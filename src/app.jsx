const { useState, useEffect } = React;

const shipTypes = [
  { name: 'Carrier', size: 5 },
  { name: 'Battleship', size: 4 },
  { name: 'Cruiser', size: 3 },
  { name: 'Submarine', size: 3 },
  { name: 'Destroyer', size: 2 }
];

function createEmptyBoard() {
  return Array.from({ length: 10 }, () => Array(10).fill(null));
}

function placeShip(board, x, y, size, horizontal) {
  if (horizontal) {
    if (x + size > 10) return false;
    for (let i = 0; i < size; i++) if (board[y][x + i]) return false;
    for (let i = 0; i < size; i++) board[y][x + i] = 'S';
  } else {
    if (y + size > 10) return false;
    for (let i = 0; i < size; i++) if (board[y + i][x]) return false;
    for (let i = 0; i < size; i++) board[y + i][x] = 'S';
  }
  return true;
}

function randomPlacement(board) {
  shipTypes.forEach(({ size }) => {
    let placed = false;
    while (!placed) {
      const x = Math.floor(Math.random() * 10);
      const y = Math.floor(Math.random() * 10);
      const horiz = Math.random() < 0.5;
      placed = placeShip(board, x, y, size, horiz);
    }
  });
}

function Game() {
  const [playerBoard, setPlayerBoard] = useState(createEmptyBoard());
  const [computerBoard, setComputerBoard] = useState(createEmptyBoard());
  const [orientation, setOrientation] = useState(true); // true horizontal
  const [placingIndex, setPlacingIndex] = useState(0);
  const [playerTurn, setPlayerTurn] = useState(false);
  const [message, setMessage] = useState('Place your Carrier');
  const [computerTargets, setComputerTargets] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const comp = createEmptyBoard();
    randomPlacement(comp);
    setComputerBoard(comp);
  }, []);

  function handlePlacement(x, y) {
    const ship = shipTypes[placingIndex];
    const board = playerBoard.map(row => row.slice());
    if (placeShip(board, x, y, ship.size, orientation)) {
      setPlayerBoard(board);
      if (placingIndex + 1 < shipTypes.length) {
        setPlacingIndex(placingIndex + 1);
        setMessage(`Place your ${shipTypes[placingIndex + 1].name}`);
      } else {
        setMessage('Your turn!');
        setPlayerTurn(true);
      }
    }
  }

  function shoot(board, x, y) {
    if (board[y][x] === 'H' || board[y][x] === 'M') return { board, hit: false };
    const newBoard = board.map(row => row.slice());
    if (newBoard[y][x] === 'S') {
      newBoard[y][x] = 'H';
      return { board: newBoard, hit: true };
    } else {
      newBoard[y][x] = 'M';
      return { board: newBoard, hit: false };
    }
  }

  function checkWin(board) {
    return board.every(row => row.every(cell => cell !== 'S'));
  }

  function handlePlayerShot(x, y) {
    if (!playerTurn || placingIndex < shipTypes.length) return;
    const res = shoot(computerBoard, x, y);
    setComputerBoard(res.board);
    if (res.hit) {
      setMessage('Hit! Go again.');
      if (checkWin(res.board)) {
        setMessage('You win!');
        setGameOver(true);
        return;
      }
    } else {
      setMessage('Miss. Computer\'s turn.');
      setPlayerTurn(false);
      setTimeout(computerMove, 800);
    }
  }

  function computerMove() {
    setComputerBoard(board => board);
    setPlayerBoard(board => {
      let targets = [...computerTargets];
      let x, y;
      if (targets.length) {
        [x, y] = targets.shift();
      } else {
        do {
          x = Math.floor(Math.random() * 10);
          y = Math.floor(Math.random() * 10);
        } while (board[y][x] === 'H' || board[y][x] === 'M');
      }
      const res = shoot(board, x, y);
      if (res.hit) {
        // add adjacent cells
        [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx, dy]) => {
          const nx = x + dx, ny = y + dy;
          if (nx>=0 && nx<10 && ny>=0 && ny<10 && !['H','M'].includes(res.board[ny][nx]))
            targets.push([nx, ny]);
        });
      }
      setComputerTargets(targets);
      if (checkWin(res.board)) {
        setGameOver(true);
        setMessage('Computer wins!');
        return res.board;
      }
      setTimeout(() => {
        setPlayerTurn(true);
        setMessage('Your turn!');
      }, 500);
      return res.board;
    });
  }

  function resetGame() {
    setPlayerBoard(createEmptyBoard());
    const comp = createEmptyBoard();
    randomPlacement(comp);
    setComputerBoard(comp);
    setOrientation(true);
    setPlacingIndex(0);
    setPlayerTurn(false);
    setMessage('Place your Carrier');
    setComputerTargets([]);
    setGameOver(false);
  }

  const renderBoard = (board, isPlayer, clickHandler) => (
    <div className="board">
      {board.map((row, y) =>
        row.map((cell, x) => {
          let className = 'cell';
          if (cell === 'H') className += ' hit';
          else if (cell === 'M') className += ' miss';
          else if (isPlayer && cell === 'S') className += ' ship';
          return (
            <div key={`${x}-${y}`} className={className}
              onClick={() => clickHandler(x, y)} />
          );
        })
      )}
    </div>
  );

  const status = shipTypes.map(({ name, size }) => {
    const remaining = playerBoard.flat().filter(c => c === 'S').length;
    return <div key={name}>{name}</div>;
  });

  return (
    <div id="game">
      <div className="controls">
        {placingIndex < shipTypes.length && (
          <button onClick={() => setOrientation(!orientation)}>
            Rotate ({orientation ? 'Horizontal' : 'Vertical'})
          </button>
        )}
        <button onClick={resetGame}>Reset</button>
      </div>
      <div className="status">{message}</div>
      <div style={{display:'flex',gap:'20px'}}>
        <div>
          <h3>Your Board</h3>
          {renderBoard(playerBoard, true, (x,y) => placingIndex < shipTypes.length ? handlePlacement(x,y) : null)}
        </div>
        <div>
          <h3>Enemy Board</h3>
          {renderBoard(computerBoard, false, handlePlayerShot)}
        </div>
      </div>
      {gameOver && <div className="status">Game Over</div>}
    </div>
  );
}

ReactDOM.render(<Game />, document.getElementById('root'));

