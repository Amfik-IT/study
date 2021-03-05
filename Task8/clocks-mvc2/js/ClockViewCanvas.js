"use strict";

function _ClockViewCanvas() {
    let myClockContainer = null;

    let hourAngle = 0;
    let minuteAngle = 0;
    let secondAngle = 0;

    let requestTime = null;

    let containerCreate = null;
    let containerCreateWidth = null;

    this.init = function (container) { // инициализация данных
        myClockContainer = container;

        let idContainer = myClockContainer.dataset.method + myClockContainer.dataset.timezone;
        containerCreate = myClockContainer.querySelector(`#${idContainer}`);
        containerCreateWidth = containerCreate.offsetWidth;
        this.createClock();
        containerCreate.innerHTML = `<canvas class="clock__canvas" width="${containerCreateWidth}" height="${containerCreateWidth}">
            Ваш браузер не поддерживает canvas, что мешает ощутить все прелести данной технологии...
            </canvas>
            <img id="photo" src="http://fe.it-academy.by/Sites/0030837/JS/Task8/clocks-mvc/catOne250.png"></img>`;
    }

    this.stopClock = function () { // остановить время
        cancelAnimationFrame(requestTime);
    }

    this.startClock = function () { // запустить время
        this.createClock();
    }

    this.updateData = function (angleObg) {
        hourAngle = angleObg.hourAngle;
        minuteAngle = angleObg.minuteAngle;
        secondAngle = angleObg.secondAngle;

    }

    this.createClock = function () {

        function drawClock() {

            blank();
            const clock = containerCreate.querySelector('.clock__canvas');
            let halfWidthClock = (containerCreateWidth / 2);
            let litleCenterCircleWidth = Math.floor(containerCreateWidth * 0.033);

            if (clock && clock.getContext('2d')) {
                let ctx = clock.getContext('2d');

                // Рисуем большой груг
                ctx.save();
                ctx.shadowColor = '#d8cdcf';
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowBlur = 10;

                ctx.beginPath();
                ctx.fillStyle = '#282828';
                ctx.strokeStyle = '#00000078';
                ctx.arc(halfWidthClock, halfWidthClock, halfWidthClock, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.fill();
                ctx.restore();

                let img = document.getElementById("photo");
                ctx.drawImage(img, halfWidthClock / 2, halfWidthClock / 2, halfWidthClock * 1.02 + 0.5, halfWidthClock * 1.02 + 0.5);

                ctx.save();

                // Рисуем 12 цифр
                for (let angle = 30; angle <= 360; angle += 30) {

                    let radius = (halfWidthClock) - (containerCreateWidth / 12.5) - 1.5;
                    let angleRadians = parseFloat(angle) / 180 * Math.PI;
                    let numeralCenterX = halfWidthClock + radius * Math.sin(angleRadians);
                    let numeralCenterY = (halfWidthClock + 2.5) - radius * Math.cos(angleRadians);

                    ctx.shadowColor = 'rgba(0,0,0,1)';
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
                    ctx.shadowBlur = 10;
                    ctx.font = `bold ${(containerCreateWidth / 10) - 0.5}px Times-New-Roman`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = '#afafaf';
                    ctx.fillText(`${angle/30}`, numeralCenterX, numeralCenterY);
                }
                ctx.restore();

                // Создание 60ти маленьких минутных точек:
                ctx.save();
                for (let angle = 6; angle <= 360; angle += 6) {

                    let radius = (halfWidthClock) - (containerCreateWidth / 50);
                    let angleRadians = parseFloat(angle) / 180 * Math.PI;
                    let CenterX = halfWidthClock + radius * Math.sin(angleRadians);
                    let CenterY = halfWidthClock - radius * Math.cos(angleRadians);

                    ctx.beginPath();
                    ctx.fillStyle = 'rgba(0,0,0,0.75)';
                    if (angle % 30 == 0) {
                        let wd = (containerCreateWidth / 100);
                        ctx.arc(CenterX, CenterY, wd / 2, 0, 2 * Math.PI);
                    } else {
                        let wd = (containerCreateWidth / 150);
                        ctx.arc(CenterX, CenterY, wd / 2, 0, 2 * Math.PI);
                    };
                    ctx.fill();

                }
                ctx.restore();

                // Стрелки

                let radius;
                let angleRadians;
                let X;
                let Y;

                // Часовая
                ctx.strokeStyle = 'rgba(0,0,0,0.77)';
                ctx.lineCap = 'round';
                ctx.lineWidth = 6.5;
                ctx.beginPath();
                ctx.moveTo(halfWidthClock, halfWidthClock);

                radius = halfWidthClock * 0.55;
                angleRadians = parseFloat(hourAngle) / 180 * Math.PI;
                X = halfWidthClock + radius * Math.sin(angleRadians);
                Y = (halfWidthClock) - radius * Math.cos(angleRadians);

                ctx.lineTo(X, Y);
                ctx.stroke();

                ctx.strokeStyle = '#afafaf';
                ctx.lineCap = 'round';
                ctx.lineWidth = 4.5;
                ctx.beginPath();
                ctx.moveTo(halfWidthClock, halfWidthClock);
                ctx.lineTo(X, Y);
                ctx.stroke();

                // Минутная
                ctx.strokeStyle = 'rgba(0,0,0,0.77)';
                ctx.lineCap = 'round';
                ctx.lineWidth = 4.5;
                ctx.beginPath();
                ctx.moveTo(halfWidthClock, halfWidthClock);

                radius = halfWidthClock * 0.65;
                angleRadians = parseFloat(minuteAngle) / 180 * Math.PI;
                X = halfWidthClock + radius * Math.sin(angleRadians);
                Y = (halfWidthClock) - radius * Math.cos(angleRadians);

                ctx.lineTo(X, Y);
                ctx.stroke();

                ctx.strokeStyle = '#afafaf';
                ctx.lineCap = 'round';
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.moveTo(halfWidthClock, halfWidthClock);
                ctx.lineTo(X, Y);
                ctx.stroke();

                // Секундная
                ctx.strokeStyle = 'rgba(0,0,0,0.77)';
                ctx.lineCap = 'round';
                ctx.lineWidth = 3.5;
                ctx.beginPath();
                ctx.moveTo(halfWidthClock, halfWidthClock);

                radius = halfWidthClock * 0.75;
                angleRadians = parseFloat(secondAngle) / 180 * Math.PI;
                X = halfWidthClock + radius * Math.sin(angleRadians);
                Y = (halfWidthClock) - radius * Math.cos(angleRadians);

                ctx.lineTo(X, Y);
                ctx.stroke();

                ctx.strokeStyle = '#afafaf';
                ctx.lineCap = 'round';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(halfWidthClock, halfWidthClock);
                ctx.lineTo(X, Y);
                ctx.stroke();

                // Маленький круг в центре
                ctx.beginPath();
                ctx.lineWidth = 2.5;
                ctx.fillStyle = '#afafaf';
                ctx.strokeStyle = '#000000cc';
                ctx.arc(halfWidthClock, halfWidthClock, litleCenterCircleWidth / 2, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.fill();
            }
            requestTime = requestAnimationFrame(drawClock);
        }

        function blank() {
            const clock = containerCreate.querySelector('.clock__canvas');

            if (clock && clock.getContext('2d')) {
                let ctx = clock.getContext('2d');
                ctx.fillStyle = '#282828';
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            }
        }

        requestTime = requestAnimationFrame(drawClock);
    }

};