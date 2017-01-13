const Rx = require('rxjs/Rx');
import {div, p, fieldset, legend, button} from '@cycle/dom';


function view(state$) {
    return state$.map(state =>
        div('#death-counter', [
            fieldset([
                legend('STORMTROOPER DEATH COUNTER'),
                button('#start', 'Start'),
                button('#stop', 'Stop'),
                button('#reset', 'Reset'),
                p('counter',`${state.value}`)
            ])
        ])
    );
}

function model(start$, incrementOrReset$, data){
    start$
        .switchMapTo(incrementOrReset$)
        .startWith(data)
        .scan((accumulated, current) => current(accumulated))
        .map(value => {
            return {
                value: value
            }
        });
}


function StormtrooperDeathCounter(sources) {

    const DOMSource = sources.DOM;
    const start$ = DOMSource.select('#start').events('click');
    const stop$ = DOMSource.select('#stop').events('click');
    const reset$ = DOMSource.select('#reset').events('click');
    const interval$ = Rx.Observable.interval(1000);

    const data = {count: 0};
    const increment = (currentValue) => ({count : currentValue.count + 1});
    const reset = (currentValue) => data;

    const stopInterval$ = interval$
        .takeUntil(stop$);

    const incrementOrReset$ = Rx.Observable.merge (
        stopInterval$.mapTo(increment),
        reset$.mapTo(reset)
    );

    const model$ = model(start$, incrementOrReset$, data);
    const ui$ = view(model$);

    return {
        DOM: ui$
    }
}

export default StormtrooperDeathCounter;