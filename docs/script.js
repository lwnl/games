import levels from './levels.js';

const stepsDisplay = document.getElementById("steps");
let playerPosition = { row: 3, col: 3 };
let previousStates = [];
let timer;
let timerDuration = 30000;
let steps = 0;
let timeRemaining = timerDuration;
let timerStarted = false;

let level = 0
let columns = 8
let gameBoard = document.querySelector(".game-board");


const backgroundMusic = new Audio('./music/background.mp3')
backgroundMusic.volume = 0.2
backgroundMusic.loop = true;


document.querySelector(".reset-button").addEventListener("click", () => {
  playLoadSound()
  resetGame()
});
document.querySelector(".undo-button").addEventListener("click", undoMove);

const levelNumber = document.querySelector('.levelNumber')

levelNumber.addEventListener('change', () => {
  level = Number(levelNumber.value)
  playLoadSound()
  resetGame()
})

resetGame()
document.addEventListener("keydown", (event) => {
  const key = event.key;
  let newRow = playerPosition.row;
  let newCol = playerPosition.col;

  if (backgroundMusic.paused)
    backgroundMusic.play();

  if (key === "ArrowUp") {
    newRow -= 1;
  } else if (key === "ArrowDown") {
    newRow += 1;
  } else if (key === "ArrowLeft") {
    newCol -= 1;
  } else if (key === "ArrowRight") {
    newCol += 1;
  }

  saveState();
  movePlayer(newRow, newCol);
});

function creatGameBoard(level) {
  gameBoard.innerHTML = ''
  const { levelNumber, matrix, playerCoordinate, outsideCoordinatesArray, wallCoordinatesArray, boxCoordinatesArray, targetCoordinatesArray } = levels[level]
  const { rows, cols } = matrix
  // console.log('rows:', rows, 'cols:', cols)
  columns = cols

  gameBoard.style.setProperty('--rows', rows.toString());
  gameBoard.style.setProperty('--columns', cols.toString());

  for (let i = 1; i <= rows * cols; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    gameBoard.appendChild(cell);
  }

  const playerCell = getCell(playerCoordinate[0], playerCoordinate[1]);
  playerCell.classList.add("player");
  playerPosition.row = playerCoordinate[0];
  playerPosition.col = playerCoordinate[1];


  outsideCoordinatesArray.forEach(([row, col]) => {
    const cell = getCell(row, col);
    cell.classList.add("outside");
  })
  wallCoordinatesArray.forEach(([row, col]) => {
    const cell = getCell(row, col);
    cell.classList.add("wall");
  })
  boxCoordinatesArray.forEach(([row, col]) => {
    const cell = getCell(row, col);
    cell.classList.add("box");
  })
  targetCoordinatesArray.forEach(([row, col]) => {
    const cell = getCell(row, col);
    cell.classList.add("goal");
  })
  return gameBoard.innerHTML
}

function updateTimerDisplay() {
  const timerDisplay = document.getElementById("timer");
  const seconds = Math.ceil(timeRemaining / 1000);
  timerDisplay.textContent = `${seconds}s`;
}

function startTimer() {
  if (timerStarted) return;

  timerStarted = true;
  timeRemaining = timerDuration;
  updateTimerDisplay();

  timer = setInterval(() => {
    timeRemaining -= 1000;

    if (timeRemaining < 0) {
      clearInterval(timer);
      alert("Zeit abgelaufen! Du hast verloren.")
      resetGame()
    } else {
      updateTimerDisplay();
    }
  }, 1000);
}

function saveState() {
  previousStates.push(gameBoard.innerHTML);
}

function movePlayer(newRow, newCol) {
  const newCell = getCell(newRow, newCol);
  const currentCell = getCell(playerPosition.row, playerPosition.col);

  // console.log('newRow:', newRow, 'newCol:', newCol) 
  // console.log('playerPosition.row:', playerPosition.row, 'playerPosition.col:', playerPosition.col)

  if (!timerStarted) {
    startTimer();
  }

  if (newCell && !newCell.classList.contains("wall")) {
    if (newCell.classList.contains("box")) {
      const boxNewRow = newRow + (newRow - playerPosition.row);
      const boxNewCol = newCol + (newCol - playerPosition.col);
      const nextBoxCell = getCell(boxNewRow, boxNewCol);

      if (
        nextBoxCell &&
        !nextBoxCell.classList.contains("wall") &&
        !nextBoxCell.classList.contains("box")
      ) {
        moveBox(newCell, nextBoxCell);
      } else {
        playFailSound()
        return;
      }
    }

    currentCell.classList.remove("player");
    newCell.classList.add("player");
    playerPosition.row = newRow;
    playerPosition.col = newCol;
    playMoveSound()
    steps++;
    stepsDisplay.textContent = `Schritte: ${steps}`;
    checkWinCondition();
  } else {
    playFailSound()
  }
}

function playNextLevelSound() {
  const soundEffectNextLevel = new Audio('./music/nextLevel.mp3');
  soundEffectNextLevel.volume = 1
  soundEffectNextLevel.play();
}

function playCongraSound() {
  const soundEffectCongra = new Audio('./music/congratulations.mp3');
  soundEffectCongra.volume = 1
  soundEffectCongra.play();
}

function playLoadSound() {
  const soundEffectLoad = new Audio('./music/load.mp3');
  soundEffectLoad.volume = 1
  soundEffectLoad.play();
}
function playFailSound() {
  const soundEffectFail = new Audio('./music/fail.mp3');
  soundEffectFail.volume = 1
  soundEffectFail.play();
}

function playMoveSound() {
  const soundEffectMove = new Audio('./music/move.mp3');
  soundEffectMove.volume = 1
  soundEffectMove.play();
}

function moveBox(boxCell, newCell) {
  boxCell.classList.remove("box");
  newCell.classList.add("box");
}

function getCell(row, col) {
  const index = (row - 1) * columns + (col - 1);
  return gameBoard.children[index];
}

function checkWinCondition() {
  const goals = document.querySelectorAll(".goal");
  let allGoalsFilled = true;

  goals.forEach((goal) => {
    if (!goal.classList.contains("box")) {
      allGoalsFilled = false;
    }
  });

  if (allGoalsFilled) {
    clearInterval(timer);
    const player = document.querySelector('.player');
    if (player) {
      playCongraSound()
      player.classList.add('swing');
    }
    setTimeout(() => {
      alert("Du hast gewonnen!")
      level++;
      if (level === levels.length) {
        alert("Du hast alle Level geschafft!");
        level = 0;
      }
      levelNumber.value = level.toString()
      playNextLevelSound()
      resetGame();
    }, 300);
  }
}

function resetGame() {
  gameBoard.innerHTML = creatGameBoard(level)
  previousStates = [];
  backgroundMusic.pause()
  timerStarted = false;
  clearInterval(timer);
  timeRemaining = timerDuration;
  updateTimerDisplay();
  steps = 0;
  stepsDisplay.textContent = `Schritte: ${steps}`;
}

function undoMove() {
  if (previousStates.length > 0) {
    gameBoard.innerHTML = previousStates.pop();

    const playerCell = document.querySelector(".player");
    if (playerCell) {
      const index = Array.from(gameBoard.children).indexOf(playerCell);
      playerPosition.row = Math.floor(index / 8) + 1;
      playerPosition.col = index % 8 + 1;
    }
    playMoveSound()
    steps--;
    stepsDisplay.textContent = `Schritte: ${steps}`;
  }
}
