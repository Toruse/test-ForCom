## Четвертый вопрос

_Вопрос:_

Напишите прототип функции __bubbleSort__ для класса __Array__, параметром в которую будет передаваться направление 
сортировки: __true__ - по возрастанию (__default__), __false__ - по убыванию

_Ответ:_

Вариант 1

Так как в заданном вопросе не указан способ реализации сортировки массива, начнём с простого, воспользуемся 
стандартными методами объекта Array sort и reverse:

```
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

Название функции bubbleSort в вопросе подталкивает реализовать сортировку алгоритмом «Сортировка пузырьком»:

```
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

