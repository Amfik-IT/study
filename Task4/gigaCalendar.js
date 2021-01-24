
let year = document.getElementById('year');
let month = document.getElementById('month')
let arrYear = [];
let arrMonth = ['Выбрать месяц', 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь',  'Декабрь'];
for (let i = 1979; i < 2031; i++) {
    if (i == 1979) {
        arrYear.push('Выбрать год');
    } else arrYear.push(i);
};
// Заполнение селекта "Год":
arrYear.forEach(function(item, index) {
    if (index == 0) {
        let option = document.createElement('option');
        option.setAttribute('selected', 'selected');
        option.setAttribute('disabled', 'disabled');
        option.innerHTML = item;
        year.append(option);
    } else {
        let option = document.createElement('option');
        option.innerHTML = item;
        year.append(option);
    };
});
// Заполнение селекта "Месяц":
arrMonth.forEach(function(item, index) {
    if (index == 0) {
        let option = document.createElement('option');
        option.setAttribute('selected', 'selected');
        option.setAttribute('disabled', 'disabled');
        option.innerHTML = item;
        month.append(option);
    } else {
        let option = document.createElement('option');
        option.innerHTML = item;
        month.append(option);
    };
});

// Кнопка "Удалить":
let inputDel = document.getElementById('del');
inputDel.disabled = true;
inputDel.className = "disabled";
inputDel.onclick = () => {
    let main = document.querySelector('main');
    if (main.firstElementChild !== null) { // Удаляет первый елемент, если он есть
        main.firstElementChild.remove();
        if (main.firstElementChild == null){ // Если элементов не осталось, то блокирует кнопку del
            inputDel.disabled = true; // Блокирует кнопку
            inputDel.className = "disabled"; // Вешает класс со стилями для заблоченной кнопки
        };
    };
}

// Кнопка "Создать":
let inputAdd = document.getElementById('add');
inputAdd.disabled = true;
inputAdd.className = "disabled";
inputAdd.onclick = () => { // Клик по кнопке "Создать":
    // debugger
    let selectedYear = +year.selectedOptions[0].innerHTML; // Смотрик какое значение года выбрали
    let selectedMonth = month.selectedIndex - 1; // Смотрик какое значение месяца выбрали
    let div = document.createElement('div'); // Блок для календаря
    div.innerHTML = createCalendar(selectedYear, selectedMonth); // Вставить в блок результат выполнения функции по созданию таблицы календаря
    let main = document.querySelector('main'); // Место вставки блока
    main.append(div); // Вставка блока
    let inputDel = document.getElementById('del'); // Найти кнопку "Удалить"
    inputDel.disabled = false; // Разблокировать кнопку "Удалить"
    inputDel.className = "undisabled"; // Применить стиль для кнопки "Удалить"

    div.addEventListener("click", clickTabl); // Слушает где в таблице календаря был клик и принимает решение
        function clickTabl(event) {
            let target = event.target; // Элемент по которому кликнули в таблице
            switch (target.className) {
                case "beforeYear":

                    --selectedYear;
                    div.innerHTML = createCalendar(selectedYear, selectedMonth); // Меняет таблицу календаря в этом блоке
                    break;

                case "beforeMonth":

                    if (selectedMonth == 0) {
                        --selectedYear;
                        selectedMonth = 11;
                        div.innerHTML = createCalendar(selectedYear, selectedMonth); // --||--
                        break;
                    } else {
                        --selectedMonth;
                        div.innerHTML = createCalendar(selectedYear, selectedMonth); // --||--
                        break;
                    };

                case "afterYear":

                    ++selectedYear;
                    div.innerHTML = createCalendar(selectedYear, selectedMonth); // --||--
                    break;

                case "afterMonth":

                    if (selectedMonth == 11) {
                        ++selectedYear;
                        selectedMonth = 0;
                        div.innerHTML = createCalendar(selectedYear, selectedMonth); // --||--
                        break;
                    } else {
                        ++selectedMonth;
                        div.innerHTML = createCalendar(selectedYear, selectedMonth); // --||--
                        break;
                    };
                    
                case "hoverDay":
        
                    let today = new Date;
                    let todayDay = today.getDate();
                    let clickDay = div.getElementsByClassName("clickDay");
                    if ((clickDay.length != 0) && (+clickDay[0].innerHTML == todayDay)) { // Есть ли у кликнутого дня атрибуты?
                        clickDay[0].className = "redDay hoverDay"; // добавить стиль 
                    } else if (clickDay.length != 0) {
                        clickDay[0].className = "hoverDay"; // или добавить стиль
                    }
                    target.classList.add('clickDay');
                    break;
                
                case "redDay hoverDay":
                    
                    let clickDay2 = div.getElementsByClassName("clickDay");
                    if (clickDay2.length != 0) {
                        clickDay2[0].className = "hoverDay";
                    };
                    target.classList.add('clickDay');
                    break;
            };
            
        };
}

// Проверка на defaultSelected:
let nav = document.querySelector('nav'); // Слушает клики в в наве и если выбран не дефолт во всех случаях, то открыть кнопку "Создать"
nav.addEventListener("click", clickNav);
function clickNav (event) {
    if ((year.selectedOptions[0].defaultSelected == false) && (month.selectedOptions[0].defaultSelected == false)) {
        inputAdd.disabled = false; // Разблокировать кнопку "Создать"
        inputAdd.className = "undisabled"; // Применить стили к кнопке "Создать"
    };
}

// Конструктор календаря:
function createCalendar(year, month) {
        // debugger
        let date = new Date (year, month);

        // Название месяца:
        let arrMonth = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
        
        // Нумерация дней от 1 до 7:
        let dayOfWeek = date.getDay();
        if (dayOfWeek == 0) {
            dayOfWeek = 7
        };

        // Создаение шапки таблицы:

        let tablCaption = `<table><tr><th class="beforeYear">&#5176;&#5176;</th><th class="beforeMonth">&#5176;</th><th colspan=3>${arrMonth[month]} ${year} года</th><th class="afterMonth">&#5171;</th><th class="afterYear">&#5171;&#5171;</th></tr>`;

        let tablHead = `<tr><th>ПН</th><th>ВТ</th><th>СР</th><th>ЧТ</th><th>ПТ</th><th>СБ</th><th>ВС</th></tr>`;

        let tabl = tablCaption + tablHead;

        // Пустые клетки в начале:
        for (let i = 0; i < dayOfWeek - 1; i++) {
            tabl += '<td></td>'
        };

        // Заполнение таблицы:
        let DayOfMonth = new Date (year, month +1, 0);
        let monthLength = DayOfMonth.getDate();
        let count  = 1;
        let today = new Date;
        let todayDay = today.getDate();

        for (let i = dayOfWeek; i <= monthLength + dayOfWeek - 1; i++) {
            if (i % 7 !== 0) {
                if (count == todayDay) {
                    tabl += `<td class="redDay hoverDay">${count}</td>`;
                    count++;
                } else {
                tabl += `<td class="hoverDay">${count}</td>`;
                count++;
                };
            } else {
                if (count == todayDay) {
                    tabl += `<td class="redDay hoverDay">${count}</td><tr>`;
                    count++;
                } else {
                    tabl += `<td class="hoverDay">${count}</td><tr>`;
                    count++;
                };
            };
        };

        // Пустые клетки в конце:
        let lastDayOfMonth = DayOfMonth.getDay();
        if (lastDayOfMonth == 0) {
            lastDayOfMonth = 7
        };
        for (let i = 0; i > lastDayOfMonth - 7; i--) {
            tabl += '<td></td>';
        };
        
        return tabl;

};