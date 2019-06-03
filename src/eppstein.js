import PQ from './pq'; // todo, import form npm... '@raymond-lam/priority-queue'
import dijkstra from './dijkstra';
import { transpose, edges as getEdges } from './graph'

// traverse tree
function traverse(tree, source, route = () => null) {
  const path = [];
  let next = source;
  while (next) {
    path.push(next);
    next = route(next) || tree[next][1];
  }
  return path;
}

/**
 * Implicit path only includes the side track edges which are in play for this path, otherwise it follows the shortest path from Source to Target
 */
class ImplicitPath {
  constructor(shortestTree, source, target, shortestCost, edges = []) {
    this._source = source;
    this._target = target;
    this._shortestTree = shortestTree;
    this._shortestCost = shortestCost;
    this._edges = edges;
  }
  getCost() {
    return this._edges.reduce((prev, current) => {
      return prev + current.cost;
    }, 0);
  }
  /**
   * Traverse shortest tree and follow each sidetrack of this implicit path to make an
   * explicit path which each step needed of the path
   */
  makeExplicit() {
    const path = [];
    traverse(this._shortestTree, this._source, (current) => {
      const sidetrack = this._edges.find(val => val.from === current);
      // we have an sidetrack edge .
      path.push(current);
      if (sidetrack !== undefined) {
        return sidetrack.to;
      }
    });
    path.unshift(this._shortestCost + this.getCost());
    return path;
  }

  getLastEdge() {
    return this._edges[this._edges.length - 1];
  }
  /**
   * Returns a new Implicit Path by appending a new sidetrack at the "end"
   */
  concat(sideTrackEdge) {
    return new ImplicitPath(this._shortestTree, this._source, this._target, this._shortestCost, [...this._edges, sideTrackEdge]);
  }
}

/**
 * A simplistic implementation of eppsteins kshort.
 * https://static.aminer.org/pdf/PDF/001/059/121/finding_the_k_shortest_paths.pdf
 * http://www.isi.edu/natural-language/people/epp-cs562.pdf
 */
export default function kshort(graph, s, t, k = 1) {
  // get the cost from target to each node in the graph.
  const shortestTree = dijkstra(transpose(graph), t);

  //compute sidetrack edge cost
  const sidetrackEdgeCost = calculateSidetrackCost(graph, shortestTree);
  //sort by shortest paths
  const pathQ = new PQ([new ImplicitPath(shortestTree, s, t, shortestTree[s][0])], (a, b) => a.getCost() - b.getCost());
  const paths = [];

  while (paths.length < k && pathQ.length > 0) {
    const next = pathQ.dequeue();
    // Add new candidate sidetracks from the next shortest path found in the PQ.
    // we'll continue by adding the next sidetracks from where the last sidetrack ended.
    // or (on the first [] implicit path we start from s)
    const newSource = next.getLastEdge() && next.getLastEdge().to || s;
    traverse(shortestTree, newSource, (current) => {
      if (sidetrackEdgeCost[current] !== undefined) {
        Object.keys(sidetrackEdgeCost[current]).forEach(to => {
          const toEnqueue = next.concat({ from: current, to, cost: sidetrackEdgeCost[current][to] });
          pathQ.enqueue(toEnqueue);
        })
      }
    });
    // console.log('PP', next);
    paths.push(next.makeExplicit());
  }
  return paths;
}

function calculateSidetrackCost(graph, tree) {
  const edges = getEdges(graph);
  const sidetracks = {};
  //all edges in the graph
  edges.forEach(edge => {
    const treeFromNode = tree[edge.from]
    // check if edge is not part of shortest path tree, if it is it's now a sidetrack...
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
