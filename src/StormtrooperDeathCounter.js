const Rx = require('rxjs/Rx');
import {div, h1, p} from '@cycle/dom';

function StormtrooperDeathCounter(sources){
    const temporaryContent$ = Rx.Observable.of('STORMTROOPER DEATH COUNTER');
    return {
        DOM: temporaryContent$.map(temporaryContent =>
            div([
                h1(`${temporaryContent}`),
                p('TODO: Insert component here...')
            ])
        )
    }
}

export default StormtrooperDeathCounter;