import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { WebNetwork } from "@/web/webNetwork";

function Graph() {
  const ref = useRef();

  const nodes = Object.keys(WebNetwork).map((key) => {
    return { id: key };
  });

  const links = Object.keys(WebNetwork).map((key) => {
    return WebNetwork[key].links.map((link) => {
      return { source: key, target: link, value: 1 };
    });
  });

  const data = {
    nodes: nodes,
    links: links.flat(),
  };

  useEffect(() => {
    const svg = d3.select(ref.current);
    const width = +svg.attr("width");
    const height = +svg.attr("height");

    const simulation = d3
      .forceSimulation()
      .force(
        "link",
        d3.forceLink().id((d) => d.id)
      )
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg
      .append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.8)
      .attr("stroke-width", 2)
      .selectAll("line")
      .data(data.links)
      .join("line");

    const node = svg
      .append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .selectAll("circle")
      .data(data.nodes)
      .join("circle")
      .attr("r", 10)
      .attr("fill", "blue");

    const ticked = () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    };

    simulation.nodes(data.nodes).on("tick", ticked);

    simulation.force("link").links(data.links);
  }, [data]);

  return (
      <svg
        ref={ref}
        width="1000"
        height="500"
      ></svg>
  );
}

export default Graph;
