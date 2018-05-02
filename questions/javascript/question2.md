## Второй вопрос

_Вопрос:_

Напишите конструкцию, которая позволяет однозначно определить, является ли свойство property свойством класса Class.

_Ответ:_

Вариант 1

```
var Class = new Object();
Class.property = 'Свойством класса.';
console.log(Class.hasOwnProperty('property')); // вернёт true
console.log(Class.hasOwnProperty('toString')); // вернёт false
```


Вариант 2

```
var Class = new Object();  
Class.property= 'Свойством класса.';

for (var name in Class) {
    if (Class.hasOwnProperty(name)) {
        console.log('Свойство (' + name + ') принадлежит классу Class');
    } else {
        console.log(name); // остальные свойства
    }
}
```