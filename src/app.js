require("./style.css");
const Rx = require('rxjs/Rx');

// ########### Event stream ###########
const stormtrooperCounter = document.querySelector('#stormtrooper-counter');
const wookieCounter = document.querySelector('#wookie-counter');
const stormtrooperAmount = document.querySelector('#stormtrooper-amount');
const wookieAmount = document.querySelector('#wookie-amount');
const jediScoreHolder = document.querySelector('#jedi-score');
const jediVerdictHolder = document.querySelector('#jedi-verdict');

const stormtrooperInputStream$ = Rx.Observable.fromEvent(stormtrooperCounter, 'input')
    .map(event => event.target.value);

const wookieInputStream$ = Rx.Observable.fromEvent(wookieCounter, 'input')
        .map(event => event.target.value);

const scoreStream$ = Rx.Observable.combineLatest(
    stormtrooperInputStream$.startWith(40),
    wookieInputStream$.startWith(5),
    (stormtrooperCount, wookieCount) => {
        const stormtrooperScore = stormtrooperCount * 0.7;
        const wookieScore = wookieCount * 1.3;
        const jediScore = Math.round(stormtrooperScore - wookieScore);
        return {stormtrooperCount, wookieCount, jediScore};
    }
)

function getJediVerdict(jediScore){
    if(jediScore < -30){
        return "I find your lack of faith disturbing.";
    }
    if(jediScore > -30 && jediScore <= 0){
        return "It's a trap!";
    }
    else if(jediScore > 0 && jediScore <= 20){
        return "Do. Or do not. There is no try.";
    }
    else if(jediScore > 20 && jediScore <= 40){
        return "Never tell me the odds.";
    }
    else if(jediScore > 40 && jediScore <=60){
        return "Great, kid. Don’t get cocky.";
    }
    else {
        return "The force is strong in this one!";
    }
}

scoreStream$.subscribe(score => {
    const {stormtrooperCount, wookieCount, jediScore} = score;
    let jediVerdict = getJediVerdict(jediScore);
    stormtrooperAmount.textContent = `#${stormtrooperCount}`;
    stormtrooperCounter.value = score.stormtrooperCount;
    wookieAmount.textContent = `#${wookieCount}`;
    wookieCounter.value = score.wookieCount;
    jediScoreHolder.textContent = `Jedi score: ${jediScore}`;
    jediVerdictHolder.textContent = `Jedi verdict: "${jediVerdict}"`;
});

// ########### Interval stream ###########

const startButton = document.querySelector('#start');
const stopButton = document.querySelector('#stop');
const resetButton = document.querySelector('#reset');
const counter = document.querySelector('#counter');

const start$ = Rx.Observable.fromEvent(startButton, 'click');
const stop$ = Rx.Observable.fromEvent(stopButton, 'click');
const reset$ = Rx.Observable.fromEvent(resetButton, 'click');
const interval$ = Rx.Observable.interval(1000);

const data = {count: 0};
const increment = (currentValue) => ({count : currentValue.count + 1});
const reset = (currentValue) => data;

const stopInterval$ = interval$
    .takeUntil(stop$);

const incrementOrReset$ = Rx.Observable.merge(
    stopInterval$.mapTo(increment),
    reset$.mapTo(reset)
);

start$
    .switchMapTo(incrementOrReset$)
    .startWith(data)
    .scan((accumulated, current) => current(accumulated))
.subscribe((deathCount) => {
    counter.textContent = `Count: ${deathCount.count}`;
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





