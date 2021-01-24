// Рекурся (работает, но не знаю как выводить результат):
// function pow(x) {
//     return (n) => {
//         if (n == 1) {
//             return x;
//         } else if (n == 0) {
//             return 1;
//         } else if (n > 1) {
//             return x * pow(x)(--n);
//         } else {
//             return 1 /  (x * pow(x)(-n - 1));
//         }
//     };
// }
function pow(x) {
    return (n) => {
        let total = 1;
        for (let i = 0; i < Math.abs(n); i++) {
            total *= x;
        };
        if (n >= 0) {
            console.log (`${x}^${n} = ${total}`);
        } else console.log (`${x}^(${n}) = ${1 / total}`)
    };
}

pow(2)(3);
pow(-2)(3);
pow(16)(0);
pow(2)(-3);

function calculate(x) {
    return (y) => {
        return (z) => {
            switch(y) {
                case "+":
                    if (z < 0) {
                        console.log (`${x}+(${z}) = ${(x+z)}`)
                    } else console.log (`${x}+${z} = ${(x+z)}`);
                    break;
                case "-":
                    if (z < 0) {
                        console.log (`${x}-(${z}) = ${(x-z)}`)
                    } else console.log (`${x}-${z} = ${(x-z)}`);
                    break;
                case "*":
                    if (z < 0) {
                        console.log (`${x}*(${z}) = ${(x*z)}`)
                    } else console.log (`${x}*${z} = ${(x*z)}`);
                    break;
                case "/":
                    if (z == 0) {
                        console.log (`${x}/${z} = Ошибка (на ноль делить нельзя)`);
                    } else console.log (`${x}/${z} = ${(x/z)}`);
                    break;
            }
        };
    };
}

calculate(15)('+')(+3);
calculate(15)('+')(-3);
calculate(15)('-')(-3);
calculate(15)('-')(3);
calculate(5)('*')(-3);
calculate(5)('*')(3);
calculate(5)('/')(0);
calculate(15)('/')(3);