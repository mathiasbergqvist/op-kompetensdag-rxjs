const Rx = require('rxjs/Rx');

//const Coord = require('./model/Coord');


class Coord {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

function *randomCoords(width = 100, height = 100) {
  const max = 5;
  let counter = 0;

  while (true) {
    yield new Coord(
      getRandomInt(0, width),
      getRandomInt(0, height)
    );
    counter++;
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

// const starsObservable$ = Rx.Observable.from(random(window.innerWidth, window.innerHeight));

// starsObservable.subscribe(
//   function (pos) { console.log('next', pos.x, pos.y); },
//   function (e) { console.log('error %s', e); },
//   function () { console.log('completed'); }
// );

const coords = randomCoords(window.innerWidth, window.innerHeight);
const nextCoord = () => coords.next();

const enterPress$ = Rx.Observable.fromEvent(document, 'keyup').filter(e => e.keyCode == 13);

const startStarsButton = document.querySelector('#start-stars');
const startStars$ = Rx.Observable.fromEvent(startStarsButton, 'click');

const stopStarsButton = document.querySelector('#stop-stars');
const stopStars$ = Rx.Observable.fromEvent(stopStarsButton, 'click');

const interval$ = Rx.Observable.interval(1);
const doInterval$ = interval$
    .takeUntil(enterPress$);

startStars$
  .switchMapTo(doInterval$)
  .map(nextCoord)
  .subscribe(
    function (n) {
      if (!n.done) {
        console.log(n.value.x, n.value.y);
        addStar(n.value.x, n.value.y);
      }
    },
    function (e) { console.log('error %s', e); },
    function () { console.log('completed'); }
  );

startStars$
.subscribe(
  function (n) {
    const container = document.querySelector('#stars-container');
    container.style.background = 'black';
    container.style.zIndex = 99;
    container.style.opacity = 0.9;
  },
  function (e) { console.log('error %s', e); },
  function () { console.log('completed'); }
);


function addStar(x, y) {
  const star = document.createElement('div');
  star.className = 'star';
  star.style.top = y + 'px';
  star.style.left = x + 'px';
  const container = document.querySelector('#stars-container');
  container.appendChild(star);

}
