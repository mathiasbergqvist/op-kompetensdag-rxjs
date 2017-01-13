const Rx = require('rxjs/Rx');

/**
 ########### PROMISE STREAM ###########
 * */
const postsPromise = fetch('http://swapi.co/api/planets/')
    .then(data => data.json())
    .catch(err => console.error(err));

const responseStream$ = Rx.Observable.fromPromise(postsPromise)
    .map(data => data.results);

function createSuggestions(responseStream){
    return responseStream.map(planets =>
        planets[Math.floor(Math.random()*planets.length)]
    );
}

function renderSuggestion(planetData, selector){
    const element = document.querySelector(selector);
    const name = element.querySelector('.name');
    const diameter = element.querySelector('.diameter');
    const climate = element.querySelector('.climate');
    const terrain = element.querySelector('.terrain');
    const population = element.querySelector('.population');

    name.textContent = planetData.name;
    diameter.textContent = planetData.diameter;
    climate.textContent = planetData.climate;
    terrain.textContent = planetData.terrain;
    population.textContent = planetData.population;
}

const suggestion1Stream$ = createSuggestions(responseStream$);
const suggestion2Stream$ = createSuggestions(responseStream$);
const suggestion3Stream$ = createSuggestions(responseStream$);

suggestion1Stream$.subscribe(planet => {
    renderSuggestion(planet, '.planetSuggestion1');
});

suggestion2Stream$.subscribe(planet => {
    renderSuggestion(planet, '.planetSuggestion2');
});

suggestion3Stream$.subscribe(planet => {
    renderSuggestion(planet, '.planetSuggestion3');
});