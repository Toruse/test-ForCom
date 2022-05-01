/////////////////////////////////////////////// Version 1 //////////////////////////////////////////////////////////////
if (!Array.prototype.bubbleSort) {
    Array.prototype.bubbleSort = function (direction) {
        'use strict';
        if (this == null) {
            throw new TypeError('can\'t convert ' + this + ' to array');
        }

        direction = typeof direction !== 'undefined' ? direction : true;

        return direction?this.sort():this.sort().reverse();
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