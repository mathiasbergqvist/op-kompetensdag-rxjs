const Rx = require('rxjs/Rx');
import {div, h1, p} from '@cycle/dom';

function HeroesOfTheGalaxy(sources){
    const temporaryContent$ = Rx.Observable.of('FAMOUS HEROES OF THE GALAXY');
    return {
        DOM: temporaryContent$.map(temporaryContent =>
            div([
                h1(`${temporaryContent}`),
                p('TODO: Insert component here...')
            ])
        )
    }
}

export default HeroesOfTheGalaxy;