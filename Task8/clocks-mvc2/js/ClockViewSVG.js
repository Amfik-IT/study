"use strict";

function _ClockViewSVG() {
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

    let hourHandIn = null;
    let minuteHandIn = null;
    let secondHandIn = null;

    this.init = function (container) { // инициализация данных
        myClockContainer = container;

        let idContainer = myClockContainer.dataset.method + myClockContainer.dataset.timezone;
        containerCreate = myClockContainer.querySelector(`#${idContainer}`);
        containerCreateWidth = containerCreate.offsetWidth;

        this.createClock();

        hourHand = containerCreate.querySelector("#hourHand");
        minuteHand = containerCreate.querySelector("#minuteHand");
        secondHand = containerCreate.querySelector("#secondHand");

        hourHandIn = containerCreate.querySelector("#hourHandIn");
        minuteHandIn = containerCreate.querySelector("#minuteHandIn");
        secondHandIn = containerCreate.querySelector("#secondHandIn");

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

            hourHand.setAttribute("transform", `rotate(${hourAngle} ${containerCreateWidth/2} ${containerCreateWidth/2})`);
            hourHandIn.setAttribute("transform", `rotate(${hourAngle} ${containerCreateWidth/2} ${containerCreateWidth/2})`);
            minuteHand.setAttribute("transform", `rotate(${minuteAngle} ${containerCreateWidth/2} ${containerCreateWidth/2})`);
            minuteHandIn.setAttribute("transform", `rotate(${minuteAngle} ${containerCreateWidth/2} ${containerCreateWidth/2})`);
            secondHand.setAttribute("transform", `rotate(${secondAngle} ${containerCreateWidth/2} ${containerCreateWidth/2})`);
            secondHandIn.setAttribute("transform", `rotate(${secondAngle} ${containerCreateWidth/2} ${containerCreateWidth/2})`);
            requestTime = requestAnimationFrame(update);
        }
        requestTime = requestAnimationFrame(update);
    }

    this.createClock = function () {
        // Построение эмуляции часов SVG:

        const svgNS = "http://www.w3.org/2000/svg";

        let halfContainerCreateWidth = containerCreateWidth / 2;
        let litleCenterCircleWidth = Math.floor(containerCreateWidth * 0.033);

        (function () {

            containerCreate.innerHTML = `<svg id="svg" height="${containerCreateWidth}" width="${containerCreateWidth}"></svg>`;
            const svg = containerCreate.querySelector("#svg");

            const whHalf = parseFloat(halfContainerCreateWidth);

            let circleBig = document.createElementNS(svgNS, "circle");

            circleBig.setAttributeNS(null, "cx", whHalf);
            circleBig.setAttributeNS(null, "cy", whHalf);
            circleBig.setAttributeNS(null, "r", whHalf);
            circleBig.classList.add("circleSvgBig");

            svg.appendChild(circleBig);

            // Создание 12ти цифр:
            for (let angle = 30; angle <= 360; angle += 30) {

                let numeral = document.createElementNS(svgNS, "text");
                numeral.classList.add("numeral");
                numeral.style.fontSize = containerCreateWidth / 10 + 'px';
                numeral.innerHTML = angle / 30;
                svg.appendChild(numeral);

                let ws = numeral.clientWidth;

                let radius = (whHalf) - (containerCreateWidth / 12.5);
                let angleRadians = parseFloat(angle) / 180 * Math.PI;

                let numeralCenterX = (whHalf) + radius * Math.sin(angleRadians);
                let numeralCenterY = (whHalf) - radius * Math.cos(angleRadians);

                numeral.setAttributeNS(null, "x", Math.round(numeralCenterX - (ws / 2 + 1)));
                numeral.setAttributeNS(null, "y", Math.round(numeralCenterY + (ws / 2 + 2.5)));
            }

            // Стрелки: 
            let hourHand = document.createElementNS(svgNS, "line"); // ЧАСОВАЯ
            hourHand.setAttributeNS(null, "x1", whHalf);
            hourHand.setAttributeNS(null, "x2", whHalf);
            hourHand.setAttributeNS(null, "y1", whHalf);
            hourHand.setAttributeNS(null, "y2", whHalf * 0.45);
            hourHand.setAttributeNS(null, "stroke", "#000000c4");
            hourHand.setAttributeNS(null, "stroke-width", 8);
            hourHand.setAttributeNS(null, "stroke-linecap", "round");
            hourHand.setAttributeNS(null, "id", "hourHand");
            svg.appendChild(hourHand);
            let hourHandIn = document.createElementNS(svgNS, "line"); // Для эфекта бордера
            hourHandIn.setAttributeNS(null, "x1", whHalf);
            hourHandIn.setAttributeNS(null, "x2", whHalf);
            hourHandIn.setAttributeNS(null, "y1", whHalf);
            hourHandIn.setAttributeNS(null, "y2", whHalf * 0.45);
            hourHandIn.setAttributeNS(null, "stroke", "#afafaf");
            hourHandIn.setAttributeNS(null, "stroke-width", 5);
            hourHandIn.setAttributeNS(null, "stroke-linecap", "round");
            hourHandIn.setAttributeNS(null, "id", "hourHandIn");
            svg.appendChild(hourHandIn);

            let minuteHand = document.createElementNS(svgNS, "line"); // МИНУТНАЯ
            minuteHand.setAttributeNS(null, "x1", whHalf);
            minuteHand.setAttributeNS(null, "x2", whHalf);
            minuteHand.setAttributeNS(null, "y1", whHalf);
            minuteHand.setAttributeNS(null, "y2", whHalf * 0.35);
            minuteHand.setAttributeNS(null, "stroke", "#000000c4");
            minuteHand.setAttributeNS(null, "stroke-width", 6);
            minuteHand.setAttributeNS(null, "stroke-linecap", "round");
            minuteHand.setAttributeNS(null, "id", "minuteHand");
            svg.appendChild(minuteHand);
            let minuteHandIn = document.createElementNS(svgNS, "line"); // Для эфекта бордера
            minuteHandIn.setAttributeNS(null, "x1", whHalf);
            minuteHandIn.setAttributeNS(null, "x2", whHalf);
            minuteHandIn.setAttributeNS(null, "y1", whHalf);
            minuteHandIn.setAttributeNS(null, "y2", whHalf * 0.35);
            minuteHandIn.setAttributeNS(null, "stroke", "#afafaf");
            minuteHandIn.setAttributeNS(null, "stroke-width", 3);
            minuteHandIn.setAttributeNS(null, "stroke-linecap", "round");
            minuteHandIn.setAttributeNS(null, "id", "minuteHandIn");
            svg.appendChild(minuteHandIn);

            let secondHand = document.createElementNS(svgNS, "line"); // СЕКУНДНАЯ
            secondHand.setAttributeNS(null, "x1", whHalf);
            secondHand.setAttributeNS(null, "x2", whHalf);
            secondHand.setAttributeNS(null, "y1", whHalf);
            secondHand.setAttributeNS(null, "y2", whHalf * 0.25);
            secondHand.setAttributeNS(null, "stroke", "#000000c4");
            secondHand.setAttributeNS(null, "stroke-width", 4);
            secondHand.setAttributeNS(null, "stroke-linecap", "round");
            secondHand.setAttributeNS(null, "id", "secondHand");
            svg.appendChild(secondHand);
            let secondHandIn = document.createElementNS(svgNS, "line"); // Для эфекта бордера
            secondHandIn.setAttributeNS(null, "x1", whHalf);
            secondHandIn.setAttributeNS(null, "x2", whHalf);
            secondHandIn.setAttributeNS(null, "y1", whHalf);
            secondHandIn.setAttributeNS(null, "y2", whHalf * 0.25);
            secondHandIn.setAttributeNS(null, "stroke", "#afafaf");
            secondHandIn.setAttributeNS(null, "stroke-width", 2);
            secondHandIn.setAttributeNS(null, "stroke-linecap", "round");
            secondHandIn.setAttributeNS(null, "id", "secondHandIn");
            svg.appendChild(secondHandIn);

            // Маленький круг в центре:
            let litleCenterCircle = document.createElementNS(svgNS, "circle");
            litleCenterCircle.setAttributeNS(null, "cx", whHalf);
            litleCenterCircle.setAttributeNS(null, "cy", whHalf);
            litleCenterCircle.setAttributeNS(null, "r", litleCenterCircleWidth / 2);
            litleCenterCircle.setAttributeNS(null, "stroke", 'black');
            litleCenterCircle.setAttributeNS(null, "fill", '#afafaf');
            svg.appendChild(litleCenterCircle);

            // Создание 60ти маленьких минутных точек:

            for (let angle = 6; angle <= 360; angle += 6) {

                let dot = document.createElementNS(svgNS, "circle");
                let wd;
                if (angle % 30 == 0) {
                    wd = Math.round(containerCreateWidth / 100);
                    dot.setAttributeNS(null, "r", wd / 2);
                } else {
                    wd = Math.round(containerCreateWidth / 150);
                    dot.setAttributeNS(null, "r", wd / 2);
                };

                svg.appendChild(dot);

                let radius = (whHalf) - (containerCreateWidth / 50);
                let angleRadians = parseFloat(angle) / 180 * Math.PI;

                let dotCenterX = (whHalf) + radius * Math.sin(angleRadians);
                let dotCenterY = (whHalf) - radius * Math.cos(angleRadians);

                dot.setAttributeNS(null, "fill", '#000000c2');
                dot.setAttributeNS(null, "cx", Math.round(dotCenterX - (wd / 2 - 1)));
                dot.setAttributeNS(null, "cy", Math.round(dotCenterY + (wd / 2 - 2)));
            }
        }());

    }

};