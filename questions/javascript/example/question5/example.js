
function clone(objectToBeCloned) {
    if (!(objectToBeCloned instanceof Object)) {
        return objectToBeCloned;
    }

    var objectClone;

    var Constructor = objectToBeCloned.constructor;
    objectClone = new Constructor();

    for (var prop in objectToBeCloned) {
        objectClone[prop] = clone(objectToBeCloned[prop]);
    }

    return objectClone;
}

function cloneGlue(objectToBeCloned) {
    if (!(objectToBeCloned instanceof Object)) {
        return objectToBeCloned;
    }

    var objectClone;

    var Constructor = objectToBeCloned.constructor;
    objectClone = new Constructor();

    for (var i = 0; i < arguments.length; i++) {
        var nextSource = arguments[i];

        if (!(nextSource instanceof Object)) {
            continue;
        }

        for (var prop in nextSource) {
            objectClone[prop] = clone(nextSource[prop]);
        }
    }

    return objectClone;
}

class User {
    _name = '';

    constructor(name) {
        this._name = name;
        this.lastName = name;
    }

    sayHi() {
        console.log(this.name);
    }

    get name() {
        return this._name;
    }

    set name(value) {
        if (value.length < 4) {
            console.log("Name is too short.");
            return;
        }
        this._name = value;
    }
}

class Student extends User {

    constructor(name, faculty) {
        super(name, faculty);
        this._faculty = faculty;
        this.pet = new Rabbit();
    }

    sayHi() {
        console.log("Student: " + this.name + " " + this.faculty);
    }

    get faculty() {
        return this._faculty;
    }

    set faculty(value) {
        this._faculty = value;
    }
}

function Animal () {
    this.eats = true;
    this.walk = function() {
        console.log("AnimalP walk");
    }
}

function Rabbit () {
    Animal.apply(this, arguments);
    this.jumps = true;
}

Rabbit.prototype = Object.create(Animal.prototype);
Object.defineProperty(Rabbit.prototype, "constructor", { value: Rabbit, writable: true, enumerable: false, configurable: true});


const user1 = new User("Jon 1");

const user2 = structuredClone(user1);
user2.name = "Jon 2";
user2.lastName = "Jon 2";

const user3 = {...user1};
user3.name = "Jon 3";
user3.lastName = "Jon 3";

const user4 = Object.assign(new user1.constructor());
user4.name = "Jon 4";
user4.lastName = "Jon 4";

const user5 = clone(user1);
user5.name = "Jon 5";
user5.lastName = "Jon 5";

const student1 = new Student("Student 1", "Economics");
const student2 = clone(student1);
student2.name = "Student 2";
student2.faculty = "Economic Clone";
student2.pet.eats = false;

const student3 = cloneGlue(student1, new Rabbit());

console.log(user1);
console.log(user2);
console.log(user3);
console.log(user4);
console.log(user5);

console.log(student1);
console.log(student2);
console.log(student3);

console.log('End');