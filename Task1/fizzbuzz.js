function fizzBuzz() {
    for (let i = 1; i <= 100; i++) {

        // Через if:

        // if (i % 3 == 0) {
        //     if (i % 5 == 0) {
        //         console.log ('FizzBuzz');
        //         continue;
        //     } else {
        //         console.log ('Fizz');
        //         continue;
        //     }
        // } else if (i % 5 == 0) {
        //     console.log ('Buzz');
        //     continue;
        // } else {
        //     console.log (i);
        //     continue;
        // }

        // Через логические операторы:

        // resultFizz = (i % 3 == 0) && 'Fizz';
        // resultBuzz = (i % 5 == 0) && 'Buzz';
        // resultFizzBuzz = (i % 3 == 0) && (i % 5 == 0) && 'FizzBuzz';
        // console.log (resultFizzBuzz || resultBuzz || resultFizz || i);

        console.log ( 
                     (i % 3 == 0) && (i % 5 == 0) && 'FizzBuzz' || 
                     (i % 5 == 0) && 'Buzz' || 
                     (i % 3 == 0) && 'Fizz' ||
                      i 
                    );
    }
}
fizzBuzz();
// Стрелочная функция (работает):
// let FizzBuzz = () => {
//     for ( let i = 1; i <= 100; i++ ) {
// 
//         console.log ( 
//                      (i % 3 == 0) && (i % 5 == 0) && 'FizzBuzz' || 
//                      (i % 5 == 0) && 'Buzz' || 
//                      (i % 3 == 0) && 'Fizz' ||
//                       i 
//                     );
//     }
//     return;
// };
// FizzBuzz ();