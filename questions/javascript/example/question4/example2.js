/////////////////////////////////////////////// Version 2 //////////////////////////////////////////////////////////////

if (!Array.prototype.bubbleSort) {
    Array.prototype.bubbleSort = function (direction) {
        'use strict';
        if (this == null) {
            throw new TypeError('can\'t convert ' + this + ' to array');
        }
        function compareArrayElement(a, b, direction) {
            a = Number.isNaN(b)?a:'' + a;
            b = Number.isNaN(a)?b:'' + b;
            return direction ? a > b : a < b;
        }

        direction = typeof direction !== 'undefined' ? direction : true;

        let sortArray = this;
        let replace;

        for (let i = 0; i < sortArray.length; i++) {
            for (let j = 0; j < sortArray.length - i - 1; j++) {
                if (compareArrayElement(sortArray[j], sortArray[j+1], direction)) {
                    replace = sortArray[j];
                    sortArray[j] = sortArray[j + 1];
                    sortArray[j + 1] = replace;
                }
            }
        }

        return sortArray;
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
