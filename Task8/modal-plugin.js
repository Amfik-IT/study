"use strict";
let myModyl = (function () {

    /* ------- begin view -------- */
    function ModalView() {
        let myModal = null;
        let myModalOverlay = null; // элемент для затемненя окна
        let btnSave = null; // кнопка модалки
        let inputsArr = null;

        this.init = function (container) { // инициализация данных
        myModal = container;

        // элемент для затемненя окна
        myModalOverlay = document.querySelector('#modal-overlay');

        // кнопка модалки
        btnSave = myModal.querySelector('#modal-save');

        // собираем все импуты в модалке
        inputsArr = myModal.querySelectorAll('input');
        }

        this.show = function () { // удаляет класс с display: none
        myModal.classList.remove('modal__closed');
        myModalOverlay.classList.remove('modal__closed');
        }

        this.hide = function () { // добавляет класс с display: none
        myModal.classList.add('modal__closed');
        myModalOverlay.classList.add('modal__closed');
        }

        this.buttonDisabled = function (state) { // блокируе кнопку сохранения
        btnSave.disabled = state;
        }

        // this.printViewData = function () { // вывести данные из хранилища в div.modal-data
        // }

        // this.clearViewData = function () { // очистить или выдать дефолтное сообщение только для div.modal-data
        // }
        this.clearView = function () {
        for (let item of inputsArr) {
            item.value = '';
        }
        }

    };
    /* -------- end view --------- */

    /* ------- begin model ------- */
    function ModalModel() {
        let myModalView = null;
        let userData = null; // объект для хранения данных о пользователе

        this.init = function (view) { // инициализация данных
        myModalView = view;

        }

        this.openModal = function () { // вызывает методы View
        myModalView.show();
        }

        this.closeModal = function () { // вызывает методы View
        myModalView.hide();
        }

        this.saveModalData = function (info) { //получить данные из модалки и сохранить
        userData = info;
        this.storeData();
        }

        this.storeData = function () { // сохранить данные в localStorage, а если не доступно, то в cookies
        window.localStorage.setItem('userInfo', JSON.stringify(userData));
        this.clearForm();
        }

        this.getData = function () { //достать данные из хранилища
        let getInfo = JSON.parse(window.localStorage.getItem("userInfo"));
        }

        // this.updateData = function() {
        // }

        this.clearData = function () { //очистить данные в хранилище
        window.localStorage.removeItem("userInfo");
        }

        this.clearForm = function () { //очистить данные в форме
        myModalView.clearView();
        }

        this.isActiveButton = function (check) { // логика блокировки кнопки сохранения
        myModalView.buttonDisabled(check); // вызывает методы View
        }
    }
    /* -------- end model -------- */

    /* ----- begin controller ---- */
    function ModalController() {
        let myModalContainer = null;
        let myModalModel = null;
        let inputsArr = null; // для коллекция импутов модалки

        this.init = function (model, container) { // получаем кнопки и вешаем обработчики
        myModalContainer = container;
        myModalModel = model;

        // кнопка открыть модалку
        const btnOpen = document.querySelector('#modal-open');
        btnOpen.addEventListener('click', this.openModal);

        // кнопка закрыть модалку
        const modalClose = myModalContainer.querySelector('#modal-close');
        modalClose.addEventListener('click', this.hideModal);

        // кнопка отмена модалки
        const modalCancel = myModalContainer.querySelector('#modal-cancel');
        modalCancel.addEventListener('click', this.hideModal);

        // кнопка сохранить инфо из модалки
        const modalSave = myModalContainer.querySelector('#modal-save');
        modalSave.addEventListener('click', this.saveModal);

        // собираем все импуты в модалке
        inputsArr = myModalContainer.querySelectorAll('input');

        // вешаем обработчик на все модальное окно и слушаем импуты
        myModalContainer.addEventListener('input', function () {
            let check = new Set(); // коллекция уникальных значений

            for (let item of inputsArr) { // проверка заполненности value импутов
            if (item.value) {
                check.add(true); // добавить в коллекцию true
            } else check.add(false); // добавить в коллекцию false
            }

            check.has(false) ? myModalModel.isActiveButton(true) : myModalModel.isActiveButton(
            false); // передает данные о состоянии кнопки сохранения
        });

        }

        this.openModal = function () { // вызывает методы модели
        myModalModel.openModal();
        myModalModel.isActiveButton(true);
        }

        this.hideModal = function () { // вызывает методы модели
        myModalModel.closeModal();
        myModalModel.clearForm();
        }

        this.saveModal = function () { // вызывает методы модели
        let inputsInfo = {};
        for (let item of inputsArr) {
            inputsInfo[item.id] = item.value;
        }
        myModalModel.closeModal();
        myModalModel.saveModalData(inputsInfo);
        }

        this.clearData = function () {
        myModalModel.clearData();
        }
    };
    /* ------ end controller ----- */

    return function() {
        this.initial = function() {
            // debugger
            // глобальная инициализация
            const appModalView = new ModalView();
            const appModalModel = new ModalModel();
            const appModalController = new ModalController();

            //вызвать init-методы...
            const containerElem = document.getElementById("modal");
            appModalView.init(containerElem);
            appModalModel.init(appModalView);
            appModalController.init(appModalModel, containerElem);
        }
    }
   }());

let modyl = new myModyl;
modyl.initial();