"use strict";
let myModule = (function () {

    /* ------- begin view Canvas-------- */
    function _ClockViewCanvas() {
        let myModal = null;

        this.init = function (container) { // инициализация данных
            myModal = container;
        }

        this.show = function () { // удаляет класс с display: none
            myModal.classList.remove('modal__closed');
        }

        this.hide = function () { // добавляет класс с display: none
            myModal.classList.add('modal__closed');
        }
        this.updateModal = function (title, content) {
            let h2 = myModal.querySelector('.modal__header h2');
            h2.innerHTML = title;
            let mainModal = myModal.querySelector('.modal__content');
            mainModal.innerHTML = content;
        }

    };
    /* -------- end view Canvas--------- */

    /* ------- begin view SVG-------- */
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
                    // debugger
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
                    // debugger
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
    /* -------- end view SVG--------- */

    /* ------- begin view DOM-------- */
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
            // debugger

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
    /* -------- end view DOM--------- */

    /* ------- begin model ------- */
    function _Clock() {
        let myClockView = null;
        let dataTimezone = null;
        let requestTime = null;

        this.init = function (view) { // инициализация данных
            myClockView = view;
        }

        this.stopClock = function () { // вызывает методы View
            myClockView.stopClock();
        }

        this.startClock = function () { // вызывает методы View
            myClockView.startClock();
        }

        this.updateInfo = function (timezone) {
            dataTimezone = timezone;
            this.updateTime();
        }

        this.updateTime = function () {

            function update() {

                let date = new Date();
                let utc = date.getTime() + (date.getTimezoneOffset() * 60000);
                let newDate = new Date(utc + (3600000 * dataTimezone));
                let hour = newDate.getHours();
                let minute = newDate.getMinutes();
                let second = newDate.getSeconds();
                let angleObg = {
                    hourAngle: (hour * 30) + (minute / 2),
                    minuteAngle: (minute * 6) + (second / 10),
                    secondAngle: second * 6,
                }
                myClockView.updateData(angleObg);
                requestTime = requestAnimationFrame(update);
            }
            requestTime = requestAnimationFrame(update);
        }
    }
    /* -------- end model -------- */

    /* ----- begin controller ---- */
    function _ClockControllerButtons() {
        let myClockContainer = null;
        let myClockModel = null;

        this.init = function (model, container) { // получаем кнопки и вешаем обработчики
            myClockContainer = container;
            myClockModel = model;

            // кнопка остановить часы
            const btnStop = myClockContainer.querySelector('.stop');
            btnStop.addEventListener('click', this.stopClock);

            // кнопка запустить часы
            const btnStart = myClockContainer.querySelector('.start');
            btnStart.addEventListener('click', this.startClock);

            // определить часовой пояс
            this.timezone();
        }

        this.stopClock = function () { // вызывает методы модели
            myClockModel.stopClock();
        }

        this.startClock = function () { // вызывает методы модели
            myClockModel.startClock();
        }

        this.timezone = function () {
            const timezone = myClockContainer.dataset.timezone;
            myClockModel.updateInfo(timezone);
        }
    };
    /* ------ end controller ----- */

    function _initial(container, method) {
        // debugger
        // глобальная инициализация
        let appClockView;
        switch (method) {
            case "DOM":
                appClockView = new _ClockViewDOM();
                break;
            case "SVG":
                appClockView = new _ClockViewSVG();
                break;
            case "Canvas":
                appClockView = new _ClockViewDOM();
                // appClockView = new _ClockViewCanvas();
                break;
            default:
                break;
        }
        // let appClockView;
        const appClockModel = new _Clock();
        const appClockController = new _ClockControllerButtons();
        //вызвать init-методы...
        appClockView.init(container);
        appClockModel.init(appClockView);
        appClockController.init(appClockModel, container);
    }

    return function () {
        this.search = function () {
            // debugger
            let arrClockContainer = document.querySelectorAll('[data-method]');

            for (let item of arrClockContainer) {

                _initial(item, item.dataset.method);

            }
        }
    }
}());

const module = new myModule;
module.search();