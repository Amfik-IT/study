"use strict";
const WheatherWidget = (function () {

    // ---------------- view -------------------
    function _viewWheather() {
        let myWheatherContainer = null;
        let divDaysOpen = false;
        let loading = false;
        let containerWidth = null;
        let openWeather = true;
        let openButton = null;

        this.init = function (container) { // инициализация данных
            myWheatherContainer = container;

        }

        this.moreWeather = function () { // для постепенного плавного открытия окон
            // debugger
            let countUp = 2;
            let countDown = 0;
            let arrDivDays = [document.querySelector(".day1"), document.querySelector(".day2"), document.querySelector(".day3")];
            if (divDaysOpen) {
                let timerId = setTimeout(function tick() {
                    if (countUp >= 0) {
                        let divHeight = arrDivDays[countUp].offsetHeight;
                        arrDivDays[countUp].style.marginTop = -divHeight + "px";
                        countUp = --countUp;
                        timerId = setTimeout(tick, 500); // 500 т.к. в css стоит transition-duration: 0.5s
                    } else {
                        countUp = 2;
                        divDaysOpen = false;
                    }
                }, 0);
            } else {
                let timerId = setTimeout(function tick() {
                    if (countDown <= 2) {
                        arrDivDays[countDown].style.marginTop = 0 + "px";
                        countDown = ++countDown;
                        timerId = setTimeout(tick, 500); // 500 т.к. в css стоит transition-duration: 0.5s
                    } else {
                        countDown = 0;
                        divDaysOpen = true;
                    }
                }, 0);
            }
        }

        this.closeWeather = function () {
            if (openWeather) {
                myWheatherContainer.style.marginRight = -(containerWidth + 15) + "px";
                openWeather = false;
                openButton.style.transform = 'rotate(315deg)';
                setTimeout(() => openButton.classList.toggle('modal__hover'), 500);
            } else {
                myWheatherContainer.style.marginRight = 0 + "px";
                openWeather = true;
                openButton.style.transform = 'rotate(0deg)';
                setTimeout(() => openButton.classList.toggle('modal__hover'), 500);
            }
        }

        this.loading = function () { // имитация загрузки данных
            if (!loading) {
                let countLoad = 0;
                let dots = document.querySelectorAll(".dot");

                function tick() {
                    if (countLoad <= 3) {
                        dots[countLoad].style.backgroundColor = "#ff7f99";
                        countLoad = ++countLoad;
                        timerId = setTimeout(tick.bind(this), 700);
                    } else {
                        countLoad = 0;
                        loading = true;
                        this.moreWeather();
                    }
                }
                let timerId = setTimeout(tick.bind(this), 500);
            } else this.moreWeather();

        }

        this.error = function () {
            alert(`Не удалось определить ваше местоположение. Загружаем для Минска.`);
        }

        this.createWidget = function (data, first) {

            if (first === "first") {
                myWheatherContainer.innerHTML = `
                <a class="modal__close" id="modal-close" title="Закрыть/открыть виджет">Закрыть</a>
                <div class="day">
                    <div class="row top">
                        <p><span class="country">${data.day_0.country},</span><br><span class="location">${data.day_0.location}</span><br><span class="description">${data.day_0.description}</span></p>
                        <img src="${data.day_0.img}" alt="icon" class="icon">
                    </div>
                    <div class="row center">
                        <diw class="weather-left-temp"><span>${data.day_0.temp}° C</span></diw>
                        <div class="weather-right-card">
                            <table class="weather-right__table">
                            <tbody><tr class="weather-right__items">
                                <th colspan="2" class="weather-right__item details">подробности</th>
                            </tr>
                            <tr class="weather-right__items">
                                <td class="weather-right__item">Как будто</td>
                                <td class="weather-right__item weather-right__feels"><span>${data.day_0.feels_like}° C</span></td>
                            </tr>
                            <tr class="weather-right__items">
                                <td class="weather-right__item">Ветер</td>
                                <td class="weather-right__item weather-right__wind-speed">${data.day_0.wind_speed} м / с </td>
                            </tr>
                            <tr class="weather-right-card__items">
                                <td class="weather-right__item">Влажность</td>
                                <td class="weather-right__item weather-right__humidity">${data.day_0.humidity}%</td>
                            </tr>
                            </tbody></table>
                        </div>
                    </div>
                    <div class="row bottom">
                        <button id="openWeather">На 3 дня</button><span class="load"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="dot"></span></span><span class="date">${data.day_0.day} ${data.day_0.month}</span>
                    </div>
                </div>`

                containerWidth = myWheatherContainer.offsetWidth;
                openButton = myWheatherContainer.querySelector('#modal-close');

            } else {

                let day1 = document.createElement('div');
                day1.classList.add('day1');
                day1.innerHTML = `
                <div class="row center">
                    <diw class="weather-left-temp"><span>${data.day_1.temp}° C</span></diw>
                    <div class="weather-right-card">
                        <table class="weather-right__table">
                        <tbody><tr class="weather-right__items">
                            <th colspan="2" class="weather-right__item details">подробности</th>
                        </tr>
                        <tr class="weather-right__items">
                            <td class="weather-right__item">Как будто</td>
                            <td class="weather-right__item weather-right__feels"><span>${data.day_1.feels_like}° C</span></td>
                        </tr>
                        <tr class="weather-right__items">
                            <td class="weather-right__item">Ветер</td>
                            <td class="weather-right__item weather-right__wind-speed">${data.day_1.wind_speed} м / с </td>
                        </tr>
                        <tr class="weather-right-card__items">
                            <td class="weather-right__item">Влажность</td>
                            <td class="weather-right__item weather-right__humidity">${data.day_1.humidity}%</td>
                        </tr>
                        <tr class="weather-right-card__items">
                            <td class="weather-right__item">Осадки</td>
                            <td class="weather-right__item weather-right__description">${data.day_1.description}</td>
                        </tr>
                        </tbody></table>
                    </div>
                    </div>
                <div class="row bottom">
                    <span class="date">${data.day_1.day} ${data.day_1.month}</span>
                </div>`

                let day2 = document.createElement('div');
                day2.classList.add('day2');
                day2.innerHTML = `
                <div class="row center">
                    <diw class="weather-left-temp"><span>${data.day_2.temp}° C</span></diw>
                    <div class="weather-right-card">
                        <table class="weather-right__table">
                        <tbody><tr class="weather-right__items">
                            <th colspan="2" class="weather-right__item details">подробности</th>
                        </tr>
                        <tr class="weather-right__items">
                            <td class="weather-right__item">Как будто</td>
                            <td class="weather-right__item weather-right__feels"><span>${data.day_2.feels_like}° C</span></td>
                        </tr>
                        <tr class="weather-right__items">
                            <td class="weather-right__item">Ветер</td>
                            <td class="weather-right__item weather-right__wind-speed">${data.day_2.wind_speed} м / с </td>
                        </tr>
                        <tr class="weather-right-card__items">
                            <td class="weather-right__item">Влажность</td>
                            <td class="weather-right__item weather-right__humidity">${data.day_2.humidity}%</td>
                        </tr>
                        <tr class="weather-right-card__items">
                            <td class="weather-right__item">Осадки</td>
                            <td class="weather-right__item weather-right__description">${data.day_2.description}</td>
                        </tr>
                        </tbody></table>
                    </div>
                    </div>
                <div class="row bottom">
                    <span class="date">${data.day_2.day} ${data.day_2.month}</span>
                </div>`

                let day3 = document.createElement('div');
                day3.classList.add('day3');
                day3.innerHTML = `
                <div class="row center">
                    <diw class="weather-left-temp"><span>${data.day_3.temp}° C</span></diw>
                    <div class="weather-right-card">
                        <table class="weather-right__table">
                        <tbody><tr class="weather-right__items">
                            <th colspan="2" class="weather-right__item details">подробности</th>
                        </tr>
                        <tr class="weather-right__items">
                            <td class="weather-right__item">Как будто</td>
                            <td class="weather-right__item weather-right__feels"><span>${data.day_3.feels_like}° C</span></td>
                        </tr>
                        <tr class="weather-right__items">
                            <td class="weather-right__item">Ветер</td>
                            <td class="weather-right__item weather-right__wind-speed">${data.day_3.wind_speed} м / с </td>
                        </tr>
                        <tr class="weather-right-card__items">
                            <td class="weather-right__item">Влажность</td>
                            <td class="weather-right__item weather-right__humidity">${data.day_3.humidity}%</td>
                        </tr>
                        <tr class="weather-right-card__items">
                            <td class="weather-right__item">Осадки</td>
                            <td class="weather-right__item weather-right__description">${data.day_3.description}</td>
                        </tr>
                        </tbody></table>
                    </div>
                </div>
                <div class="row bottom">
                    <span class="date">${data.day_3.day} ${data.day_3.month}</span>
                </div>`

                myWheatherContainer.append(day1);
                myWheatherContainer.append(day2);
                myWheatherContainer.append(day3);
                this.loading();
            }
        }

    };

    // ---------------- model -------------------
    function _modelWheather() {
        let myViewWheather = null;
        let infoWheather = {};

        this.init = function (view) { // инициализация данных
            myViewWheather = view;
        }

        this.getGeolocation = function (first) {

            navigator.geolocation.getCurrentPosition(success.bind(this), error.bind(this));

            function success(position) { // запрос геопозиции (работает локально или на сайтах с шифрованным протоколом https )
                // debugger
                const coords = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                }

                first === "first" ? this.getInfoAPI(coords) : this.getInfoAPIMore(coords);
            }

            function error() { // т.к. для демонстрации у меня нет сайта с шифрованным протоколом, то просто запрашиваю для минска
                myViewWheather.error();
                const coords = {
                    latitude: 53.900002,
                    longitude: 27.566668,
                }

                first === "first" ? this.getInfoAPI(coords) : this.getInfoAPIMore(coords);
            }
        }

        this.loading = function () {
            myViewWheather.loading();
        }

        this.closeWeather = function () {
            myViewWheather.closeWeather();
        }

        this.getInfoAPI = function (coords) { // запрос на 1 день (сегодня)
            let apiUrl = "https://api.openweathermap.org/data/2.5/";
            let apiKey = "ae4b5785b64e59216083a230bd0e5417";
            let apiQuery = apiUrl + "/weather?lat=" + coords.latitude + "&lon=" + coords.longitude + "&mode=json&units=metric&lang=ru&appid=" + apiKey;

            fetch(apiQuery)
                .then(response => response.json())
                .then(data => {
                    // console.log(data);

                    infoWheather[`day_0`] = {};
                    infoWheather[`day_0`].country = data.sys.country; // место
                    infoWheather[`day_0`].location = data.name; // место
                    infoWheather[`day_0`].temp = Math.round(data.main.temp); // температура
                    infoWheather[`day_0`].feels_like = Math.round(data.main.feels_like); // температура по ощущениям 
                    infoWheather[`day_0`].humidity = data.main.humidity; // влажность
                    infoWheather[`day_0`].description = data.weather[0].description; // ясность
                    infoWheather[`day_0`].wind_speed = data.wind.speed; // скорость ветра
                    infoWheather[`day_0`].img = `https://openweathermap.org/themes/openweathermap/assets/vendor/owm/img/widgets/${data.weather[0].icon}.png`;
                    let date = new Date();
                    let arrMonth = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
                    infoWheather[`day_0`].month = arrMonth[date.getMonth()];
                    infoWheather[`day_0`].day = date.getDate();



                    // console.log(infoWheather);
                    myViewWheather.createWidget(infoWheather, "first");
                })
                .catch(error => alert("Ошибка получения погоды. Причина: " + error));
        }

        this.getInfoAPIMore = function (coords) { // запрос на 3 дня
            let apiUrl = "https://api.openweathermap.org/data/2.5/";
            let apiKey = "ae4b5785b64e59216083a230bd0e5417";
            let apiQuery = apiUrl + "/forecast?lat=" + coords.latitude + "&lon=" + coords.longitude + "&mode=json&units=metric&lang=ru&appid=" + apiKey;

            fetch(apiQuery)
                .then(response => response.json())
                .then(data => {
                    // console.log(data);
                    let counter = 1;
                    let nextIndex = Math.ceil((24 - new Date().getHours()) / 3) + 4; // это выражение не поддается логике, просто нашел закономерность для того что бы инфа была на 12:00 дня

                    for (let i = 0; i <= data.list.length; i++) {
                        if (i === nextIndex || i === nextIndex + 8 || i === nextIndex + 16) {
                            infoWheather[`day_${counter}`] = {};
                            infoWheather[`day_${counter}`].country = data.city.country; // место
                            infoWheather[`day_${counter}`].location = data.city.name; // место
                            infoWheather[`day_${counter}`].temp = Math.round(data.list[i].main.temp); // температура
                            infoWheather[`day_${counter}`].feels_like = Math.round(data.list[i].main.feels_like); // температура по ощущениям 
                            infoWheather[`day_${counter}`].humidity = data.list[i].main.humidity; // влажность
                            infoWheather[`day_${counter}`].description = data.list[i].weather[0].description; // ясность
                            infoWheather[`day_${counter}`].wind_speed = data.list[i].wind.speed; // скорость ветра
                            infoWheather[`day_${counter}`].img = `https://openweathermap.org/themes/openweathermap/assets/vendor/owm/img/widgets/${data.list[i].weather[0].icon}.png`;
                            let date = new Date(data.list[i].dt_txt);
                            let arrMonth = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
                            infoWheather[`day_${counter}`].month = arrMonth[date.getMonth()];
                            infoWheather[`day_${counter}`].day = date.getDate();
                            counter = ++counter;
                        }
                    }
                    // console.log(infoWheather);
                    myViewWheather.createWidget(infoWheather, "more");
                })
                .catch(error => alert("Ошибка получения погоды. Причина: " + error));
        }
    }

    // ---------------- controller -------------------
    function _controllerWheather() {
        let myWheatherContainer = null;
        let myWheatherModel = null;
        let more = false;

        this.init = function (model, container) { // получаем кнопки и вешаем обработчики
            myWheatherContainer = container;
            myWheatherModel = model;

            // слушаем клики по контейнеру
            container.addEventListener('click', (event) => {
                let target = event.target;

                if (target.id === "openWeather") {
                    this.moreWeather();
                } else if (target.id === "modal-close") {
                    this.closeWeather();
                }
            });

            this.getInfoAPI();

        }

        this.moreWeather = () => { // если уже запрашивали на 3 дня, то больше не делаю запрос а просто открываю инфу
            if (!more) {
                myWheatherModel.getGeolocation("more"); // делаю запрос второй раз на 3 деня
                more = true;
            } else myWheatherModel.loading(); // так если один раз уже загружали, то ропустит имитацию загрузки и отроет инфу
        }

        this.closeWeather = () => {
            myWheatherModel.closeWeather();
        }

        this.getInfoAPI = () => {
            myWheatherModel.getGeolocation("first"); // делаю запрос в первый раз на 1 день
        }
    }

    return function () {
        this.getWeather = () => {
            const wheatherWidget = document.createElement('div');
            wheatherWidget.classList.add("wheather_widget");
            wheatherWidget.setAttribute('id', "wheather_widget");
            document.body.prepend(wheatherWidget);

            // глобальная инициализация
            const appViewWheather = new _viewWheather();
            const appModelWheather = new _modelWheather();
            const appControllerWheather = new _controllerWheather();

            //вызвать init-методы...
            appViewWheather.init(wheatherWidget);
            appModelWheather.init(appViewWheather);
            appControllerWheather.init(appModelWheather, wheatherWidget);
        }
    }
}());
new WheatherWidget().getWeather();