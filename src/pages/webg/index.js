import Graph from '@/components/Graph';

const graphData = {
  nodes: [
    { id: 'A' },
    { id: 'B' },
    { id: 'C' },
    { id: 'D' },
    { id: 'E' }
  ],
  links: [
    { source: 'A', target: 'B', value: 1 },
    { source: 'A', target: 'C', value: 2 },
    { source: 'B', target: 'D', value: 3 },
    { source: 'C', target: 'D', value: 4 },
    { source: 'D', target: 'E', value: 5 }
  ]
};

function webg() {
  return <Graph data={graphData} />;
}

export default webg;

