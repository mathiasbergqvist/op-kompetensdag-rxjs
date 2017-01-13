const Rx = require('rxjs/Rx');

const height = 5;
const width = 7;
function findCell(x, y) {
    return document.getElementById("cell-" + x + "-" + y);
}

function renderCell(x, y, hasBeam) {
    let cell = findCell(x, y);
    cell.textContent = hasBeam ? "💥" :  "";
}

// vi får inte rensa alla fält det kan ju vara en beam i någon
function renderTable(beams) {
    for (let col = 0; col < width; col++) {
        for (let row = 0; row < height; row++) {
            const hasBeam = beams.some(beam => beam.col === col && beam.row === row);
            renderCell(col, row, hasBeam);
        }
    }
}

function renderTarget(pos) {
    for (let row = 0; row < height; row++) {
        document.getElementById("cell-" + (width - 1) + "-" + row).textContent = pos === row ? "👹" : "";
    }
}

const gameTick$ = Rx.Observable.interval(200).map(_ => {
    return {action: "tick"}
});

const shoot = [0, 1, 2, 3, 4]
    .map(row => {
        const button = document.getElementById('button-' + row);
        return Rx.Observable.fromEvent(button, 'click')
            .map(event => {
                return {action: "newbeam", row}
            })
    });

const shots$ = Rx.Observable.merge.apply(Rx.Observable, shoot);

const gameEvents$ = Rx.Observable.merge(shots$, gameTick$);

const beams$ = gameEvents$
    .scan((beams, event) => {
        switch (event.action) {
            case "newbeam":
                if (beams.some(beam => beam.row === event.row && beam.col === 0)) {
                    return beams;
                } else {
                    return beams.concat({row: event.row, col: 0});
                }
            case "tick":
                return beams.map(beam => {return {row: beam.row, col: beam.col + 1}})
                    .filter(beam => beam.col <= width + 1);
            default:
                return beams;
        }
    }, []);

beams$.subscribe(renderTable);

const targetPosition$ = Rx.Observable.interval(200)
    .map(_ => Math.random())
    .map(random => {
        if (random < 0.1) return -1;
        else if (random > 0.9) return 1;
        else return 0;
    }, 0)
    .scan((pos, direction) =>  Math.min(Math.max(0, pos + direction), height - 1));


// någon bugg med detta
Rx.Observable.combineLatest(beams$, targetPosition$, function (beams, pos) {
    return {
        hit: beams.some(beam => beam.col === width - 1 && beam.row === pos),
        pos: pos
    }
})
    .filter(zipped => zipped.hit)
    .subscribe(zipped => console.log("Träff"));

targetPosition$.subscribe(renderTarget);

