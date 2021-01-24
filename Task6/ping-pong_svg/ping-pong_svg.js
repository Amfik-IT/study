// -------------------------------------------------------
// Div навигация:
const divNav = document.createElement('div');
divNav.classList.add('nav');
document.body.prepend(divNav);

// Кнопка "Старт":
const inputStart = document.createElement('input');
inputStart.type = 'button';
inputStart.value = 'Старт';
inputStart.addEventListener('click', start);
divNav.prepend(inputStart);

// Табло "Счёт":
const spanPoints = document.createElement('span');
spanPoints.classList.add('points');
let pointPlayerOne = 0;
let pointPlayerTwo = 0;
spanPoints.innerHTML = `${pointPlayerOne}:${pointPlayerTwo}`;
divNav.append(spanPoints);

// -------------------------------------------------------
// Построение эмуляции игрового поля SVG:

const svgNS = "http://www.w3.org/2000/svg";


const svg = document.getElementById("svg");
svg.classList.add('pingPong');
svg.setAttribute("width", 800);
svg.setAttribute("height", 500)

const w = parseFloat(svg.getAttributeNS(null, "width"));
const h = parseFloat(svg.getAttributeNS(null, "height"));

// платформа игрок первый:
let platformLeft = document.createElementNS(svgNS, "rect");
const wPLeft = 10;
const hPLeft = 100;
let startPLeftY = h/2 - hPLeft/2;
platformLeft.setAttributeNS(null,"width", wPLeft);
platformLeft.setAttributeNS(null,"height", hPLeft);
platformLeft.setAttributeNS(null,"x", 0);
platformLeft.setAttributeNS(null,"y", startPLeftY);
platformLeft.setAttributeNS(null,"stroke", "#bf9768");
platformLeft.setAttributeNS(null,"fill", 'url(#PLeft)');
platformLeft.classList.add('player', 'playerOne');
svg.appendChild(platformLeft);

// Мяч:
let svgBall = document.createElementNS(svgNS, "circle");
svgBall.setAttributeNS(null,"cx", w/2);
svgBall.setAttributeNS(null,"cy", h/2);
svgBall.setAttributeNS(null,"r", 15);
svgBall.setAttributeNS(null,"fill", 'url(#imageBall)');
svgBall.setAttributeNS(null,"filter", "url(#shadowBall)");
svgBall.classList.add("svgBall");
svg.appendChild(svgBall);
// Отсчет
let countdownTxt = document.createElementNS(svgNS, "text");
countdownTxt.setAttributeNS(null,"id", "countdownTxt");
countdownTxt.setAttributeNS(null,"x", Math.round(w/2 - 8));
countdownTxt.setAttributeNS(null,"y", Math.round(h/2 + 6));
svg.appendChild(countdownTxt);

// платформа игрок первый:
let platformRight = document.createElementNS(svgNS, "rect");
const wPRight = 10;
const hPRight = 100;
let startPRightY = h/2 - hPRight/2;
platformRight.setAttributeNS(null,"width", wPRight);
platformRight.setAttributeNS(null,"height", hPRight);
platformRight.setAttributeNS(null,"x", w - wPRight);
platformRight.setAttributeNS(null,"y", startPRightY);
platformRight.setAttributeNS(null,"stroke", "#61ee44");
platformRight.setAttributeNS(null,"fill", 'url(#PRight)');
platformRight.classList.add('player', 'playerTwo');
svg.appendChild(platformRight);



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
    // debugger
    switch (direction) {
        case 1:
            startPLeftY = startPLeftY - 4; // Сдвинуть левую платформу вверх
            if (startPLeftY < 0) startPLeftY = 0; // Чтобы не вылезал за край
            platformLeft.setAttributeNS(null,"y", startPLeftY);
            window.cancelAnimationFrame(timerMoovePlayerOne); // Остановка интервала
            timerMoovePlayerOne = window.requestAnimationFrame(function() {
                moovePlayerOne(1);
            });
            break;
        case -1:
            startPLeftY = startPLeftY + 4; // Сдвинуть левую платформу вверх
            if (startPLeftY > h - hPLeft) startPLeftY = h - hPLeft; // Чтобы не вылезал за край
            platformLeft.setAttributeNS(null,"y", startPLeftY);
            window.cancelAnimationFrame(timerMoovePlayerOne); // Остановка интервала
            timerMoovePlayerOne = window.requestAnimationFrame(function() {
                moovePlayerOne(-1);
            });
            break;
        case 0:
            window.cancelAnimationFrame(timerMoovePlayerOne); // Остановка интервала
            break;
        default:
            break;
    };
}

// Функция движения платформы PlayerTwo:
function moovePlayerTwo(direction) {
    switch (direction) {
        case 1:
            startPRightY = startPRightY - 4; // Сдвинуть правую платформу вверх
            if (startPRightY < 0) startPRightY = 0; // Чтобы не вылезал за край
            platformRight.setAttributeNS(null,"y", startPRightY);
            window.cancelAnimationFrame(timerMoovePlayerTwo); // Остановка интервала
            timerMoovePlayerTwo = window.requestAnimationFrame(function() {
                moovePlayerTwo(1);
            });
            break;
        case -1:
            startPRightY = startPRightY + 4; // Сдвинуть правую платформу вверх
            if (startPRightY > h - hPRight) startPRightY = h - hPRight; // Чтобы не вылезал за край
            platformRight.setAttributeNS(null,"y", startPRightY);
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
// Движение мяча:

// Массив параметров мяча
let ball = {
    posX: w/2,
    posY: h/2,
    speedX: 2.5,
    speedY: 0,
    accelX: 0.5,
    accelY: 0,
    width: svgBall.getAttributeNS(null, "r") * 2,
    height: svgBall.getAttributeNS(null, "r") * 2,

    update : function() {
        svgBall.setAttributeNS(null,"cx", this.posX);
        svgBall.setAttributeNS(null,"cy", this.posY);
    }
}

// Массив параметров поля
let area = {
    width: w,
    height: h
}

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
                countdownTxt.innerHTML = count;
                count--;
            }, 0);
            setTimeout(countdown, 1000);
        } else {
            countdownTxt.innerHTML = "";
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
    if (ball.posX + (ball.width/2) > area.width - wPRight) {
        if (ball.posY + (ball.height/2) > startPRightY && ball.posY - (ball.height/2) < startPRightY + hPRight) {
            if (ball.posY + (ball.height/2) < startPRightY + 6 || ball.posY - (ball.height/2) > startPRightY + hPRight - 6) { // попало в уголок платформы, "+ 6" - увеличил площадь уголка платформы
                ball.speedY = ball.speedY * -1; // инверсия направления
                ball.speedX += ball.accelX; // увеличение скорости
                ball.speedX = ball.speedX * -1; // инверсия направления
                ball.posX = area.width - wPRight - (ball.width/2);
                random("hit"); // Рандомный угол движения мяча по оси Y, для более интересной логики
            } else { // попало не в уголок платформы
                ball.speedX += ball.accelX; // увеличение скорости
                ball.speedX = ball.speedX * -1; // инверсия направления
                ball.posX = area.width - wPRight - (ball.width/2);
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
    if ( ball.posX - (ball.width/2) < wPLeft ) {
        if (ball.posY + (ball.height/2) > startPLeftY && ball.posY - (ball.height/2) < startPLeftY + hPLeft) {
            if (ball.posY + (ball.height/2) < startPLeftY + 6 || ball.posY - (ball.height/2) > startPLeftY + hPLeft - 6) { // попало у уголок платформы, "+ 6" - увеличил площадь уголка платформы
                ball.speedY = ball.speedY * -1; // инверсия направления
                ball.speedX -= ball.accelX; // увеличение скорости
                ball.speedX = ball.speedX * -1; // инверсия направления
                ball.posX = wPLeft + (ball.width/2);
                random("hit"); // Рандомный угол движения мяча по оси Y, для более интересной логики
            } else { // попало не в уголок платформы
                ball.speedX -= ball.accelX; // увеличение скорости
                ball.speedX = ball.speedX * -1; // инверсия направления
                ball.posX = wPLeft + (ball.width/2);
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

    ball.update(); // Применение новых параметров
    requestId = requestAnimationFrame(mooveBall); // Рекурсия анимации
}

// Сброс параметров мяча и учет побед + стоп анимаций
function playerWin(player) {

    // Сброс параметров мяча
    ball.posX = w/2;
    ball.posY = h/2;
    ball.speedX = 2.5;
    ball.update();
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

// Анимация верчения мяча
// let imgBall = document.getElementById('rotateBall');
// imgBall.setAttribute("transform-origin", '15px 15px');
// let angle = 0;

// function rotator() {
//     if (angle !== 360) {
//         angle = angle + 6;
//         imgBall.setAttribute('transform', `rotate(${angle})`);
//     } else angle = 0;
//     window.requestAnimationFrame(rotator);
// }
// window.requestAnimationFrame(rotator);