import epps from '../src/epps';
import dijkstra from '../src/dijkstra';
import {reverse} from '../src/graph'
// original eppstein graph
const graph = {
  A: {B: 2, E: 13},
  B: {C: 20, F: 27},
  C: {D: 14, G: 14},
  D: {H: 15},
  E: {F: 9, I: 15},
  F: {G: 10, J: 20},
  G: {H: 25, K: 12},
  H: {L: 7},
  I: {J: 18},
  J: {K: 8},
  K: {L: 11},
  L: {}
}

describe('epps', function() {
  it('should work', function() {
    console.log(dijkstra(reverse(graph), 'L'));
  });
});