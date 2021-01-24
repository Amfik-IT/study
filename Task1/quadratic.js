function quadraticEquation(a, b, c) {
    if (a == 0) {
        console.log (`Аргумент "а" не может ровняться ${a}! Введите корректное значение!`);
        return;
    };
    let D = (b**2) - (4 * a * c);

    let moduloA = (a > 1 && a) || (a < -1 && Math.abs(a)) || "";
    let moduloB = (b > 1 && b) || (b < -1 && Math.abs(b)) || "";
    let moduloC = Math.abs(c);
    let operA = (a < 0 && "\-") || (a >= 0 && "");
    let operB = (b >= 0 && "\+") || (b < 0 && "\-");
    let operC = (c >= 0 && "\+") || (c < 0 && "\-");

    if (D > 0) {
        let x1 = (-b + (D**0.5)) / (2 * a);
        let x2 = (-b - (D**0.5)) / (2 * a);

        if (b == 0) {
            console.log (`уравнение ${operA}${moduloA}x^2 ${operC} ${moduloC} = 0 имеет корни x1 = ${x1} и x2 = ${x2}`);
        } else
            console.log (`уравнение ${operA}${moduloA}x^2 ${operB} ${moduloB}x ${operC} ${moduloC} = 0 имеет корни x1 = ${x1} и x2 = ${x2}`);

    } else if (D == 0) {
        let x = (-b + (D**0.5)) / (2 * a);

        if (b == 0) {
            console.log (`уравнение ${operA}${moduloA}x^2 ${operC} ${moduloC} = 0 имеет один корень x = ${x}`);
        } else
            console.log (`уравнение ${operA}${moduloA}x^2 ${operB} ${moduloB}x ${operC} ${moduloC} = 0 имеет один корень x = ${x}`);
    } else {
        if (b == 0) {
            console.log (`уравнение ${operA}${moduloA}x^2 ${operC} ${moduloC} = 0 не имеет вещественных корней`);
        } else
            console.log (`уравнение ${operA}${moduloA}x^2 ${operB} ${moduloB}x ${operC} ${moduloC} = 0 не имеет вещественных корней`);
    }
    console.log (`Дискриминант = ${D}`);
}
quadraticEquation(-1, -1, -1);
quadraticEquation(2, -4, 8);