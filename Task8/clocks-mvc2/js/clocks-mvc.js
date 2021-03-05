"use strict";

function _initial(container, method) {
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
            appClockView = new _ClockViewCanvas();
            break;
        default:
            break;
    }

    const appClockModel = new _Clock();
    const appClockController = new _ClockControllerButtons();
    //вызвать init-методы...
    appClockView.init(container);
    appClockModel.init(appClockView);
    appClockController.init(appClockModel, container);
}

function search() {

    let arrClockContainer = document.querySelectorAll('[data-method]');

    for (let item of arrClockContainer) {

        _initial(item, item.dataset.method);

    }
}

search();