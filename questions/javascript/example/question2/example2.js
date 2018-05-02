var Class = new Object();
Class.property= 'Свойство класса.';

for (var name in Class) {
    if (Class.hasOwnProperty(name)) {
        console.log('Свойство (' + name + ') принадлежит классу Class');
    } else {
        console.log(name); // остальные свойства
    }
}