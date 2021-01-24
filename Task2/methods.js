
function currentSums(numbers) {
    let res1 = [];
    let res2 = [];
    numbers.reduce((previousValue, item, index) => {
            if (previousValue + item == item) {
                res1[index] = item;
            } else {
                res1[index] = res1[index - 1] + "+" + item;
            };

            res2[index] = previousValue + item;
            return previousValue + item;
    }, 0);

    console.log(`[${res1}] = [${res2}]`);
}
currentSums([2, 3, 5, 7, 11, 13, 17]);
//  что значит 0 в этом методе?
// --------------------------------------------------------------------------------


function firstLettersFromString(str) {

    // РАБОТАЕТ, но НЕ Map =(
    // let arrFromStr = [];
    // arrFromStr.push(str[0]);
    // for (let i = 0; i < str.length; i++) {
    //     if (str[i] == " ") {
    //         arrFromStr.push(str[i + 1]);
    //     }
    // }
    // console.log(arrFromStr);

    let arrFromStr = str.split(' ');
    let result = arrFromStr.map((item) => item[0]);
    console.log(result);
}

firstLettersFromString("Каждый охотник желает знать, где сидит фазан.");

// ----------------------------------------------------------------------------------


function positiveIntegers(arr) {
    let results = arr.filter(item => Math.round(item) == item && item >= 0);
    console.log(results);
}

positiveIntegers([-1, 2, 3.5, -12, 4, 1.25, 16]);

// -----------------------------------------------------------------------------------
// без for, filter, map используя slice bkb splice.
function changeArray(arr) {
    if (Math.ceil(arr.length / 2) == (arr.length / 2)) {

        let arrFirstHalf = arr.filter((item, index) => {
            if (index < (arr.length / 2)) return true;
        });
        let arrLastHalf = arr.filter((item, index) => {
            if (index >= (arr.length / 2)) return true;
        });
        let result = arrLastHalf.concat(arrFirstHalf);
        console.log(result);
        
    } else {

        let arrFirstHalf = arr.filter((item, index) => {
            if (index < Math.ceil(arr.length / 2 - 1)) return true;
        });
        let arrLastHalf = arr.filter((item, index) => {
            if (index > Math.ceil(arr.length / 2 - 1)) return true;
        });
        let result = arrLastHalf.concat(arr[Math.ceil(arr.length / 2 - 1)], arrFirstHalf);
        console.log(result);
    }
}

changeArray([ 1, 2, 3, 4, 5, 6, 7, 8, 9]);
changeArray([ 1, 2, 3, 4, 5, 6, 7, 8]);