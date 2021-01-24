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
// Div поле:
const divPingPong = document.createElement('div');
divPingPong.classList.add('pingPong');
divPingPong.setAttribute('style', 'height: 500px; width: 800px');
divNav.after(divPingPong);

// Div-платформа игрок первый:
const divPlayerOne = document.createElement('div');
divPlayerOne.classList.add('player', 'playerOne');
divPlayerOne.setAttribute('style', 'height: 100px; width: 10px;');
divPingPong.append(divPlayerOne);

let startPositionOneX = (divPingPong.offsetHeight / 2) - (divPlayerOne.offsetHeight / 2) - 3; // стартовое расположение платформы 1
divPlayerOne.style.top = startPositionOneX + "px";

// Мяч:
const divBall = document.createElement('div');
divBall.classList.add('ball');
divBall.setAttribute('style', 'height: 30px; width: 30px');
divPingPong.append(divBall);

let startPositionBallY = (divPingPong.offsetHeight / 2) - (divBall.offsetHeight / 2) - 3; // стартовое расположение мяча
let startPositionBallX = (divPingPong.offsetWidth / 2) - (divBall.offsetWidth / 2) - 3; // (-3) - это поправка на бордер
divBall.style.top = startPositionBallY + 'px';
divBall.style.left = startPositionBallX + 'px';

// Div-платформа игрок второй:
const divPlayerTwo = document.createElement('div');
divPlayerTwo.classList.add('player', 'playerTwo');
divPlayerTwo.setAttribute('style', 'height: 100px; width: 10px');
divPingPong.append(divPlayerTwo);

let startPositionTwoX = (divPingPong.offsetHeight / 2) - (divPlayerOne.offsetHeight / 2) - 3; // стартовое расположение платформы 2
let startPositionTwoY = divPingPong.offsetWidth - (divPlayerTwo.offsetWidth) - 6;
divPlayerTwo.style.top = startPositionTwoX + 'px';
divPlayerTwo.style.left = startPositionTwoY + 'px';

// -------------------------------------------------------
// Движение платформ:
let timerMoovePlayerOne;
let timerMoovePlayerTwo;

// Слушатель нажатия кнопок
document.addEventListener("keydown", function(event) {
    switch (event.key + " " + event.location) {
        case "Shift 1":
            event.preventDefault(); // отмена действия по умолчанию
            clearInterval(timerMoovePlayerOne); // Т.к. кнопка залипает, то очищаю интервал
            timerMoovePlayerOne = setInterval(() => moovePlayerOne(1), 1); // Запуск функции движения через интервал, чтобы выкинуть из стека задач (левая вверх)
            break;
        case "Control 1":
            event.preventDefault(); // --||--
            clearInterval(timerMoovePlayerOne); // --||--
            timerMoovePlayerOne = setInterval(() => moovePlayerOne(-1), 1); // --||-- (левая вниз)
            break;
        case "ArrowUp 0":
            event.preventDefault(); // --||--
            clearInterval(timerMoovePlayerTwo); // --||--
            timerMoovePlayerTwo = setInterval(() => moovePlayerTwo(1), 1); // --||-- (правая вверх)
            break;
        case "ArrowDown 0":
            event.preventDefault(); // --||--
            clearInterval(timerMoovePlayerTwo); // --||--
            timerMoovePlayerTwo = setInterval(() => moovePlayerTwo(-1), 1); // --||-- (правая вниз)
            break;
        case "  0":
            event.preventDefault(); // Отмена действия по умолчанию у пробела (прокрутка страницы)
            break;
      default:
            break;
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
            divPlayerOne.style.top = --divPlayerOne.offsetTop + "px"; // Сдвинуть левую платформу вверх
            if (parseInt(divPlayerOne.style.top) < 0) divPlayerOne.style.top = 0 + "px"; // Чтобы не вылезал за край
            break;
        case -1:
            divPlayerOne.style.top = ++divPlayerOne.offsetTop + "px"; // Сдвинуть левую платформу вниз
            let maxPositionY = divPingPong.offsetHeight - divPlayerOne.offsetHeight - 6; // До куда может мах опуститься, 6 - бордер
            if (parseInt(divPlayerOne.style.top) > maxPositionY) divPlayerOne.style.top = maxPositionY + "px"; // Чтобы не вылезал за край
            break;
        case 0:
            clearInterval(timerMoovePlayerOne); // Остановка интервала
            divPlayerOne.style.top = divPlayerOne.offsetTop + "px"; // Назначение новых координат по Y
            break;
        default:
            break;
    };
}

// Функция движения платформы PlayerTwo:
function moovePlayerTwo(direction) {
    switch (direction) {
        case 1:
            divPlayerTwo.style.top = --divPlayerTwo.offsetTop + "px"; // Сдвинуть правую платформу вверх
            if (parseInt(divPlayerTwo.style.top) < 0) divPlayerTwo.style.top = 0 + "px"; // Чтобы не вылезал за край
            break;
        case -1:
            divPlayerTwo.style.top = ++divPlayerTwo.offsetTop + "px"; // Сдвинуть правую платформу вниз
            let maxPositionY = divPingPong.offsetHeight - divPlayerTwo.offsetHeight - 6; // До куда может мах опуститься, 6 - бордер
            if (parseInt(divPlayerTwo.style.top) > maxPositionY) divPlayerTwo.style.top = maxPositionY + "px"; // Чтобы не вылезал за край
            break;
        case 0:
            clearInterval(timerMoovePlayerTwo); // Остановка интервала
            divPlayerTwo.style.top = divPlayerTwo.offsetTop + "px"; // Назначение новых координат по Y
            break;
        default:
          break;
    };
}

// -------------------------------------------------------
// Движение мяча:

// Массив параметров мяча
let ball = {
    posX: startPositionBallX,
    posY: startPositionBallY,
    speedX: 2.5,
    speedY: 0,
    accelX: 0.5,
    accelY: 0,
    width: divBall.offsetWidth,
    height: divBall.offsetHeight,

    update : function() {
        divBall.style.top = Math.round(this.posY) + 'px';
        divBall.style.left = Math.round(this.posX) + 'px';
    }
}

// Массив параметров поля
let area = {
    width: divPingPong.offsetWidth,
    height: divPingPong.offsetHeight
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
                divBall.innerHTML = count;
                divBall.style.transform = 'scale(1.5)'; // Анимация отсчёта
                count--;
            }, 0);
            setTimeout(() => {divBall.style.transform = 'scale(1)'}, 500); // Анимация отсчёта
            setTimeout(countdown, 1000);
        } else {
            divBall.innerHTML = "";
            count = 3;
            divBall.style.animation = 'rotator linear .4s infinite'; // Анимация кручения мяча
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
    if (ball.posX + ball.width > area.width - 6 - divPlayerTwo.offsetWidth) { // "- 6" - бордер
        if (ball.posY + ball.height > divPlayerTwo.offsetTop && ball.posY < divPlayerTwo.offsetTop + divPlayerTwo.offsetHeight) {
            if (ball.posY + ball.height < divPlayerTwo.offsetTop + 6 || ball.posY > divPlayerTwo.offsetTop + divPlayerTwo.offsetHeight - 6) { // попало в уголок платформы, "+ 6" - увеличил площадь уголка платформы
                ball.speedY = ball.speedY * -1; // инверсия направления
                ball.speedX += ball.accelX; // увеличение скорости
                ball.speedX = ball.speedX * -1; // инверсия направления
                ball.posX = area.width - 6 - divPlayerTwo.offsetWidth - ball.width; // "- 6" - бордер
                random("hit"); // Рандомный угол движения мяча по оси Y, для более интересной логики
            } else { // попало не в уголок платформы
                ball.speedX += ball.accelX; // увеличение скорости
                ball.speedX = ball.speedX * -1; // инверсия направления
                ball.posX = area.width - 6 - divPlayerTwo.offsetWidth - ball.width; // "- 6" - бордер
                random("hit"); // Рандомный угол движения мяча по оси Y, для более интересной логики
            }
        }
    }

    // попадание в правую стену (не отбил)
    if ( ball.posX + ball.width > area.width - 6) { // "- 6" - бордер
        ball.posX = area.width - 6 - ball.width;
        playerWin(1); // засчитать победу и начать новый раунд
        return;
    }

    
    // попадание в левую платформу (отбил)
    if ( ball.posX < divPlayerOne.offsetWidth ) {
        if (ball.posY + ball.height > divPlayerOne.offsetTop && ball.posY < divPlayerOne.offsetTop + divPlayerOne.offsetHeight) {
            if (ball.posY + ball.height < divPlayerOne.offsetTop + 6 || ball.posY > divPlayerOne.offsetTop + divPlayerOne.offsetHeight - 6) { // попало у уголок платформы, "+ 6" - увеличил площадь уголка платформы
                ball.speedY = ball.speedY * -1; // инверсия направления
                ball.speedX -= ball.accelX; // увеличение скорости
                ball.speedX = ball.speedX * -1; // инверсия направления
                ball.posX = 10;
                random("hit"); // Рандомный угол движения мяча по оси Y, для более интересной логики
            } else { // попало не в уголок платформы, "+ 6" - увеличил площадь уголка платформы
                ball.speedX -= ball.accelX; // увеличение скорости
                ball.speedX = ball.speedX * -1; // инверсия направления
                ball.posX = 10;
                random("hit"); // Рандомный угол движения мяча по оси Y, для более интересной логики
            }
        }
    } 
    // попадание в левую стену (не отбил)
    if (ball.posX < 0) {
        ball.posX = 0;
        playerWin(2); // засчитать победу и начать новый раунд
        return;
    }

    ball.posY += ball.speedY; // Смещение мяча по оси Y

    // вылетел ли мяч ниже пола?
    if ( ball.posY + ball.height > area.height - 6) { // "- 6" - бордер
        ball.speedY = ball.speedY * -1; // инверсия направления
        ball.posY = area.height - ball.height - 6; // "- 6" - бордер
    }
    // вылетел ли мяч выше потолка?
    if ( ball.posY < 0 ) {
        ball.speedY = ball.speedY * -1; // инверсия направления
        ball.posY = 0;
    }

    ball.update(); // Применение новых параметров
    requestId = requestAnimationFrame(mooveBall); // Рекурсия анимации
}

// Сброс параметров мяча и учет побед + стоп анимаций
function playerWin(player) {

    // Сброс параметров мяча
    ball.posX = startPositionBallX;
    ball.posY = startPositionBallY;
    ball.speedX = 2.5;
    ball.update();
    divBall.style.animation = 'none'; // Стоп анимации кручения мяча
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