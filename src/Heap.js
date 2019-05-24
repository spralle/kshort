export default class Heap {
  _d; // number of children per node
  _size = 0;
  _heap;

  constructor(capacity, numberOfChildrenPerNode = 2, comparantor = (e1, e2) => e1 < e2) {
    this._heap = Array(capacity);
    this._d = numberOfChildrenPerNode;
  }
  isEmpty() {
    return this._size === 0;
  }

  insert(e) {
    // Add the element at the bottom of the heap
    this._heap[this._size++] = e;
    // bubble up
    this._bubbleUp(this._size - 1);
  }

  peek() {
    return this._get(0);
  }

  pop() {
    const tmp = this._get(0);
    this._delete(0);
    return tmp;
  }

  delete(index) {
    const value = this._get(index);
    this._set(index, this._get(this._size - 1));
    this._size--;
    this._bubbleDown(index);
    return value;
  }

  _getParentIndex(index) {
    return Math.floor((index -1) / 2);
  }

  _getParent(index) {
    return this._get(this._getParentIndex(index));
  }
  _get(index) {
    return this._heap[index];
  }
  _set(index, value) {
    this._heap[index] = value;
  }
  _getKthChildIndexOf(index, k) {
    return this._d * index + k;
  }
  _getKthChild(index, k) {
    return this._get(this._getKthChildIndexOf(index, k));
  }
  _getMinimumChildIndexOf(index) {
    let bestChildNr = 1;
    let currentChildNr = 1;

    while (++currentChildNr <= this._d) {
      if (this._getKthChild(index, currentChildNr) < this._getKthChild(index, bestChildNr)) {
        bestChildNr = currentChildNr;
      }
    }
    return this._getKthChildIndexOf(index, bestChildNr);
  }

  _bubbleUp(childIndex) {
    let index = childIndex;
    const tmp = this._get(index);
    while (index > 0 && tmp < this._getParent(index)) {
      // move parent down
      this._set(index, this._getParent(index));
      // move "cursor" to parent
      index = this._getParentIndex(index);
    }
    this._set(index, tmp);
  }

  _bubbleDown(parentIndex) {
    let index = parentIndex;
    let child;
    const tmp = this._get(index);
    while (this._getKthChildIndexOf(index, 1) < this._size) {
      child = this._getMinimumChildIndexOf(index);
      if (this._get(child) < tmp) {
        this._set(index, this._get(child));
      } else {
        break;
      }
      index = child;
    }
    this._set(index, tmp);
  }
}