// Создание большого круга часов и стрелок:

const circleBig = document.createElement('div'); // Большой груг
circleBig.classList.add("circleBig");
document.body.prepend(circleBig);

const hourHand = document.createElement('div'); // Часовая стрелка
hourHand.classList.add("hourHand");
circleBig.append(hourHand);
hourHand.style.height = (circleBig.offsetHeight / 2) - 90 + 'px';

const minuteHand = document.createElement('div'); // Минутная стрелка
minuteHand.classList.add("minuteHand");
circleBig.append(minuteHand);
minuteHand.style.height = (circleBig.offsetHeight / 2) - 60 + 'px';

const secondHand = document.createElement('div'); // Сукундная стрелка
secondHand.classList.add("secondHand");
circleBig.append(secondHand);
secondHand.style.height = (circleBig.offsetHeight / 2) - 30 + 'px';

const litleCenterCircle = document.createElement('div'); // Маленький круг в центре
litleCenterCircle.classList.add("litleCenterCircle");
circleBig.append(litleCenterCircle);

let circleBigCenterX = circleBig.offsetLeft + (circleBig.offsetWidth / 2); // Получение точки центра большого круга по X
let circleBigCenterY = circleBig.offsetTop + (circleBig.offsetHeight / 2); // -- || -- по Y

// Положение стрелок и маленького круга:

hourHand.style.left = (circleBig.offsetWidth / 2) - (hourHand.offsetWidth / 2) + 1 + 'px'; 
hourHand.style.top = (circleBig.offsetHeight / 2) + 'px';
hourHand.style.marginTop = -(circleBig.offsetHeight / 2) + 90 + 'px';

minuteHand.style.left = (circleBig.offsetWidth / 2) - (minuteHand.offsetWidth / 2) + 'px';
minuteHand.style.top = (circleBig.offsetHeight / 2) + 'px';
minuteHand.style.marginTop = -(circleBig.offsetHeight / 2) + 60 + 'px';

secondHand.style.left = (circleBig.offsetWidth / 2) - (secondHand.offsetWidth / 2) + 'px';
secondHand.style.top = (circleBig.offsetHeight / 2) + 'px';
secondHand.style.marginTop = -(circleBig.offsetHeight / 2) + 30 + 'px';

litleCenterCircle.style.left = (circleBig.offsetWidth / 2) - (litleCenterCircle.offsetWidth / 2) + 1 + 'px';
litleCenterCircle.style.top = (circleBig.offsetHeight / 2) - (litleCenterCircle.offsetHeight / 2) + 1 + 'px';

// Создание 12ти маленьких кругов c цифрами:

for (let angle = 30; angle <= 360; angle += 30) {
    let circleSmall = document.createElement('div');
    circleSmall.classList.add("circleSmall");
    circleSmall.innerHTML = angle / 30;
    circleBig.append(circleSmall);


    let radius = (circleBig.offsetWidth / 2) - (circleSmall.offsetWidth / 2) - 15;
    let angleRadians = parseFloat(angle)/180*Math.PI;

    let circleSmallCenterX = (circleBig.offsetWidth / 2) + radius * Math.sin(angleRadians);
    let circleSmallCenterY = (circleBig.offsetHeight / 2) - radius * Math.cos(angleRadians);

    circleSmall.style.left = Math.round(circleSmallCenterX-circleSmall.offsetWidth/2) + "px";
    circleSmall.style.top = Math.round(circleSmallCenterY-circleSmall.offsetHeight/2) + "px";

}

// Создание 60ти маленьких минутных точек:

for (let angle = 6; angle <= 360; angle += 6) {
    let dot = document.createElement('div');
    if (angle % 30 == 0) {
        dot.classList.add("dotBig");
    } else dot.classList.add("dotSmall");
    circleBig.append(dot);


    let radius = (circleBig.offsetWidth / 2) - (dot.offsetWidth / 2) - 5;
    let angleRadians = parseFloat(angle)/180*Math.PI;

    let dotCenterX = (circleBig.offsetWidth / 2) + radius * Math.sin(angleRadians);
    let dotCenterY = (circleBig.offsetHeight / 2) - radius * Math.cos(angleRadians);

    dot.style.left = Math.round(dotCenterX-dot.offsetWidth/2) - 1 + "px";
    dot.style.top = Math.round(dotCenterY-dot.offsetHeight/2) + "px";

}

// Движение стрелок:

let timerClock = setInterval(tick, 1000);

function tick() {
    // debugger
    let date = new Date();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    hourHand.style.transform = `rotate(${(hour*30) + (minute/2)}deg)`;
    minuteHand.style.transform = `rotate(${(minute*6) + (second/10)}deg)`;
    secondHand.style.transform = `rotate(${second*6}deg)`;
}