function compress (str) {
    // debugger
    let lowerCase = str.toLowerCase();

    let n = 1;
    let result = "";
    for (let i = 0; i < lowerCase.length; i++) {
        if (lowerCase[i] == lowerCase[i + 1]) {
            ++n;
        } else {
            result += lowerCase[i] + n;
            n = 1;
        }
    }

    if ((result.length === 2) && (result[1] === "1") ) {
        result = result[0];
        console.log (`"${str}" => "${result}"`);
    } else {
        console.log (`"${str}" => "${result}"`);
    }

}
compress("aaaabbbbhhrrrkkk");
compress("aaannnaannnn");
compress("z");

function uncompress (str) {
    // debugger
    let strLowerCase = str.toLowerCase();
    let strSplit = strLowerCase.split('');
    let arrABC = [];
    for (let key of strSplit) {
        if (isNaN(+key)) {
            arrABC.push(key);
        };
    };
    
    let res = "";
    for (let key of arrABC) {
        let getIndex = strLowerCase.indexOf(key);
        let indexRepeat = parseInt(strLowerCase.slice(getIndex + 1, strLowerCase.length));
        strLowerCase = strLowerCase.slice(getIndex + 1, strLowerCase.length)
        res += (key.repeat(indexRepeat));
    };
    console.log (`"${str}" => "${res}"`);
}
uncompress("a2b5f3a4");
uncompress("b114m3333r1");