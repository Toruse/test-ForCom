/////////////////////////////////////////////// Version 3 //////////////////////////////////////////////////////////////

if (!Array.prototype.bubbleSort) {
    Array.prototype.bubbleSort = function (direction) {
        'use strict';
        if (this == null) {
            throw new TypeError('can\'t convert ' + this + ' to array');
        }

        let sortHelper = {
            direction: typeof direction !== 'undefined' ? direction : true,
            compare: function (a, b) {
                a = Number.isNaN(b) ? a : '' + a;
                b = Number.isNaN(a) ? b : '' + b;
                return this.direction ? a > b : a < b;
            },
            swap: function (items, leftIndex, rightIndex) {
                let temp = items[leftIndex];
                items[leftIndex] = items[rightIndex];
                items[rightIndex] = temp;
            },
            partition: function (items, low, high) {
                let pivot = items[Math.floor((high + low) / 2)];
                let i = low;
                let j = high;

                while (i <= j) {
                    while (this.compare(pivot, items[i])) {
                        i++;
                    }
                    while (this.compare(items[j], pivot)) {
                        j--;
                    }
                    if (i <= j) {
                        this.swap(items, i, j);
                        i++;
                        j--;
                    }
                }
                return i;
            },
            quickSort: function (items, low, high) {
                let index;
                if (items.length > 1) {
                    index = this.partition(items, low, high);
                    if (low < index - 1) {
                        this.quickSort(items, low, index - 1);
                    }
                    if (index < high) {
                        this.quickSort(items, index, high);
                    }
                }
                return items;
            }
        }

        let sortArray = this;
        return sortHelper.quickSort(sortArray, 0, sortArray.length - 1);
    }
}

console.log([39, 12, 20, 15, 50, 10].bubbleSort());
console.log([39, 12, 20, 15, 50, 10].bubbleSort(true));
console.log([39, 12, 20, 15, 50, 10].bubbleSort(false));

console.log([0.39, 12, 20.20, 20.15, 50, 10].bubbleSort(true));
console.log([0.39, 12, 20.20, 20.15, 50, 10].bubbleSort(false));

console.log(["bbb", "aaa", "avcd", "ccc"].bubbleSort(true));
console.log(["bbb", "aaa", "avcd", "ccc"].bubbleSort(false));

console.log(["bbb", "aaa", 10, 12, 10.11, 10.12].bubbleSort(true));
console.log(["bbb", "aaa", 10, 12, 10.11, 10.12].bubbleSort(false));