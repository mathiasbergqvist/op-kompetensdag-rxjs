const Rx = require('rxjs/Rx');

const array = [0, 10, 1, 18, 'foo', 2, NaN, 3, 4, 'bar', 666];

const numbers$ = Rx.Observable.from(array)
    .filter(entry => !isNaN(entry))
    .filter(entry => entry < 10)
    .map(entry => entry + 1);

numbers$.subscribe(entry => console.log(entry));


