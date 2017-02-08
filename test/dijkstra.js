import dijkstra from '../src/dijkstra';
import should from 'should';

const graph = {
  A: {B: 4, C: 1},
  B: {C: 1, D: 6},
  C: {D: 10},
  D: {C: 1}
}

describe('dijkstra', function() {
  it('should calculate shortest distance', function() {
    dijkstra(graph, 'A').A[0].should.equal(0);
    dijkstra(graph, 'A').D[0].should.equal(10);
  });
});