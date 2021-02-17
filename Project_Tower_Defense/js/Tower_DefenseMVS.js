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

    // задний фон
    blank(img) {
        this.ctx.drawImage(img, 0, 0, this.canvasWidth, this.canvasHeight);
    }

    // контролбар
    drawControlsBar(width, height) {
        this.ctx.fillStyle = '#7d7d7d80';
        this.ctx.fillRect(0, 0, width, height);
    }

    // элементы статуса игрока
    drawGameStatus(score, numberOfResources, winningScore, enemiesLength, gameOver) {
        this.ctx.fillStyle = 'gold';
        this.ctx.font = '30px Lineage2Font';
        this.ctx.fillText(`Очки: ${score}`, 20, 40);
        this.ctx.fillText(`Золото: ${numberOfResources}`, 20, 80);
        if (gameOver) {
            this.ctx.fillStyle = 'black';
            this.ctx.font = '50px Lineage2Font';
            this.ctx.fillText(`Game Over`, 350, 330)
        }
        if (score >= winningScore && enemiesLength === 0) {
            this.ctx.fillStyle = 'black';
            this.ctx.font = '50px Lineage2Font';
            this.ctx.fillText(`Level Complete`, 300, 330)
        }
    }

    // враги
    drawEnemy(i, health) {
        this.ctx.drawImage(i[0], i[1], i[2], i[3], i[4], i[5], i[6], i[7], i[8]);

        // шкала здоровья
        this.ctx.save();
        this.ctx.strokeStyle = 'rgba(0,0,0,0.77)';
        this.ctx.lineCap = 'round';
        this.ctx.lineWidth = 5.5;
        this.ctx.beginPath();
        this.ctx.moveTo(i[5] + 80, i[6] + 60);
        this.ctx.lineTo(i[5] + 80, i[6] + (50 - (health / 2)) + 10);
        this.ctx.stroke();

        this.ctx.strokeStyle = 'red';
        this.ctx.lineCap = 'round';
        this.ctx.lineWidth = 3.5;
        this.ctx.beginPath();
        this.ctx.moveTo(i[5] + 80, i[6] + 60);
        this.ctx.lineTo(i[5] + 80, i[6] + (50 - (health / 2)) + 10);
        this.ctx.stroke();
        this.ctx.restore();
    }

    drawDyingEnemy(i) {
        this.ctx.drawImage(i[0], i[1], i[2], i[3], i[4], i[5], i[6], i[7], i[8]);
    }

    // сетка игрового поля
    drawCell(x, y, width, height) {
        this.ctx.strokeStyle = '#cbcbcbbd';
        this.ctx.strokeRect(x, y, width, height);
    }

    // защитники
    drawDefender(i, health) {
        this.ctx.drawImage(i[0], i[1], i[2], i[3], i[4], i[5], i[6], i[7], i[8]);

        // шкала здоровья
        this.ctx.save();
        this.ctx.strokeStyle = 'rgba(0,0,0,0.77)';
        this.ctx.lineCap = 'round';
        this.ctx.lineWidth = 5.5;
        this.ctx.beginPath();
        this.ctx.moveTo(i[5] + 20, i[6] + 60);
        this.ctx.lineTo(i[5] + 20, i[6] + (50 - (health / 2)) + 10);
        this.ctx.stroke();

        this.ctx.strokeStyle = 'green';
        this.ctx.lineCap = 'round';
        this.ctx.lineWidth = 3.5;
        this.ctx.beginPath();
        this.ctx.moveTo(i[5] + 20, i[6] + 60);
        this.ctx.lineTo(i[5] + 20, i[6] + (50 - (health / 2)) + 10);
        this.ctx.stroke();
        this.ctx.restore();
    }

    drawDyingDefender(i) {
        this.ctx.drawImage(i[0], i[1], i[2], i[3], i[4], i[5], i[6], i[7], i[8]);
    }

    // снаряды
    drawProjectile(img, x, y, width, height) {
        this.ctx.drawImage(img, x, y, width, height);
    }

    // ресурсы
    drawResource(i, amount) {

        this.ctx.drawImage(i[0], i[1], i[2], i[3], i[4], i[5], i[6], i[7], i[8]);
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
        this.numberOfResources = 300; // стартовое количество ресурсов игрока
        this.gameOver = false;
        this.score = 0; // очки игрока
        this.winningScore = 100;

        // изображения
        this.images = {};

        this.addImage = (name, src) => {
            this.images[name] = new Image();
            this.images[name].src = src;
        }

        this.addImage('background_1', 'img/battle-backgrounds/game_background_1.jpg');
        this.addImage('background_2', 'img/battle-backgrounds/game_background_2.jpg');
        this.addImage('background_3', 'img/battle-backgrounds/game_background_3.jpg');
        this.addImage('background_4', 'img/battle-backgrounds/game_background_4.jpg');

        this.addImage('spellsEffect_1', 'img/protecting_char/Spells-Effect_1.png');
        this.addImage('spellsEffect_2', 'img/protecting_char/Spells-Effect_2.png');
        this.addImage('spellsEffect_3', 'img/protecting_char/Spells-Effect_3.png');

        this.addImage('wraith_01', 'img/protecting_char/Wraith_01.png');
        this.addImage('wraith_02', 'img/protecting_char/Wraith_02.png');
        this.addImage('wraith_03', 'img/protecting_char/Wraith_03.png');

        this.addImage('fallen_Angels_01', 'img/attacking_char/Fallen_Angels_01.png');
        this.addImage('fallen_Angels_02', 'img/attacking_char/Fallen_Angels_02.png');
        this.addImage('fallen_Angels_03', 'img/attacking_char/Fallen_Angels_03.png');

        this.addImage('golem_01', 'img/attacking_char/Golem_01.png');
        this.addImage('golem_02', 'img/attacking_char/Golem_02.png');
        this.addImage('golem_03', 'img/attacking_char/Golem_03.png');

        this.addImage('reaper_Man_01', 'img/attacking_char/Reaper_Man_01.png');
        this.addImage('reaper_Man_02', 'img/attacking_char/Reaper_Man_02.png');
        this.addImage('reaper_Man_03', 'img/attacking_char/Reaper_Man_03.png');

        this.addImage('Orc_01', 'img/attacking_char/Orc_01.png');
        this.addImage('Orc_02', 'img/attacking_char/Orc_02.png');
        this.addImage('Orc_03', 'img/attacking_char/Orc_03.png');

        this.addImage('coin', 'img/coins/coin.png');

        // массивы данных
        this.gameGrid = []; // массив объектов (ячеек) игрового поля, с методом отрисовки
        this.defenders = []; // массив защитников
        this.dyingDefenders = []; // массив умирающих защитников
        this.enemies = []; // массив врагов
        this.dyingEnemies = []; // массив умирающийх врагов
        this.enemyPosition = []; // массив местоположения врагов
        this.projectiles = []; // массив снарядов для защитников
        this.resources = []; // массив ресурсов
        this.amounts = [20, 30, 40]; // массив данных для ресурсов

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
            height: this.cellSize * 1.5,
        }

        // ------------------------------------------ РЫЧАГИ УПРАВЛЕНИЯ ----------------------------------------------------

        // ------игровое поле

        this.blank = () => { // функция очистки канваса
            // debugger
            this.view.blank(this.images.background_1);
        }

        this.handleGameGrid = () => { // функция отрисовки всех ячеек
            for (let i = 0; i < this.gameGrid.length; i++) {
                this.gameGrid[i].draw(); // вызываю метод отрисовки каждой ячейки
            }
        }

        this.handleGameStatus = () => { // показываеем в навбаре сколько у игрока бабла и очков
            this.view.drawGameStatus(this.score, this.numberOfResources, this.winningScore, this.enemies.length, this.gameOver);
        }



        // ------ враги

        this.handleEnemies = () => { // функция создания смещения и логики врага

            for (let i = 0; i < this.enemies.length; i++) { // перебор массива врагов

                this.enemies[i].draw();
                this.enemies[i].update();

                if (this.enemies[i].x < 0) { // игра заканчивается если противник дошел то левого края поля
                    this.gameOver = true;
                }
                if (this.enemies[i].health <= 0) { // если здоровье меньше или равно 0 - враг убит

                    let geinedResources = this.enemies[i].maxHealth / 10; // игрок получает ресурс в кол-ве 0.1 часть от здоровья противника 

                    this.numberOfResources += geinedResources;
                    this.score += geinedResources; // игрок получает очки в кол-ве 0.1 часть от здоровья противника 

                    const findThisIndex = this.enemyPosition.indexOf(this.enemies[i].y) // ищет позицию убитого врага

                    // для анимации смерти
                    this.dyingEnemies.push(this.newDyingEnemies(this.enemies[i].x, this.enemies[i].y, this.enemies[i].image[0], this)) // добавить врага в массив убитых врагов

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


        this.handleDyingEnemies = () => { // умирающие враги

            for (let i = 0; i < this.dyingEnemies.length; i++) {
                this.dyingEnemies[i].draw();
                this.dyingEnemies[i].update();

                if (this.dyingEnemies[i].animDying) {

                    this.dyingEnemies.splice(i, 1); // вырезать с позиции i умершего противника
                    i--; // для корректировки индекса цикла
                }
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

                        // для анимации смерти
                        this.dyingDefenders.push(this.newDyingDefender(this.defenders[i].x, this.defenders[i].y, this.defenders[i].image[0], this)) // добавить защитника в массив убитых защитников

                        this.defenders.splice(i, 1); // вырезать с позиции i один элемент
                        i--; // для корректировки индекса цикла

                        for (let k = 0; k < this.enemies.length; k++) { // все враги продолжают двигаться, что бы не застремали если оба врага убили одного защитника
                            this.enemies[k].movement = this.enemies[k].speed;
                        }


                    }
                }
            }
        }

        this.handleDyingDefenders = () => { // умирающие защитники

            for (let i = 0; i < this.dyingDefenders.length; i++) {
                this.dyingDefenders[i].draw();
                this.dyingDefenders[i].update();

                if (this.dyingDefenders[i].animDying) {

                    this.dyingDefenders.splice(i, 1); // вырезать с позиции i умершего противника
                    i--; // для корректировки индекса цикла
                }
            }
        }
        // ------ снаряды

        this.handleProjectiles = () => {
            for (let i = 0; i < this.projectiles.length; i++) { // перебирает массив снарядов и вызывает их методы перерисовки и смещения
                this.projectiles[i].update();
                this.projectiles[i].draw();

                for (let j = 0; j < this.enemies.length; j++) { // пребор массива врагов
                    if (this.enemies[j] && this.projectiles[i] && this.collision(this.projectiles[i], this.enemies[j])) { // если существует враг и снаряд проверяет их столкновение

                        this.enemies[j].health -= this.projectiles[i].power; // если столкнулись онять здоровье у врага на силу снаряда
                        this.projectiles.splice(i, 1); // вырезать снаряд из массива снарядов
                        i--; // сделать поправку счетчика
                    }
                }

                if (this.projectiles[i] && this.projectiles[i].x > this.canvasWidth - this.cellSize) { // если снаряд ударился о край канваса
                    this.projectiles.splice(i, 1); // вырезать снаряд из массива снарядов
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
                this.resources[i].update();

                if (this.resources[i] && this.mouse.x && this.mouse.y && this.collision(this.resources[i], this.mouse)) { // если есть ресурс, мышь на канвасом, и координаты мышки сталкиваются с ресурсом - то забрать его и удалить из массива
                    this.numberOfResources += this.resources[i].amount;
                    this.resources.splice(i, 1);
                    i--; // поправка счетчика
                }
            }
        }

        // --------------------------------------------- ЗАПУСК МАШИНЫ
        this.animate = () => {

            this.blank(this.imgBackground_1); // задний фон
            this.view.drawControlsBar(this.controlsBar.width, this.controlsBar.height); // контролбар
            this.handleGameGrid(); // сетка поля

            this.handleDefenders(); // защитники
            this.handleDyingDefenders();
            this.handleProjectiles(); // снаряды
            this.handleEnemies(); // враги
            this.handleDyingEnemies();
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
    // ------------------------------------------------ ВНУТРЕННОСТИ МАШИНЫ --------------------------------

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

    // ------------------------------------------------------ враги

    newEnemy(verticalPosition, model) {
        class Enemy {
            constructor(verticalPosition, model) {
                this.x = model.canvasWidth; // что бы появлялись за пределами канваса
                this.y = verticalPosition; // параметр определяется рандомом ниже покоду
                this.width = model.cellSize - model.cellGap * 2; // ширина ячейки минус двойной отступ
                this.height = model.cellSize - model.cellGap * 2; // высота ячейки минус двойной отступ
                this.speed = Math.random() * 0.2 + 0.4; // у врага случайная скорость движения
                this.movement = this.speed; // переменная для того что бы моги остановить врага
                this.health = 100; // здоровье врага
                this.maxHealth = this.health; // сохранение максимального здоровья для расчетов очков и наград

                this.frameX = 267.916667;
                this.frameY = 170;
                this.charFrameX = 0;
                this.charFrameY = 0;
                this.image = [model.images.fallen_Angels_01, 30, 0, this.frameX, this.frameY, this.x, this.y, 90, this.height];
            }

            draw() { // рисует врага и его здоровье
                model.view.drawEnemy(this.image, this.health);
            }

            update() {
                //--- анимация персанажа
                this.image[1] = (this.frameX * this.charFrameX) + 20;
                this.image[2] = this.frameY * this.charFrameY;
                this.image[5] = this.x;
                this.image[6] = this.y;

                if (this.charFrameX < 11 && model.frame % 6 === 0) {
                    this.charFrameX++;
                }
                if (this.charFrameX >= 11) {
                    this.charFrameX = 0;
                }

                //--- атака
                if (this.movement === 0) {

                    this.charFrameY = 1;
                } else this.charFrameY = 0;

                //--- смещение
                this.x -= this.movement; // смещает врага влево
            }

        }
        return new Enemy(verticalPosition, model);
    }

    newDyingEnemies(x, y, img, model) {
        class DyingEnemy {
            constructor(x, y, img, model) {
                this.x = x;
                this.y = y;
                this.height = model.cellSize - model.cellGap * 2; // высота ячейки минус двойной отступ
                this.animDying = false;

                this.frameX = 267.916667;
                this.frameY = 170;
                this.charFrameX = 0;
                this.charFrameY = 2;
                this.image = [img, 20, 0, this.frameX, this.frameY, this.x, this.y, 90, this.height];
            }

            draw() { // рисует врага и его здоровье
                model.view.drawDyingEnemy(this.image);
            }

            update() {
                //--- анимация персанажа
                this.image[1] = (this.frameX * this.charFrameX) + 20;
                this.image[2] = (this.frameY * this.charFrameY) + 10;

                if (this.charFrameX < 11 && model.frame % 6 === 0) {
                    this.charFrameX++;
                }
                if (this.charFrameX >= 11) {
                    this.animDying = true;
                }
            }

        }
        return new DyingEnemy(x, y, img, model);
    }
    // ---------------------------------------------------- защитники

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
                this.powerAtack = 10;

                this.frameX = 267.916667;
                this.frameY = 170;
                this.charFrameX = 0;
                this.charFrameY = 0;
                this.image = [model.images.wraith_01, 0, 0, this.frameX, this.frameY, this.x, this.y, 100, this.height];
            }

            draw() { // отрисовка защаитника

                model.view.drawDefender(this.image, this.health);
            }

            update() {
                //--- анимация персанажа
                this.image[1] = this.frameX * this.charFrameX;
                this.image[2] = this.frameY * this.charFrameY;

                if (this.charFrameX < 11 && model.frame % 6 === 0) {
                    this.charFrameX++;
                }
                if (this.charFrameX >= 11) {
                    this.charFrameX = 0;
                }

                //--- стрельба
                if (this.shooting) { // если true но начинает увеличивать таймет и по определенным значениям добавлять снаряды

                    this.charFrameY = 1;
                    this.timer++;

                    if (this.timer % 66 === 0) { // как только сменится фрейм, то должно пройти 66 кадров чтобы анимация была на месте выстрела
                        model.projectiles.push(model.newProjectile(this.x + 55, this.y + 35, model.images.spellsEffect_1, this.powerAtack, model));
                    }

                } else {

                    this.timer = 0;
                    this.charFrameY = 0;
                }
            }
        }
        return new Defender(x, y, model)
    }

    newDyingDefender(x, y, img, model) {
        class DyingDefender {
            constructor(x, y, img, model) {
                this.x = x;
                this.y = y;
                this.height = model.cellSize - model.cellGap * 2; // высота ячейки минус двойной отступ
                this.animDying = false;

                this.frameX = 267.916667;
                this.frameY = 170;
                this.charFrameX = 0;
                this.charFrameY = 2;
                this.image = [img, 20, 0, this.frameX, this.frameY, this.x, this.y, 100, this.height];
            }

            draw() { // рисует врага и его здоровье
                model.view.drawDyingDefender(this.image);
            }

            update() {
                //--- анимация персанажа
                this.image[1] = (this.frameX * this.charFrameX);
                this.image[2] = (this.frameY * this.charFrameY);

                if (this.charFrameX < 11 && model.frame % 6 === 0) {
                    this.charFrameX++;
                }
                if (this.charFrameX >= 11) {
                    this.animDying = true;
                }
            }

        }
        return new DyingDefender(x, y, img, model);
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
    // ------------------------------------------------------ снаряды

    newProjectile(x, y, img, power, model) {
        class Projectile {
            constructor(x, y, img, power, model) {
                // debugger
                this.x = x;
                this.y = y;
                this.width = 20;
                this.height = 20;
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

    // ------------------------------------------------------ ресурсы

    newResource(model) {
        class Resource { // класс создания ресурсов
            constructor(model) {
                this.x = Math.random() * (model.canvasWidth - model.cellSize); // ширина канваса минус одна ячейка сетки, что бы не появлялись за краем
                this.y = (Math.floor(Math.random() * 4) + 3) * model.cellSize + 25;
                this.width = model.cellSize * 0.4;
                this.height = model.cellSize * 0.4;
                this.amount = model.amounts[Math.floor(Math.random() * model.amounts.length)]; // рандом умножит на длинну массива сумм наград

                this.frameX = 103.5;
                this.frameY = 90;
                this.charFrameX = 0;
                this.image = [model.images.coin, 0, 0, this.frameX, this.frameY, this.x, this.y, 35, this.height];
            }
            draw() {
                // model.view.drawResource(this.x, this.y, this.width, this.height, this.amount);
                model.view.drawResource(this.image, this.amount);
            }
            update() {
                //--- анимация бабла
                this.image[1] = this.frameX * this.charFrameX;

                if (this.charFrameX < 5 && model.frame % 12 === 0) {
                    this.charFrameX++;
                }
                if (this.charFrameX >= 5) {
                    this.charFrameX = 0;
                }
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
    collision(first, second) { // функция коллизии столкновения (если что-то сломается, то убери тут "-10")
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

        this.canvas.addEventListener('click', () => { // клик по канвасу, размещение защитника
            this.model.createDefender();
        })

        this.model.start();
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