## Второй вопрос

_Вопрос:_

Напишите конструкцию, которая позволяет однозначно определить, является ли свойство __property__ свойством класса 
__Class__.

_Ответ:_

Вариант 1

```javascript
var Class = new Object();
Class.property = 'Свойство класса.';
console.log(Class.hasOwnProperty('property')); // вернёт true
console.log(Class.hasOwnProperty('toString')); // вернёт false
```


Вариант 2

```javascript
var Class = new Object();  
Class.property= 'Свойство класса.';

for (var name in Class) {
    if (Class.hasOwnProperty(name)) {
        console.log('Свойство (' + name + ') принадлежит классу Class');
    } else {
        console.log(name); // остальные свойства
    }
}
```

[Содержание](../SUMMARY.md)