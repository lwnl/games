import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import readline from 'readline';
import readlineSync from 'readline-sync';
import { fileURLToPath } from 'url';

// set the condition of game over
// set the condition of success
// write the function of growingUp
// write the function of moveBody

// set the input mode of the terminal
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
}

let head = [19, 11];
let headCoordinateArray = [[19, 11]];
let bodyLength = 0;
let speed = 300; // Speed of the snake
let n = 5; // Number of food
let foodArray = [];
const timers = { up: null, down: null, left: null, right: null };

// Listen for keypress events
process.stdin.on('keypress', (str, key) => {
  if (['up', 'down', 'left', 'right'].includes(key.name)) {
    closeTimersExcept(key.name);  // Close timers for other directions

    if (!timers[key.name]) {  // Only start a new timer if the current direction's timer is not running
      timers[key.name] = setInterval(() => { headMove(key.name); }, speed);
    }
  } else if (key.ctrl && key.name === 'c') {
    process.exit();  // Exit the program when Ctrl + C is pressed
  }
});

console.clear();

// Get the path of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, 'snake.md');

initialization()

// Close the timers except the current direction
function closeTimersExcept(except) {
  for (const direction in timers) {
    if (direction !== except && timers[direction]) {
      clearInterval(timers[direction]);
      timers[direction] = null;  // reset the timer to null
    }
  }
}


// Initialize a 19x23 game area
function initialization() {
  let gameArea = [];
  for (let i = 0; i < 20; i++) {
    let Row = '';
    for (let j = 0; j < 23; j++) {
      if (i === 19 && j === 11) {
        Row += '🟨';
      } else {
        Row += '⬜️';
      }
    }
    gameArea.push(Row);
  }
  // Transform the gameArea to a string data and save it
  const originalGameArea = gameArea.join('\n');
  saveGameArea(originalGameArea);

  // 在19*23的矩阵内，随机生成n个食物坐标
  foodArray = generateFood(n);

  // Update the game area with the food
  addFood(foodArray);

  console.log(`\nWelcome to the snake game! Use the arrow keys to move the snake. Speed = ${speed}ms, Number of food = ${n}\n`);
}
// Close all timers
function closeAllTimers() {
  for (const direction in timers) {
    if (timers[direction]) {
      clearInterval(timers[direction]); // Stop the timer
      timers[direction] = null;         // Reset the timer to null
    }
  }
}

// Generate n random food coordinates within the 19x23 game area
function generateFood(n) {
  let food = [];
  for (let i = 0; i < n; i++) {
    let x = Math.floor(Math.random() * 19);
    let y = Math.floor(Math.random() * 23);
    food.push([x, y]);
  }
  return food;
}

// Add the food to the game area
function addFood(food) {
  let gameArea = readFileSync(filePath, 'utf8');
  let gameAreaArray = gameArea.split('\n');

  for (const [x, y] of food) {
    let row = splitIntoChunks(gameAreaArray[x], 2);
    row[y] = '🍎';
    gameAreaArray[x] = row.join('');
  }

  saveGameArea(gameAreaArray.join('\n'));
}

// Move the snake head

function headMove(direction) {
  const [x, y] = head;
  // Check if the snake head has eaten the food
  foodArray.forEach((food, index) => {
    if (food[0] === head[0] && food[1] === head[1]) {
      foodArray.splice(index, 1);  // Remove the food that was eaten
      bodyLength++
      // grow the snake body and let the body move following the head
      buildBody(bodyLength);
    }
  });
  showBody();
  // move head
  switch (direction) {
    case 'up':
      // Check if moving up is within bounds
      if (x <= 0) {
        gameOver();
        return;
      }
      updateGameArea(head, '🟨', 'up');
      // Update the head position
      if (x === 0) {
        console.log('Game over!');
        return;
      }
      head = [x - 1, y];
      headCoordinateArray.push(head);
      break;
    case 'down':
      // Check if moving down is within bounds
      if (x >= 19) {
        gameOver();
        return;
      }
      updateGameArea(head, '🟨', 'down');
      // Update the head position
      if (x === 19) {
        console.log('Game over!');
        return;
      }
      head = [x + 1, y];
      headCoordinateArray.push(head);
      break;
    case 'left':
      // Check if moving left is within bounds
      if (y <= 0) {
        gameOver();
        return;
      }
      updateGameArea(head, '🟨', 'left');
      // Update the head position
      if (y === 0) {
        console.log('Game over!');
        return;
      }
      head = [x, y - 1];
      headCoordinateArray.push(head);
      break;
    case 'right':
      // Check if moving right is within bounds
      if (y >= 22) {
        gameOver();
        return;
      }
      updateGameArea(head, '🟨', 'right');
      // Update the head position
      if (y === 22) {
        console.log('Game over!');
        return;
      }
      head = [x, y + 1];
      headCoordinateArray.push(head);
      break;
    default:
      break;
  }
}

function buildBody(length) {
  // Grow the snake body
  let bodyArray = [];
  for (let i = 0; i < length; i++) {

  }
  let lastBody = headCoordinateArray[headCoordinateArray.length - 2];
  let lastBodyRow = lastBody[0];
  let lastBodyColumn = lastBody[1];
  let lastBodySign = '🟨';
  updateGameArea(lastBody, lastBodySign, 'up');
  headCoordinateArray.pop();
  headCoordinateArray.push([lastBodyRow, lastBodyColumn]);
}

function moveBody() {
  // Move the snake body

}

function updateGameArea(movingPoint, sign, direction) {
  const [x, y] = movingPoint;

  // Read the game area from the file
  let gameArea = readFileSync(filePath, 'utf8');
  let gameAreaArray = gameArea.split('\n');

  // Clear the current position of the snake head
  let movingPointRow = splitIntoChunks(gameAreaArray[x], 2);
  movingPointRow[y] = '⬜️';
  gameAreaArray[x] = movingPointRow.join('');

  // Update the new position of the snake head
  let nextMovingPointRow
  switch (direction) {
    case 'up':
      nextMovingPointRow = splitIntoChunks(gameAreaArray[x - 1], 2);
      nextMovingPointRow[y] = sign;
      gameAreaArray[x - 1] = nextMovingPointRow.join('');
      break;
    case 'down':
      nextMovingPointRow = splitIntoChunks(gameAreaArray[x + 1], 2);
      nextMovingPointRow[y] = sign;
      gameAreaArray[x + 1] = nextMovingPointRow.join('');
      break;
    case 'left':
      nextMovingPointRow = splitIntoChunks(gameAreaArray[x], 2);
      nextMovingPointRow[y - 1] = sign;
      gameAreaArray[x] = nextMovingPointRow.join('');
      break;
    case 'right':
      nextMovingPointRow = splitIntoChunks(gameAreaArray[x], 2);
      nextMovingPointRow[y + 1] = sign;
      gameAreaArray[x] = nextMovingPointRow.join('');
      break;
    default:
      break;
  }


  // Save the updated game area
  saveGameArea(gameAreaArray.join('\n'));
}


function gameOver() {
  closeAllTimers()
  console.log('Game over!');
  console.log('foodArray:', foodArray);
  console.log('Your score:', headCoordinateArray.length);
  process.exit();
}

// Split a string into chunks of a specific size
function splitIntoChunks(str, chunkSize) {
  let result = [];
  for (let i = 0; i < str.length; i += chunkSize) {
    result.push(str.slice(i, i + chunkSize));
  }
  return result;
}
// save and print game area
function saveGameArea(gameArea) {
  try {
    writeFileSync(filePath, gameArea, 'utf8');
  } catch (error) {
    console.error('Error saving data to file:', error);
  }
  const gameAreaArray = gameArea.split('\n');
  console.clear();
  for (const row of gameAreaArray) {
    console.log(row);
  }
}