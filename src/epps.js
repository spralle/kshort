import PQ from './pq'; // todo, import form npm... '@raymond-lam/priority-queue'
import dijkstra from './dijkstra';
import { reverse } from './graph'

class Edge {

}

/**
 * https://static.aminer.org/pdf/PDF/001/059/121/finding_the_k_shortest_paths.pdf
 * http://www.isi.edu/natural-language/people/epp-cs562.pdf
 */
export default function kshort(graph, s, t) {
  const shortestTree = dijkstra(reverse(graph), t);
  //compute sidetrack edge cost
  const sidetrackEdgeCost = calculateSidetrackCost(graph, shortestTree);
  console.log(sidetrackEdgeCost);
  return shortestTree;
}

function calculateSidetrackCost(graph, tree) {
  Map < Array < String >, Edge > edges;
}
