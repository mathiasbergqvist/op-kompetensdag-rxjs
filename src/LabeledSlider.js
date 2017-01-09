const Rx = require('rxjs/Rx');
import {div, span, input} from '@cycle/dom';

function intent(DOMSource) {
    return DOMSource.select('.slider').events('input')
        .map(event => event.target.value);
}

function model(newValue$, props$) {
    const initialValue$ = props$
        .map(props => props.init).first();
    const value$ = initialValue$.concat(newValue$);
    return Rx.Observable.combineLatest (
        value$,
        props$,
        (value, props) => {
            return {
                label: props.label,
                span: props.span,
                min: props.min,
                max: props.max,
                value: value
            }
        });
}

function view(state$) {
    return state$.map(state =>
        div('.labeled-slider', [
            div('.label', `${state.label}`),
            span('.amount-span', `${state.span}${state.value}`),
            input('.slider', {attrs: {type: "range", min: state.min, max: state.max, value: state.value}})
        ])
    );
}

function LabeledSlider(sources) {
    const change$ = intent(sources.DOM);
    const state$ = model(change$, sources.props);
    const ui$ = view(state$);
    return {
        DOM: ui$,
        value: state$.map(state => state.value)
    };
}

export default LabeledSlider;