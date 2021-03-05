"use strict";

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
};