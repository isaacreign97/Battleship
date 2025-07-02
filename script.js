const board = document.getElementById('board');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const shotsEl = document.getElementById('shots');
const hitsEl = document.getElementById('hits');
const missesEl = document.getElementById('misses');
const logEl = document.getElementById('log');

let shots = 0;
let hits = 0;
let misses = 0;
let running = false;

function initBoard() {
    board.innerHTML = '';
    for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener('click', cellClicked);
            board.appendChild(cell);
        }
    }
}

function cellClicked(e) {
    if (!running) return;
    const cell = e.target;
    if (cell.classList.contains('hit') || cell.classList.contains('miss')) return;
    shots++;
    shotsEl.textContent = shots;
    // simple random hit/miss simulation
    if (Math.random() < 0.3) {
        cell.classList.add('hit');
        hits++;
        hitsEl.textContent = hits;
        addLog(`Hit at (${cell.dataset.row}, ${cell.dataset.col})`);
    } else {
        cell.classList.add('miss');
        misses++;
        missesEl.textContent = misses;
        addLog(`Miss at (${cell.dataset.row}, ${cell.dataset.col})`);
    }
}

function addLog(text) {
    const li = document.createElement('li');
    li.textContent = text;
    logEl.prepend(li);
}

startBtn.addEventListener('click', () => {
    running = true;
    addLog('Game started');
});

resetBtn.addEventListener('click', () => {
    shots = hits = misses = 0;
    shotsEl.textContent = hitsEl.textContent = missesEl.textContent = 0;
    logEl.innerHTML = '';
    initBoard();
    running = false;
    addLog('Game reset');
});

initBoard();
