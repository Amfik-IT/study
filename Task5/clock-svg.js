// Построение эмуляции часов SVG:

const svgNS = "http://www.w3.org/2000/svg";

(function() {
    
    const svg = document.getElementById("svg");

    const w = parseFloat(svg.getAttributeNS(null, "width"));
    const h = parseFloat(svg.getAttributeNS(null, "height"));

    let circleBig = document.createElementNS(svgNS,"circle");

    circleBig.setAttributeNS(null,"cx", w/2);
    circleBig.setAttributeNS(null,"cy", h/2);
    circleBig.setAttributeNS(null,"r", w/2);
    circleBig.classList.add("circleSvgBig");

    svg.appendChild(circleBig);

    // Создание 12ти цифр:
    for (let angle = 30; angle <= 360; angle += 30) {

        let numeral = document.createElementNS(svgNS,"text");
        numeral.classList.add("numeral");
        numeral.innerHTML = angle / 30;
        svg.appendChild(numeral);
    
        let ws = numeral.clientWidth;
    
        let radius = (w / 2) - 40;
        let angleRadians = parseFloat(angle)/180*Math.PI;
    
        let numeralCenterX = (w / 2) + radius * Math.sin(angleRadians);
        let numeralCenterY = (h / 2) - radius * Math.cos(angleRadians);
    
        numeral.setAttributeNS(null,"x", Math.round(numeralCenterX - (ws / 2)));
        numeral.setAttributeNS(null,"y", Math.round(numeralCenterY + (ws / 2 + 5)));
    }
    // digitalClock
    let digitalClock = document.createElementNS(svgNS, "text");
    digitalClock.setAttributeNS(null,"id", "digitalClock");
    svg.appendChild(digitalClock);
    digitalClock.setAttributeNS(null,"x", Math.round(w/2 - 50));
    digitalClock.setAttributeNS(null,"y", Math.round(h/2 + 160));

    // Стрелки: 
    let hourHand = document.createElementNS(svgNS, "line"); // ЧАСОВАЯ
    hourHand.setAttributeNS(null,"x1", w/2 - 2);
    hourHand.setAttributeNS(null,"x2", w/2 - 2);
    hourHand.setAttributeNS(null,"y1", h/2);
    hourHand.setAttributeNS(null,"y2", 100);
    hourHand.setAttributeNS(null,"stroke", "#000000c4");
    hourHand.setAttributeNS(null,"stroke-width", 10);
    hourHand.setAttributeNS(null,"stroke-linecap", "round");
    hourHand.setAttributeNS(null,"id", "hourHand");
    svg.appendChild(hourHand);
    let hourHandIn = document.createElementNS(svgNS, "line"); // Для эфекта бордера
    hourHandIn.setAttributeNS(null,"x1", w/2 - 2);
    hourHandIn.setAttributeNS(null,"x2", w/2 - 2);
    hourHandIn.setAttributeNS(null,"y1", h/2);
    hourHandIn.setAttributeNS(null,"y2", 100);
    hourHandIn.setAttributeNS(null,"stroke", "#afafaf");
    hourHandIn.setAttributeNS(null,"stroke-width", 7);
    hourHandIn.setAttributeNS(null,"stroke-linecap", "round");
    hourHandIn.setAttributeNS(null,"id", "hourHandIn");
    svg.appendChild(hourHandIn);

    let minuteHand = document.createElementNS(svgNS, "line"); // МИНУТНАЯ
    minuteHand.setAttributeNS(null,"x1", w/2 - 2);
    minuteHand.setAttributeNS(null,"x2", w/2 - 2);
    minuteHand.setAttributeNS(null,"y1", h/2);
    minuteHand.setAttributeNS(null,"y2", 70);
    minuteHand.setAttributeNS(null,"stroke", "#000000c4");
    minuteHand.setAttributeNS(null,"stroke-width", 8);
    minuteHand.setAttributeNS(null,"stroke-linecap", "round");
    minuteHand.setAttributeNS(null,"id", "minuteHand");
    svg.appendChild(minuteHand);
    let minuteHandIn = document.createElementNS(svgNS, "line");// Для эфекта бордера
    minuteHandIn.setAttributeNS(null,"x1", w/2 - 2);
    minuteHandIn.setAttributeNS(null,"x2", w/2 - 2);
    minuteHandIn.setAttributeNS(null,"y1", h/2);
    minuteHandIn.setAttributeNS(null,"y2", 70);
    minuteHandIn.setAttributeNS(null,"stroke", "#afafaf");
    minuteHandIn.setAttributeNS(null,"stroke-width", 5);
    minuteHandIn.setAttributeNS(null,"stroke-linecap", "round");
    minuteHandIn.setAttributeNS(null,"id", "minuteHandIn");
    svg.appendChild(minuteHandIn);

    let secondHand = document.createElementNS(svgNS, "line"); // СЕКУНДНАЯ
    secondHand.setAttributeNS(null,"x1", w/2 - 2);
    secondHand.setAttributeNS(null,"x2", w/2 - 2);
    secondHand.setAttributeNS(null,"y1", h/2);
    secondHand.setAttributeNS(null,"y2", 40);
    secondHand.setAttributeNS(null,"stroke", "#000000c4");
    secondHand.setAttributeNS(null,"stroke-width", 5);
    secondHand.setAttributeNS(null,"stroke-linecap", "round");
    secondHand.setAttributeNS(null,"id", "secondHand");
    svg.appendChild(secondHand);
    let secondHandIn = document.createElementNS(svgNS, "line");// Для эфекта бордера
    secondHandIn.setAttributeNS(null,"x1", w/2 - 2);
    secondHandIn.setAttributeNS(null,"x2", w/2 - 2);
    secondHandIn.setAttributeNS(null,"y1", h/2);
    secondHandIn.setAttributeNS(null,"y2", 40);
    secondHandIn.setAttributeNS(null,"stroke", "#afafaf");
    secondHandIn.setAttributeNS(null,"stroke-width", 2);
    secondHandIn.setAttributeNS(null,"stroke-linecap", "round");
    secondHandIn.setAttributeNS(null,"id", "secondHandIn");
    svg.appendChild(secondHandIn);

    // Маленький круг в центре:
    let litleCenterCircle = document.createElementNS(svgNS,"circle");
    litleCenterCircle.setAttributeNS(null,"cx", w/2 -2);
    litleCenterCircle.setAttributeNS(null,"cy", h/2 -2);
    litleCenterCircle.setAttributeNS(null,"r", 8);
    litleCenterCircle.setAttributeNS(null,"stroke", 'black');
    litleCenterCircle.setAttributeNS(null,"fill", '#afafaf');
    svg.appendChild(litleCenterCircle);

    // Создание 60ти маленьких минутных точек:

    for (let angle = 6; angle <= 360; angle += 6) {
        // debugger
        let dot = document.createElementNS(svgNS,"circle");
        let wd;
        if (angle % 30 == 0) {
            dot.setAttributeNS(null,"r", 2.5);
            wd = 5;
        } else {
            dot.setAttributeNS(null,"r", 1.5);
            wd = 3;
        };

        svg.appendChild(dot);

        let radius = (w / 2) - 10;
        let angleRadians = parseFloat(angle)/180*Math.PI;

        let dotCenterX = (w / 2) + radius * Math.sin(angleRadians);
        let dotCenterY = (h / 2) - radius * Math.cos(angleRadians);

        dot.setAttributeNS(null,"fill", '#000000c2');
        dot.setAttributeNS(null,"cx", Math.round(dotCenterX - (wd / 2 - 1)));
        dot.setAttributeNS(null,"cy", Math.round(dotCenterY + (wd / 2 - 2)));
    }
}());

// Движение стрелок:

let timerClock = setInterval(tick, 1000);

function tick() {
    // debugger
    let date = new Date();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    hourHand.setAttribute("transform", `rotate(${(hour*30) + (minute/2)} 248 250)`);
    hourHandIn.setAttribute("transform", `rotate(${(hour*30) + (minute/2)} 248 250)`);
    minuteHand.setAttribute("transform", `rotate(${(minute*6) + (second/10)} 248 250)`);
    minuteHandIn.setAttribute("transform", `rotate(${(minute*6) + (second/10)} 248 250)`);
    secondHand.setAttribute("transform", `rotate(${second*6} 248 250)`);
    secondHandIn.setAttribute("transform", `rotate(${second*6} 248 250)`);
    let secondBefore;
    let minuteBefore;
    if (second < 10) {
        secondBefore = 0;
    } else secondBefore = "";
    if (minute < 10) {
        minuteBefore = 0;
    } else minuteBefore = "";
    digitalClock.innerHTML = `${hour}:${minuteBefore}${minute}:${secondBefore}${second}`;
}