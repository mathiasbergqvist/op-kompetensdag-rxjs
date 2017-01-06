require("./style.css");
const Rx = require('rxjs/Rx');

// ########### Event stream ########### 
const userInput = document.querySelector('#user-input');
const label = document.querySelector('#label');

const userInputStream$ = Rx.Observable.fromEvent(userInput, 'input')
    .map(event => event.target.value.toUpperCase()).startWith('');

userInputStream$.subscribe(input => {
    label.textContent = `Input: ${input}`;
});

// ########### Promise Stream ###########
const postsPromise = fetch('http://swapi.co/api/films/')
    .then(data => data.json())
    .catch(err => console.error(err));

const responseStream = Rx.Observable.fromPromise(postsPromise);

responseStream.subscribe(data => console.log(data), err => console.error(err));





