require("./style.css");
const Rx = require('rxjs/Rx');
import {run} from '@cycle/rxjs-run';
import {makeDOMDriver, div, p} from '@cycle/dom';
import JediScoreboard from './JediScoreboard';
import StormtrooperDeathCounter from './StormtrooperDeathCounter';

function main(sources){
    const jediScoreBoard$ = JediScoreboard(sources).DOM;
    const stormTrooperDeathCounter$ = StormtrooperDeathCounter(sources).DOM;
    const main$ = Rx.Observable.combineLatest (
        jediScoreBoard$,
        stormTrooperDeathCounter$,
        (jediScoreBoard, stormTrooperDeathCounter) =>
            div([
                jediScoreBoard,
                stormTrooperDeathCounter
            ])
    );

    return {
        DOM: main$
    }
}

const drivers = {
    DOM: makeDOMDriver('#app')
};

run(main, drivers);