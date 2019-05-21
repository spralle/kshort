/*
 * Utility functions to work with our graph model 
 */

export function neighbours(graph, node) {
  return Object.keys(graph[node]) || [];
}

export function edges(graph) {
  const nodes = vertices(graph);
  let edges = [];
  nodes.forEach(node => {
    const vertexNeighbours = neighbours(graph, node);
    edges = edges.concat(vertexNeighbours.map(vn => {
      return { from: node, to: vn, cost: graph[node][vn] };
    }));
  })
  return edges;
}

export function vertices(graph) {
  return Object.keys(graph);
}

/** transpose / reverse the graph */
export function transpose(graph) {
  const rev = {};
  const verts = vertices(graph);
  verts.forEach((v, i) => {
    rev[v] = rev[v] || {};
    const neighs = neighbours(graph, v);
    neighs.forEach((n, j) => {
      rev[n] = (rev[n] || {});
      rev[n][v] = graph[v][n];
    });
  });
  return rev;

}