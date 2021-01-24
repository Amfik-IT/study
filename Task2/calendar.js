
function calendar() {
    // debugger
    let year = +prompt ('Введите год', '2020');
    let month = +prompt ('Введите номер месяця', '12') - 1;
    let date = new Date (year, month);
    
    // Название месяца:
    let monthForCaption;
    switch (month) {
        case 0:
            monthForCaption = 'Январь';
            break;
        case 1:
            monthForCaption = 'Февраль';
            break;
        case 2:
            monthForCaption = 'Март';
            break;
        case 3:
            monthForCaption = 'Апрель';
            break;
        case 4:
            monthForCaption = 'Май';
            break;
        case 5:
            monthForCaption = 'Июнь';
            break;
        case 6:
            monthForCaption = 'Июль';
            break;
        case 7:
            monthForCaption = 'Август';
            break;
        case 8:
            monthForCaption = 'Сентябрь';
            break;
        case 9:
            monthForCaption = 'Октябрь';
            break;
        case 10:
            monthForCaption = 'Ноябрь';
            break;
        case 11:
            monthForCaption = 'Декабрь';
            break;
    }

    // Нумерация дней от 1 до 7:
    let dayOfWeek = date.getDay();
    if (dayOfWeek == 0) {
        dayOfWeek = 7
    };

    // Получить место вставки каледаря и создаение шапки таблицы:
    let colendarElem = document.getElementById('calendar');
    let tabl = `<table><caption>${monthForCaption} ${year} года</caption><tr><th>ПН</th><th>ВТ</th><th>СР</th><th>ЧТ</th><th>ПТ</th><th>СБ</th><th>ВС</th></tr>`;

    // Пустые клетки в начале:
    for (let i = 0; i < dayOfWeek - 1; i++) {
        tabl += '<td></td>'
    };

    // Заполнение таблицы:
    let DayOfMonth = new Date (year, month +1, 0);
    let monthLength = DayOfMonth.getDate();
    let count  = 1;
    for (let i = dayOfWeek; i <= monthLength + dayOfWeek - 1; i++) {
        if (i % 7 !== 0) {
            tabl += `<td>${count}</td>`;
            count++;
        } else {
            tabl += `<td>${count}</td><tr>`;
            count++;
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
}