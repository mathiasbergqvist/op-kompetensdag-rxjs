const Rx = require('rxjs/Rx');
import {div, fieldset, legend, label, span, br, p} from '@cycle/dom';
import isolate from '@cycle/isolate';
import LabeledSlider from './LabeledSlider';

const IsolatedLabeledSlider = function (sources) {
    return isolate(LabeledSlider)(sources);
};

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

function JediScoreboard(sources) {

    const stormTrooperDeathCounterProps$ = Rx.Observable.of({
        label: 'How many stormtroopers did you kill today?',
        span: '#',
        min: 0,
        max: 100,
        init: 40
    });

    const stormTrooperDeathCounterSinks = IsolatedLabeledSlider({
        DOM: sources.DOM,
        props: stormTrooperDeathCounterProps$
    });

    const stormTrooperDeathCounterUi$ = stormTrooperDeathCounterSinks.DOM;
    const stormTrooperDeathCounterValue$ = stormTrooperDeathCounterSinks.value;

    const wookieDeathCounterProps$ = Rx.Observable.of({
        label: 'How many wookies did you ACCIDENTALLY kill today?',
        span: '#',
        min: 0,
        max: 50,
        init: 5
    });

    const wookieDeathCounterSinks = IsolatedLabeledSlider({
        DOM: sources.DOM,
        props: wookieDeathCounterProps$
    });
    const wookieDeathCounterUi$ = wookieDeathCounterSinks.DOM;
    const wookieDeathCounterValue$ = wookieDeathCounterSinks.value;

    const jediScore$ = Rx.Observable.combineLatest(
        stormTrooperDeathCounterValue$,
        wookieDeathCounterValue$,
        (stormTrooperDeathCounterValue, wookieTrooperDeathCounterValue) => {
            const stormtrooperScore = stormTrooperDeathCounterValue * 0.7;
            const wookieScore = wookieTrooperDeathCounterValue * 1.3;
            return Math.round(stormtrooperScore - wookieScore);
        }
    );

    const jediScoreboard$ = Rx.Observable.combineLatest (
        jediScore$,
        stormTrooperDeathCounterUi$,
        wookieDeathCounterUi$,
        (jediScore, stormTrooperDeathCounterUi, wookieDeathCounterUi) =>
            div([
                fieldset([
                    legend('JEDI SCOREBOARD'),
                    stormTrooperDeathCounterUi,
                    br(),
                    wookieDeathCounterUi,
                    p('#jedi-score', `Jedi score: ${jediScore}`),
                    p('#jedi-verdict', `Jedi verdict: "${getJediVerdict(jediScore)}"`)
                ])
            ])
    );

    return {
        DOM: jediScoreboard$
    }
}

export default JediScoreboard;