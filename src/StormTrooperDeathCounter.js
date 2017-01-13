const Rx = require('rxjs/Rx');

/**
    ########### INTERVAL STREAM ###########
 * */

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
