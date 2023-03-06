## Пятый вопрос

_Вопрос:_

Напишите прототип функции __clone__ для класса __Object__ и его любого наследника, которая бы клонирована его свойства 
и методы

_Ответ:_

Для клонирования объекта можно использовать стандартные средства, как __Object.assign()__ или более новое 
__structuredClone()__. Так же существуют более простые способы, например, перебор свойств объекта или конвертация объекта 
через __JSON__ (JSON.parse(JSON.stringify(object))) или использовать оператор расширения __Spread__ (…).

Однако если объект имеет вложенный объект нужно выполнить рекурсивный перебор свойства объекта. В результате мы получим 
функцию указанную ниже:

```javascript
/**
 * Функция клонирует объект с рекурсивным перебором свойств
 * @param objectToBeCloned
 * @return Object
 */
function clone(objectToBeCloned) {
    // Если не объект заканчивает рекурсивный перебор.
    if (!(objectToBeCloned instanceof Object)) {
        return objectToBeCloned;
    }

    var objectClone;

    // Получаем конструктор клонируемого объекта
    var Constructor = objectToBeCloned.constructor;
    // Создаем новый объект, то есть разрываем ссылку на исходный объект
    objectClone = new Constructor();

    // Перебираем свойства объекта
    for (var prop in objectToBeCloned) {
        objectClone[prop] = clone(objectToBeCloned[prop]);
    }

    return objectClone;
}
```

Если нужна поддержка склеивания объектов как в методе __Object.assign()__, то мы получим функцию:

```javascript
/**
 * Функция клонирует объект с возможностью склеить объекты
 * @param objectToBeCloned
 * @param arguments
 * @returns Object
 */
function cloneGlue(objectToBeCloned) {
    // Не объект покидаем функцию
    if (!(objectToBeCloned instanceof Object)) {
        return objectToBeCloned;
    }

    var objectClone;

    // Получаем конструктор клонируемого объекта
    var Constructor = objectToBeCloned.constructor;
    // Создаем новый объект, то есть разрываем ссылку на исходный объект
    objectClone = new Constructor();

    // Перебираем переданные объекты и проходим по их свойствам передавая в клонированный объект
    for (var i = 0; i < arguments.length; i++) {
        var nextSource = arguments[i];

        if (!(nextSource instanceof Object)) {
            continue;
        }
        // Перебираем свойства объекта
        for (var prop in nextSource) {
            objectClone[prop] = clone(nextSource[prop]);
        }
    }

    return objectClone;
}
```

Только стоит учитывать, что есть ряд специфических объектов (например: __RegExp__, __Array__, __Date__), которые при 
клонировании имеют специальные способы реализации. Например, когда объект имеет свойство Date, то при клонировании 
устанавливается время клонирования объекта, а не время исходящего объекта. Соответственно при клонировании нужно 
передать время из исходящего объекта. Что и реализуем:

```javascript
function clone(objectToBeCloned) {
    if (!(objectToBeCloned instanceof Object)) {
        return objectToBeCloned;
    }

    var objectClone;

    var Constructor = objectToBeCloned.constructor;
    // Учитываем специфических объекты
    switch (Constructor) {
        case RegExp:
            objectClone = new Constructor(objectToBeCloned);
        break;
        // Ситуация с клонированием объекта Date, где передаем время из исходящего объекта
        case Date:
            objectClone = new Constructor(objectToBeCloned.getTime());
        break;
        default:
            objectClone = new Constructor();
    }

    for (var prop in objectToBeCloned) {
        objectClone[prop] = clone(objectToBeCloned[prop]);
    }

    return objectClone;
}
```