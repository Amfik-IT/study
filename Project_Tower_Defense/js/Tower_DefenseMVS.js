"use strict";
const myGame = (function () {

    /* ------- begin view -------- */
    class GameView {

        constructor(container, canvas, canvasBack) {
            this.container = container;
            this.canvas = canvas;

            this.ctx = this.canvas.getContext('2d');
            this.canvasWidth = 900;
            this.canvasHeight = 600;

            this.canvasBack = canvasBack;
            this.ctx_2 = this.canvasBack.getContext('2d');
            this.canvasBackPozition = container.getBoundingClientRect();
            this.users = null;
            this.thisUser = null;
            this.usersScore = null;

            // страничка с меню (главная)
            this.HomeComponent = {
                id: "menu",
                title: "Funny Defenders Undead",
                render: (className = "menu", ...rest) => {
                    return `
                    <section class="${className}">
                        <ul class="mainmenu__list">
                            <li><a class="new__game">Новая игра</a></li>
                            <li><a class="continue">Продолжить</a></li>
                            <li><a class="mainmenu__link" href="#rules">Правила игры</a></li>
                            <li><a class="mainmenu__link" href="#leaders">Таблица лидеров</a></li>
                            <li><a class="sound">Звук</a></li>
                        </ul>
                    </section>
                  `;
                }
            };

            // страничка с провилами игры
            this.RulesComponent = {
                id: "rules",
                title: "Правила игры",
                render: (className = "menu", ...rest) => {
                    return `
                    <section class="${className}">
                        <a class="mainmenu__link back" href="#menu">Назад</a>
                        <p class="rules__text">В начале игры у вас есть стартовое количество темной материи для строительства защитников. Также темная материя будет появляться в процессе игры в случайних местах на поле битвы, и даваться за каждое убийство врага. Что бы установить защитника, кликните левой кнопкой мыши на участок поля где вы хотите его разместить. Игра будет окончена если противник доберется до противополжного края арены. Удачной игры =)</p>
                    </section>
                  `;
                }
            };

            // страничка таблицы лидеров
            this.LeadersComponent = {
                id: "leaders",
                title: "Таблица лидеров",
                render: (className = "menu", ...rest) => {
                    return `
                    <section class="${className}">
                        <a class="mainmenu__link back" href="#menu">Назад</a>
                        <ul class="users">
                            <li class="user1">
                                <span class="name">${this.users[0].username}</span>
                                <span class="points">${this.users[0].points}</span>
                            </li>
                            <li class="user2">
                                <span class="name">${this.users[1].username}</span>
                                <span class="points">${this.users[1].points}</span>
                            </li>
                            <li class="user3">
                                <span class="name">${this.users[2].username}</span>
                                <span class="points">${this.users[2].points}</span>
                            </li>
                            <li class="user4">
                                <span class="name">${this.users[3].username}</span>
                                <span class="points">${this.users[3].points}</span>
                            </li>
                            <li class="user5">
                                <span class="name">${this.users[4].username}</span>
                                <span class="points">${this.users[4].points}</span>
                            </li>
                            <li class="user6">
                                <span class="name">${this.users[5].username}</span>
                                <span class="points">${this.users[5].points}</span>
                            </li>
                            <li class="user7">
                                <span class="name">${this.users[6].username}</span>
                                <span class="points">${this.users[6].points}</span>
                            </li>
                            <li class="user8">
                                <span class="name">${this.users[7].username}</span>
                                <span class="points">${this.users[7].points}</span>
                            </li>
                            <li class="user9">
                                <span class="name">${this.users[8].username}</span>
                                <span class="points">${this.users[8].points}</span>
                            </li>
                            <li class="user10">
                                <span class="name">${this.users[9].username}</span>
                                <span class="points">${this.users[9].points}</span>
                            </li>
                        </ul>
                    </section>
                  `;
                }
            };

            // страничка запроса имени игрока
            this.getNameComponent = {
                id: "name",
                title: "Имя игрока",
                render: (className = "menu", ...rest) => {
                    return `
                    <section class="${className}">
                        <p>Твое имя, герой:</p>
                        <input type="text" class="input__name" id="newUserName" name="username" placeholder="Введите имя" required>
                        <a class="add__name" href="#menu">Ок</a>
                    </section>
                  `;
                }
            };

            // страничка сообщения о том что игрок попал в таблицу лидеров
            this.addLeadersComponent = {
                id: "newLeader",
                title: "Новый лидер",
                render: (className = "menu", ...rest) => {
                    return `
                    <section class="${className}">
                        <p>Встречайте нового героя!!!  <span>${this.thisUser}</span>  вы набрали <span>${this.usersScore}</span> очков  и попали в таблицу лидеров!</p>
                        <a class="new__leaders" href="#leaders">Я лучший =)</a>
                    </section>
                  `;
                }
            };

            this.router = {
                menu: this.HomeComponent,
                rules: this.RulesComponent,
                leaders: this.LeadersComponent,
                default: this.HomeComponent,
                addLeader: this.addLeadersComponent,
                getName: this.getNameComponent
            };

        };

        init() {
            this.canvas.width = this.canvasWidth;
            this.canvas.height = this.canvasHeight;
            this.canvasBack.width = this.canvasBackPozition.width;
            this.canvasBack.height = this.canvasBackPozition.height;
            let main = document.createElement('main');
            main.setAttribute("id", "main");
            this.canvasBack.after(main);
        }

        // задний фон игрового поля (арены)
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

        // отрисовка анимации смерти врага
        drawDyingEnemy(i) {
            this.ctx.drawImage(i[0], i[1], i[2], i[3], i[4], i[5], i[6], i[7], i[8]);
        }

        // сетка игрового поля
        drawCell(x, y, width, height) {
            this.ctx.strokeStyle = 'transparent';
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

        // отрисовка анимации смерти защитника
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

        // отрисовка анимированного заднего фона страницы
        drawBackground(sky, arr_clouds_2_1, rocks, clouds_2, arr_clouds_2_2, ground_1,
            ground_2, ground_3, plant) {
            // debugger
            this.ctx_2.drawImage(sky, 0, 0, this.canvasBackPozition.width, this.canvasBackPozition.height);
            this.ctx_2.drawImage(arr_clouds_2_1[0], arr_clouds_2_1[1], 0, this.canvasBackPozition.width, this.canvasBackPozition.height);
            this.ctx_2.drawImage(rocks, 0, 0, this.canvasBackPozition.width, this.canvasBackPozition.height);
            this.ctx_2.drawImage(clouds_2, 0, 0, this.canvasBackPozition.width, this.canvasBackPozition.height);
            this.ctx_2.drawImage(arr_clouds_2_2[0], arr_clouds_2_2[1], 0, this.canvasBackPozition.width, this.canvasBackPozition.height);
            this.ctx_2.drawImage(ground_1, 0, 0, this.canvasBackPozition.width, this.canvasBackPozition.height);
            this.ctx_2.drawImage(ground_2, 0, 0, this.canvasBackPozition.width, this.canvasBackPozition.height);
            this.ctx_2.drawImage(ground_3, 0, 0, this.canvasBackPozition.width, this.canvasBackPozition.height);
            this.ctx_2.drawImage(plant, 0, 0, this.canvasBackPozition.width, this.canvasBackPozition.height);
        }


        // ------------------------------------------------- вспомогательные методы

        // обновление параметров размера канваса при ресайзе страницы
        resize() {
            this.canvasBackPozition = container.getBoundingClientRect();
            this.canvasBack.width = this.canvasBackPozition.width;
            this.canvasBack.height = this.canvasBackPozition.height;
        }

        // отобразить контент на странице(запрос имени, меню и т.д) SPA
        renderContent(hashPageName) {

            let routeName = "default";

            if (hashPageName.length > 0) {
                routeName = hashPageName in this.router ? hashPageName : "error"; // добавь страничку с ошибкой!!!
            }

            window.document.title = this.router[routeName].title;
            let main = document.querySelector("#main");
            main.innerHTML = this.router[routeName].render(`${routeName}-page menuWindow`);

        }

        start(stay) {

            if (stay) {

                this.canvas.classList.toggle('show');
                setTimeout(this.canvas.style.opacity = '1', 1000);
                this.canvas.animate([
                    // keyframes
                    {
                        opacity: 0
                    },
                    {
                        opacity: 1
                    }
                ], {
                    // timing options
                    duration: 1000,
                    iterations: 1
                })

            } else {

                setTimeout(this.canvas.style.opacity = '0', 1000);
                this.canvas.animate([
                    // keyframes
                    {
                        opacity: 1
                    },
                    {
                        opacity: 0
                    }
                ], {
                    // timing options
                    duration: 1000,
                    iterations: 1
                })
                this.canvas.classList.toggle('show');
            }

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
            this.frameBack = 0 // кадры - как долго открыто окно
            this.numberOfResources = 300; // стартовое количество ресурсов игрока
            this.gameOver = false;
            this.userName = null; // имя игрока
            this.score = 0; // очки игрока
            this.winningScore = 100;

            // изображения
            this.images = {};

            this.addImage = (name, src) => {
                this.images[name] = new Image();
                this.images[name].src = src;
            }

            this.addImage('clouds_2', 'img/game_background/clouds_2.png');
            this.addImage('clouds_2_1', 'img/game_background/clouds_2_1.png');
            this.addImage('clouds_2_2', 'img/game_background/clouds_2_2.png');
            this.addImage('ground_1', 'img/game_background/ground_1.png');
            this.addImage('ground_2', 'img/game_background/ground_2.png');
            this.addImage('ground_3', 'img/game_background/ground_3.png');
            this.addImage('plant', 'img/game_background/plant.png');
            this.addImage('rocks', 'img/game_background/rocks.png');
            this.addImage('sky', 'img/game_background/sky.png');

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

            this.addImage('coin', 'img/coins/dark_coin.png');

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
            this.gameBackground = null;
            this.arrUsers = []; // массив данных об игроках


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

            // ------ Задний фон (горы с тучами)

            this.handlegameBackground = () => {
                this.gameBackground.draw();
                this.gameBackground.update();
            }

            // --------------------------------------------- ЗАПУСК МАШИНЫ
            this.animate = () => {

                this.blank(); // задний фон игрового поля
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

                if (!this.gameOver) { // пока флаг gameOver = false - игра продолжается
                    requestAnimationFrame(this.animate);
                } else { // иначе сравнивает кол-во очков игрока с рейтингом очков и добавляет или нет результат в таблицу

                    this.score += (this.numberOfResources / 10);
                    let leader = false;

                    for (let i = 0; i < this.arrUsers.length; i++) {
                        if (this.score > +this.arrUsers[i].points) {
                            // debugger
                            this.deleteUser(this.arrUsers[9].id); // удалить с сервера игрока с самым маленьким кол-вом очков

                            // --> добавить инфу игрока на сервер
                            this.addUser(this.userName, this.score);

                            // --> вызвать метод вью о том что попал в таблицу лидеров
                            this.view.thisUser = this.userName;
                            this.view.usersScore = this.score;
                            this.view.renderContent("addLeader");

                            leader = true; // что бы не сработал if ниже

                            // --> закрыть игру
                            setTimeout(() => this.view.start(false), 3000);

                            break;
                        }
                    }

                    // --> закрыть игру если в лидеры не попал
                    if (!leader) setTimeout(() => this.view.start(false), 3000);
                }
            }

            this.animateBackground = () => {

                this.handlegameBackground(); // задний фон страницы
                this.frameBack++; // увеличение счетчика кадров
                requestAnimationFrame(this.animateBackground);

            }
        };

        // --------инициализация

        init() {
            this.createGrid();
            this.gameBackground = this.newGameBackground(this);
            this.animateBackground();
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
                    this.width = model.cellSize * 0.6;
                    this.height = model.cellSize * 0.6;
                    this.amount = model.amounts[Math.floor(Math.random() * model.amounts.length)]; // рандом умножит на длинну массива сумм наград

                    this.frameX = 90;
                    this.frameY = 90;
                    this.charFrameX = 0;
                    this.image = [model.images.coin, 0, 0, this.frameX, this.frameY, this.x, this.y, this.width, this.height];
                }
                draw() {
                    // model.view.drawResource(this.x, this.y, this.width, this.height, this.amount);
                    model.view.drawResource(this.image, this.amount);
                }
                update() {
                    //--- анимация бабла
                    this.image[1] = this.frameX * this.charFrameX;

                    if (this.charFrameX < 11 && model.frame % 6 === 0) {
                        this.charFrameX++;
                    }
                    if (this.charFrameX >= 11) {
                        this.charFrameX = 0;
                    }
                }
            }
            return new Resource(model);
        }

        // задний фон окна страницы

        newGameBackground(model) {
            class GameBackground {
                constructor(model) {
                    this.clouds_2_1_x = 0.5;
                    this.clouds_2_2_x = 0.5;
                    this.image_clouds_2_1 = [model.images.clouds_2_1];
                    this.image_clouds_2_2 = [model.images.clouds_2_2];
                    this.speed_1 = 0.5;
                    this.speed_2 = -0.5;
                }

                draw() {
                    this.image_clouds_2_1[1] = this.clouds_2_1_x;
                    this.image_clouds_2_2[1] = this.clouds_2_2_x;
                    model.view.drawBackground(model.images.sky, this.image_clouds_2_1, model.images.rocks, model.images.clouds_2, this.image_clouds_2_2,
                        model.images.ground_1, model.images.ground_2, model.images.ground_3, model.images.plant);
                };

                update() {
                    if (model.frameBack % 2 === 0) {
                        this.clouds_2_1_x += this.speed_1;
                        this.clouds_2_2_x += this.speed_2;
                    }

                    if (model.frameBack !== 0 && model.frameBack % 3800 === 0) {
                        this.speed_1 = this.speed_1 * -1;
                        this.speed_2 = this.speed_2 * -1;
                    }
                };

            }

            return new GameBackground(model);

        }

        // ------------------------------------------------ ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ -------------------------

        // расчет коллизий
        collision(first, second) { // функция коллизии столкновения
            if (!(first.x > second.x + second.width ||
                    first.x + first.width < second.x ||
                    first.y > second.y + second.height ||
                    first.y + first.height < second.y)) {
                return true;
            };
        };

        // при ресайзе окна
        resize() {
            this.view.resize();
        }

        // переход между вкладками меню
        updateState() {

            // ---> проверка локал сторадж
            if (window.localStorage.getItem("Funny_Defenders_Undead") === null) {
                this.view.renderContent("getName"); // если раньше не посещал эту страницу, то при старте спрашиваю имя
            } else {
                let storageInfo = JSON.parse(window.localStorage.getItem("Funny_Defenders_Undead"));
                this.userName = storageInfo.name; // достать и сохранить имя игрока
                const hashPageName = window.location.hash.slice(1).toLowerCase(); // находит хэш и отрезает решетку
                this.view.renderContent(hashPageName);
            }
        }

        // старт игры

        start() {

            // сбросить настройки игры, очистить массивы данных об игровом працессе
            this.enemiesInterval = 600; // интервал появления врагов
            this.frame = 0; // кадры - как долго идет игра
            this.frameBack = 0 // кадры - как долго открыто окно
            this.numberOfResources = 300; // стартовое количество ресурсов игрока
            this.gameOver = false;
            this.score = 0; // очки игрока
            this.winningScore = 100;

            this.gameGrid = []; // массив объектов (ячеек) игрового поля, с методом отрисовки
            this.defenders = []; // массив защитников
            this.dyingDefenders = []; // массив умирающих защитников
            this.enemies = []; // массив врагов
            this.dyingEnemies = []; // массив умирающийх врагов
            this.enemyPosition = []; // массив местоположения врагов
            this.projectiles = []; // массив снарядов для защитников
            this.resources = []; // массив ресурсов

            this.blank(); // отрисовать задний фон игры (канвас), что бы ло старта игы окно плавно появилось уже с картинкой
            this.view.start(true); // плавно отобразить окно с игрой
            setTimeout(this.animate(), 1000); // запустить игру через 1 сек (это время на появления окна с игрой)
        }

        // Удалить с сервера худшего игрока из таблицы лидеров
        deleteUser(id) {
            myAppDB.ref('users/' + `user_${id}}`).remove()
                .then(function () {
                    console.log("Пользователь удален из коллеции users");
                })
                .catch(function (error) {
                    console.error("Ошибка удаления пользователя: ", error);
                });
        }

        // Добавить на сервер результат игрока (при добалении использую только уникальные id, что бы избежать ошибок чтения и записи на сервере)
        addUser(username, points) {
            let randomID = Math.round(Math.random() * 1000000);
            myAppDB.ref('users/' + `user_${randomID}}`).set({
                    username: `${username}`,
                    points: `${points}`,
                    id: randomID
                })
                .then(function (username) {
                    console.log("Пользователь добавлен в коллецию users");
                })
                .catch(function (error) {
                    console.error("Ошибка добавления пользователя: ", error);
                });
        }

        // Получить с сервера данные об игроках-лидерах
        getUsersList(model) {
            myAppDB.ref("users/").on("value", function (snapshot) { // отслеживание изменений (на сервере) в реальном времени
                model.updateUsersData(snapshot.val()); // тут приходит объект данными с сервера
            }, function (error) {
                console.log("Error: " + error.code);
            });
        }

        // Преобразовать полученные с сервера данные об игроках-лидерах
        updateUsersData(userList) {

            let arrKey = Object.keys(userList); // получаю ключи объекта 
            let usersData = []; // массив с лидерами (данные с сервера)

            for (let i = 0; i < arrKey.length; i++) {
                usersData.push(userList[`${arrKey[i]}`]);
            }

            usersData.sort(function (a, b) { // сортирует массив с лидерами по их очкам от большего к меньшему
                if (+a.points < +b.points) {
                    return 1;
                }
                if (+a.points > +b.points) {
                    return -1;
                }
                // a должно быть равным b
                return 0;
            });

            this.arrUsers = usersData;
            console.log(this.arrUsers)

            // передать this.arrUsers во въюшку дял отображения списка

            this.view.users = this.arrUsers;
        }
    };
    /* -------- end model -------- */




    /* ----- CONTROLLER ---- */
    class GameController {

        constructor(model, container, canvas, canvasBack) {
            this.model = model;
            this.container = container;
            this.canvas = canvas;
            this.canvasBack = canvasBack;
        }

        init() {

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
            this.canvas.addEventListener('click', () => {
                this.model.createDefender();
            })

            // вешаем слушателей на событие hashchange 
            window.addEventListener("hashchange", () => this.updateState());

            //первая отрисовка
            this.updateState();

            // получение инфы для таблицы лидеров
            this.model.getUsersList(this.model);

            // кнопка старт и другие
            let main = document.querySelector('#main');
            main.addEventListener('click', (e) => {
                let target = e.target;

                if (target.className === 'new__game') this.start();

                // добавить имя в локал сторадж
                if (target.className === 'add__name') {

                    let inputName = this.container.querySelector('#newUserName');

                    // сохранение в local storage
                    let visitInfo = {};
                    visitInfo.name = inputName.value;
                    window.localStorage.setItem("Funny_Defenders_Undead", JSON.stringify(visitInfo));

                    this.model.userName = inputName.value;

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

        // --> это удали потом это тест
        // addTestUser(user) {
        //     if (user.userName && user.points) {
        //         this.model.addUser(user.userName, user.points);
        //     }
        // }

    };
    /* ------ end controller ----- */

    return {
        init: function () {
            // глобальная инициализация
            const containerElem = document.getElementById("container");

            const canvas = document.createElement('canvas');
            canvas.setAttribute("id", "canvas1");
            const canvasBack = document.createElement('canvas');
            canvasBack.setAttribute("id", "background");
            containerElem.append(canvasBack);
            containerElem.append(canvas);


            const appGameView = new GameView(containerElem, canvas, canvasBack);
            const appGameModel = new GameModel(appGameView);
            const appGameController = new GameController(appGameModel, containerElem, canvas, canvasBack);

            //вызвать init-методы...
            appGameView.init();
            appGameModel.init();
            appGameController.init();

            // appGameController.addTestUser({
            //     userName: 'Черный кот',
            //     points: '100'
            // });
            // appGameController.addTestUser({
            //     userName: 'Ведьма',
            //     points: '90'
            // });
            // appGameController.addTestUser({
            //     userName: 'Вампир',
            //     points: '80'
            // });
            // appGameController.addTestUser({
            //     userName: 'Оборотень',
            //     points: '70'
            // });
            // appGameController.addTestUser({
            //     userName: 'Демон',
            //     points: '60'
            // });
            // appGameController.addTestUser({
            //     userName: 'Гуль',
            //     points: '50'
            // });
            // appGameController.addTestUser({
            //     userName: 'Джин',
            //     points: '40'
            // });
            // appGameController.addTestUser({
            //     userName: 'Призрак',
            //     points: '30'
            // });
            // appGameController.addTestUser({
            //     userName: 'Метла ведьмы',
            //     points: '20'
            // });
            // appGameController.addTestUser({
            //     userName: 'Джин Тоник',
            //     points: '10'
            // });
        }
    };
})();

document.addEventListener("DOMContentLoaded", myGame.init()); // инициализируем модуль как только DOM готов.