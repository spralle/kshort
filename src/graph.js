
export function neighbours(graph, node) {
  return Object.keys(graph[node]) || [];
}

export function vertices(graph) {
  return Object.keys(graph);
}

/** reverse the graph */
export function reverse(graph) {
  const rev = {};
  const verts = vertices(graph);
  verts.forEach((v, i) => {
    rev[v] = rev[v] || {};
    const neighs = neighbours(graph, v);
    neighs.forEach((n, j)=> {
      rev[n] = (rev[n] || {});
      rev[n][v] = graph[v][n];
    });
  });
  return rev;

}