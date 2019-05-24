import Heap from '../src/Heap';
import should from 'should';

describe('Heap', function () {
  it('#insert', function () {
    const heap = new Heap(10);
    heap.insert(24);
    heap.insert(6);
    heap.insert(28);
    heap.insert(5);
    heap.insert(63);
    heap.insert(19);
    heap.insert(94);

    const expectedResult = [5, 6, 19, 24, 63, 28, 94];
    should(heap._heap.slice(0, expectedResult.length)).eql(expectedResult);
  });

  it('#insert bubbles', function () {
    const seed = [9, 8, 7, 5, 3, 1];
    const heap = new Heap(10);
    seed.forEach(val => heap.insert(val));
    const expectedResult = [1, 5, 3, 9, 7, 8];
    should(heap._heap.slice(0, expectedResult.length)).eql(expectedResult);
  });

  it('#delete', function () {
    const seed = [5, 6, 19, 24, 63, 28, 94];
    const heap = new Heap(10);
    seed.forEach(val => heap.insert(val));
    heap.delete(0);
    const expectedResult = [6, 24, 19, 94, 63, 28];
    should(heap._heap.slice(0, expectedResult.length)).eql(expectedResult);
  });
});