"use strict";

function _ClockViewDOM() {
    let myClockContainer = null;

    let hourAngle = 0;
    let minuteAngle = 0;
    let secondAngle = 0;

    let requestTime = null;

    let containerCreate = null;
    let containerCreateWidth = null;

    let hourHand = null;
    let minuteHand = null;
    let secondHand = null;

    this.init = function (container) { // инициализация данных
        myClockContainer = container;

        let idContainer = myClockContainer.dataset.method + myClockContainer.dataset.timezone;
        containerCreate = myClockContainer.querySelector(`#${idContainer}`);
        containerCreateWidth = containerCreate.offsetWidth;
        this.createClock();
        hourHand = containerCreate.querySelector(".hourHand");
        minuteHand = containerCreate.querySelector(".minuteHand");
        secondHand = containerCreate.querySelector(".secondHand");
        this.updateClock();
    }

    this.stopClock = function () { // остановить время
        cancelAnimationFrame(requestTime);
    }

    this.startClock = function () { // запустить время
        this.updateClock();
    }

    this.updateData = function (angleObg) {
        hourAngle = angleObg.hourAngle;
        minuteAngle = angleObg.minuteAngle;
        secondAngle = angleObg.secondAngle;

    }

    this.updateClock = function () {

        function update() {
            hourHand.style.transform = `rotate(${hourAngle}deg)`;
            minuteHand.style.transform = `rotate(${minuteAngle}deg)`;
            secondHand.style.transform = `rotate(${secondAngle}deg)`;
            requestTime = requestAnimationFrame(update);
        }
        requestTime = requestAnimationFrame(update);
    }

    this.createClock = function () {

        let halfContainerCreateWidth = containerCreateWidth / 2;
        let litleCenterCircleWidth = Math.floor(containerCreateWidth * 0.033)
        // Создание большого круга часов и стрелок:

        const circleBig = document.createElement('div'); // Большой груг
        circleBig.classList.add("circleBig");
        circleBig.style.width = containerCreateWidth + 'px';
        circleBig.style.height = containerCreateWidth + 'px';


        const hourHand = document.createElement('div'); // Часовая стрелка
        hourHand.classList.add("hourHand");
        circleBig.append(hourHand);
        hourHand.style.height = (halfContainerCreateWidth) * 0.55 + 'px';

        const minuteHand = document.createElement('div'); // Минутная стрелка
        minuteHand.classList.add("minuteHand");
        circleBig.append(minuteHand);
        minuteHand.style.height = (halfContainerCreateWidth) * 0.65 + 'px';

        const secondHand = document.createElement('div'); // Сукундная стрелка
        secondHand.classList.add("secondHand");
        circleBig.append(secondHand);
        secondHand.style.height = (halfContainerCreateWidth) * 0.75 + 'px';

        const litleCenterCircle = document.createElement('div'); // Маленький круг в центре
        litleCenterCircle.classList.add("litleCenterCircle");
        litleCenterCircle.style.width = litleCenterCircleWidth + 'px';
        litleCenterCircle.style.height = litleCenterCircleWidth + 'px';
        circleBig.append(litleCenterCircle);

        containerCreate.prepend(circleBig); // Вставить часы и найти стрелки

        // Положение стрелок и маленького круга:

        hourHand.style.left = (halfContainerCreateWidth) - (hourHand.offsetWidth / 2) + 'px';
        hourHand.style.top = (halfContainerCreateWidth) + 'px';
        hourHand.style.marginTop = -(halfContainerCreateWidth) * 0.55 + 'px';

        minuteHand.style.left = (halfContainerCreateWidth) - (minuteHand.offsetWidth / 2) + 'px';
        minuteHand.style.top = (halfContainerCreateWidth) + 'px';
        minuteHand.style.marginTop = -(halfContainerCreateWidth) * 0.65 + 'px';

        secondHand.style.left = (halfContainerCreateWidth) - (secondHand.offsetWidth / 2) + 'px';
        secondHand.style.top = (halfContainerCreateWidth) + 'px';
        secondHand.style.marginTop = -(halfContainerCreateWidth) * 0.75 + 'px';

        litleCenterCircle.style.left = (halfContainerCreateWidth) - (litleCenterCircleWidth / 2) + 'px';
        litleCenterCircle.style.top = (halfContainerCreateWidth) - (litleCenterCircleWidth / 2) + 'px';

        // Создание 12ти маленьких кругов c цифрами:

        for (let angle = 30; angle <= 360; angle += 30) {
            let circleSmall = document.createElement('div');
            circleSmall.classList.add("circleSmall");
            circleSmall.style.width = containerCreateWidth / 10 + 'px';
            circleSmall.style.height = containerCreateWidth / 10 + 'px';
            circleSmall.style.fontSize = containerCreateWidth / 10 + 'px';
            circleSmall.innerHTML = angle / 30;
            circleBig.append(circleSmall);


            let radius = (halfContainerCreateWidth) - (circleSmall.offsetWidth / 2) - 15;
            let angleRadians = parseFloat(angle) / 180 * Math.PI;

            let circleSmallCenterX = (halfContainerCreateWidth) + radius * Math.sin(angleRadians);
            let circleSmallCenterY = (halfContainerCreateWidth) - radius * Math.cos(angleRadians);

            circleSmall.style.left = Math.round(circleSmallCenterX - (containerCreateWidth / 10) / 2) + "px";
            circleSmall.style.top = Math.round(circleSmallCenterY - (containerCreateWidth / 10) / 2) + "px";

        }

        // Создание 60ти маленьких минутных точек:

        for (let angle = 6; angle <= 360; angle += 6) {
            let dot = document.createElement('div');
            if (angle % 30 == 0) {
                dot.classList.add("dotBig");
                dot.style.width = Math.round(containerCreateWidth / 100) + 'px';
                dot.style.height = Math.round(containerCreateWidth / 100) + 'px';
            } else {
                dot.classList.add("dotSmall");
                dot.style.width = Math.round(containerCreateWidth / 150) + 'px';
                dot.style.height = Math.round(containerCreateWidth / 150) + 'px';
            }
            circleBig.append(dot);


            let radius = (halfContainerCreateWidth) - (dot.offsetWidth / 2) - 5;
            let angleRadians = parseFloat(angle) / 180 * Math.PI;

            let dotCenterX = (halfContainerCreateWidth) + radius * Math.sin(angleRadians);
            let dotCenterY = (halfContainerCreateWidth) - radius * Math.cos(angleRadians);

            dot.style.left = Math.round(dotCenterX - dot.offsetWidth / 2) - 1 + "px";
            dot.style.top = Math.round(dotCenterY - dot.offsetHeight / 2) + "px";

        }
    }

};