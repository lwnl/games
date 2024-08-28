document.addEventListener("DOMContentLoaded", () => {
  const gameBoard = document.querySelector(".game-board");
  const initialGameState = gameBoard.innerHTML;
  const stepsDisplay = document.getElementById("steps");
  let playerPosition = { row: 2, col: 2 };
  let previousStates = [];
  let timer;
  let timerDuration = 60000;
  let steps = 0;
  let timeRemaining = timerDuration;
  let timerStarted = false;

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

      if (timeRemaining <= 0) {
        clearInterval(timer);
        alert("Zeit abgelaufen! Du hast verloren.");
        resetGame();
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
          return;
        }
      }

      currentCell.classList.remove("player");
      newCell.classList.add("player");
      playerPosition.row = newRow;
      playerPosition.col = newCol;
      steps++;
      stepsDisplay.textContent = `Schritte: ${steps}`;
      checkWinCondition();
    }
  }

  function moveBox(boxCell, newCell) {
    boxCell.classList.remove("box");
    newCell.classList.add("box");
  }

  function getCell(row, col) {
    const index = row * 8 + col;
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
            player.classList.add('swing');
        }
        setTimeout(() => alert("Du hast gewonnen!"), 100);
    }
  }

  function resetGame() {
    gameBoard.innerHTML = initialGameState;
    playerPosition = { row: 2, col: 2 };
    previousStates = [];
    timerStarted = false;
    clearInterval(timer);
    timeRemaining = timerDuration;
    updateTimerDisplay();
  }

  function undoMove() {
    if (previousStates.length > 0) {
      gameBoard.innerHTML = previousStates.pop();

      const playerCell = document.querySelector(".player");
      if (playerCell) {
        const index = Array.from(gameBoard.children).indexOf(playerCell);
        playerPosition.row = Math.floor(index / 8);
        playerPosition.col = index % 8;
      }
      steps--;
      stepsDisplay.textContent = `Schritte: ${steps}`;
    }
  }

  document.addEventListener("keydown", (event) => {
    const key = event.key;
    let newRow = playerPosition.row;
    let newCol = playerPosition.col;

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

  document.querySelector(".reset-button").addEventListener("click", resetGame);
  document.querySelector(".undo-button").addEventListener("click", undoMove);
});
