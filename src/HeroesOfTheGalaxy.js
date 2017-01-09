const Rx = require('rxjs/Rx');

/**
 ########### PROMISE STREAM ###########
 * */
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