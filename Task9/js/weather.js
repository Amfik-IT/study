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

        this.moreWeather = function () {
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
                        timerId = setTimeout(tick, 500);
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
                        timerId = setTimeout(tick, 500);
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

        this.loading = function (moreWeather) {
            if (!loading) {
                let countLoad = 0;
                let dots = document.querySelectorAll(".dot");
                let timerId = setTimeout(function tick() {
                    if (countLoad <= 3) {
                        dots[countLoad].style.backgroundColor = "#ff7f99";
                        countLoad = ++countLoad;
                        timerId = setTimeout(tick, 700);
                    } else {
                        countLoad = 0;
                        loading = true;
                        moreWeather();
                    }
                }, 500);
            } else moreWeather();

        }

        this.createWidget = function (data) {
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
            </div>
            <div class="day1">
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
                </div>
            </div>
            <div class="day2">
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
                </div>
            </div>
            <div class="day3">
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
                </div>
            </div>`;
            containerWidth = myWheatherContainer.offsetWidth;
            openButton = myWheatherContainer.querySelector('#modal-close');
        }

    };

    // ---------------- model -------------------
    function _modelWheather() {
        let myViewWheather = null;
        let infoWheather = {};

        this.init = function (view, coords) { // инициализация данных
            myViewWheather = view;
            this.getInfoAPI(coords);
        }

        this.loading = function () {
            myViewWheather.loading(myViewWheather.moreWeather);
        }

        this.closeWeather = function () {
            myViewWheather.closeWeather();
        }

        this.getInfoAPI = function (coords) {
            let apiUrl = "https://api.openweathermap.org/data/2.5/";
            let apiKey = "ae4b5785b64e59216083a230bd0e5417";
            let apiQuery = apiUrl + "/forecast?lat=" + coords.latitude + "&lon=" + coords.longitude + "&mode=json&units=metric&lang=ru&appid=" + apiKey;

            fetch(apiQuery)
                .then(response => response.json())
                .then(data => {
                    // console.log(data);
                    let counter = 0;
                    let nextIndex = Math.ceil((24 - new Date().getHours()) / 3) + 4;

                    for (let i = 0; i <= data.list.length; i++) {
                        if (i === 0 || i === nextIndex || i === nextIndex + 8 || i === nextIndex + 16) {
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
                    myViewWheather.createWidget(infoWheather);
                })
                .catch(error => console.error("Ошибка получения погоды. Причина: " + error));
        }
    }

    // ---------------- controller -------------------
    function _controllerWheather() {
        let myWheatherContainer = null;
        let myWheatherModel = null;

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
        }

        this.moreWeather = () => {
            myWheatherModel.loading();
        }

        this.closeWeather = () => {
            myWheatherModel.closeWeather();
        }

        this.getInfoAPI = () => {
            myWheatherModel.getInfoAPI();
        }
    }

    // ---------------- initial function -------------------
    function _initial(containerElem, coords) {
        // глобальная инициализация
        const appViewWheather = new _viewWheather();
        const appModelWheather = new _modelWheather();
        const appControllerWheather = new _controllerWheather();

        //вызвать init-методы...
        appViewWheather.init(containerElem);
        appModelWheather.init(appViewWheather, coords);
        appControllerWheather.init(appModelWheather, containerElem);
    }

    // ---------------- create_Container function -------------------
    function _createContainer(coords) {
        const wheatherWidget = document.createElement('div');
        wheatherWidget.classList.add("wheather_widget");
        wheatherWidget.setAttribute('id', "wheather_widget");
        document.body.prepend(wheatherWidget);

        _initial(wheatherWidget, coords);
    }


    return function () {
        this.getWeather = () => {
            navigator.geolocation.getCurrentPosition(success, error);

            function success(position) {
                const coords = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                }

                _createContainer(coords);
            }

            function error() {
                alert(`Не удалось определить ваше местоположение`);
            }
        }
    }
}());
new WheatherWidget().getWeather();