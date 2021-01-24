function HashStorage(_key, _value) {
    this.store = {};
}

HashStorage.prototype.addValue = function(_key, _value) {
    this[_key] = _value;
};

HashStorage.prototype.getValue = function(_key) {
    if (this[_key] !== undefined) {
        return this[_key];
    } else {
        return (false)
    }
};

HashStorage.prototype.deleteValue = function(_key) {
    if (this[_key] !== undefined) {
        delete this[_key];
        return (true);
    } else return (false);
};

HashStorage.prototype.getKeys = function() {
    return (Object.keys(this));
};

// ------------------------------------------------------------

function coctailsStorage(_key, _value) {
    HashStorage.call(this, _key, _value);
}

coctailsStorage.prototype = Object.create(HashStorage.prototype);
coctailsStorage.prototype.constructor = coctailsStorage;


coctailsStorage.prototype.addInfo = function(key = prompt('Введите название рецепта'), value, addValue) {

    let coctailElem = document.getElementById('coctail');
    if (key !== null && key !== "") {
        value = [];
        addComponent();
        function addComponent() {
            if (confirm('Добавить компонент?')) {
                value.push(prompt('Введите компонент и его количество', 'Компонент 50гр'));
                addComponent();
            } else {
                value.push(confirm('Напиток алкогольный?'));
                value.push(prompt('Введите рецепт приготовления', '...'));
            };
        };
        this.addValue(key, value);
    } else if (key == null) {
        coctailElem.innerHTML = `<h2>Отмена =)</h2>`;
    } else coctailElem.innerHTML = `<h2>Вы не ввели название!</h2>`;
    
}

coctailsStorage.prototype.deleteInfo = function(key = prompt('Введите название рецепта'), deleteValue) {

    let coctailElem = document.getElementById('coctail');
    if (this.deleteValue(key)) {
        coctailElem.innerHTML = `<h2>Рецепт "${key}" удалён!</h2>`
    } else coctailElem.innerHTML = `<h2>Такого рецепта нет!</h2>`;
}

coctailsStorage.prototype.getList = function(getKeys) {

    let coctailElem = document.getElementById('coctail');
    let result = `<h2>Перечень рецептов:</h2><ul>`;
    for (key of this.getKeys()) {
        result += `<li>${key}</li>`;
    };
    coctailElem.innerHTML = result;
}

coctailsStorage.prototype.getInfo = function(key = prompt('Введите название рецепта'), getValue) {

    let coctailElem = document.getElementById('coctail');
    if (this.getValue(key)) {

        let arrKey = this.getValue(key);
        let setResult = `<h2>Коктейль "${key}" (алкогольный: ${arrKey[arrKey.length - 2] ? `да` : `нет`})</h2>`;
        
        rEach(function(item, index) {
            if (index == 0) {
                setResult += `<h3>Необходимые ингридиенты:</h3><ul><li>${item}</li>`;
            } else if (index !== 0 && index < arrKey.length - 2) {
                setResult += `<li>${item}</li>`;
            } else if (index == arrKey.length - 1) {
                setResult += `</ul><h3>Рецепт приготовления:</h3><p>${item}</p>`
            };
        });
      coctailElem.innerHTML = setResult;
    } else {
        coctailElem.innerHTML = `<h2>Такого рецепта нет!</h2>`
    }
    
}

// ---------------------------------------------------------------------------

const coctailStorage = new coctailsStorage();

coctailStorage.addValue('Маргарита', ['Водка Finlandia 50мл', 'Кофейный ликер 25мл', 'Лед в кубиках 120г', true, 'Наполни стакан кубиками льда доверху, затем налей кофейный ликер 25 мл, водку 50 мл и размешай коктейльной ложкой.']);

coctailStorage.addValue('Пеликан', ['Гренадин Monin 10мл', 'Клубничный сироп Monin 10мл', 'Персиковый сок 150мл', 'Лимонный сок 15мл', 'Банан 110г','Клубника 50г','Дробленый лед 60г', false, 'Положи в блендер очищенную и нарезанную половинку банана и клубнику 2 ягоды. Налей лимонный сок 15 мл, гренадин 10 мл, клубничный сироп 10 мл и персиковый сок 150 мл. Добавь в блендер совок дробленого льда и взбей. Перелей в хайбол. Укрась кружком банана и половинкой клубники на коктейльной шпажке.']);

coctailStorage.addValue('Отвертка', ['Водка Finlandia 50мл', 'Апельсиновый сок 150мл', 'Апельсин 30г', 'Лед в кубиках 180г', true, 'Наполни стакан кубиками льда доверху, затем налей водку 50 мл, долей апельсиновый сок доверху и аккуратно размешай коктейльной ложкой. Укрась кружком апельсина.']);