let btn = document.querySelectorAll("input");

function makeCounter() {
	let counter = 0;
	return function() {
		return ++counter;
	}
}

btn.forEach(function(item) {
    let counter = makeCounter();
    
    item.onclick = function() {
        item.value = counter();
    };
})

// Так нельзя (работает):
// btn.forEach(function(item) {
//     item.onclick = function() {
//             let elem = item;
//             i = +elem.value + 1
//             elem.value=i
//         };
// })