import { WebNetwork } from "@/web/webNetwork";

export default class WebMatrix {
  constructor() {
    this._G = new Map(); // Create an empty graph.
    this._n = 0; // Number of nodes.
    this._edges = 0; // Number of edges.
    this._my_dict = {}; // Empty dictionary to assign an unique idx per page.
    this._dfMatrix = []; // Array to store the Matrix M as a sparse Matrix.
    this._DeadEdges = []; // It contains Dead Edges that will be deleted by the DropDeadEnd method.
    this._PageRankVector = {}; // Dictionary to store the PageRank for each node.
    this._DeadEnds = []; // The list contains the DeadEnd nodes used by the method find_DegreeOfNodes.
    this._FullDeadEnds = []; // The list contains the DeadEnd nodes used by the method DropDeadEnd.
  }

  /**
   * This method adds nodes to the graph.
   * @param {Array} nodes - list storing the graph nodes.
   * @returns {Number} - number of nodes added.
   */
  add_nodes_(nodes) {
    for (let node of nodes) {
      this._G.set(node, new Map());
    }
    this._n = this._G.size;

    return this._n;
  }

  /**
   * This method adds edges to the graph.
   * @param {Array} edges - list storing tuples like ["page-x", "page-y"].
   * @returns {Number} - number of edges added.
   */
  add_edges_(edges) {
    for (let edge of edges) {
      if (this._G.has(edge[0]) && this._G.has(edge[1])) {
        this._G.get(edge[0]).set(edge[1], {});
        this._edges++;
      }
    }

    return this._edges;
  }

  /**
   * This method finds the degree of all nodes in the graph.
   * @returns {Array} - array storing degrees of all nodes and dead end nodes.
   */
  find_DegreeOfNodes_() {
    let DeadEnds = []; // the list contains the DeadEnd nodes
    let degrees = new Array(this._G.size).fill(0);
    let nodes = Array.from(this._G.keys());

    for (let i = 0; i < nodes.length; i++) {
      degrees[i] = this._G.get(nodes[i]).size;
      if (degrees[i] === 0) {
        DeadEnds.push(nodes[i]); // add new DeadEnd node.
      }
    }

    return [degrees, DeadEnds];
  }

  /**
   * This method builds the M matrix as a sparse matrix using a 2D array.
   * @param {Array} degrees - degrees of all nodes in the graph.
   * @returns {Array} - 2D array containing the sparse matrix.
   */
  build_matrix_(degrees) {
    let edges = Array.from(this._G.entries()).flatMap(([src, dests]) => {
      return Array.from(dests.keys()).map((dest) => [src, dest]);
    });
    let nodes = Array.from(this._G.keys());

    for (let i = 0; i < nodes.length; i++) {
      this._my_dict[nodes[i]] = i;
    }

    for (let item = 0; item < edges.length; item++) {
      let src = edges[item][0]; // source Web page in th edge
      let dest = edges[item][1]; // destination Web page in the edge
      let src_idx = this._my_dict[src]; // get the id of the source Web page
      let dest_idx = this._my_dict[dest]; // get the id of the destination Web page
      let value = 1 / degrees[src_idx]; // calculate the value of the edge
      this._dfMatrix.push([src_idx, dest_idx, value]); // add the edge to the sparse matrix
    }

    return this._dfMatrix;
  }

  /**
   * This method drops the dead end nodes from the graph.
   * @param {Array} DeadEnds - list of dead end nodes.
   * @returns {Number} - number of dead end nodes dropped.
   * @returns {Number} - number of edges dropped.
   * @returns {Number} - number of nodes dropped.
   * @returns {Number} - number of edges remaining.
   * @returns {Number} - number of nodes remaining.
   * @returns {Number} - number of dead end nodes remaining.
   */
  DropDeadEnd_() {
    let [degrees, DeadEnds] = this.find_DegreeOfNodes_();
    while (DeadEnds.length > 0) {
      let node = DeadEnds.pop();
      let deadEdges = [];
      for (let [node_in, edges] of this._G.entries()) {
        if (edges.has(node)) deadEdges.push(node_in);
      }

      this._G.delete(node);
      this._FullDeadEnds.push(node);

      for (let edge of deadEdges) {
        this._G.get(edge).delete(node);
        this._DeadEdges.push([edge, node, 1 / degrees[this._my_dict[edge]]]);
      }

      [degrees, DeadEnds] = this.find_DegreeOfNodes_();
    }

    this._n = this._G.size;
    this._edges = Array.from(this._G.entries()).flatMap(([src, dests]) => {
      return Array.from(dests.keys()).map((dest) => [src, dest]);
    }).length;

    //Update the M matrix
    this._dfMatrix = [];
    this.build_matrix_(degrees);

    return [this._dfMatrix, this._FullDeadEnds];
  }

  /**
   * This method calculates the PageRank for each node in the graph.
   * @param {Number} d - damping factor.
   * @param {Number} eps - convergence threshold.
   * @returns {Array} - array storing the PageRank for each node.
   * @returns {Number} - number of iterations.
   */
  Taxation_(d, eps, vi, m) {
    let nodes = Array.from(this._G.keys());
    let n = this._n;
    let PageRankVector = vi || new Array(n).fill(1 / n);
    let PageRankVector_new = new Array(n).fill(0);
    let iterations = 0;
    let diff = 1;

    while (diff > eps) {
      for (let i = 0; i < n; i++) {
        let sum = 0;
        for (let j = 0; j < this._dfMatrix.length; j++) {
          if (this._dfMatrix[j][1] === i) {
            sum += this._dfMatrix[j][2] * PageRankVector[this._dfMatrix[j][0]];
          }
        }
        let dumpTopic = (1 - d) / n;
        if (vi) {
          dumpTopic = 0;
          if (vi[i] !== 0) {
            dumpTopic = dumpTopic = (1 - d) / m;
          }
        }
        PageRankVector_new[i] = d * sum + dumpTopic;
      }
      diff = 0;
      for (let i = 0; i < n; i++) {
        diff += Math.abs(PageRankVector_new[i] - PageRankVector[i]);
      }
      PageRankVector = PageRankVector_new.slice();
      iterations++;
    }

    for (let i = 0; i < n; i++) {
      PageRankVector[i] = [nodes[i], PageRankVector[i]];
    }
    PageRankVector = Object.fromEntries(PageRankVector);
    this._PageRankVector = PageRankVector;
    return [PageRankVector, iterations];
  }

  /**
   * This method calculates the PageRank for the dropped ends.
   *
   * @returns {Array} - array storing the PageRank for each node.
   */
  PageRank_() {
    if (this._FullDeadEnds.length !== 0) {
      this._FullDeadEnds.reverse().forEach((node) => {
        let pr_node = 0;
        let node_edges = this._DeadEdges.filter((edge) => edge[1] === node);
        node_edges.forEach((edge) => {
          let prob = edge[2];
          let pr_node_in = this._PageRankVector[edge[0]];
          pr_node += pr_node_in * prob;
        });

        this._PageRankVector[node] = pr_node;
      });
    }

    return this._PageRankVector;
  }
}
