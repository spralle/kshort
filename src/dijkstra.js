import PQ from './pq';
import { neighbours } from './graph';


function defaultCmp(a, b) {
  if (a > b) return 1;
  else if (a < b) return -1;
  else return 0;
}


/**
 * Returns all shortest distances to all nodes from 's' node
 */
export default function dijkstra(graph, s) {
  const dist = {};
  const pq = new PQ([], (a, b) => defaultCmp(a.d, b.d));

  pq.enqueue({ d: 0, node: s });
  dist[s] = [0];
  while (pq.length > 0) {
    const n = pq.dequeue();
    const u = n.node;
    const next = neighbours(graph, u);
    // check all neighbours
    for (let i = 0; i < next.length; i++) {
      const v = next[i];
      const weight = graph[u][v];
      // is new distance less than previous distance
      const newWeight = dist[u][0] + weight;
      if (dist[v] === undefined || dist[v][0] > newWeight) {
        dist[v] = [newWeight, u];
        pq.enqueue({ d: newWeight, node: v });
      }
    }
  }
  return dist;
}