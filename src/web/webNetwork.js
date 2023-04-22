export const WebNetwork = {
  A: {
    links: ["B", "C", "D"],
    mainTopic: "art",
    subTopics: ["art"]
  },
  B: {
    links: ["A", "C"],
    mainTopic: "business",
    subTopics: ["business"]
  },
  C: {
    links: ["B", "D"],
    mainTopic: "computers",
    subTopics: ["computers"]
  },
  D: {
    links: ['E'],
    mainTopic: "games",
    subTopics: ["games"]
  },
  E: {
    links: [],
    mainTopic: "games",
    subTopics: ["games"]
  }
}