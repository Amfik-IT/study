function countVowelLetters(str) {
    // debugger
    let lowerCase = str.toLowerCase();
    let strSplit = lowerCase.split('');
    let vowels = "аеиоуыэюяё";

    let i = 0;
    for (let key of strSplit) {
        if (vowels.indexOf(key, 0) >= 0) {
            ++i
        };
    }
    console.log (`Количество гласных = ${i}`);
}