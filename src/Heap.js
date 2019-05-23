export default class Heap {
  _d; // number of children per node
  _size = 0;
  _heap;

  constructor(capacity, numberOfChildrenPerNode = 2) {
    this._heap = Array(capacity);
    this._d = numberOfChildrenPerNode;
  }
  isEmpty() {
    return this._size === 0;
  }
  
  insert(e) {
    // if (isFull( ) )
    // throw new NoSuchElementException("Overflow Exception");
    this._heap[this._heapSize++] = e;
    this._heapifyUp(heapSize - 1);
  }

  _getParentIndex(index) {
    return (indx - 1) / this._d;
  }
  _getKthChildIndexOfI(i, k) {
    return this._d * i + k;
  }
}