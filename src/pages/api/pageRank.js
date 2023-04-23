// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import WebMatrix from "@/utils/WebMatriz";
import { WebNetwork } from "@/web/webNetwork";

const EPSILON = 0.001;
const BETHA = 0.85; // A value between 0.8 and 0.9 is recommended

const getPageRank = (b, eps, preferences) => {
  const WEB = new WebMatrix();
  //Start the time to calculate the time of execution with performance.now()

  const performanceTime = performance.now();
  WEB.add_nodes_(Object.keys(WebNetwork));
  WEB.add_edges_(
    Object.entries(WebNetwork)
      .map(([node, { links }]) => links.map((link) => [node, link]))
      .flat()
  );

  let n = WEB._n;
  let m = null;
  let vi = null;
  if (preferences) {
    m = 0; // Number of topics with preference 1
    let t = 0; // Number of nodes with preference 1
    let topicsSelected = [];
    Object.entries(preferences).forEach(([topic, value]) => {
      if (value) topicsSelected.push(topic);
    });
    m = topicsSelected.length;

    Object.entries(WebNetwork).forEach(([node, { primaryTopic }]) => {
      if (topicsSelected.some((topic) => primaryTopic === topic)) t++;
    });

    vi = new Array(n).fill(0);
    Object.entries(WebNetwork).forEach(([node, { primaryTopic }], idx) => {
      if (topicsSelected.some((topic) => primaryTopic === topic))
        vi[idx] = 1 / t;
    });
  }

  const [degrees, DeadEnds] = WEB.find_DegreeOfNodes_();
  WEB.build_matrix_(degrees);
  WEB.DropDeadEnd_();
  const [taxation, iterations] = WEB.Taxation_(b, eps, vi, m);
  let pageRank = WEB.PageRank_();
  pageRank = Object.entries(pageRank);
  pageRank.sort((a, b) => b[1] - a[1]);
  pageRank = pageRank.map(([node, value]) => ({
    node,
    value,
    ...WebNetwork[node],
  }));

  const time = (performance.now() - performanceTime) / 1000;

  return { pageRank, iterations, time };
};

const filterPages = (query, preferences) => {
  const PAGERANK = getPageRank(BETHA, EPSILON, preferences);
  let { pageRank, iterations, time } = { ...PAGERANK };
  let queryNd = query.trim().toLowerCase();
  queryNd = queryNd.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  pageRank = pageRank.filter((page) => {
    const { title, description, primaryTopic, secondaryTopics } = page;
    return (
      title.toLowerCase().includes(queryNd) ||
      description.toLowerCase().includes(queryNd) ||
      primaryTopic.includes(queryNd) ||
      secondaryTopics.some((topic) => topic.includes(queryNd))
    );
  });

  return { pageRank, iterations, time };
};

export default function handler(req, res) {
  if (req.method === "GET") {
    let { query } = req.query;
    let { topicspreferences } = req.headers;
    topicspreferences = topicspreferences
      ? JSON.parse(topicspreferences)
      : null;
    if (query) {
      let filter = topicspreferences
        ? filterPages(query, topicspreferences)
        : filterPages(query);
      res.status(200).json(filter);
    } else {
      res.status(200).json(filterPages(query || "", topicspreferences));
    }
  }
}
