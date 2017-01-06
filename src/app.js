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

// ########### Promise stream ###########
const postsPromise = fetch('http://swapi.co/api/films/')
    .then(data => data.json())
    .catch(err => console.error(err));

const responseStream$ = Rx.Observable.fromPromise(postsPromise)
    .map(data => data.results);

function createSuggestions(responseStream){
    return responseStream.map(films =>
        films[Math.floor(Math.random()*films.length)]
    );
}

function renderSuggestion(filmData, selector){
    const element = document.querySelector(selector);
    const title = element.querySelector('.title');
    const director = element.querySelector('.director');
    const releaseDate = element.querySelector('.release-date');

    title.textContent = filmData.title;
    director.textContent = filmData.director;
    releaseDate.textContent = filmData.release_date;
}

const suggestion1Stream$ = createSuggestions(responseStream$);
const suggestion2Stream$ = createSuggestions(responseStream$);
const suggestion3Stream$ = createSuggestions(responseStream$);

suggestion1Stream$.subscribe(film => {
    renderSuggestion(film, '.suggestion1');
});

suggestion2Stream$.subscribe(film => {
    renderSuggestion(film, '.suggestion2');
});

suggestion3Stream$.subscribe(film => {
    renderSuggestion(film, '.suggestion3');
});

responseStream$.subscribe(data => console.log(data), err => console.error(err));





