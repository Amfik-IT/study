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
            this.audioBack = null;
            this.audioGame = null;
            this.muted = false;

            // страничка с меню (главная)
            this.HomeComponent = {
                id: "menu",
                title: "Funny Defenders Undead",
                render: (className = "menu", ...rest) => {
                    return `
                    <section class="${className}">
                        <ul class="mainmenu__list">
                            <li><a class="new__game">Новая игра</a></li>
                            <li><a id="continue" class="continue save__true">Продолжить</a></li>
                            <li><a class="mainmenu__link" href="#rules">Правила игры</a></li>
                            <li><a class="mainmenu__link" href="#leaders">Таблица лидеров</a></li>
                            <li><span class="saund__off-top"></span><a id="sound" class="sound">Звук</a><span class="saund__off-bottom"></span></li>
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
                                <span class="name">1) ${this.users[0].username}</span>
                                <span class="points">${this.users[0].points}</span>
                            </li>
                            <li class="user2">
                                <span class="name">2) ${this.users[1].username}</span>
                                <span class="points">${this.users[1].points}</span>
                            </li>
                            <li class="user3">
                                <span class="name">3) ${this.users[2].username}</span>
                                <span class="points">${this.users[2].points}</span>
                            </li>
                            <li class="user4">
                                <span class="name">4) ${this.users[3].username}</span>
                                <span class="points">${this.users[3].points}</span>
                            </li>
                            <li class="user5">
                                <span class="name">5) ${this.users[4].username}</span>
                                <span class="points">${this.users[4].points}</span>
                            </li>
                            <li class="user6">
                                <span class="name">6) ${this.users[5].username}</span>
                                <span class="points">${this.users[5].points}</span>
                            </li>
                            <li class="user7">
                                <span class="name">7) ${this.users[6].username}</span>
                                <span class="points">${this.users[6].points}</span>
                            </li>
                            <li class="user8">
                                <span class="name">8) ${this.users[7].username}</span>
                                <span class="points">${this.users[7].points}</span>
                            </li>
                            <li class="user9">
                                <span class="name">9) ${this.users[8].username}</span>
                                <span class="points">${this.users[8].points}</span>
                            </li>
                            <li class="user10">
                                <span class="name">10) ${this.users[9].username}</span>
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
                        <input type="text" class="input__name" id="newUserName" name="username" placeholder="Введите имя" maxlength="10" required>
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
        drawGameStatus(score, numberOfResources, levelComplete, gameOver,
            imgCoin, imgScore, imgUp_01, imgUp_02, imgWraith, imgMan_01, win) {

            this.ctx.drawImage(imgScore, 20, 10, 50, 50); // иконка кубка (очки)
            this.ctx.drawImage(imgCoin, 0, 0, 90, 90, 20, 60, 50, 50); // иконка энергии
            this.ctx.drawImage(imgWraith, 0, 0, 267.916667, 180, 300, 3, 50, 50); // иконка защитника дальнего боя
            this.ctx.drawImage(imgMan_01, 0, 0, 267.916667, 180, 300, 56, 50, 50); // иконка защитника ближнего боя
            this.ctx.drawImage(imgUp_01, 0, 0, 100, 100, 430, 3, 50, 50); // иконка апгрейд 1
            this.ctx.drawImage(imgUp_01, 0, 0, 100, 100, 430, 56, 50, 50); // иконка апгрейд 1
            this.ctx.drawImage(imgUp_02, 0, 0, 100, 100, 560, 3, 50, 50); // иконка апгрейд 1
            this.ctx.drawImage(imgUp_02, 0, 0, 100, 100, 560, 56, 50, 50); // иконка апгрейд 1

            this.ctx.save();
            this.ctx.shadowColor = 'white';
            this.ctx.shadowOffsetX = 0;
            this.ctx.shadowOffsetY = 0;
            this.ctx.shadowBlur = 7;
            this.ctx.fillStyle = 'black';
            this.ctx.font = '50.5px RUSNeverwinter';
            this.ctx.globalAlpha = 0.8;

            this.ctx.fillText(`${Math.round(score)}`, 100, 45);
            this.ctx.fillText(`${numberOfResources} $`, 100, 90);
            this.ctx.restore();

            this.ctx.save();
            this.ctx.shadowColor = 'white';
            this.ctx.shadowOffsetX = 0;
            this.ctx.shadowOffsetY = 0;
            this.ctx.shadowBlur = 7;
            this.ctx.fillStyle = 'black';
            this.ctx.font = '25.5px RUSNeverwinter';

            this.ctx.fillText(`50 xp`, 360, 15);
            this.ctx.fillText(`5 atc`, 360, 30);
            this.ctx.fillText(`50 $`, 360, 45);

            this.ctx.fillText(`80 xp`, 360, 70);
            this.ctx.fillText(`6 atc/s`, 360, 85);
            this.ctx.fillText(`50 $`, 360, 100);

            this.ctx.fillText(`+15 xp`, 490, 15);
            this.ctx.fillText(`10 atc`, 490, 30);
            this.ctx.fillText(`25 $`, 490, 45);

            this.ctx.fillText(`+30 xp`, 490, 70);
            this.ctx.fillText(`9 atc/s`, 490, 85);
            this.ctx.fillText(`25 $`, 490, 100);

            this.ctx.fillText(`+25 xp`, 620, 15);
            this.ctx.fillText(`15 atc`, 620, 30);
            this.ctx.fillText(`25 $`, 620, 45);

            this.ctx.fillText(`+60 xp`, 620, 70);
            this.ctx.fillText(`12 atc/s`, 620, 85);
            this.ctx.fillText(`25 $`, 620, 100);

            this.ctx.restore();


            if (gameOver) {
                this.ctx.fillStyle = 'black';
                this.ctx.font = '50px Lineage2Font';
                this.ctx.fillText(`Game Over`, 350, 330)
            }
            if (levelComplete && !win) {
                this.ctx.fillStyle = 'black';
                this.ctx.font = '50px Lineage2Font';
                this.ctx.fillText(`Level Complete`, 300, 330)
            }
            if (win) {
                this.ctx.fillStyle = 'black';
                this.ctx.font = '50px Lineage2Font';
                this.ctx.fillText(`!!! You're a winner !!!`, 250, 330)
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
            this.ctx.lineTo(i[5] + 80, i[6] + (50 - (health / 5)) + 10);
            this.ctx.stroke();

            this.ctx.strokeStyle = 'red';
            this.ctx.lineCap = 'round';
            this.ctx.lineWidth = 3.5;
            this.ctx.beginPath();
            this.ctx.moveTo(i[5] + 80, i[6] + 60);
            this.ctx.lineTo(i[5] + 80, i[6] + (50 - (health / 5)) + 10);
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

        // сетка навбара
        drawNavCell(x, y, width, height, color) {
            this.ctx.strokeStyle = `${color}`;
            this.ctx.strokeRect(x, y, width, height);
        }

        drawNavButton(img, sx, sy, sw, sh, wx, wy, ww, wh) {
            // debugger
            this.ctx.drawImage(img, sx, sy, sw, sh, wx, wy, ww, wh);
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
            this.ctx.lineTo(i[5] + 20, i[6] + (50 - (health / 5)) + 10);
            this.ctx.stroke();

            this.ctx.strokeStyle = 'green';
            this.ctx.lineCap = 'round';
            this.ctx.lineWidth = 3.5;
            this.ctx.beginPath();
            this.ctx.moveTo(i[5] + 20, i[6] + 60);
            this.ctx.lineTo(i[5] + 20, i[6] + (50 - (health / 5)) + 10);
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

        // отрисовка анимированного заднего фона стартовой страницы
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

        // ------------------------------------------ звуки ------------------------------

        playAudioBack() {

            this.audioBack = new Audio();

            // проверка поддерживаемого формата браузером
            if (this.audioBack.canPlayType("audio/mp3") == "probably") {
                this.audioBack.src = "audio/rage-zone-k1.mp3"
            } else this.audioBack.src = "audio/rage-zone-k1.ogg"

            // this.audioBack.setAttribute('id', 'audioBack');
            this.audioBack.loop = true;
            this.audioBack.autoplay = true;
            this.audioBack.volume = 0.4;
            // console.log(this.audioBack.canPlayType("audio/mp3"));
        }

        mutedAudioBack(stay) {
            // debugger
            // this.audioBack.pause();
            // this.audioBack.currentTime = 0.0;
            this.audioBack.muted = stay;
        }

        playAudioGame() {
            this.audioGame = new Audio();

            // проверка поддерживаемого формата браузером
            if (this.audioGame.canPlayType("audio/mp3") == "probably") {
                this.audioGame.src = "audio/rage-zone-hierarchy&quad.mp3"
            } else this.audioGame.src = "audio/rage-zone-hierarchy&quad.ogg"

            // this.audioGame.setAttribute('id', 'audioGame');
            this.audioGame.loop = true;
            this.audioGame.autoplay = true;
            this.audioGame.volume = 0.4;
            if (this.muted) this.mutedAudioGame(true)
            if (!this.muted) this.mutedAudioBack(true);
        }

        mutedAudioGame(stay) {
            this.audioGame.currentTime = 0.0;
            this.audioGame.muted = stay;
        }

        isMuted(stay) {
            this.muted = stay;
        }

        closeSaund(stay) {

            let closeButton = this.container.querySelector('.sound');
            let spanCloseTop = this.container.querySelector('.saund__off-top');
            let spanCloseBottom = this.container.querySelector('.saund__off-bottom');
            if (stay) {

                closeButton.classList.toggle('red');
                setTimeout(() => {
                    spanCloseTop.style.opacity = '1';
                    spanCloseTop.style.transform = "rotate(45deg) translateX(50%)";
                }, 700);
                setTimeout(() => {
                    spanCloseBottom.style.opacity = '1';
                    spanCloseBottom.style.transform = "rotate(-45deg) translateX(50%)";
                }, 700);
                spanCloseTop.animate([
                    // keyframes
                    {
                        transform: "rotate(0deg) translateX(50%)",
                        opacity: 0
                    },
                    {
                        transform: "rotate(45deg) translateX(50%)",
                        opacity: 1
                    }
                ], {
                    // timing options
                    duration: 700,
                    iterations: 1
                })

                spanCloseBottom.animate([
                    // keyframes
                    {
                        transform: "rotate(0deg) translateX(50%)",
                        opacity: 0
                    },
                    {
                        transform: "rotate(-45deg) translateX(50%)",
                        opacity: 1
                    }
                ], {
                    // timing options
                    duration: 700,
                    iterations: 1
                })

            } else if (!stay) {

                closeButton.classList.toggle('red');
                setTimeout(() => {
                    spanCloseTop.style.opacity = '0';
                    spanCloseTop.style.transform = "rotate(0deg) translateX(50%)";
                }, 700);
                setTimeout(() => {
                    spanCloseBottom.style.opacity = '0';
                    spanCloseBottom.style.transform = "rotate(0deg) translateX(50%)";
                }, 700);
                spanCloseTop.animate([
                    // keyframes
                    {
                        transform: "rotate(45deg) translateX(50%)",
                        opacity: 1
                    },
                    {
                        transform: "rotate(0deg) translateX(50%)",
                        opacity: 0
                    }
                ], {
                    // timing options
                    duration: 700,
                    iterations: 1
                })

                spanCloseBottom.animate([
                    // keyframes
                    {
                        transform: "rotate(-45deg) translateX(50%)",
                        opacity: 1
                    },
                    {
                        transform: "rotate(0deg) translateX(50%)",
                        opacity: 0
                    }
                ], {
                    // timing options
                    duration: 700,
                    iterations: 1
                })
            }
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

        // start / end 
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
                if (!this.muted) this.mutedAudioBack(false);
                if (!this.muted) this.mutedAudioGame(true);

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

        // снять блок с кнопки "продолжить"
        continueBlock(stay) {
            let continueButton = this.container.querySelector(".continue");
            stay ? continueButton.classList.remove("save__true") : continueButton.classList.add("save__true");
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
            this.frameNextLevel = 0; // кадры - отсчет до запуска нового уровня
            this.numberOfResources = 300; // стартовое количество ресурсов игрока
            this.gameOver = false; // игрок проиграл
            this.levelComplete = false; // игрок прошёл уровень
            this.win = false; // игрок прошёл игру
            this.userName = null; // имя игрока
            this.score = 0; // очки игрока
            this.levelGame = 1;
            this.winningScore = 100; // кол-во очков что бы враги перестали появляться и для перехода на след лвл
            this.animateID = null;

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

            this.addImage('reaper_Man_01', 'img/protecting_char/Reaper_Man_01.png');
            this.addImage('reaper_Man_02', 'img/protecting_char/Reaper_Man_02.png');
            this.addImage('reaper_Man_03', 'img/protecting_char/Reaper_Man_03.png');

            this.addImage('Orc_01', 'img/attacking_char/Orc_01.png');
            this.addImage('Orc_02', 'img/attacking_char/Orc_02.png');
            this.addImage('Orc_03', 'img/attacking_char/Orc_03.png');

            this.addImage('coin', 'img/coins/dark_coin.png');
            this.addImage('score', 'img/coins/score.png');
            this.addImage('up_01', 'img/coins/up_01.png');
            this.addImage('up_02', 'img/coins/up_02.png');

            this.addImage('nav_game_button', 'img/buttons/Nav_Game_Button.png');


            // массивы данных
            this.gameGrid = []; // массив объектов (ячеек) игрового поля, с методом отрисовки
            this.navGrid = []; // массив объектов (ячеек) навбара, с методом отрисовки
            this.defenders = []; // массив защитников
            this.dyingDefenders = []; // массив умирающих защитников
            this.enemies = []; // массив врагов
            this.dyingEnemies = []; // массив умирающийх врагов
            this.enemyPosition = []; // массив местоположения врагов Y
            this.enemyPositionX = []; // массив столкновения врагов с защитниками X
            this.projectiles = []; // массив снарядов для защитников
            this.resources = []; // массив ресурсов
            this.amounts = [20, 30, 40]; // массив данных для ресурсов
            this.gameBackground = null;
            this.gameBattleBackground = null;
            this.arrUsers = []; // массив данных об игроках

            // параметры выбранного защитника
            this.choiceDefender = "wraith";


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

            // функция очистки канваса
            this.blank = () => {
                // debugger
                // подена арен в зависимости от уровня игры
                if (this.levelGame === 1 || this.levelGame === 2 || this.levelGame === 3) this.gameBattleBackground = this.images.background_1;
                if (this.levelGame === 4 || this.levelGame === 5 || this.levelGame === 6) this.gameBattleBackground = this.images.background_2;
                if (this.levelGame === 7 || this.levelGame === 8 || this.levelGame === 9) this.gameBattleBackground = this.images.background_4;

                this.view.blank(this.gameBattleBackground);
            }

            // функция отрисовки ячеек игрового поля
            this.handleGameGrid = () => {
                for (let i = 0; i < this.gameGrid.length; i++) {
                    this.gameGrid[i].draw(); // вызываю метод отрисовки каждой ячейки
                }
            }

            // функция отрисовки ячеек навбара
            this.handleNavGrid = () => {
                for (let i = 0; i < this.navGrid.length; i++) {
                    this.navGrid[i].draw(); // вызываю метод отрисовки каждой ячейки
                }
            }

            // слежу за состоянием игры показываю в навбаре сколько у игрока бабла и очков // вызвать следующий лвл
            this.handleGameStatus = () => {

                // уровень пройден если очки больше планки и нет врагов, и игра еще не пройдена
                (this.score >= this.winningScore && this.enemies.length === 0 && this.levelGame !== "win") ? this.levelComplete = true: this.levelComplete = false;

                // если уровень пройден
                if (this.levelComplete) {
                    this.frameNextLevel++; // увеличить счетчик до следующего уровня
                    if (this.frameNextLevel !== 0 && this.frameNextLevel % 180 === 0 && this.levelGame < 10) {
                        this.score += Math.round(this.numberOfResources / 10); // добавить игроку очки в размере 10% от оставшегося ресурса
                        this.numberOfResources += 300; // дать игроку еще 300 ресурсов
                        this.nextLevelGame();
                    }

                }

                if (this.levelComplete && this.levelGame === 10) {

                    this.levelGame = "win"; // что бы не вошло в условие ктоторе ставит levelComplete (выше)
                    this.levelComplete = false; // что бы не вошло в это условие повторно
                    this.win = true; // что бы отрисовало что игрок победил
                    let leader = false; // что бы не сработал или не сработал if ниже
                    this.view.continueBlock(false) // задизейблить кнопку "продолжить"

                    for (let i = 0; i < this.arrUsers.length; i++) {
                        if (Math.round(this.score) > +this.arrUsers[i].points) { // если очки игрока превышают отчки хотябы одного игрока из таблицы лидеров тот это игрок попадает в таблицу лидеров
                            // debugger
                            this.deleteUser(this.arrUsers[9].id); // удалить с сервера игрока с самым маленьким кол-вом очков

                            // --> добавить инфу игрока на сервер
                            this.addUser(this.userName, Math.round(this.score));

                            // --> вызвать метод вью о том что попал в таблицу лидеров
                            this.view.thisUser = this.userName;
                            this.view.usersScore = Math.round(this.score);
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

                // отрисовать инфу на странице
                this.view.drawGameStatus(this.score, this.numberOfResources, this.levelComplete, this.gameOver,
                    this.images.coin, this.images.score, this.images.up_01, this.images.up_02, this.images.wraith_01, this.images.reaper_Man_01, this.win);

            }



            // ------------------------ враги

            // созданиа, смещениа, логика врага (тут и логика конца)
            this.handleEnemies = () => {

                for (let i = 0; i < this.enemies.length; i++) { // перебор массива врагов

                    this.enemies[i].draw(); //отрисовка врага
                    this.enemies[i].update(); // обновление состояния врага

                    if (this.enemies[i].x < 0) { // игра заканчивается если противник дошел то левого края поля
                        this.gameOver = true;
                    }
                    if (this.enemies[i].health <= 0) { // если здоровье меньше или равно 0 - враг убит

                        // если будет сложно замени тут 15 на 10 (будет завать в 0.5 раза больше золота за килл), легко - 15 на 20
                        let geinedResources = Math.ceil(this.enemies[i].maxHealth / 15); // игрок получает ресурс в кол-ве 0.05 часть от здоровья противника 
                        let geinedScore = this.enemies[i].maxHealth / 10;
                        this.numberOfResources += geinedResources;
                        this.score += geinedScore; // игрок получает очки в кол-ве 0.1 часть от здоровья противника 

                        const findThisIndex = this.enemyPosition.indexOf(this.enemies[i].y) // ищет позицию убитого врага

                        // для анимации смерти
                        this.dyingEnemies.push(this.newDyingEnemies(this.enemies[i].x, this.enemies[i].y, this.enemies[i].image[0], this)) // добавить врага в массив убитых врагов

                        this.enemyPosition.splice(findThisIndex, 1); // удаляет позицию убитого врага
                        this.enemies.splice(i, 1); // удаляет убитого врага
                        i--; // корректирует счетчик цикла
                    }
                }

                // скорость появления врагов, место, вид врага
                // враг 1 ур
                if (this.frame % this.enemiesInterval === 0 && this.score < this.winningScore) {

                    if (this.levelGame === 1 || this.levelGame === 2 || this.levelGame === 3) {
                        let verticalPosition = Math.floor(Math.random() * 4 + 3) * this.cellSize + this.cellGap; // 3 - т.к. контролбар занимает 3 ячейки, 4 - т.к. нужно что бы движение шло только по 4 полосам после контролбара 
                        this.enemies.push(this.newEnemy(verticalPosition, this, this.images.Orc_01, 110, 0.1)) // добавить врага в массив
                        this.enemyPosition.push(verticalPosition); // добавить в массив позиции появления врага
                    }
                    if (this.levelGame === 4 || this.levelGame === 5 || this.levelGame === 6) {
                        let verticalPosition = Math.floor(Math.random() * 4 + 3) * this.cellSize + this.cellGap; // 3 - т.к. контролбар занимает 3 ячейки, 4 - т.к. нужно что бы движение шло только по 4 полосам после контролбара 
                        this.enemies.push(this.newEnemy(verticalPosition, this, this.images.fallen_Angels_01, 130, 0.1)) // добавить врага в массив
                        this.enemyPosition.push(verticalPosition); // добавить в массив позиции появления врага
                    }
                    if (this.levelGame === 7 || this.levelGame === 8 || this.levelGame === 9) {
                        let verticalPosition = Math.floor(Math.random() * 4 + 3) * this.cellSize + this.cellGap; // 3 - т.к. контролбар занимает 3 ячейки, 4 - т.к. нужно что бы движение шло только по 4 полосам после контролбара 
                        this.enemies.push(this.newEnemy(verticalPosition, this, this.images.golem_01, 150, 0.1)) // добавить врага в массив
                        this.enemyPosition.push(verticalPosition); // добавить в массив позиции появления врага
                    }

                    // скорость появления противников
                    if (this.enemiesInterval > 200) this.enemiesInterval -= 50;
                }

                // враг 2 ур
                if (this.frame !== 0 && this.frame % 350 === 0 && this.score < this.winningScore) {

                    if (this.levelGame === 2 || this.levelGame === 3) {
                        let verticalPosition = Math.floor(Math.random() * 4 + 3) * this.cellSize + this.cellGap; // 3 - т.к. контролбар занимает 3 ячейки, 4 - т.к. нужно что бы движение шло только по 4 полосам после контролбара 
                        this.enemies.push(this.newEnemy(verticalPosition, this, this.images.Orc_02, 160, 0.15)) // добавить врага в массив (позиция, модель, img, здоровье, сила удара (60раз в секунду))
                        this.enemyPosition.push(verticalPosition); // добавить в массив позиции появления врага
                    }
                    if (this.levelGame === 5 || this.levelGame === 6) {
                        let verticalPosition = Math.floor(Math.random() * 4 + 3) * this.cellSize + this.cellGap; // 3 - т.к. контролбар занимает 3 ячейки, 4 - т.к. нужно что бы движение шло только по 4 полосам после контролбара 
                        this.enemies.push(this.newEnemy(verticalPosition, this, this.images.fallen_Angels_02, 180, 0.15)) // добавить врага в массив
                        this.enemyPosition.push(verticalPosition); // добавить в массив позиции появления врага
                    }
                    if (this.levelGame === 8 || this.levelGame === 9) {
                        let verticalPosition = Math.floor(Math.random() * 4 + 3) * this.cellSize + this.cellGap; // 3 - т.к. контролбар занимает 3 ячейки, 4 - т.к. нужно что бы движение шло только по 4 полосам после контролбара 
                        this.enemies.push(this.newEnemy(verticalPosition, this, this.images.golem_02, 200, 0.15)) // добавить врага в массив
                        this.enemyPosition.push(verticalPosition); // добавить в массив позиции появления врага
                    }

                }

                // враг 3 ур
                if (this.frame !== 0 && this.frame % 590 === 0 && this.score < this.winningScore) {

                    if (this.levelGame === 3) {
                        let verticalPosition = Math.floor(Math.random() * 4 + 3) * this.cellSize + this.cellGap; // 3 - т.к. контролбар занимает 3 ячейки, 4 - т.к. нужно что бы движение шло только по 4 полосам после контролбара 
                        this.enemies.push(this.newEnemy(verticalPosition, this, this.images.Orc_03, 210, 0.2)) // добавить врага в массив
                        this.enemyPosition.push(verticalPosition); // добавить в массив позиции появления врага
                    }
                    if (this.levelGame === 6) {
                        let verticalPosition = Math.floor(Math.random() * 4 + 3) * this.cellSize + this.cellGap; // 3 - т.к. контролбар занимает 3 ячейки, 4 - т.к. нужно что бы движение шло только по 4 полосам после контролбара 
                        this.enemies.push(this.newEnemy(verticalPosition, this, this.images.fallen_Angels_03, 230, 0.2)) // добавить врага в массив
                        this.enemyPosition.push(verticalPosition); // добавить в массив позиции появления врага
                    }
                    if (this.levelGame === 9) {
                        let verticalPosition = Math.floor(Math.random() * 4 + 3) * this.cellSize + this.cellGap; // 3 - т.к. контролбар занимает 3 ячейки, 4 - т.к. нужно что бы движение шло только по 4 полосам после контролбара 
                        this.enemies.push(this.newEnemy(verticalPosition, this, this.images.golem_03, 250, 0.2)) // добавить врага в массив
                        this.enemyPosition.push(verticalPosition); // добавить в массив позиции появления врага
                    }

                }

            }

            // умирающие враги
            this.handleDyingEnemies = () => {

                for (let i = 0; i < this.dyingEnemies.length; i++) {
                    this.dyingEnemies[i].draw();
                    this.dyingEnemies[i].update();

                    if (this.dyingEnemies[i].animDying) {

                        this.dyingEnemies.splice(i, 1); // вырезать с позиции i умершего противника
                        i--; // для корректировки индекса цикла
                    }
                }
            }


            // ----------------------- защитники

            // функция создания и логики защитников
            this.handleDefenders = () => {

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
                            this.defenders[i].health -= this.enemies[j].power; // у защитника отнимается здоровье в зависимости от силы врага
                            if (this.defenders[i].nameDefender === "reaper_Man") this.enemies[j].health -= this.defenders[i].powerCloseAtack; // у врвга отнимается здоровье в зависимости от атаки защитника
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

            // умирающие защитники
            this.handleDyingDefenders = () => {

                for (let i = 0; i < this.dyingDefenders.length; i++) {
                    this.dyingDefenders[i].draw();
                    this.dyingDefenders[i].update();

                    if (this.dyingDefenders[i].animDying) {

                        this.dyingDefenders.splice(i, 1); // вырезать с позиции i умершего противника
                        i--; // для корректировки индекса цикла
                    }
                }
            }

            // ------------------------- снаряды

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

            // -------------------------- ресурсы

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

            // ---------------------------------------- Задний фон (горы с тучами)

            this.handlegameBackground = () => {
                this.gameBackground.draw();
                this.gameBackground.update();
            }

            // --------------------------------------------- ЗАПУСК МАШИНЫ
            this.animate = () => {

                this.blank(); // задний фон игрового поля
                this.view.drawControlsBar(this.controlsBar.width, this.controlsBar.height); // контролбар
                this.handleGameGrid(); // сетка поля
                this.handleNavGrid(); // сетка навбара

                this.handleDefenders(); // защитники
                this.handleDyingDefenders();
                this.handleProjectiles(); // снаряды
                this.handleEnemies(); // враги
                this.handleDyingEnemies();
                this.handleResources(); // ресурсы
                this.handleGameStatus(); // статус (выиграл\проиграл)
                this.frame++; // увеличение счетчика кадров

                if (!this.gameOver) { // пока флаг gameOver = false - игра продолжается
                    this.animateID = requestAnimationFrame(this.animate);
                } else { // иначе сравнивает кол-во очков игрока с рейтингом очков и добавляет или нет результат в таблицу

                    cancelAnimationFrame(this.animateID);
                    this.score += (this.numberOfResources / 10); // добавить очки от оставшейся энергии
                    this.numberOfResources = 0; // обнулить энергию
                    let leader = false; // что бы не сработал или не сработал if ниже
                    this.view.continueBlock(false) // задизейблить кнопку "продолжить"

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
                            setTimeout(() => this.view.start(false), 2000);

                            break;
                        }
                    }

                    // --> закрыть игру если в лидеры не попал
                    if (!leader) setTimeout(() => this.view.start(false), 2000);
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

        newNavCell(x, y, model, button, img) {
            class NavCell { // Класс который создаст ячейку сетки
                constructor(x, y, model, button, img) {
                    this.x = x;
                    this.y = y;
                    this.width = 50;
                    this.height = 50;
                    this.choice = false;
                    this.isButton = button; // menu или pause
                    this.imgButton = img;
                }
                draw() {
                    // debugger
                    // ячейки выбора персонажа
                    if (model.mouse.x && model.mouse.y && model.collision(this, model.mouse) && !this.isButton) { // если мышка над полем канвас и над сеткой поля, рисует
                        model.view.drawNavCell(this.x, this.y, this.width, this.height, "white");
                    }
                    if (this.choice && !this.isButton) {
                        model.view.drawNavCell(this.x, this.y, this.width, this.height, "gold");
                    }
                    // ячейки кнопки меню
                    if (this.isButton === "menu") {
                        this.choice ? model.view.drawNavButton(img, 60, 0, 60, 60, this.x, this.y, this.width, this.height) : model.view.drawNavButton(img, 0, 0, 60, 60, this.x, this.y, this.width, this.height);
                    }
                    if (this.isButton === "pause") {
                        this.choice ? model.view.drawNavButton(img, 60, 60, 60, 60, this.x, this.y, this.width, this.height) : model.view.drawNavButton(img, 0, 60, 60, 60, this.x, this.y, this.width, this.height);
                    }
                }
            }
            return new NavCell(x, y, model, button, img)
        }

        // Создание сетки поля и создание ячее навбара
        createGrid() {
            for (let y = this.cellSize * 3; y < this.canvasHeight - this.cellSize; y += this.cellSize) { // y = cellSize, т.к. начинаю не сначала поля, после поля управления
                for (let x = 0; x < this.canvasWidth; x += this.cellSize) {
                    this.gameGrid.push(this.newCell(x, y, this)); // добавляю в массив объекты с параметрами их расположения и методом отрисовки
                }
            }

            this.navGrid.push(this.newNavCell(300, 3, this, false, false)); // две ячейки навбара выбора героя
            this.navGrid.push(this.newNavCell(300, 56, this, false, false));
            this.navGrid[0].choice = true; // что бы изначально игрок видел какой защитник выбран

            this.navGrid.push(this.newNavCell(840, 3, this, "menu", this.images.nav_game_button)); // две ячейки навбара меню и пауза
            this.navGrid.push(this.newNavCell(840, 56, this, "pause", this.images.nav_game_button));
        }

        // ------------------------------------------------------ враги

        newEnemy(verticalPosition, model, img, health, power) {
            class Enemy {
                constructor(verticalPosition, model, img, health, power) {
                    this.x = model.canvasWidth; // что бы появлялись за пределами канваса
                    this.y = verticalPosition; // параметр определяется рандомом ниже покоду
                    this.width = model.cellSize - model.cellGap * 2; // ширина ячейки минус двойной отступ
                    this.height = model.cellSize - model.cellGap * 2; // высота ячейки минус двойной отступ
                    this.speed = Math.random() * 0.2 + 0.4; // у врага случайная скорость движения
                    this.movement = this.speed; // переменная для того что бы моги остановить врага
                    this.health = health; // здоровье врага
                    this.maxHealth = this.health; // сохранение максимального здоровья для расчетов очков и наград
                    this.power = power;

                    this.frameX = 267.916667;
                    this.frameY = 170;
                    this.charFrameX = 0;
                    this.charFrameY = 0;
                    this.image = [img, 30, 0, this.frameX, this.frameY, this.x, this.y, 90, this.height];
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

                    // проверка столкновения с врагом
                    for (let i = 0; i < model.defenders.length; i++) {
                        if (this.health > 0 && model.collision(this, model.defenders[i])) {
                            model.defenders[i].fight = true; // включить анимацию защитника
                        }
                        if (this.health <= 0 && model.collision(this, model.defenders[i])) {
                            model.defenders[i].fight = false; // выключить анимацию защитника
                        }
                    }

                    //--- атака
                    if (this.movement === 0) {

                        this.charFrameY = 1;
                    } else this.charFrameY = 0;

                    //--- смещение
                    this.x -= this.movement; // смещает врага влево
                }

            }
            return new Enemy(verticalPosition, model, img, health, power);
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

        newDefender(x, y, model, name) {
            class Defender { // класс создания защитников
                constructor(x, y, model, name) {
                    this.x = x;
                    this.y = y;
                    this.width = model.cellSize - model.cellGap * 2; // ширина ячейки минус двойной отступ
                    this.height = model.cellSize - model.cellGap * 2; // высота ячейки минус двойной отступ

                    // параметры защитника
                    this.nameDefender = name;
                    // wraith
                    this.shooting = false; // стреляет или нет
                    this.fight = false; // ближняя атака
                    this.health = this.nameDefender === "wraith" ? 50 : 80; // кол-во здоровья
                    this.projectiles = []; // массив снарядов
                    this.imgProjectil = model.images.spellsEffect_1;
                    this.timer = 0; // таймер выстрела(скорость стрельбы)
                    this.powerAtack = 5; // сила атаки (дальный бой)
                    this.powerCloseAtack = 0.1 // сила атаки (ближний бой)
                    this.level = 1; // уровень защитника
                    this.costUp = 25; // стоимость улучшения

                    this.frameX = 267.916667;
                    this.frameY = 170;
                    this.charFrameX = 0;
                    this.charFrameY = 0;
                    this.image = this.nameDefender === "wraith" ? [model.images.wraith_01, 0, 0, this.frameX, this.frameY, this.x, this.y, 100, this.height] : [model.images.reaper_Man_01, 0, 0, this.frameX, this.frameY, this.x, this.y, 100, this.height];
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
                    if (this.nameDefender === "wraith") { // если защитник дального боя

                        if (this.shooting) { // если true но начинает увеличивать таймет и по определенным значениям добавлять снаряды

                            this.charFrameY = 1;
                            this.timer++;

                            if (this.timer % 66 === 0) { // как только сменится фрейм, то должно пройти 66 кадров чтобы анимация была на месте выстрела
                                model.projectiles.push(model.newProjectile(this.x + 55, this.y + 35, this.imgProjectil, this.powerAtack, model));
                            }

                        } else {

                            this.timer = 0;
                            this.charFrameY = 0;
                        }

                    } else { // если защитник ближнего боя
                        if (this.fight) {
                            this.charFrameY = 1;
                            this.timer++;
                        } else {
                            this.timer = 0;
                            this.charFrameY = 0;
                        }
                    }

                }

                // апгрейд защитника
                up() {
                    if (this.level === 1 && model.numberOfResources >= this.costUp) {
                        model.numberOfResources -= this.costUp;
                        this.nameDefender === "wraith" ? this.health += 15 : this.health += 30;
                        this.imgProjectil = model.images.spellsEffect_2;
                        this.powerAtack = 10;
                        this.powerCloseAtack = 0.15
                        this.level++;
                        this.image = this.nameDefender === "wraith" ? [model.images.wraith_02, 0, 0, this.frameX, this.frameY, this.x, this.y, 100, this.height] : [model.images.reaper_Man_02, 0, 0, this.frameX, this.frameY, this.x, this.y, 100, this.height];
                        return;
                    }
                    if (this.level === 2 && model.numberOfResources >= this.costUp) {
                        model.numberOfResources -= this.costUp;
                        this.nameDefender === "wraith" ? this.health += 25 : this.health += 60;
                        this.imgProjectil = model.images.spellsEffect_3;
                        this.powerAtack = 15;
                        this.powerCloseAtack = 0.2
                        this.level++;
                        this.image = this.nameDefender === "wraith" ? [model.images.wraith_03, 0, 0, this.frameX, this.frameY, this.x, this.y, 100, this.height] : [model.images.reaper_Man_03, 0, 0, this.frameX, this.frameY, this.x, this.y, 100, this.height];
                        return;
                    }
                }
            }
            return new Defender(x, y, model, name)
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

        // клик по канвасу
        click(clickPosition) {
            //------------------ новый защитник
            if (clickPosition.y > this.controlsBar.height && clickPosition.y < this.canvasHeight - this.cellSize && this.navGrid[3].choice === false) { // клик был на игровой сетке
                this.createDefender();

                // ---- клик по защитнику (апгрейд)
            } else if (clickPosition.x > 300 && clickPosition.x < 350 && this.navGrid[3].choice === false) { // выбран wraith
                if (clickPosition.y > 3 && clickPosition.y < 53) {
                    this.navGrid[0].choice = true; // меняю флаг выделения выбранного защитника
                    this.navGrid[1].choice = false;
                    this.choiceDefender = "wraith";
                }
                if (clickPosition.y > 56 && clickPosition.y < 106) { // выбран reaper_Man
                    this.navGrid[1].choice = true; // меняю флаг выделения выбранного защитника
                    this.navGrid[0].choice = false;
                    this.choiceDefender = "reaper_Man";
                }
                // ---------меню в игре
            } else if (clickPosition.x > 840 && clickPosition.x < 890) {

                // выбрана кнопка меню
                if (clickPosition.y > 3 && clickPosition.y < 53) {
                    this.navGrid[2].choice == true ? this.navGrid[2].choice = false : this.navGrid[2].choice = true; // меняю флаг выделения

                    // поставить на пузу
                    this.navGrid[3].choice = true; // меняю флаг выделения
                    cancelAnimationFrame(this.animateID); // остановить анимацию, игра на паузе
                    this.handleNavGrid(); // сетка навбара рисую еще раз что бы отрисовалась кнопка в активном состоянии
                    this.view.continueBlock(true) // раздизейблить кнопку "продолжить"
                    this.view.start(false); // спрятать игру и показать главное меню
                }

                // выбрана кнопка пауза
                if (clickPosition.y > 56 && clickPosition.y < 106) {
                    if (this.navGrid[3].choice === false) {

                        this.navGrid[3].choice = true; // меняю флаг выделения
                        cancelAnimationFrame(this.animateID); // остановить анимацию, игра на паузе
                        this.handleNavGrid(); // сетка навбара рисую еще раз что бы отрисовалась кнопка в активном состоянии
                    } else {

                        // debugger
                        this.navGrid[3].choice = false; // меняю флаг выделения
                        this.animateID = requestAnimationFrame(this.animate); // возобновить анимацию, игра не на паузе
                    }
                }
            }
        }

        createDefender() { // тут и стоимость защитника
            // debugger
            const gridPositionX = this.mouse.x - (this.mouse.x % this.cellSize) + this.cellGap; // беру позицию мышки и отмаю остаток от деления на ширину ячуйки (получу точное положение Х по сетке)
            const gridPositionY = this.mouse.y - (this.mouse.y % this.cellSize) + this.cellGap; // беру позицию мышки и отмаю остаток от деления на высоту ячуйки (получу точное положение У по сетке)
            if (gridPositionY < this.controlsBar.height || gridPositionY > this.canvasHeight - this.cellSize) return; // что бы нельзя было размещать на выше и ниже игрового поля

            for (let i = 0; i < this.defenders.length; i++) {
                if (this.defenders[i].x === gridPositionX && this.defenders[i].y === gridPositionY) {
                    this.defenders[i].up();
                    return; // если есть защитник с такими координатами, то произойдет его улучшение не позволит поставить еще одного наверх этого
                }
            }

            let defenderCost = 50; // Стоимость защитника

            if (this.numberOfResources >= defenderCost) { // если денег хватает то его добовляет в массив защитников 
                this.defenders.push(this.newDefender(gridPositionX, gridPositionY, this, this.choiceDefender));
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


        // убнуление параметров уровня (метод помогает методу nextLevelGame)
        zeroingLevel() {
            this.defenders.length = 0; // массив защитников
            this.dyingDefenders.length = 0; // массив умирающих защитников
            this.enemies.length = 0; // массив врагов
            this.dyingEnemies.length = 0; // массив умирающийх врагов
            this.enemyPosition.length = 0; // массив местоположения врагов Y
            this.enemyPositionX.length = 0; // массив столкновения врагов с защитниками X
            this.projectiles.length = 0; // массив снарядов для защитников
            this.resources.length = 0; // массив ресурсов
        }

        // следующий уровень 

        nextLevelGame() {
            this.levelGame++;
            if (this.levelGame < 10) {
                switch (this.levelGame) {
                    case 2:
                        // убнуление параметров уровня
                        this.zeroingLevel();
                        this.frame = 0;
                        this.winningScore = this.score + 150;
                        break;

                    case 3:
                        this.zeroingLevel();
                        this.frame = 0;
                        this.winningScore = this.score + 200;
                        break;

                    case 4:
                        this.zeroingLevel();
                        this.frame = 0;
                        this.winningScore = this.score + 250;
                        break;

                    case 5:
                        this.zeroingLevel();
                        this.frame = 0;
                        this.winningScore = this.score + 300;
                        break;

                    case 6:
                        this.zeroingLevel();
                        this.frame = 0;
                        this.winningScore = this.score + 350;
                        break;

                    case 7:
                        this.zeroingLevel();
                        this.frame = 0;
                        this.winningScore = this.score + 400;
                        break;

                    case 8:
                        this.zeroingLevel();
                        this.frame = 0;
                        this.winningScore = this.score + 450;
                        break;

                    case 9:
                        this.zeroingLevel();
                        this.frame = 0;
                        this.winningScore = this.score + 500;
                        break;

                    default:
                        break;
                }
            }
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

        // при ресайзе окна
        resize() {
            this.view.resize();
        }

        // переход между вкладками меню
        updateState() {
            // debugger
            // ---> проверка локал сторадж
            if (window.localStorage.getItem("Funny_Defenders_Undead") === null) {
                window.location.hash = "#getName";
                this.view.renderContent("getName"); // если раньше не посещал эту страницу, то при старте спрашиваю имя
            } else {
                let storageInfo = JSON.parse(window.localStorage.getItem("Funny_Defenders_Undead"));
                this.userName = storageInfo.name; // достать и сохранить имя игрока
                const hashPageName = window.location.hash.slice(1).toLowerCase(); // находит хэш и отрезает решетку
                this.view.renderContent(hashPageName);
            }
        }

        // старт игры (сброс параметров прошлой игры)

        start() {

            this.navGrid[2].choice = false; // сбрасываю флаг выделения меню в игре
            this.navGrid[3].choice = false; // сбрасываю флаг выделения пауза в игре
            this.view.continueBlock(false) // задизейблить кнопку "продолжить"

            cancelAnimationFrame(this.animateID);
            this.enemiesInterval = 600; // интервал появления врагов
            this.frame = 0; // кадры - как долго идет игра
            this.frameNextLevel = 0; // кадры - отсчет до запуска нового уровня
            this.numberOfResources = 300; // стартовое количество ресурсов игрока
            this.gameOver = false; // игрок проиграл
            this.levelComplete = false; // игрок прошёл уровень
            this.win = false; // игрок прошёл игру
            this.score = 0; // очки игрока
            this.levelGame = 1;
            this.winningScore = 100; // кол-во очков что бы враги перестали появляться и для перехода на след лвл


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

        // продолжить
        continue () {

            this.navGrid[2].choice = false;
            this.handleNavGrid(); // сетка навбара рисую еще раз что бы отрисовалась кнопка в  неактивном состоянии
            this.view.start(true);
        }

        // ------------------------------------------- СЕРВЕРНАЯ ЧАСТЬ ------------------------------------------


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
            // debugger
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
            this.updateState();
        }


        // ------------------------------------------------- ЗВУКИ ------------------------------------------------

        playAudioBack() {
            this.view.playAudioBack();
        }

        mutedAudioBack(stay) {
            this.view.mutedAudioBack(stay);
        }

        playAudioGame() {
            this.view.playAudioGame();
        }

        isMuted(stay) {
            this.view.isMuted(stay);
            this.view.closeSaund(stay);
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

                // старт
                if (target.className === 'new__game') {
                    // если еще не было клика по странице, то сначала ключаю саунд бэка, что пристарте он уже был и было выключать (без этого ошибка)
                    if (!this.audioBack) {
                        this.playAudioBack();
                        this.audioBack = true;
                    }

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

        }
    };
})();

document.addEventListener("DOMContentLoaded", myGame.init()); // инициализируем модуль как только DOM готов.