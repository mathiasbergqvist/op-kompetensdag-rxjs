const Rx = require('rxjs/Rx');

const height = 5;
const width = 7;
function findCell(x, y) {
    return document.getElementById("cell-" + x + "-" + y);
}

function renderCell(x, y, hasBeam, hasTarget, hasCollision) {
    let cell = findCell(x, y);
    if (hasCollision) {
        cell.textContent = "🔥"
    } else if (hasTarget) {
        cell.textContent = "👹";
    } else if (hasBeam) {
        cell.textContent = "💥";
    } else {
        return cell.textContent = "";
    }
}

function renderView(model) {
    const beams = model.beams;
    for (let col = 0; col < width; col++) {
        for (let row = 0; row < height; row++) {
            const hasBeam = beams.some(beam => beam.col === col && beam.row === row);
            const hasTarget = col === width - 1 && model.pos === row;
            const hasCollision = hasTarget && model.hit;
            renderCell(col, row, hasBeam, hasTarget, hasCollision);
        }
    }
    document.getElementById("number-of-hits").textContent = model.numberOfHits;
}

const gameTick$ = Rx.Observable.interval(100).map(_ => {
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

const beams$ = Rx.Observable.merge(shots$, gameTick$)
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
                    .filter(beam => beam.col < width);
            default:
                return beams;
        }
    }, []);

const targetPosition$ = Rx.Observable.interval(200)
    .map(_ => Math.random())
    .map(random => {
        if (random < 0.1) return -1;
        else if (random > 0.9) return 1;
        else return 0;
    }, 0)
    .filter(direction => direction !== 0)
    .scan((pos, direction) =>  Math.min(Math.max(0, pos + direction), height - 1))
    .startWith(0);


Rx.Observable.combineLatest(beams$, targetPosition$, function (beams, pos) {
    return {
        hit: beams.some(beam => beam.col === width - 1 && beam.row === pos),
        pos: pos,
        beams: beams
    }
}).scan((model, newModel) => {
    let numberOfHits = model.numberOfHits || 0;
    if (newModel.hit && !model.hit) {
        numberOfHits++;
    }
    return {
        hit: newModel.hit,
        pos: newModel.pos,
        beams: newModel.beams,
        numberOfHits: numberOfHits
    }
}).subscribe(model => {
        renderView(model)
    });
