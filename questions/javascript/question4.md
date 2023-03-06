## Четвертый вопрос

_Вопрос:_

Напишите прототип функции __bubbleSort__ для класса __Array__, параметром в которую будет передаваться направление 
сортировки: __true__ - по возрастанию (__default__), __false__ - по убыванию

_Ответ:_

Вариант 1

Так как в заданном вопросе не указан способ реализации сортировки массива, начнём с простого, воспользуемся 
стандартными методами объекта Array sort и reverse:

```javascript
//Проверяем наличие метода в массиве
if (!Array.prototype.bubbleSort) {
    //Создаем прототип функции сортировки bubbleSort
    Array.prototype.bubbleSort = function (direction) {
        'use strict';
        if (this == null) {
            throw new TypeError('can\'t convert ' + this + ' to array');
        }

        //Если параметр сортировки не передан, указываем значение по умолчанию
        direction = typeof direction !== 'undefined' ? direction : true;

        //Если true сортируем по возрастанию 
        //Если false сортируем по возрастанию и обращаем порядок следования элементов массива
        return direction?this.sort():this.sort().reverse();
    }
}
``` 

Вариант 2

В вопросе, название функции bubbleSort подталкивает реализовать сортировку алгоритмом «Сортировка пузырьком»:

```javascript
//Проверяем наличие метода в массиве
if (!Array.prototype.bubbleSort) {
    //Создаем прототип функции сортировки bubbleSort
    Array.prototype.bubbleSort = function (direction) {
        'use strict';
        if (this == null) {
            throw new TypeError('can\'t convert ' + this + ' to array');
        }
        //Задаем функцию для сравнения элементов массива на основе параметра направления сортировки
        function compareArrayElement(a, b, direction) {
            a = Number.isNaN(b)?a:'' + a;
            b = Number.isNaN(a)?b:'' + b;
            return direction ? a > b : a < b;
        }

        //Если параметр сортировки не передан, указываем значение по умолчанию
        direction = typeof direction !== 'undefined' ? direction : true;

        let sortArray = this;
        let replace;

        //Выполняем сортировку массива по алгоритму «Сортировка пузырьком»
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
```

Вариант 3

Так как алгоритм «Сортировка пузырьком» является слишком медленным, лучше реализовать функцию на основе алгоритма 
«Быстрая сортировка»:

```javascript
//Проверяем наличие метода в массиве
if (!Array.prototype.bubbleSort) {
    //Создаем прототип функции сортировки bubbleSort
    Array.prototype.bubbleSort = function (direction) {
        'use strict';
        if (this == null) {
            throw new TypeError('can\'t convert ' + this + ' to array');
        }

        let sortHelper = {
            //Параметр направления сортировки
            direction: typeof direction !== 'undefined' ? direction : true,
            /**
             * Задаем метод для сравнения элементов массива на основе параметра направления сортировки
             * @param a - элемент массива для сравнения
             * @param b - элемент массива для сравнения
             * @returns {boolean}
             */
            compare: function (a, b) {
                a = Number.isNaN(b) ? a : '' + a;
                b = Number.isNaN(a) ? b : '' + b;
                return this.direction ? a > b : a < b;
            },
            /**
             * Метод для смены элементов массива местами
             * @param items - массив в котором меняются элементы
             * @param leftIndex - индекс элемента массива для смены
             * @param rightIndex - индекс элемента массива для смены
             */
            swap: function (items, leftIndex, rightIndex) {
                let temp = items[leftIndex];
                items[leftIndex] = items[rightIndex];
                items[rightIndex] = temp;
            },
            /**
             * Метод разделитель
             * @param items - массив для сортировки
             * @param low - левый указатель
             * @param high - правый указатель
             * @returns int - левый указатель
             */            
            partition: function (items, low, high) {
                //Находим опорный элемент
                let pivot = items[Math.floor((high + low) / 2)];
                let i = low;
                let j = high;

                //Определяем нужно ли поменять элементы местами
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
            /**
             * Метод сортировки массива
             * @param items - массив для сортировки
             * @param low - левый указатель
             * @param high - правый указатель
             * @returns {array}
             */
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
        //Сортируем массив
        return sortHelper.quickSort(sortArray, 0, sortArray.length - 1);
    }
}
```