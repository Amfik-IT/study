// -------------------------------------------------------
// Div навигация:
const divNav = document.createElement('div');
divNav.classList.add('nav');
document.body.prepend(divNav);

// Кнопка "Старт":
const inputStart = document.createElement('input');
inputStart.type = 'button';
inputStart.value = 'Старт';
// inputStart.addEventListener('click', start); 
divNav.prepend(inputStart);

// Табло "Счёт":
const spanPoints = document.createElement('span');
spanPoints.classList.add('points');
let pointPlayerOne = 0;
let pointPlayerTwo = 0;
spanPoints.innerHTML = `${pointPlayerOne}:${pointPlayerTwo}`;
divNav.append(spanPoints);

// Div c canvas:
const divForCanvas = document.createElement('div');
divForCanvas.classList.add('pingPong');
divNav.after(divForCanvas);

// Canvas:
const Canvas = document.createElement('canvas');
Canvas.setAttribute('id', 'pingPong');
Canvas.setAttribute('width', '800');
Canvas.setAttribute('height', '500');
divForCanvas.append(Canvas);

// -------------------------------------------------------

window.onload = function () {
    // объект настроек
    const settings = {
        canvas: null,
        ctx: null,
        bufferCanvas: null,
        bufferCtx: null,
        LeftColor: null,
        RightColor: null,
        blankColor: "#282828",
        pattern: null,
        patternCtx: null,
    }

    // собираем данные об канвасе и создаем буферизирующий канвас
    settings.canvas = document.getElementById("pingPong");
    settings.ctx = settings.canvas.getContext("2d");
    settings.bufferCanvas = document.createElement("canvas");
    settings.bufferCtx = settings.bufferCanvas.getContext("2d");
    settings.bufferCtx.canvas.width = settings.ctx.canvas.width;
    settings.bufferCtx.canvas.height = settings.ctx.canvas.height;
    settings.pattern = document.createElement("canvas");
    settings.patternCtx = settings.pattern.getContext("2d");
    settings.patternCtx.canvas.width = settings.bufferCtx.canvas.width;
    settings.patternCtx.canvas.height = settings.bufferCtx.canvas.height;

    // Паттерн для очистки
    settings.patternCtx.fillStyle = settings.blankColor;
    settings.patternCtx.fillRect(0, 0, settings.pattern.width, settings.pattern.height);

        for (let i = 20; i < settings.patternCtx.canvas.width; i+=20) {
        for (let j = 20; j< settings.patternCtx.canvas.height; j+=20) {
            if (i % 100 == 0 && j % 100 == 0) {
                settings.patternCtx.save();
                settings.patternCtx.globalAlpha = 0.1;
                settings.patternCtx.beginPath();
                settings.patternCtx.strokeStyle = '#00000036';
                settings.patternCtx.lineWidth = 2;
                settings.patternCtx.moveTo(0, j);
                settings.patternCtx.lineTo(settings.patternCtx.canvas.width, j);
                settings.patternCtx.moveTo(i, 0);
                settings.patternCtx.lineTo(i, settings.patternCtx.canvas.height);
                settings.patternCtx.stroke();
                settings.patternCtx.restore();
                settings.patternCtx.resetTransform();
            } else {
                settings.patternCtx.save();
                settings.patternCtx.globalAlpha = 0.1;
                settings.patternCtx.beginPath();
                settings.patternCtx.strokeStyle = '#00000026';
                settings.patternCtx.lineWidth = 2;
                settings.patternCtx.moveTo(0, j);
                settings.patternCtx.lineTo(settings.patternCtx.canvas.width, j);
                settings.patternCtx.moveTo(i, 0);
                settings.patternCtx.lineTo(i, settings.patternCtx.canvas.height);
                settings.patternCtx.stroke();
                settings.patternCtx.restore();
                settings.patternCtx.resetTransform();
            }
        }
    }
    settings.patternCtx.save();
    settings.patternCtx.strokeStyle = 'black';
    settings.patternCtx.shadowColor = '#ec2247';
    settings.patternCtx.shadowOffsetX = 3;
    settings.patternCtx.shadowOffsetY = 0;
    settings.patternCtx.shadowBlur = 4;
    settings.patternCtx.lineWidth = 2;
    settings.patternCtx.beginPath();
    settings.patternCtx.moveTo(-2, 0);
    settings.patternCtx.lineTo(-2, settings.patternCtx.canvas.height);
    settings.patternCtx.stroke();
    settings.patternCtx.shadowOffsetX = -3;
    settings.patternCtx.moveTo(settings.patternCtx.canvas.width + 2, 0);
    settings.patternCtx.lineTo(settings.patternCtx.canvas.width + 2, settings.patternCtx.canvas.height);
    settings.patternCtx.stroke();
    settings.patternCtx.restore();

    // Cтартовыe параметры платформ
  
    const platformWidth = 10;
    const platformHeight = 100;
    let LeftStartPozX = 0;
    let LeftStartPozY = Canvas.offsetHeight/2 - 50;
    let RightStartPozX = Canvas.offsetWidth - 10;
    let RightStartPozY = Canvas.offsetHeight/2 - 50;
    
    // Массив параметров поля
    let area = {
        width: Canvas.offsetWidth,
        height: Canvas.offsetHeight,
    }
    // Массив параметров мяча
    let ball = {
        posX: area.width/2,
        posY: area.height/2,
        width: 30,
        height: 30,
        r: 15,
        speedX: 2.5,
        speedY: 0,
        accelX: 0.5,
        accelY: 0,
    }

    // Функция перерисовки canvas
    
    const drawMultiAnimations = function() {

        settings.bufferCtx.drawImage(settings.pattern, 0, 0, settings.bufferCanvas.width, settings.bufferCanvas.height);

        function blank() {
            settings.bufferCtx.drawImage(settings.pattern, 0, 0, settings.bufferCanvas.width, settings.bufferCanvas.height);
        }

        function gradients() {
            // debugger
            settings.LeftColor = settings.bufferCtx.createLinearGradient(LeftStartPozX, LeftStartPozY, platformWidth, LeftStartPozY + platformHeight);
            settings.LeftColor.addColorStop(0, "hsl(32,100%,78%)");
            settings.LeftColor.addColorStop(0.47, "hsl(32,100%,90%)");
            settings.LeftColor.addColorStop(0.53, "hsl(32,100%,78%)");
            settings.LeftColor.addColorStop(1, "hsl(32,100%,70%)");

            settings.RightColor = settings.bufferCtx.createLinearGradient(RightStartPozX, RightStartPozY, RightStartPozX + platformWidth, RightStartPozY + platformHeight);
            settings.RightColor.addColorStop(0, "hsl(110,100%,78%)");
            settings.RightColor.addColorStop(0.47, "hsl(110,100%,90%)");
            settings.RightColor.addColorStop(0.53, "hsl(110,100%,78%)");
            settings.RightColor.addColorStop(1, "hsl(110,100%,70%)");
        }

        function leftPlatformDraw() {
            // debugger
            settings.bufferCtx.fillStyle = settings.LeftColor;
            settings.bufferCtx.strokeStyle = 'rgb(191, 151, 104)';
            settings.bufferCtx.lineWidth = 2;
            settings.bufferCtx.strokeRect(LeftStartPozX, LeftStartPozY, platformWidth, platformHeight);
            settings.bufferCtx.fillRect(LeftStartPozX, LeftStartPozY, platformWidth, platformHeight);
        }
        function RightPlatformDraw() {
            // debugger
            settings.bufferCtx.fillStyle = settings.RightColor;
            settings.bufferCtx.strokeStyle = 'rgb(97, 238, 68)';
            settings.bufferCtx.lineWidth = 2;
            settings.bufferCtx.strokeRect(RightStartPozX, RightStartPozY, platformWidth, platformHeight);
            settings.bufferCtx.fillRect(RightStartPozX, RightStartPozY, platformWidth, platformHeight);
        }
        function BallDraw() {
            // debugger
            settings.bufferCtx.save();
            settings.bufferCtx.fillStyle = '#940e26';
            settings.bufferCtx.strokeStyle = '#ab102c';
            settings.bufferCtx.shadowColor = '#c71535';
            settings.bufferCtx.shadowOffsetX = 0;
            settings.bufferCtx.shadowOffsetY = 0;
            settings.bufferCtx.shadowBlur = 5;
            settings.bufferCtx.lineWidth = 1;
            settings.bufferCtx.beginPath();
            settings.bufferCtx.arc(ball.posX, ball.posY, ball.r, 0, 2*Math.PI);
            settings.bufferCtx.fill();
            settings.bufferCtx.stroke();
            settings.bufferCtx.restore();
        }

        function animate() {
            blank();
            gradients();
            leftPlatformDraw();
            RightPlatformDraw();
            BallDraw();
            settings.ctx.drawImage(settings.bufferCanvas, 0, 0, settings.canvas.width, settings.canvas.height);
            requestAnimationFrame(animate);
        }
        // animate();
        requestAnimationFrame(animate);
    }
    drawMultiAnimations();

    // -------------------------------------------------------
    // Движение платформ:
    let timerMoovePlayerOne;
    let timerMoovePlayerTwo;

    // Слушатель нажатия кнопок
    document.addEventListener("keydown", function(event) {
        if (event.repeat == false) {
            switch (event.key + " " + event.location) {
                case "Shift 1":
                    event.preventDefault(); // отмена действия по умолчанию
                    timerMoovePlayerOne = window.requestAnimationFrame(function() { // Запуск функции движения через интервал, чтобы выкинуть из стека задач (левая вверх)
                        moovePlayerOne(1);
                    });
                    break;
                case "Control 1":
                    event.preventDefault(); // --||--
                    timerMoovePlayerOne = window.requestAnimationFrame(function() { // --||--
                        moovePlayerOne(-1);
                    });
                    break;
                case "ArrowUp 0":
                    event.preventDefault(); // --||--
                    timerMoovePlayerTwo = window.requestAnimationFrame(function() { // --||--
                        moovePlayerTwo(1);
                    });
                    break;
                case "ArrowDown 0":
                    event.preventDefault(); // --||--
                    timerMoovePlayerTwo = window.requestAnimationFrame(function() { // --||--
                        moovePlayerTwo(-1);
                    });
                    break;
                case "  0":
                    event.preventDefault(); // Отмена действия по умолчанию у пробела (прокрутка страницы)
                    break;
            default:
                    break;
            }      
        }
    });

    // Слушатель отжатия кнопок
    document.addEventListener("keyup", function(event) {
        switch (event.key + " " + event.location) {
            case "Shift 1":
                moovePlayerOne(0); // Запуск функции движения с аргументом остановки движения
                break;
            case "Control 1":
                moovePlayerOne(0); // --||--
                break;
            case "ArrowUp 0":
                moovePlayerTwo(0); // --||--
                break;
            case "ArrowDown 0":
                moovePlayerTwo(0); // --||--
                break;   
            case "  0":
                start(); // Старт по нажатию на пробел
                break; 
            default:
                break;
        }
    });

    // Функция движения платформы PlayerOne:
    function moovePlayerOne(direction) {
        switch (direction) {
            case 1:
                LeftStartPozY = LeftStartPozY - 4; // Сдвинуть левую платформу вверх
                if (LeftStartPozY < 0) LeftStartPozY = 0; // Чтобы не вылезал за край
                window.cancelAnimationFrame(timerMoovePlayerOne); // Остановка интервала
                timerMoovePlayerOne = window.requestAnimationFrame(function() {
                    moovePlayerOne(1);
                });
                break;
            case -1:
                LeftStartPozY = LeftStartPozY + 4; // Сдвинуть левую платформу вниз
                let maxPositionY = Canvas.offsetHeight - platformHeight; // До куда может мах опуститься
                if (LeftStartPozY > maxPositionY) LeftStartPozY = maxPositionY; // Чтобы не вылезал за край
                window.cancelAnimationFrame(timerMoovePlayerOne); // Остановка интервала
                timerMoovePlayerOne = window.requestAnimationFrame(function() {
                    moovePlayerOne(-1);
                });
                break;
            case 0:
                window.cancelAnimationFrame(timerMoovePlayerOne); // Остановка интервала
                // divPlayerOne.style.top = divPlayerOne.offsetTop + "px"; // Назначение новых координат по Y
                break;
            default:
                break;
        };
    }

    // Функция движения платформы PlayerTwo:
    function moovePlayerTwo(direction) {
        switch (direction) {
            case 1:
                RightStartPozY = RightStartPozY - 4; // Сдвинуть правую платформу вверх
                if (RightStartPozY < 0) RightStartPozY = 0; // Чтобы не вылезал за край
                window.cancelAnimationFrame(timerMoovePlayerTwo); // Остановка интервала
                timerMoovePlayerTwo = window.requestAnimationFrame(function() {
                    moovePlayerTwo(1);
                });
                break;
            case -1:
                RightStartPozY = RightStartPozY + 4; // Сдвинуть правую платформу вниз
                let maxPositionY = area.height - platformHeight; // До куда может мах опуститься
                if (RightStartPozY > maxPositionY) RightStartPozY = maxPositionY; // Чтобы не вылезал за край
                window.cancelAnimationFrame(timerMoovePlayerTwo); // Остановка интервала
                timerMoovePlayerTwo = window.requestAnimationFrame(function() {
                    moovePlayerTwo(-1);
                });
                break;
            case 0:
                window.cancelAnimationFrame(timerMoovePlayerTwo); // Остановка интервала
                break;
            default:
            break;
        };
    }

    // -------------------------------------------------------
 
    // Запуск анимации движения мяча

    // Функция рандома рандома при старте и ударе о платформу 
    function random(param) {
        let randomX = Math.random();
        let randomY = Math.random();
        if (param === "win") {
            if (randomX < 0.5) ball.speedX = ball.speedX * -1; // Рандомное направление движения мяча по оси X
            if (randomY < 0.3) ball.speedY = 0.5; // Рандомный угол движения мяча по оси Y
            if (randomY >= 0.3 && randomY <= 0.6) ball.speedY = 1; // --||--
            if (randomY > 0.6) ball.speedY = 1.5; // --||--
            if (randomY < 0.5) ball.speedY = ball.speedY * -1; // Рандомное направление движения мяча по оси Y
        } else {
            if (ball.speedY > 0) {
                if (randomY < 0.3) ball.speedY = 0.5; // Рандомный угол движения мяча по оси Y
                if (randomY >= 0.3 && randomY <= 0.6) ball.speedY = 1; // --||--
                if (randomY > 0.6) ball.speedY = 1.5; // --||--
            } else {
                if (randomY < 0.3) ball.speedY = -0.5; // Рандомный угол движения мяча по оси Y
                if (randomY >= 0.3 && randomY <= -0.6) ball.speedY = 1; // --||--
                if (randomY > 0.6) ball.speedY = -1.5; // --||--
            }
        }
    }

    // Функция старта игры и отсчета времени
    let requestId;
    function start() {
        
        random("win");

        let count = 3;
        function countdown() { // Отсчет времени
            // debugger
            if (count > 0) {
                setTimeout(() => {
                    paramCount = count;
                    count--;
                }, 0);
                setTimeout(countdown, 1000);
            } else {
                paramCount = "";
                count = 3;
                requestId = requestAnimationFrame(mooveBall);
                return;
            }
        }
        countdown();
    }

    // Логика поведения мяча
    function mooveBall() {

        ball.posX += ball.speedX; // Смещение мяча по оси X

        // попадание в правую платформу (отбил)
        if (ball.posX + (ball.width/2) > area.width - platformWidth) {
            if (ball.posY + (ball.height/2) > RightStartPozY && ball.posY - (ball.height/2) < RightStartPozY + platformHeight) {
                if (ball.posY + (ball.height/2) < RightStartPozY + 6 || ball.posY - (ball.height/2) > RightStartPozY + platformHeight - 6) { // попало в уголок платформы, "+ 6" - увеличил площадь уголка платформы
                    ball.speedY = ball.speedY * -1; // инверсия направления
                    ball.speedX += ball.accelX; // увеличение скорости
                    ball.speedX = ball.speedX * -1; // инверсия направления
                    ball.posX = area.width - platformWidth - (ball.width/2);
                    random("hit"); // Рандомный угол движения мяча по оси Y, для более интересной логики
                } else { // попало не в уголок платформы
                    ball.speedX += ball.accelX; // увеличение скорости
                    ball.speedX = ball.speedX * -1; // инверсия направления
                    ball.posX = area.width - platformWidth - (ball.width/2);
                    random("hit"); // Рандомный угол движения мяча по оси Y, для более интересной логики
                }
            }
        }

        // попадание в правую стену (не отбил)
        if ( ball.posX + (ball.width/2) > area.width) {
            ball.posX = area.width - (ball.width/2);
            playerWin(1); // засчитать победу и начать новый раунд
            return;
        }

        
        // попадание в левую платформу (отбил)
        if ( ball.posX - (ball.width/2) < platformWidth ) {
            if (ball.posY + (ball.height/2) > LeftStartPozY && ball.posY - (ball.height/2) < LeftStartPozY + platformHeight) {
                if (ball.posY + (ball.height/2) < LeftStartPozY + 6 || ball.posY - (ball.height/2) > LeftStartPozY + platformHeight - 6) { // попало у уголок платформы, "+ 6" - увеличил площадь уголка платформы
                    ball.speedY = ball.speedY * -1; // инверсия направления
                    ball.speedX -= ball.accelX; // увеличение скорости
                    ball.speedX = ball.speedX * -1; // инверсия направления
                    ball.posX = platformWidth + (ball.width/2);
                    random("hit"); // Рандомный угол движения мяча по оси Y, для более интересной логики
                } else { // попало не в уголок платформы
                    ball.speedX -= ball.accelX; // увеличение скорости
                    ball.speedX = ball.speedX * -1; // инверсия направления
                    ball.posX = platformWidth + (ball.width/2);
                    random("hit"); // Рандомный угол движения мяча по оси Y, для более интересной логики
                }
            }
        } 
        // попадание в левую стену (не отбил)
        if (ball.posX - (ball.width/2) < 0) {
            ball.posX = ball.width/2;
            playerWin(2); // засчитать победу и начать новый раунд
            return;
        }

        ball.posY += ball.speedY; // Смещение мяча по оси Y

        // вылетел ли мяч ниже пола?
        if ( ball.posY + (ball.height/2) > area.height) {
            ball.speedY = ball.speedY * -1; // инверсия направления
            ball.posY = area.height - (ball.height/2);
        }
        // вылетел ли мяч выше потолка?
        if ( ball.posY - (ball.height/2) < 0 ) {
            ball.speedY = ball.speedY * -1; // инверсия направления
            ball.posY = (ball.height/2);
        }

        requestId = requestAnimationFrame(mooveBall); // Рекурсия анимации
    }

    // Сброс параметров мяча и учет побед + стоп анимаций
    function playerWin(player) {

        // Сброс параметров мяча
        ball.posX = area.width/2;
        ball.posY = area.height/2;
        ball.speedX = 2.5;
        cancelAnimationFrame(requestId); // Стоп анимации движения мяча

        // Учет побед и запуск игры до 5ти очков
        switch (player) {
            case 1: // выиграл игрок 1
                if (pointPlayerOne < 4) {
                    ++pointPlayerOne; // увеличить очки
                    spanPoints.innerHTML = `${pointPlayerOne}:${pointPlayerTwo}`; // записать очки
                    start(); // начать новый раунд
                } else {
                    pointPlayerOne = 0; // сбросить очки
                    pointPlayerTwo = 0; // сбросить очки
                    spanPoints.innerHTML = `${pointPlayerOne}:${pointPlayerTwo}`;  // записать очки
                }
                break;
            case 2: // выиграл игрок 2
                if (pointPlayerTwo < 4) {
                    ++pointPlayerTwo; // увеличить очки
                    spanPoints.innerHTML = `${pointPlayerOne}:${pointPlayerTwo}`; // записать очки
                    start(); // начать новый раунд
                } else {
                    pointPlayerOne = 0; // сбросить очки
                    pointPlayerTwo = 0; // сбросить очки
                    spanPoints.innerHTML = `${pointPlayerOne}:${pointPlayerTwo}`; // записать очки
                }
                break;
            default:
            break;
        };
    }
}