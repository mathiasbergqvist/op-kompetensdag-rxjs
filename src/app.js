require("./style.css");
const Rx = require('rxjs/Rx');

// ########### Event stream ###########
const stormtrooperCounter = document.querySelector('#stormtrooper-counter');
const wookieCounter = document.querySelector('#wookie-counter');
const jediScore = document.querySelector('#jedi-score');
const jediVerdict = document.querySelector('#jedi-verdict');

const stormtrooperInputStream$ = Rx.Observable.fromEvent(stormtrooperCounter, 'input')
    .map(event => event.target.value);

const wookieInputStream$ = Rx.Observable.fromEvent(wookieCounter, 'input')
        .map(event => event.target.value);

const scoreStream$ = Rx.Observable.combineLatest(
    stormtrooperInputStream$.startWith(40),
    wookieInputStream$.startWith(10),
    (stormtrooperCount, wookieCount) => {
        const stormtrooperScore = stormtrooperCount * 0.7;
        const wookieScore = wookieCount * 1.3;
        const jediScore = stormtrooperScore - wookieScore;
        return {stormtrooperScore, wookieScore, jediScore};
    }
)

scoreStream$.subscribe(score => {
    console.log("scores", score)
});


// ########### Promise stream ###########
const postsPromise = fetch('http://swapi.co/api/people/')
    .then(data => data.json())
    .catch(err => console.error(err));

const responseStream$ = Rx.Observable.fromPromise(postsPromise)
    .map(data => data.results);

function createSuggestions(responseStream){
    return responseStream.map(heroes =>
        heroes[Math.floor(Math.random()*heroes.length)]
    );
}

function renderSuggestion(heroData, selector){

    const element = document.querySelector(selector);
    const name = element.querySelector('.name');
    const birthYear = element.querySelector('.birth-year');
    const gender = element.querySelector('.gender');
    const skinColor = element.querySelector('.skin-color');
    const hairColor = element.querySelector('.hair-color');

    name.textContent = heroData.name;
    birthYear.textContent = heroData.birth_year;
    gender.textContent = heroData.gender;
    skinColor.textContent = heroData.skin_color;
    hairColor.textContent = heroData.hair_color;
}

const suggestion1Stream$ = createSuggestions(responseStream$);
const suggestion2Stream$ = createSuggestions(responseStream$);
const suggestion3Stream$ = createSuggestions(responseStream$);

suggestion1Stream$.subscribe(hero => {
    renderSuggestion(hero, '.suggestion1');
});

suggestion2Stream$.subscribe(hero => {
    renderSuggestion(hero, '.suggestion2');
});

suggestion3Stream$.subscribe(hero => {
    renderSuggestion(hero, '.suggestion3');
});





