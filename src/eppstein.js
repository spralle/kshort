import PQ from './pq'; // todo, import form npm... '@raymond-lam/priority-queue'
import dijkstra from './dijkstra';
import { transpose, edges as getEdges } from './graph'

class Edge {

}

/**
 * https://static.aminer.org/pdf/PDF/001/059/121/finding_the_k_shortest_paths.pdf
 * http://www.isi.edu/natural-language/people/epp-cs562.pdf
 */
export default function kshort(graph, s, t) {
  console.log(graph);
  const shortestTree = dijkstra(transpose(graph), t);
  //compute sidetrack edge cost
  const sidetrackEdgeCost = calculateSidetrackCost(graph, shortestTree);
  console.log(sidetrackEdgeCost);
  return shortestTree;
}

function calculateSidetrackCost(graph, tree) {
  const edges = getEdges(graph);
  const sidetracks = {};
  edges.forEach(edge => {
    const treeFromNode = tree[edge.from]
    // check if edge is not part of shortest path tree.
    if (!(treeFromNode && treeFromNode[1] === edge.to)) {
      const treeToNode = tree[edge.to]
      // sidetrack cost is the additional total cost it would be to travel this path
      //sidetracks.push({ from: edge.from, to: edge.to, cost: edge.cost - treeFromNode[0] + treeToNode[0] });
      sidetracks[edge.from] = sidetracks[edge.from] || {};
      sidetracks[edge.from][edge.to] = edge.cost - treeFromNode[0] + treeToNode[0];
    }
  });
  return sidetracks;
}
