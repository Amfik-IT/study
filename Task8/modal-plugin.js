"use strict";
let myModule = (function () {

    /* ------- begin view -------- */
    function ModalView() {
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

        this.createModal = function () {
            myModalView.createModal();
        }
        this.updateView = function (title, content) {
            myModalView.updateModal(title, content);
        }
    }
    /* -------- end model -------- */

    /* ----- begin controller ---- */
    function ModalController() {
        let myModalContainer = null;
        let myModalModel = null;

        this.init = function (model, container) { // получаем кнопки и вешаем обработчики
            myModalContainer = container;
            myModalModel = model;

            // кнопка открыть модалку
            // debugger
            const btnOpen = document.querySelector('[data-supermodal="' + container.id + '"]');
            if (btnOpen.dataset.supermodalTitle && btnOpen.dataset.supermodalContent) {
                myModalModel.updateView(btnOpen.dataset.supermodalTitle, btnOpen.dataset.supermodalContent);
            }
            btnOpen.addEventListener('click', this.openModal);

            // кнопка закрыть модалку
            const modalClose = myModalContainer.querySelector('#modal-close');
            modalClose.addEventListener('click', this.hideModal);
        }

        this.openModal = function () { // вызывает методы модели
            myModalModel.openModal();
        }

        this.hideModal = function () { // вызывает методы модели
            myModalModel.closeModal();
        }
    };
    /* ------ end controller ----- */

    function _initial(id) {
        // глобальная инициализация
        const appModalView = new ModalView();
        const appModalModel = new ModalModel();
        const appModalController = new ModalController();
        //вызвать init-методы...
        const containerElem = document.getElementById(id);
        appModalView.init(containerElem);
        appModalModel.init(appModalView);
        appModalController.init(appModalModel, containerElem);
    }

    function _createContainer(id) {
        let modalOverlay = document.createElement('div');
        modalOverlay.classList.add("modal-overlay", "modal__closed");
        modalOverlay.setAttribute('id', id);

        let divModal = document.createElement('div');
        divModal.classList.add("modal");
        modalOverlay.append(divModal);

        let headerModal = document.createElement('header');
        headerModal.classList.add("modal__header");
        headerModal.innerHTML = '<a href="#" class="modal__close" id="modal-close" title="Закрыть модальное окно">Закрыть</a><h2></h2>'
        divModal.append(headerModal);

        let mainModal = document.createElement('div');
        mainModal.classList.add("modal__content");
        divModal.append(mainModal);
        document.body.prepend(modalOverlay);

        _initial(id);
    }
    return function () {
        this.search = function () {
            // debugger
            let arrButtonModal = document.querySelectorAll('a');

            for (let item of arrButtonModal) {
                if (item.dataset.supermodal) {
                    let isNull = document.getElementById(item.dataset.supermodal);
                    if (isNull) {
                        _initial(item.dataset.supermodal);
                    } else {
                        if (item.dataset.supermodalTitle && item.dataset.supermodalContent) {
                            _createContainer(item.dataset.supermodal);
                        }
                    }
                }
            }
        }
    }
}());

const module = new myModule;
module.search();