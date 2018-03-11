## Первый вопрос

_Вопрос:_

Напишите конструкцию, которая позволяет однозначно подтвердить, что переменная определена и имеет значение, отличное от **undefined**.

_Ответ:_

Вариант 1

```
if (typeof a !== "undefined") {
    console.log("Переменная определена");
} else {
    console.log("Переменная не определена");
}
```


Вариант 2

```
function defined(nameVar) {
    return typeof window[nameVar] !== "undefined";
}

if (defined("a")) {
    console.log("Переменная определена");
} else {
    console.log("Переменная не определена");
}
```

Вариант 3

```
function defined(nameVar) {
    return (nameVar in window) && window[nameVar]!=null;
}

if (defined("a")) {
    console.log("Переменная определена");
} else {
    console.log("Переменная не определена");
}
```