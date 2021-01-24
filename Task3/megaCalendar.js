let create;

function calendar() {
    // debugger
    let year = +prompt ('Введите год', '2021');
    let month = +prompt ('Введите номер месяця', '1') - 1;
    let date = new Date (year, month);

    createCalendar();

    function createCalendar() {
        // Название месяца:
        let arrMonth = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

        // Нумерация дней от 1 до 7:
        let dayOfWeek = date.getDay();
        if (dayOfWeek == 0) {
            dayOfWeek = 7
        };

        // Получить место вставки каледаря и создаение шапки таблицы:
        let colendarElem = document.getElementById('calendar');

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
                    tabl += `<td class="redDay">${count}</td>`;
                    count++;
                } else {
                tabl += `<td>${count}</td>`;
                count++;
                };
            } else {
                if (count == todayDay) {
                    tabl += `<td class="redDay">${count}</td><tr>`;
                    count++;
                } else {
                    tabl += `<td>${count}</td><tr>`;
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

        colendarElem.innerHTML = tabl;

        // Перемотка календаря:
        let beforeYear = document.querySelector(".beforeYear");
        beforeYear.onclick = () => {
            --year;
            date = new Date (year, month);
            createCalendar();
        };

        let beforeMonth = document.querySelector(".beforeMonth");
        beforeMonth.onclick = () => {
            if (month == 0) {
                --year;
                month = 11;
                date = new Date (year, month);
                createCalendar();
            } else {
                --month;
                date = new Date (year, month);
                createCalendar();
            };
        };

        let afterYear = document.querySelector(".afterYear");
        afterYear.onclick = () => {
            ++year;
            date = new Date (year, month);
            createCalendar();
        };

        let afterMonth = document.querySelector(".afterMonth");
        afterMonth.onclick = () => {
            if (month == 11) {
                ++year;
                month = 0;
                date = new Date (year, month);
                createCalendar();
            } else {
                ++month;
                date = new Date (year, month);
                createCalendar();
            };
        };

    };

        create = createCalendar();
}