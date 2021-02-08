// Через класс

// class A {
//     constructor(v) {
//         this.value = v || null;
//     }
//     getValue() {
//         console.log(this.value);
//     }
//     setValue(v) {
//         this.value = v;
//     }
// }

// class B extends A {
//     constructor(v) {
//         super();
//         this.val = v || null;
//     }
//     getOwnValue() {
//         console.log(this.val);
//     }
//     setValue(v) {
//         this.val = v;
//     }
// }


// через функции и прототипное наследование
function A(_v) {
    this.value = _v || null;
}

A.prototype.getValue = function () {
    console.log(this.value);
};

A.prototype.setValue = function (_v) {
    this.value = _v;
};

function B(_v) {
    A.call(this, _v);
    // super();
    this.val = _v || null;
}

B.prototype = Object.create(A.prototype);
B.prototype.constructor = B;

B.prototype.getOwnValue = function () {
    console.log(this.val);
};

B.prototype.setOwnValue = function (_v) {
    this.val = _v;
};

const c = new B(42);
console.log(c);
c.getValue();
c.setValue(15);