export default class GameController {

    constructor(model, container, canvas, canvasBack) {
        this.model = model;
        this.container = container;
        this.canvas = canvas;
        this.canvasBack = canvasBack;
        this.audioBack = false;
        this.muted = false;
    }

    init() {

        document.addEventListener('click', (event) => {
            if (!this.audioBack) {
                this.playAudioBack();
                this.audioBack = true;
            }

        });

        let canvasPosition = this.canvas.getBoundingClientRect(); // нынешнее положение канваса

        // следим за мышкой, если над полем, то можно будет взаиможействовать (передает координаты, или undefined если мышь не над канвасом)
        this.canvas.addEventListener('mousemove', (event) => {
            this.model.mouse.x = event.x - canvasPosition.left;
            this.model.mouse.y = event.y - canvasPosition.top;

        });

        this.canvas.addEventListener('mouseleave', () => {
            this.model.mouse.x = undefined;
            this.model.mouse.y = undefined;

        });

        // изменение вычислений при ресайзе окна
        window.addEventListener('resize', () => {
            canvasPosition = this.canvas.getBoundingClientRect();
            this.model.resize();
        })

        // клик по канвасу, размещение защитника
        this.canvas.addEventListener('click', (e) => {
            let clickPosition = {
                x: e.x - canvasPosition.left,
                y: e.y - canvasPosition.top,
            }
            this.model.click(clickPosition);
        })

        // вешаем слушателей на событие hashchange 
        window.addEventListener("hashchange", () => this.updateState());

        // сначала получение инфы для таблицы лидеров, а потом первая отрисовка
        this.model.getUsersList(this.model);

        // кнопка старт и другие
        let main = document.querySelector('#main');
        main.addEventListener('click', (e) => {
            let target = e.target;

            // если еще не было клика по странице, то сначала ключаю саунд бэка, что пристарте он уже был и было выключать (без этого ошибка)
            if (!this.audioBack) {
                this.playAudioBack();
                this.audioBack = true;
            }

            // старт
            if (target.className === 'new__game') {

                this.start();
                this.playAudioGame();

            }

            // вкл/выкл звук
            if (target.id === 'sound') {
                if (this.muted) {
                    this.muted = false;
                    this.mutedAudioBack(false);
                    this.model.isMuted(false);
                } else {
                    this.muted = true;
                    this.mutedAudioBack(true);
                    this.model.isMuted(true);
                }
            }

            // добавить имя в локал сторадж
            if (target.className === 'add__name') {

                let inputName = this.container.querySelector('#newUserName');

                // сохранение в local storage
                let visitInfo = {};
                visitInfo.name = inputName.value;
                window.localStorage.setItem("Funny_Defenders_Undead", JSON.stringify(visitInfo));

                this.model.userName = inputName.value;

            };

            // продолжить
            if (target.id === 'continue') {

                let continueButton = this.container.querySelector(".save__true");
                // console.log(continueButton);
                if (!continueButton) {
                    this.playAudioGame();
                    this.model.continue();
                }


            };
        })
    }

    //первая отрисовка на станице
    updateState() {
        this.model.updateState();
    }

    // старт игры
    start() {
        this.model.start();
    }

    // ------------------------------------------- Звуки -------------------------------------------
    // играть аудио заставочного экрана
    playAudioBack() {
        this.model.playAudioBack();
    }

    //  выключить аудио заставочного экрана
    mutedAudioBack(stay) {
        this.model.mutedAudioBack(stay);
    }

    // играть аудио игрового экрана
    playAudioGame() {
        this.model.playAudioGame();
    }

}