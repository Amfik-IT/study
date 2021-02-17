"use strict";
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 900;
canvas.height = 600;

// ------------------------------------------------ Глобальные переменные

const cellSize = 75; // ширина и высота ячейки сетки
const cellGap = 2.5; // отступ между ячейками
let enemiesInterval = 600; // интервал появления врагов
let frame = 0; // кадры - как долго идет игра
let numberOfResources = 300; // количество ресурсов игрока
let gameOver = false;
let score = 0; // очки игрока
const winningScore = 100;

const gameGrid = []; // массив объектов (ячеек) игрового поля, с методом отрисовки
const defenders = []; // массив защитников
const enemies = []; // массив врагов
const enemyPosition = []; // массив местоположения врагов
const projectiles = []; // массив снарядов для защитников
const resources = []; // массив ресурсов


// ----------------------------------------------------- Мышь
const mouse = {
    x: 10,
    y: 10,
    width: 0.07,
    height: 0.07,
}
let canvasPosition = canvas.getBoundingClientRect(); // следим за мышкой, если над полем, то можно будет взаиможействовать
canvas.addEventListener('mousemove', (event) => {
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;

});
canvas.addEventListener('mouseleave', () => {
    mouse.x = undefined;
    mouse.y = undefined;

});


// -------------------------------------------------- игровое поле

const controlsBar = { // Массив параметров поля управления
    width: canvas.width,
    height: cellSize * 3,
    draw() {
        ctx.fillStyle = '#595959a3';
        ctx.fillRect(0, 0, this.width, this.height);
    },
}

class Cell { // Класс который создаст ячейку сетки
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = cellSize;
        this.height = cellSize;
    }
    draw() {
        if (mouse.x && mouse.y && collision(this, mouse)) { // если мышка над полем канвас и над сеткой поля, рисует
            ctx.strokeStyle = 'black';
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
}

function createGrid() { // Создание сетки
    for (let y = cellSize * 3; y < canvas.height - cellSize; y += cellSize) { // y = cellSize, т.к. начинаю не сначала поля, после поля управления
        // debugger
        for (let x = 0; x < canvas.width; x += cellSize) {
            // debugger
            gameGrid.push(new Cell(x, y)); // добавляю в массив объекты с параметрами их расположения и методом отрисовки
        }
    }
}
createGrid();

function handleGameGrid() { // функция отрисовки всех ячеек
    for (let i = 0; i < gameGrid.length; i++) {
        gameGrid[i].draw(); // вызываю метод отрисовки каждой ячейки
    }
}

function blank() { // функция очистки канваса
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}



// ------------------------------------------------------- снаряды
class Projectile {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.power = 20;
        this.speed = 5;
    }
    update() {
        this.x += this.speed;
    }
    draw() {
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x, this.y, this.width + 20, this.height + 20);
    }
}

function handleProjectiles() {
    for (let i = 0; i < projectiles.length; i++) {
        projectiles[i].update();
        projectiles[i].draw();

        for (let j = 0; j < enemies.length; j++) {
            if (enemies[j] && projectiles[i] && collision(projectiles[i], enemies[j])) {

                enemies[j].health -= projectiles[i].power;
                projectiles.splice(i, 1);
                i--;
            }
        }

        if (projectiles[i] && projectiles[i].x > canvas.width - cellSize) {
            projectiles.splice(i, 1);
            i--; // для корректировки индекса цикла
        }
    }
}



// ------------------------------------------------------ защитники
class Defender { // класс создания защитников
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = cellSize - cellGap * 2; // ширина ячейки минус двойной отступ
        this.height = cellSize - cellGap * 2; // высота ячейки минус двойной отступ
        this.shooting = false; // стреляет или нет
        this.health = 100; // кол-во здоровья
        this.projectiles = []; // массив снарядов
        this.timer = 0; // таймер выстрела(скорость стрельбы) 
    }
    draw() { // отрисовка защаитника
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'gold';
        ctx.font = '20px Arial';
        ctx.fillText(Math.floor(this.health), this.x + 20, this.y + 20)
    }
    update() {
        if (this.shooting) { // если true но начинает увеличивать таймет и по определенным значениям добавлять снаряды

            this.timer++;
            if (this.timer % 100 === 0) {
                projectiles.push(new Projectile(this.x + 20, this.y + 20));
            }

        } else {
            this.timer = 0;
        }
    }
}

canvas.addEventListener('click', () => { // клик по канвасу, размещение защитника
    const gridPositionX = mouse.x - (mouse.x % cellSize) + cellGap; // беру позицию мышки и отмаю остаток от деления на ширину ячуйки (получу точное положение Х по сетке)
    const gridPositionY = mouse.y - (mouse.y % cellSize) + cellGap; // беру позицию мышки и отмаю остаток от деления на высоту ячуйки (получу точное положение У по сетке)
    if (gridPositionY < controlsBar.height || gridPositionY > canvas.height - cellSize) return; // что бы нельзя было размещать на выше и ниже игрового поля

    for (let i = 0; i < defenders.length; i++) {
        if (defenders[i].x === gridPositionX && defenders[i].y === gridPositionY) return; // если есть защитник с такими координатами, то не позволит поставить еще одного наверх этого
    }

    let defenderCost = 100; // Стоимость защитника

    if (numberOfResources >= defenderCost) { // если денег хватает то его добовляет в массив защитников 
        defenders.push(new Defender(gridPositionX, gridPositionY));
        numberOfResources -= defenderCost; // вычесть стоимость защитника
    }
})

function handleDefenders() { // функция отрисовки защитников
    for (let i = 0; i < defenders.length; i++) {
        defenders[i].draw(); // вызываю метод отрисовки защитника
        defenders[i].update();

        if (enemyPosition.indexOf(defenders[i].y) !== -1) { // если положение по высоте зашитника будет найдено в массиве врагов вернет 1 - значит враги на этой строке есть
            defenders[i].shooting = true; // начать стрельбу
        } else {
            defenders[i].shooting = false; // остановить стрельбу
        }

        for (let j = 0; j < enemies.length; j++) {

            if (defenders[i] && collision(defenders[i], enemies[j])) { // если защитник и враг сталкиваются то:
                enemies[j].movement = 0; // враг останавливается
                defenders[i].health -= 0.1; // у защитника отнимается здоровье
            }

            if (defenders[i] && defenders[i].health <= 0) { // если здоровье защитника меньше или равно 0, то вырезаем его из массыва защитников
                defenders.splice(i, 1); // вырезать с позиции i один элемент
                i--; // для корректировки индекса цикла

                for (let k = 0; k < enemies.length; k++) { // все враги продолжают двигаться, что бы не застремали если оба врага убили одного защитника
                    enemies[k].movement = enemies[k].speed;
                }
                // enemies[j].movement = enemies[j].speed; // враг продолжает двигаться
            }
        }
    }
}



// --------------------------------------------------------- враги
class Enemy {
    constructor(verticalPosition) {
        this.x = canvas.width; // что бы появлялись за пределами канваса
        this.y = verticalPosition; // параметр определяется рандомом ниже покоду
        this.width = cellSize - cellGap * 2; // ширина ячейки минус двойной отступ
        this.height = cellSize - cellGap * 2; // высота ячейки минус двойной отступ
        this.speed = Math.random() * 0.2 + 0.4; // у врага случайная скорость движения
        this.movement = this.speed; // переменная для того что бы моги остановить врага
        this.health = 100; // здоровье врага
        this.maxHealth = this.health; // сохранение максимального здоровья для расчетов очков и наград
    }
    update() {
        this.x -= this.movement; // смещает врага влево
    }
    draw() { // рисует врага и его здоровье
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText(Math.floor(this.health), this.x + 20, this.y + 20)
    }
}

function handleEnemies() { // функция смещения и отрисовки врага
    for (let i = 0; i < enemies.length; i++) {

        enemies[i].update();
        enemies[i].draw();

        if (enemies[i].x < 0) { // игра заканчивается если противник дошел то левого края поля
            gameOver = true;
        }
        if (enemies[i].health <= 0) { // если здоровье враг убит

            let geinedResources = enemies[i].maxHealth / 10; // игрок получает ресурс в кол-ве 0.1 часть от здоровья противника 
            numberOfResources += geinedResources;
            score += geinedResources; // игрок получает очки в кол-ве 0.1 часть от здоровья противника 
            const findThisIndex = enemyPosition.indexOf(enemies[i].y) // ищет позицию убитого врага
            enemyPosition.splice(findThisIndex, 1); // удаляет позицию убитого врага
            enemies.splice(i, 1); // удаляет убитого врага
            i--; // корректирует счетчик цикла
        }
    }
    if (frame % enemiesInterval === 0 && score < winningScore) { // скорость появления врагов и место

        let verticalPosition = Math.floor(Math.random() * 4 + 3) * cellSize + cellGap; // 3 - т.к. контролбар занимает 3 ячейки, 4 - т.к. нужно что бы движение шло только по 4 полосам после контролбара 
        enemies.push(new Enemy(verticalPosition)) // добавить врага в массив
        enemyPosition.push(verticalPosition); // добавить в массив позиции появления врага

        if (enemiesInterval > 200) enemiesInterval -= 50; // скорость появления противников
    }
}



// -------------------------------------------------------- ресурсы
const amounts = [20, 30, 40];
class Resource { // класс создания ресурсов
    constructor() {
        this.x = Math.random() * (canvas.width - cellSize); // ширина канваса минус одна ячейка сетки, что бы не появлялись за краем
        this.y = (Math.floor(Math.random() * 4) + 3) * cellSize + 25;
        this.width = cellSize * 0.6;
        this.height = cellSize * 0.6;
        this.amount = amounts[Math.floor(Math.random() * amounts.length)]; // рандом умножит на длинну массива сумм наград
    }
    draw() {
        // debugger
        ctx.fillStyle = 'yellow';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText(this.amount, this.x + 10, this.y + 30);
    }
}

function handleResources() {

    if (frame % 500 === 0 && score < winningScore) { // если еще не выйграли, и на каждоп 500ом кадре сознает реурс
        resources.push(new Resource);
    }

    for (let i = 0; i < resources.length; i++) {
        resources[i].draw(); // отрисовка ресурсов
        if (resources[i] && mouse.x && mouse.y && collision(resources[i], mouse)) { // если есть ресурс, мышь на канвасом, и координаты мышки сталкиваются с ресурсом - то забрать его и удалить из массива
            numberOfResources += resources[i].amount;
            resources.splice(i, 1);
            i--;
        }
    }
}



// ------------------------------------------------ вспомогательные функции

function handleGameStatus() { // показываеем в навбаре сколько у игрока бабла и очков
    ctx.fillStyle = 'gold';
    ctx.font = '30px Arial';
    ctx.fillText(`Очки: ${score}`, 20, 40);
    ctx.fillText(`Бабло: ${numberOfResources}`, 20, 80);
    if (gameOver) {
        ctx.fillStyle = 'black';
        ctx.font = '50px Arial';
        ctx.fillText(`Game Over`, 350, 330)
    }
    if (score >= winningScore && enemies.length === 0) {
        ctx.fillStyle = 'black';
        ctx.font = '50px Arial';
        ctx.fillText(`Level Complete`, 300, 330)
    }
}

imgBackground_1.onload = function () { // функция анимации
    function animate() {
        blank(); // задний фон
        controlsBar.draw(); // контролбар
        handleGameGrid(); // сетка поля
        handleProjectiles(); // снаряды
        handleDefenders(); // защитники
        handleEnemies(); // враги
        handleResources(); // ресурсы
        handleGameStatus(); // статус (виграл\проиграл)
        frame++; // увеличение счетчика кадров
        if (!gameOver) requestAnimationFrame(animate);
    }
    animate();
}

function collision(first, second) { // функция коллизии столкновения
    if (!(first.x > second.x + second.width ||
            first.x + first.width < second.x ||
            first.y > second.y + second.height ||
            first.y + first.height < second.y)) {
        return true;
    };
};

wiyndow.addEventListener('resize', () => { // изменение вычислений при ресайзе окна
    canvasPosition = canvas.getBoundingClientRect()
})