"use strict";

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

    this.timezone = function () { // определить и передать часовой пояс
        const timezone = myClockContainer.dataset.timezone;
        myClockModel.updateInfo(timezone);
    }
};