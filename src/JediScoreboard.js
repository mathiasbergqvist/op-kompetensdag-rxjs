const Rx = require('rxjs/Rx');

/**
    ########### UI EVENT STREAM ###########
* */
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

const jediScoreStream$ = Rx.Observable.combineLatest(
    stormtrooperInputStream$.startWith(40),
    wookieInputStream$.startWith(5),
    (stormtrooperCount, wookieCount) => {
        const stormtrooperScore = stormtrooperCount * 0.7;
        const wookieScore = wookieCount * 1.3;
        const jediScore = Math.round(stormtrooperScore - wookieScore);
        return {stormtrooperCount, wookieCount, jediScore};
    }
);

function getJediVerdict(jediScore) {
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

jediScoreStream$.subscribe(score => {
    const {stormtrooperCount, wookieCount, jediScore} = score;
    let jediVerdict = getJediVerdict(jediScore);
    stormtrooperAmount.textContent = `#${stormtrooperCount}`;
    stormtrooperCounter.value = score.stormtrooperCount;
    wookieAmount.textContent = `#${wookieCount}`;
    wookieCounter.value = score.wookieCount;
    jediScoreHolder.textContent = `Jedi score: ${jediScore}`;
    jediVerdictHolder.textContent = `Jedi verdict: "${jediVerdict}"`;
});