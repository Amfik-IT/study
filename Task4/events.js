
// Пункт 1 (ссылки):
let links = document.querySelectorAll('#links a span');

links.forEach(function(item) {
    item.addEventListener("mouseover", show, {once: true});
    item.addEventListener("mouseout", hide, {once: true});
});


function show() {
    let newSpan = document.createElement('span');
    let hrefSpan = ` (${this.parentElement.href})`;
    newSpan.innerHTML = hrefSpan;

    let textSpan = `${this.parentElement.title}`;
    this.parentElement.title = this.innerHTML;
    this.innerHTML = textSpan;
    this.after(newSpan);
    this.removeEventListener("mouseover", show, {once: true});
}

function hide() {
    this.nextElementSibling.remove();
    let textSpan = `${this.parentElement.title}`;
    this.parentElement.title = this.innerHTML;
    this.innerHTML = textSpan;
    this.removeEventListener("mouseout", hide, {once: true});
}


// Пункт 2 (input text):
let inputs = document.querySelectorAll('#inputs input');

inputs.forEach(function(item) {
    item.addEventListener("click", consoleValue, {once: true});
});

function consoleValue() {
    console.log(this.value);
    this.removeEventListener("click", consoleValue, {once: true});
}


// Пункт 3 (p > x**n):
let arrP = document.querySelectorAll('#quadratic p');

arrP.forEach(function(item) {
    item.addEventListener("click", quadraticFunc, {once: true});
});

function quadraticFunc() {
    let number = +this.innerHTML;
    this.innerHTML = number**2;
    this.removeEventListener("click", quadraticFunc, {once: true});
}


// Пункт 4 (validation):
let arrInput = document.querySelectorAll('#validation input');

arrInput.forEach(function(item) {
    item.addEventListener("blur", validationInput);
});

function validationInput() {

    let validStr = this.value;
    if (validStr.length >= +this.dataset.length) {
        this.className = "valid";
    } else this.className = "unvalid";

}