
let inputText = document.createElement('input');
inputText.type = 'text';
document.body.prepend(inputText);

let inputAdd = document.createElement('input');
inputAdd.type = 'button';
inputAdd.value = 'Add';
inputText.after(inputAdd);

let inputRemove = document.createElement('input');
inputRemove.type = 'button';
inputRemove.value = 'Remove';
inputAdd.after(inputRemove);

let myOl;
(function (arr) {
    myOl = document.createElement('ol');
    document.body.prepend(myOl);
    arr.forEach((item) => {
        let li = document.createElement('li');
        let span = document.createElement('span');
        li.prepend(span);
        span.innerHTML = item;
        myOl.append(li);
    });
    funcForLi();
})(["Отдых", "Рейв", "Техно-транс", "Танцы", "Поднос"]);

inputAdd.onclick = () => {
    if (inputText.value !== "") {
        let li = document.createElement('li');
        let span = document.createElement('span');
        li.prepend(span);
        span.innerHTML = inputText.value;
        myOl.append(li);
        inputText.value = "";
        inputRemove.disabled = false;
        funcForLi();
    };
};

inputRemove.onclick = () => {
    if (myOl.lastElementChild !== null) {
        myOl.lastElementChild.remove();
        if (myOl.lastElementChild == null){
            inputRemove.disabled = true;
        };
    };
};

function funcForLi() {
    let arrLi = document.querySelectorAll('span');

    arrLi.forEach(function(item) {

        item.onclick = function click() {
            // debugger
            let inputForLi = document.createElement('input');
            inputForLi.value = this.innerHTML;
            this.replaceWith(inputForLi);
            inputForLi.focus();
            inputForLi.onblur = function() {
                let spanForLi = document.createElement('span');
                spanForLi.innerHTML = this.value;
                spanForLi.onclick = click;
                this.replaceWith(spanForLi);
            };

        };
    });
}