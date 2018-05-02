var Class = new Object();
Class.property = 'Свойство класса.';
console.log(Class.hasOwnProperty('property')); // вернёт true
console.log(Class.hasOwnProperty('toString')); // вернёт false