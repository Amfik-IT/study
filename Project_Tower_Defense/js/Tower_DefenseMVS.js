"use strict";

/* ------- begin view -------- */
class GameView {

    constructor(container, canvas) {
        this.container = container;
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.canvasWidth = 900;
        this.canvasHeight = 600;
    };

    init() {
        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;

    }

    blank(img) {
        this.ctx.drawImage(img, 0, 0, this.canvasWidth, this.canvasHeight);
    }

    drawControlsBar(width, height) {
        this.ctx.fillStyle = '#595959a3';
        this.ctx.fillRect(0, 0, width, height);
    }

    handleGameStatus(score, numberOfResources, winningScore, enemiesLength, gameOver) {
        this.ctx.fillStyle = 'gold';
        this.ctx.font = '30px Arial';
        this.ctx.fillText(`Очки: ${score}`, 20, 40);
        this.ctx.fillText(`Бабло: ${numberOfResources}`, 20, 80);
        if (gameOver) {
            this.ctx.fillStyle = 'black';
            this.ctx.font = '50px Arial';
            this.ctx.fillText(`Game Over`, 350, 330)
        }
        if (score >= winningScore && enemiesLength === 0) {
            this.ctx.fillStyle = 'black';
            this.ctx.font = '50px Arial';
            this.ctx.fillText(`Level Complete`, 300, 330)
        }
    }

    drawEnemy(x, y, width, height, health) {
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(x, y, width, height);
        this.ctx.fillStyle = 'black';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(Math.floor(health), x + 20, y + 20)
    }


    drawCell(x, y, width, height) {
        this.ctx.strokeStyle = 'black';
        this.ctx.strokeRect(x, y, width, height);
    }

    drawDefender(x, y, width, height, health) {
        this.ctx.fillStyle = 'blue';
        this.ctx.fillRect(x, y, width, height);
        this.ctx.fillStyle = 'gold';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(Math.floor(health), x + 20, y + 20);
    }

    drawProjectile(img, x, y, width, height) {
        this.ctx.drawImage(img, x, y, width, height);
    }

    drawResource(x, y, width, height, amount) {
        this.ctx.fillStyle = 'yellow';
        this.ctx.fillRect(x, y, width, height);
        this.ctx.fillStyle = 'black';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(amount, x + 10, y + 30);
    }
};
/* -------- end view --------- */




/* ------- MODEL ------- */
class GameModel {

    constructor(view) {
        // --------------------------------------- ПАРАМЕТРЫ -----------------------------------------------------------

        // вьюшка
        this.view = view;

        // размеры
        this.canvasWidth = 900;
        this.canvasHeight = 600;
        this.cellSize = 75; // ширина и высота ячейки сетки
        this.cellGap = 2.5; // отступ между ячейками

        // настройки
        this.enemiesInterval = 600; // интервал появления врагов
        this.frame = 0; // кадры - как долго идет игра
        this.numberOfResources = 300; // количество ресурсов игрока
        this.gameOver = false;
        this.score = 0; // очки игрока
        this.winningScore = 100;

        // изображения
        this.imgBackground_1 = new Image();
        this.imgSpellsEffect_1 = new Image();
        this.imgBackground_1.src = 'img/battle-backgrounds/game_background_2.jpg';
        this.imgSpellsEffect_1.src = 'img/attacking_char/Spells-Effect/Spells-Effect_1.png';

        // массивы данных
        this.gameGrid = []; // массив объектов (ячеек) игрового поля, с методом отрисовки
        this.defenders = []; // массив защитников
        this.enemies = []; // массив врагов
        this.enemyPosition = []; // массив местоположения врагов
        this.projectiles = []; // массив снарядов для защитников
        this.resources = []; // массив ресурсов
        this.amounts = [20, 30, 40]; // массив ачивок

        // параметры мышки
        this.mouse = {
            x: 10,
            y: 10,
            width: 0.07,
            height: 0.07,
        }

        // параметры статусбара
        this.controlsBar = { // Массив параметров поля управления
            width: this.canvasWidth,
            height: this.cellSize * 3,
        }

        // --------------------------------------- ОСНОВА -----------------------------------------------------------

        // ------игровое поле

        this.blank = () => { // функция очистки канваса
            // debugger
            this.view.blank(this.imgBackground_1);
        }

        this.handleGameGrid = () => { // функция отрисовки всех ячеек
            for (let i = 0; i < this.gameGrid.length; i++) {
                this.gameGrid[i].draw(); // вызываю метод отрисовки каждой ячейки
            }
        }

        this.handleGameStatus = () => { // показываеем в навбаре сколько у игрока бабла и очков
            this.view.handleGameStatus(this.score, this.numberOfResources, this.winningScore, this.enemies.length, this.gameOver);
        }



        // ------ враги

        this.handleEnemies = () => { // функция создания смещения и логики врага

            for (let i = 0; i < this.enemies.length; i++) {

                this.enemies[i].update();
                this.enemies[i].draw();

                if (this.enemies[i].x < 0) { // игра заканчивается если противник дошел то левого края поля
                    this.gameOver = true;
                }
                if (this.enemies[i].health <= 0) { // если здоровье враг убит

                    let geinedResources = this.enemies[i].maxHealth / 10; // игрок получает ресурс в кол-ве 0.1 часть от здоровья противника 

                    this.numberOfResources += geinedResources;
                    this.score += geinedResources; // игрок получает очки в кол-ве 0.1 часть от здоровья противника 

                    const findThisIndex = this.enemyPosition.indexOf(this.enemies[i].y) // ищет позицию убитого врага

                    this.enemyPosition.splice(findThisIndex, 1); // удаляет позицию убитого врага
                    this.enemies.splice(i, 1); // удаляет убитого врага
                    i--; // корректирует счетчик цикла
                }
            }
            if (this.frame % this.enemiesInterval === 0 && this.score < this.winningScore) { // скорость появления врагов и место

                let verticalPosition = Math.floor(Math.random() * 4 + 3) * this.cellSize + this.cellGap; // 3 - т.к. контролбар занимает 3 ячейки, 4 - т.к. нужно что бы движение шло только по 4 полосам после контролбара 
                this.enemies.push(this.newEnemy(verticalPosition, this)) // добавить врага в массив
                this.enemyPosition.push(verticalPosition); // добавить в массив позиции появления врага

                if (this.enemiesInterval > 200) this.enemiesInterval -= 50; // скорость появления противников
            }
        }

        // ------ защитники

        this.handleDefenders = () => { // функция создания и логики защитников

            for (let i = 0; i < this.defenders.length; i++) {
                this.defenders[i].draw(); // вызываю метод отрисовки защитника
                this.defenders[i].update();

                if (this.enemyPosition.indexOf(this.defenders[i].y) !== -1) { // если положение по высоте зашитника будет найдено в массиве врагов вернет 1 - значит враги на этой строке есть
                    this.defenders[i].shooting = true; // начать стрельбу
                } else {
                    this.defenders[i].shooting = false; // остановить стрельбу
                }

                for (let j = 0; j < this.enemies.length; j++) {

                    if (this.defenders[i] && this.collision(this.defenders[i], this.enemies[j])) { // если защитник и враг сталкиваются то:
                        this.enemies[j].movement = 0; // враг останавливается
                        this.defenders[i].health -= 0.1; // у защитника отнимается здоровье
                    }

                    if (this.defenders[i] && this.defenders[i].health <= 0) { // если здоровье защитника меньше или равно 0, то вырезаем его из массыва защитников
                        this.defenders.splice(i, 1); // вырезать с позиции i один элемент
                        i--; // для корректировки индекса цикла

                        for (let k = 0; k < this.enemies.length; k++) { // все враги продолжают двигаться, что бы не застремали если оба врага убили одного защитника
                            this.enemies[k].movement = this.enemies[k].speed;
                        }
                        // enemies[j].movement = enemies[j].speed; // враг продолжает двигаться
                    }
                }
            }
        }

        // ------ снаряды

        this.handleProjectiles = () => {
            for (let i = 0; i < this.projectiles.length; i++) {
                this.projectiles[i].update();
                this.projectiles[i].draw();

                for (let j = 0; j < this.enemies.length; j++) {
                    if (this.enemies[j] && this.projectiles[i] && this.collision(this.projectiles[i], this.enemies[j])) {

                        this.enemies[j].health -= this.projectiles[i].power;
                        this.projectiles.splice(i, 1);
                        i--;
                    }
                }

                if (this.projectiles[i] && this.projectiles[i].x > this.canvasWidth - this.cellSize) {
                    this.projectiles.splice(i, 1);
                    i--; // для корректировки индекса цикла
                }
            }
        }

        // ------ ресурсы

        this.handleResources = () => {

            if (this.frame % 500 === 0 && this.score < this.winningScore) { // если еще не выйграли, и на каждоп 500ом кадре сознает реурс
                this.resources.push(this.newResource(this));
            }

            for (let i = 0; i < this.resources.length; i++) {
                this.resources[i].draw(); // отрисовка ресурсов
                if (this.resources[i] && this.mouse.x && this.mouse.y && this.collision(this.resources[i], this.mouse)) { // если есть ресурс, мышь на канвасом, и координаты мышки сталкиваются с ресурсом - то забрать его и удалить из массива
                    this.numberOfResources += this.resources[i].amount;
                    this.resources.splice(i, 1);
                    i--; // поправка счетчика
                }
            }
        }

        // ------ запуск машины
        this.animate = () => {

            this.blank(this.imgBackground_1); // задний фон
            this.view.drawControlsBar(this.controlsBar.width, this.controlsBar.height); // контролбар
            this.handleGameGrid(); // сетка поля
            this.handleProjectiles(); // снаряды
            this.handleDefenders(); // защитники
            this.handleEnemies(); // враги
            this.handleResources(); // ресурсы
            this.handleGameStatus(); // статус (выиграл\проиграл)
            this.frame++; // увеличение счетчика кадров
            if (!this.gameOver) requestAnimationFrame(this.animate);
        }
    };

    // --------инициализация

    init() {
        this.createGrid();
    }
    // ------------------------------------------------ ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ --------------------------------

    // -------------------------------------------------- игровое поле

    newCell(x, y, model) {
        class Cell { // Класс который создаст ячейку сетки
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.width = model.cellSize;
                this.height = model.cellSize;
            }
            draw() {
                if (model.mouse.x && model.mouse.y && model.collision(this, model.mouse)) { // если мышка над полем канвас и над сеткой поля, рисует
                    model.view.drawCell(this.x, this.y, this.width, this.height)
                }
            }
        }
        return new Cell(x, y, model)
    }

    createGrid() { // Создание сетки
        for (let y = this.cellSize * 3; y < this.canvasHeight - this.cellSize; y += this.cellSize) { // y = cellSize, т.к. начинаю не сначала поля, после поля управления
            for (let x = 0; x < this.canvasWidth; x += this.cellSize) {
                this.gameGrid.push(this.newCell(x, y, this)); // добавляю в массив объекты с параметрами их расположения и методом отрисовки
            }
        }
    }

    // --------------------------------------------------------- враги

    newEnemy(verticalPosition, model) {
        class Enemy {
            constructor(verticalPosition) {
                this.x = model.canvasWidth; // что бы появлялись за пределами канваса
                this.y = verticalPosition; // параметр определяется рандомом ниже покоду
                this.width = model.cellSize - model.cellGap * 2; // ширина ячейки минус двойной отступ
                this.height = model.cellSize - model.cellGap * 2; // высота ячейки минус двойной отступ
                this.speed = Math.random() * 0.2 + 0.4; // у врага случайная скорость движения
                this.movement = this.speed; // переменная для того что бы моги остановить врага
                this.health = 100; // здоровье врага
                this.maxHealth = this.health; // сохранение максимального здоровья для расчетов очков и наград
            }
            update() {
                this.x -= this.movement; // смещает врага влево
            }
            draw() { // рисует врага и его здоровье
                model.view.drawEnemy(this.x, this.y, this.width, this.height, this.health);
            }
        }
        return new Enemy(verticalPosition, model);
    }

    // ------------------------------------------------------- защитники

    newDefender(x, y, model) {
        class Defender { // класс создания защитников
            constructor(x, y, model) {
                this.x = x;
                this.y = y;
                this.width = model.cellSize - model.cellGap * 2; // ширина ячейки минус двойной отступ
                this.height = model.cellSize - model.cellGap * 2; // высота ячейки минус двойной отступ
                this.shooting = false; // стреляет или нет
                this.health = 100; // кол-во здоровья
                this.projectiles = []; // массив снарядов
                this.timer = 0; // таймер выстрела(скорость стрельбы) 
            }
            draw() { // отрисовка защаитника
                model.view.drawDefender(this.x, this.y, this.width, this.height, this.health);
            }
            update() {
                if (this.shooting) { // если true но начинает увеличивать таймет и по определенным значениям добавлять снаряды

                    this.timer++;
                    if (this.timer % 100 === 0) {
                        model.projectiles.push(model.newProjectile(this.x + 20, this.y + 20, model.imgSpellsEffect_1, 20, model));
                    }

                } else {
                    this.timer = 0;
                }
            }
        }
        return new Defender(x, y, model)
    }

    createDefender() {
        // debugger
        const gridPositionX = this.mouse.x - (this.mouse.x % this.cellSize) + this.cellGap; // беру позицию мышки и отмаю остаток от деления на ширину ячуйки (получу точное положение Х по сетке)
        const gridPositionY = this.mouse.y - (this.mouse.y % this.cellSize) + this.cellGap; // беру позицию мышки и отмаю остаток от деления на высоту ячуйки (получу точное положение У по сетке)
        if (gridPositionY < this.controlsBar.height || gridPositionY > this.canvasHeight - this.cellSize) return; // что бы нельзя было размещать на выше и ниже игрового поля

        for (let i = 0; i < this.defenders.length; i++) {
            if (this.defenders[i].x === gridPositionX && this.defenders[i].y === gridPositionY) return; // если есть защитник с такими координатами, то не позволит поставить еще одного наверх этого
        }

        let defenderCost = 100; // Стоимость защитника

        if (this.numberOfResources >= defenderCost) { // если денег хватает то его добовляет в массив защитников 
            this.defenders.push(this.newDefender(gridPositionX, gridPositionY, this));
            this.numberOfResources -= defenderCost; // вычесть стоимость защитника
        }
    }
    // ------------------------------------------------------- снаряды

    newProjectile(x, y, img, power, model) {
        class Projectile {
            constructor(x, y, img, power, model) {
                // debugger
                this.x = x;
                this.y = y;
                this.width = 30;
                this.height = 30;
                this.power = power;
                this.speed = 5;
            }
            update() {
                this.x += this.speed;
            }
            draw() {
                model.view.drawProjectile(img, this.x, this.y, this.width, this.height);
            }
        }
        return new Projectile(x, y, img, power, model);
    }

    // -------------------------------------------------------- ресурсы

    newResource(model) {
        class Resource { // класс создания ресурсов
            constructor(model) {
                this.x = Math.random() * (model.canvasWidth - model.cellSize); // ширина канваса минус одна ячейка сетки, что бы не появлялись за краем
                this.y = (Math.floor(Math.random() * 4) + 3) * model.cellSize + 25;
                this.width = model.cellSize * 0.6;
                this.height = model.cellSize * 0.6;
                this.amount = model.amounts[Math.floor(Math.random() * model.amounts.length)]; // рандом умножит на длинну массива сумм наград
            }
            draw() {
                model.view.drawResource(this.x, this.y, this.width, this.height, this.amount);
            }
        }
        return new Resource(model);
    }


    // ------------------------------------------------ ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ -------------------------

    // старт игры
    start() {
        this.animate();
    }

    // расчет коллизий
    collision(first, second) { // функция коллизии столкновения
        if (!(first.x > second.x + second.width ||
                first.x + first.width < second.x ||
                first.y > second.y + second.height ||
                first.y + first.height < second.y)) {
            return true;
        };
    };
};
/* -------- end model -------- */




/* ----- CONTROLLER ---- */
class GameController {

    constructor(model, container, canvas) {
        this.model = model;
        this.container = container;
        this.canvas = canvas;
        // this.canvasWidth = 900;
        // this.canvasHeight = 600;
    }

    init() {

        let canvasPosition = this.canvas.getBoundingClientRect(); // следим за мышкой, если над полем, то можно будет взаиможействовать

        this.canvas.addEventListener('mousemove', (event) => {
            this.model.mouse.x = event.x - canvasPosition.left;
            this.model.mouse.y = event.y - canvasPosition.top;

        });

        this.canvas.addEventListener('mouseleave', () => {
            this.model.mouse.x = undefined;
            this.model.mouse.y = undefined;

        });

        window.addEventListener('resize', () => { // изменение вычислений при ресайзе окна
            canvasPosition = this.canvas.getBoundingClientRect()
        })
        this.model.start()

        this.canvas.addEventListener('click', () => { // клик по канвасу, размещение защитника
            this.model.createDefender();
        })
    }
};
/* ------ end controller ----- */

// глобальная инициализация
const containerElem = document.getElementById("container");
const canvas = document.getElementById("canvas1");
const appGameView = new GameView(containerElem, canvas);
const appGameModel = new GameModel(appGameView);
const appGameController = new GameController(appGameModel, containerElem, canvas);

//вызвать init-методы...
appGameView.init();
appGameModel.init();
appGameController.init();