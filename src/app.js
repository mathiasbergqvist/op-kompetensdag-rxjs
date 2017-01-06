const Rx = require('rxjs/Rx');

// ########### Input stream
const userInput = document.querySelector('#user-input');
const label = document.querySelector('#label');

const userInputStream$ = Rx.Observable.fromEvent(userInput, 'input')
    .map(event => event.target.value.toUpperCase()).startWith('');

userInputStream$.subscribe(input => {
    label.textContent = `Input: ${input}`;
});

