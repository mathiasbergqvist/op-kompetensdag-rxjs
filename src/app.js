require("./style.css");
const Rx = require('rxjs/Rx');
import {run} from '@cycle/rxjs-run';
import {makeDOMDriver, div} from '@cycle/dom';
import JediScoreboard from './JediScoreboard';
import StormtrooperDeathCounter from './StormtrooperDeathCounter';
import HeroesOfTheGalaxy from './HeroesOfTheGalaxy';

function main(sources){
    const jediScoreBoard$ = JediScoreboard(sources).DOM;
    const stormTrooperDeathCounter$ = StormtrooperDeathCounter(sources).DOM;
    const heroesOfTheGalaxy$ = HeroesOfTheGalaxy(sources).DOM;

    const main$ = Rx.Observable.combineLatest (
        jediScoreBoard$,
        stormTrooperDeathCounter$,
        heroesOfTheGalaxy$,
        (jediScoreBoard, stormTrooperDeathCounter, heroesOfTheGalaxy) =>
            div([
                jediScoreBoard,
                stormTrooperDeathCounter,
                heroesOfTheGalaxy
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