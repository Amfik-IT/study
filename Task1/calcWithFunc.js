// let znac = null;

function one(func) {
    let i = 1;
    if (func == undefined) {
        return i;
    } else {
        func();
    };
    
};

function two (func) {
    let i = 2;
    if (func == undefined) {
        return i;
    } else {
        func();
    };
};

function three (func) {
    let i = 3;
    if (func == undefined) {
        return i;
    } else {
        func();
    };
};

function four (func) {
    let i = 4;
    if (func == undefined) {
        return i;
    } else {
        func();
    };
};

function five (func) {
    let i = 5;
    if (func == undefined) {
        return i;
    } else {
        func();
    };
};

function six (func) {
    let i = 6;
    if (func == undefined) {
        return i;
    } else {
        func();
    };
};

function seven (func) {
    let i = 7;
    if (func == undefined) {
        return i;
    } else {
        func();
    };
};

function eight (func) {
    let i = 8;
    if (func == undefined) {
        return i;
    } else {
        func();
    };
};

function nine (func) {
    let i = 9;
    if (func == undefined) {
        return i;
    } else {
        func();
    };
};

function zero (func) {
    let i = 0;
    if (func == undefined) {
        return i;
    } else {
        func();
    };
};

function plus (x) {
    let signifier = "+";
    return function (signifier, x) {
        switch(signifier) {
            case "+":
                console.log (`Результат: ${i} + ${x} = ${(i+x)}`);
                break;
            case "-":
                console.log (`Результат: ${i} - ${x} = ${(i-x)}`);
                break;
            case "*":
                console.log (`Результат: ${i} * ${x} = ${(i*x)}`);
                break;
            case "/":
                if (x !== 0) {
                    console.log (`Результат: ${i} / ${x} = ${(i/x)}`);
                    break;
                } else {
                    console.log (`На ноль делить нельзя`);
                    break;
                };
    }
};

function minus (oper) {
    let signifier = "-";
    return function (signifier, x) {
        switch(signifier) {
            case "+":
                console.log (`Результат: ${i} + ${x} = ${(i+x)}`);
                break;
            case "-":
                console.log (`Результат: ${i} - ${x} = ${(i-x)}`);
                break;
            case "*":
                console.log (`Результат: ${i} * ${x} = ${(i*x)}`);
                break;
            case "/":
                if (x !== 0) {
                    console.log (`Результат: ${i} / ${x} = ${(i/x)}`);
                    break;
                } else {
                    console.log (`На ноль делить нельзя`);
                    break;
                };
    }
};

function times (oper) {
    let signifier = "*";
    return function (signifier, x) {
        switch(signifier) {
            case "+":
                console.log (`Результат: ${i} + ${x} = ${(i+x)}`);
                break;
            case "-":
                console.log (`Результат: ${i} - ${x} = ${(i-x)}`);
                break;
            case "*":
                console.log (`Результат: ${i} * ${x} = ${(i*x)}`);
                break;
            case "/":
                if (x !== 0) {
                    console.log (`Результат: ${i} / ${x} = ${(i/x)}`);
                    break;
                } else {
                    console.log (`На ноль делить нельзя`);
                    break;
                };
    }
};

function dividedBy (oper) {
    let signifier = "/";
    return function (signifier, x) {
        switch(signifier) {
            case "+":
                console.log (`Результат: ${i} + ${x} = ${(i+x)}`);
                break;
            case "-":
                console.log (`Результат: ${i} - ${x} = ${(i-x)}`);
                break;
            case "*":
                console.log (`Результат: ${i} * ${x} = ${(i*x)}`);
                break;
            case "/":
                if (x !== 0) {
                    console.log (`Результат: ${i} / ${x} = ${(i/x)}`);
                    break;
                } else {
                    console.log (`На ноль делить нельзя`);
                    break;
                };
    }
};

one(plus(two()));