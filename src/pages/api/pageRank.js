// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import WebMatrix from "@/utils/WebMatriz";
import { WebNetwork } from "@/web/webNetwork";

const EPSILON = 0.001;
const BETHA = 0.8;

const getPageRank = (b, eps) => {
  const WEB = new WebMatrix();
  //Start the time to calculate the time of execution with performance.now()

  const performanceTime = performance.now();
  WEB.add_nodes_(Object.keys(WebNetwork));
  WEB.add_edges_(
    Object.entries(WebNetwork)
      .map(([node, { links }]) => links.map((link) => [node, link]))
      .flat()
  );

  const [degrees, DeadEnds] = WEB.find_DegreeOfNodes_();
  WEB.build_matrix_(degrees);
  WEB.DropDeadEnd_();
  const [taxation, iterations] = WEB.Taxation_(b, eps);
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

const PAGERANK = getPageRank(BETHA, EPSILON);

const filterPages = (query) => {
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
    const { query } = req.query;
    if (query) {
      const filter = filterPages(query);
      res.status(200).json(filter);
    } else {
      res.status(200).json(PAGERANK);
    }
  }
}
