// Расчет размеров Div для анимации----------------------------
// Div получения инфы
const divGetInfo = document.getElementById('getInfo');
const startXGetInfo = -divGetInfo.offsetWidth - 20; // старт X за правым краем боди, -20 - это тень
const startYGetInfo = window.innerHeight/2 - divGetInfo.offsetHeight/2; // старт Y по середине боди
const finishXGetInfo = window.innerWidth/2 - divGetInfo.offsetWidth/2; // до куда сработает анимация по X
divGetInfo.style.top = startYGetInfo + 'px';
divGetInfo.style.left = startXGetInfo + 'px';
// div с отсчетом
const divBirthday = document.getElementById('birthday');
const startXBirthday = window.innerWidth + 20; // старт X за левым краем боди, +20 - это тень
const startYBirthday = window.innerHeight/2 - divBirthday.offsetHeight/2; // старт Y по середине боди
const finishXBirthday = window.innerWidth/2 - divBirthday.offsetWidth/2; // до куда сработает анимация по X
divBirthday.style.top = startYBirthday + 'px';
divBirthday.style.left = startXBirthday + 'px';

// Функции анимации: ---------------------------------------------------
function animate({timing, draw, duration}) {

    let start = performance.now();
  
    requestAnimationFrame(function animate(time) {
      // timeFraction изменяется от 0 до 1
      let timeFraction = (time - start) / duration;
      if (timeFraction > 1) timeFraction = 1;
  
      // вычисление текущего состояния анимации
      let progress = timing(timeFraction);
  
      draw(progress); // отрисовать её
  
      if (timeFraction < 1) {
        requestAnimationFrame(animate);
      }
  
    });
}
// функция инверсии тайминга
function makeEaseOut(timing) { 
    return function(timeFraction) {
      return 1 - timing(1 - timeFraction);
    }
}
// функция расчета времени
function bounce(timeFraction) { 
for (let a = 0, b = 1, result; 1; a += b, b /= 2) {
    if (timeFraction >= (7 - 4 * a) / 11) {
    return -Math.pow((11 - 6 * a - 11 * timeFraction) / 4, 2) + Math.pow(b, 2)
    }
  }
}
// Показать Div Info
function showDivInfo() { 
    let to = 360;
    let from = 0;
    animate({
      duration: 2000,
      timing: makeEaseOut(bounce),
      draw(progress) {
        divGetInfo.style.left = finishXGetInfo * (-1 + progress*2) + 'px'
        divGetInfo.style.transform = `rotate(${(to - from) * (-1 + progress*2)}deg)`
      }
    });
};
// Скрыть Div Info
function hideDivInfo() {
    let to = 0;
    let from = 360;
animate({
    duration: 2000,
    timing: makeEaseOut(bounce),
    draw(progress) {
        divGetInfo.style.left = startXGetInfo * (-1 + progress*2) + 'px'
        divGetInfo.style.transform = `rotate(${(to - from) * (-1 + progress*2)}deg)`
    }
    });
};
// Показать Div Birthday
function showDivBirthday() {
    let to = 360;
    let from = 0;
    animate({
      duration: 2000,
      timing: makeEaseOut(bounce),
      draw(progress) {
        divBirthday.style.left = finishXBirthday * (3 - progress*2) + 'px'
        divBirthday.style.transform = `rotate(${(to - from) * (3 - progress*2)}deg)`
      }
    });
};
// Скрыть Div Birthday и очистить инфу из localStorage. Показать div получения инфы
function clearBirthday() {
  let to = 360;
  let from = 0;
  animate({
    duration: 2000,
    timing: makeEaseOut(bounce),
    draw(progress) {
      divBirthday.style.left = finishXBirthday * (1 + progress*2) + 'px'
      divBirthday.style.transform = `rotate(${(to - from) * (1 + progress*2)}deg)`
    }
  });
  showDivInfo();
  window.localStorage.removeItem("visitInfo");
};
// Получение и сохранение данных----------------------------------------
// Массив для наддных
let user = {};
// Заполнение массива и сохранение в localStorage
function saveInfo() {
    debugger
    let firstname = document.getElementById('firstname').value;
    let year = document.getElementById('year').value
    let month = document.getElementById('month').value
    let day = document.getElementById('day').value
    user.name = firstname;
    user.year = year;
    user.month = month;
    user.day = day;
    window.localStorage.setItem("visitInfo", JSON.stringify(user));
    hideDivInfo();
    countdownBirthday();
}

// Проверка посещения этой страницы и инфы о ней------------------------------
if (window.localStorage.getItem("visitInfo") === null) {
    showDivInfo();
} else {
    countdownBirthday();
}


// Функция анимации div с отсчетом-------------------------------------------

function countdownBirthday() {
  let savedUser = JSON.parse(window.localStorage.getItem("visitInfo"));// Забираем инфу из localStorage
  let h3 = document.getElementById('hello');
  h3.innerHTML = `Здравствуйте ${savedUser.name} =)`;
  let divBirthdayInfo = document.getElementById('birthdayInfo');
  
  // Функция отсчета дней до ДР и обновления отсчета
  function timeCountdown() {
    // debugger
    let dateNow = new Date(); // Дата сегодня
    let dayNow = dateNow.getDate(); // День сегодня
    let DayOfMonth = new Date (dateNow.getFullYear(), dateNow.getMonth() + 1, 0).getDate(); // Сколько дней в этом месяце
    let birthday = new Date(dateNow.getFullYear(), savedUser.month - 1, savedUser.day, 0, 0, 0); // Дата ДР
    let time = `<p>До Дня Рождения осталось:</p>`;

    if (birthday >= dateNow) { // Если ДР еще не прошел в этом году
      // debugger
      let date = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate());
      let month = null;

      for (let i = 0; date < birthday; i++){ // Сколько мес до ДР
        month = i;
        date = new Date(dateNow.getFullYear(), date.getMonth() + 1, dateNow.getDate());
      }

      if (month > 0) { // если до ДР больше месяца
        if (birthday.getDate() > dayNow) { // Если дата дня ДР больше сегодняшней даты 
          day = (+savedUser.day) - dayNow - 1; // -1 т.к. этот день уже не полный, остаток показывают часы и минуты
        } else { // Если дата дня ДР меньше сегодняшней даты 
          day = DayOfMonth - dayNow + (+savedUser.day) - 1; // Остаток дней в этом мес + дни от начала мес. до дня ДР в месяце ДР
        }
      } else { // если до ДР меньше месяца
        if (birthday.getMonth() == dateNow.getMonth()){ // если ДР в этом месяце
          day = (+savedUser.day) - dayNow - 1; // -1 т.к. этот день уже не полный, остаток показывают часы и минуты
        } else day = DayOfMonth - dayNow + (+savedUser.day) - 1; // если ДР в след. месяце, но число меньше чем сегодня (остаток от мес.)
      }

      hours = 24 - dateNow.getHours() - 1; // Сутки минус прошедшие часы сегодняшнего дня; -1 т.к. час не полный, остаток показ. минуты
      minutes = 60 - dateNow.getMinutes() - 1; // Час минус прошедшие минуты теперяшнего часа; -1 т.к. мин. не полная, остаток показ. сек
      seconds = 60 - dateNow.getSeconds(); // Минута минус прошедшие секунды теперяшней минуты
      time += `
      <p><span>${month}</span> мес. 
      <span>${day}</span> дн.
      <span>${hours}</span> ч.
      <span>${minutes}</span> мин.
      <span>${seconds}</span> сек.</p>`
      divBirthdayInfo.innerHTML = time;

    } else { // Если ДР уже прошел в этом году
      month = 12 - dateNow.getMonth() - 1; // Год минус прошедшие месяцы 
      day = DayOfMonth - dayNow + (+savedUser.day) - 1;
      hours = 24 - dateNow.getHours() - 1;
      minutes = 60 - dateNow.getMinutes() - 1;
      seconds = 60 - dateNow.getSeconds();
      time += `
      <p><span>${month}</span> мес. 
      <span>${day}</span> дн.
      <span>${hours}</span> ч.
      <span>${minutes}</span> мин.
      <span>${seconds}</span> сек.</p>`
      divBirthdayInfo.innerHTML = time;
    }
    requestAnimationFrame(timeCountdown)
  }
  requestAnimationFrame(timeCountdown);
  showDivBirthday();
}