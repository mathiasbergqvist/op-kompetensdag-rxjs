const Rx = require('rxjs/Rx');

var source = Rx.Observable.interval(400).take(6)
    .map(i => ['1', '1', '13', '27', 'foo', 'bar'][i]);

var result = source;

result.subscribe(x => console.log(x));
