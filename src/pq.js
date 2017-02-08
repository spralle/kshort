//     priority-queue.js
//     https://github.com/raymond-lam/es6-priority-queue
//     (c) 2017 Raymond Lam
//
//     Author: Raymond Lam (ray@lam-ray.com)
//
//     priority-queue.js may be freely distributed under the MIT license

// Default cmp function, which simply returns 1, -1, or 0 if a > b, a < b, or
// otherwise respectively.
function defaultCmp(a, b) {
  if (a > b) return 1;
  else if (a < b) return -1;
  else return 0;
}

class PriorityQueue {
  // Constructor takes initial elements of the priority queue (which defaults to
  // an empty array) and a comparator (which defaults to defaultCmp). It
  // constructs a priority queue, where the given comparator will always be used
  // for comparisons, and enqueues the given initial elements.
  constructor(init = [], cmp  = defaultCmp) {
    this._cmp = cmp;

    // This priority queue is implemented as a binary min-heap represented by as
    // an array.
    this._heap = [];

    this.enqueue(...init);
  }

  // Define an iterator which successively dequeues from a clone of this
  // priority queue.
  [Symbol.iterator]() {
    return this.values();
  }

  // Removes all elements from the priority queue. Returns the number of
  // elements removed.
  clear() {
    let length = this.length;
    this._heap = [];
    return length;
  }

  // Shallow clone of the priority queue.
  clone() {

    // Should be O(n) time complexity, because elements enqueued directly from a
    // a heap will already be in the correct order and not need to be percolated
    // up.
    return new PriorityQueue(this._heap, this._cmp);
  }

  // Removes the minimum element of the priority queue, Returns undefined if the
  // priority queue is empty.
  dequeue() {
    // If there is only one element in the priority queue, just remove and
    // return it. If there are zero, return undefined.
    if (this._heap.length < 2) return this._heap.pop();

    // Save the return value, and put the last leaf of the heap at the root.
    let returnValue = this._heap[0];
    this._heap[0] = this._heap.pop();

    // The binary heap is represented as an array, where given an element at
    // index i, the first child is (i * 2) + 1, and the second child is at
    // (i * 2) + 2.
    //
    // Percolate down:
    // Initialize i, childI1 and childI2 at the root and its children
    // respectively. let nextI be the index of the minimum element of the
    // current element and its children. Stop if we've reached the end of the
    // heap or if the minimum element is the current element at i. Otherwise,
    // swap the current element at i with the element at nextI, and continue the
    // loop. For the next iteration of the loop, i becomes nextI (the index
    // whose element we'd swapped), and childI1 and childI2 are the indices of
    // the children.
    for (
      let i = 0, childI1 = 1, childI2 = 2, nextI;
      childI1 < this._heap.length && (
        nextI = this._minInHeap(
          i, childI1, childI2 < this._heap.length ? childI2 : void(0)
        )
      ) !== i;
      i = nextI, childI1 = (i * 2) + 1, childI2 = childI1 + 1
    ) this._swapInHeap(i, nextI);

    return returnValue;
  }

  // Inserts each of the given arguments into the appropriate place in the
  // priority queue. Returns the resulting length of the priority queue.
  enqueue(...newValues) {
    for (let newValue of newValues) {
      // The enqueued element becomes the last leaf of the heap, which will be
      // percolated up as necessary.
      this._heap.push(newValue);

      // The binary heap is represented as an array, where given an element at
      // index i, its parent is at floor((i - 1) / 2).
      //
      // Percolate up:
      // Start the loop at the last leaf of the heap. Stop the loop if the
      // current element is the root of the heap or if the current element
      // greater than or equal to the parent. Otherwise, swap the current
      // element with its parent, and continue the loop at the parent.

      for (
        let i = this._heap.length - 1, parentI = Math.floor((i - 1) / 2);
        i > 0 && this._cmpInHeap(i, parentI) < 0;
        i = parentI, parentI = Math.floor((parentI - 1) / 2)
      ) this._swapInHeap(i, parentI);
    }

    return this.length;
  }

  // Returns an Iterator which iterates over key/value pairs, where the values
  // are the values in the priority queue, and the keys are the positions those
  // values occupy in the priority queue.
  *entries() {
    let i = 0;
    for (let value of this) {
      yield [i++, value];
    }
  }

  // Returns true if searchElement is present in the priority queue, starting
  // search at fromIndex
  includes(searchElement, fromIndex = 0) {
    // If fromIndex is 0, it means search the whole queue, in which case order
    // doesn't matter, so we can just delegate to the heap
    if (fromIndex === 0) return this._heap.includes(searchElement);

    // Negative fromIndex means start that many from the end of the priority queue
    if (fromIndex < 0) fromIndex = this.length + fromIndex;

    // Return true if the searchElement is in the priority queue at or after the given
    // fromIndex
    if (Number.isNaN(searchElement)) {
      for (let [i, value] of this.entries()) {
        if (i >= fromIndex && Number.isNaN(value)) return true;
      }
    }
    else {
      for (let [i, value] of this.entries()) {
        if (i >= fromIndex && value === searchElement) return true;
      }
    }

    // If we get this far, we haven't found the element.
    return false;
  }

  // Joins the elements of the priority queue in sorted order into a string.
  join() {
    return Array.from(this).join(...arguments);
  }

  // Returns the minimum element of the priority queue without removing it.
  peek() {
    return this._heap[0];
  }

  // Applies a function against an accumulator and each value of the priority
  // queue in order to reduce it to a single value.
  reduce(callback, initialValue) {
    for (let [i, element] of this.entries())
      initialValue = callback(initialValue, element, i, this);
    return initialValue;
  }

  // Applies a function against an accumulator and each value of the priority
  // queue in reverse order to reduce it to a single value.
  reduceRight(callback, initialValue) {
    for (let [i, element] of Array.from(this.entries()).reverse())
      initialValue = callback(initialValue, element, i, this);
    return initialValue;
  }

  // JSON.stringify of this priority queue should be the JSON of the elements
  // of the priority queue in a sorted array.
  toJSON() {
    return Array.from(this);
  }

  // The locale-specific string form of this priority queue should be the
  // locale-specific string form of an array of this priority queue's elements
  // in sorted order.
  toLocaleString() {
    return Array.from(this).toLocaleString();
  }

  // The string form of this priority queue should be the string form of an
  // array of this priority queue's elements in sorted order.
  toString() {
    return Array.from(this).toString();
  }

  // Returns a new Iterator which iterates over the priority queue's values,
  // without mutating the priority queue itself.
  *values() {
    // Clone this because we don't want to mutate the original priority queue by
    // iterating over its elements.
    var priorityQueue = this.clone();

    while (priorityQueue.length) {
      yield priorityQueue.dequeue();
    }
  }

  // length accessor is simply the number of elements currently in the priority
  // queue.
  get length() {
    return this._heap.length;
  }

  // Helper method. Returns the result of the comparator function on the
  // elements located at the given indices in the heap array.
  _cmpInHeap(i1, i2) {
    return this._cmp(this._heap[i1], this._heap[i2]);
  }

  // Helper method. Given two or three indices of the heap array, compares the
  // corresponding elements and returns the index to the minimum element of
  // them.
  _minInHeap(i1, i2, i3) {

    // First compare the elements at the first two given indices. Return the
    // index for minimum of them, or if we are given a third index, compare with
    // that corresponding element and return the minimum of them.
    let i = this._cmpInHeap(i1, i2) > 0 ? i2 : i1;
    if (typeof i3 === 'undefined') return i;
    else return this._cmpInHeap(i, i3) > 0 ? i3 : i;
  }

  // Helper method. Swaps the elements at the given indices of the heap array.
  _swapInHeap(i1, i2) {
    let tmp = this._heap[i1];
    this._heap[i1] = this._heap[i2];
    this._heap[i2] = tmp;
  }
};

export default PriorityQueue;