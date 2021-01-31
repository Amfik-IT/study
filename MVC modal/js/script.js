/* ------- begin view -------- */
function ModalView() {
    let myModal = null;
    let myModalOverlay = null; // элемент для затемненя окна
    let btnSave = null; // кнопка модалки

    this.init = function (container) { // инициализация данных
        myModal = container;
        // элемент для затемненя окна
        myModalOverlay = document.querySelector('#modal-overlay');
        // кнопка модалки
        btnSave = myModal.querySelector('#modal-save');
    }

    this.show = function () { // удаляет класс с display: none
        myModal.classList.remove('modal_closed');
        myModalOverlay.classList.remove('modal_closed');
    }

    this.hide = function () { // добавляет класс с display: none
        myModal.classList.add('modal_closed');
        myModalOverlay.classList.add('modal_closed');
    }

    this.buttonDisabled = function (state) { // блокируе кнопку сохранения     
        btnSave.disabled = state;
    }

    // this.printViewData = function () { // вывести данные из хранилища в div.modal-data
    // }

    // this.clearViewData = function () { // очистить или выдать дефолтное сообщение только для div.modal-data
    // }
    this.clearView = function () {
        //инпуты
        let inputsInfo = document.querySelectorAll('input')
        for (item of inputsInfo) {
            item.value = '';
        }
    }
};
/* -------- end view --------- */

/* ------- begin model ------- */
function ModalModel() {
    let myModalView = null;
    // let userData = null; // объект для хранения данных о пользователе
    let btnDis = true; // для значения блокировки кнопки сохранения

    this.init = function (view, container) { // инициализация данных
        myModalContainer = container;
        myModalView = view;
    }

    this.openModal = function () { // вызывает методы View
        myModalView.show(); 
        myModalView.buttonDisabled(btnDis)
    }

    this.closeModal = function () { // вызывает методы View
        btnDis = true
        this.clearForm();
        myModalView.hide();
    }

    this.storeData = function (userData) { // сохранить данные в localStorage, а если не доступно, то в cookies
        window.localStorage.setItem('userInfo', JSON.stringify(userData));
    }

    // this.getData = function() { //достать данные из хранилища
    //   let getInfo = JSON.parse(window.localStorage.getItem("userInfo"));
    // }

    // this.updateData = function() {
    // }

    // this.clearData = function() { //очистить данные в хранилище
    //   window.localStorage.removeItem("userInfo");
    // }

    this.clearForm = function () { //очистить данные в форме
        myModalView.clearView();
    }

    this.isActiveButton = function (values) { // логика блокировки кнопки сохранения
        btnDis = values.includes('');
        myModalView.buttonDisabled(btnDis); // вызывает методы View
    }
}
/* -------- end model -------- */

/* ----- begin controller ---- */
function ModalController() {
    let myModalContainer = null;
    let myModalModel = null;
    let userData = {};
    let inputsInfo = null;
    let values = [];

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

        // вешаем обработчик на все модальное окно, слушаем импуты, передаем значение
        myModalContainer.addEventListener('input', this.getInputsValue);

    }

    this.openModal = function () { // вызывает методы модели
        myModalModel.openModal();
    }

    this.hideModal = function () { // вызывает методы модели
        myModalModel.closeModal();
    }

    this.saveModal = function () { // вызывает методы модели
        myModalModel.closeModal();
        myModalModel.storeData(userData);
    }

    this.getInputsValue = function () {
        inputsInfo = myModalContainer.querySelectorAll('input');
        for (item of inputsInfo) {
            userData[item.id] = item.value;
        }
        values = Object.values(userData);
        myModalModel.storeData(userData);
        myModalModel.isActiveButton(values);
    }
};
/* ------ end controller ----- */

// глобальная инициализация
const appModalView = new ModalView();
const appModalModel = new ModalModel();
const appModalController = new ModalController();

//вызвать init-методы...
const containerElem = document.getElementById("modal");
appModalView.init(containerElem);
appModalModel.init(appModalView, containerElem);
appModalController.init(appModalModel, containerElem);