import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import readline from 'readline';
import readlineSync from 'readline-sync';
import { fileURLToPath } from 'url';

// set the condition of game over

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
      timers[key.name] = setInterval(() => { updateGameArea(key.name); }, speed);
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


function updateGameArea(direction) {

  // check the current position of the snake head
  const [x, y] = head;
  // set the condition of game over
  // check if the snake head has hit the wall
  let hitWall = false;
  if (x < 0 || x > 19 || y < 0 || y > 23) 
    hitWall = true;
  let hitBody = false;
  // get the current body position
  let bodyArray = []
  for (let i = 0; i < bodyLength; i++) {
    bodyArray.push(headCoordinateArray[headCoordinateArray.length - 2 - i]);
  }
  // check if the snake head has hit the body
  bodyArray.forEach((body) => {
    if (body[0] === x && body[1] === y) {
      hitBody = true;
    }
  })

  if (hitWall || hitBody)
    gameOver();

  // check if the snake head has eaten the food
  foodArray.forEach((food, index) => {
    if (food[0] === x && food[1] === y) {
      foodArray.splice(index, 1);  // Remove the food that was eaten
      if (foodArray.length === 0) {
        console.log('Congratulations! You have eaten all the food!');
        process.exit();
      }
      bodyLength++
      // grow the snake body and let the body move following the head
    }
  })

  // show position of next round

  // calculate the position of the snake head for next round
  if (direction === 'up') {
    head = [x - 1, y];
  } else if (direction === 'down') {
    head = [x + 1, y];
  } else if (direction === 'left') {
    head = [x, y - 1];
  } else if (direction === 'right') {
    head = [x, y + 1];
  }
  // save the position of the snake head for next round
  headCoordinateArray.push(head);

  // calculate the position of the snake body for next round
  let bodyArrayNextRound = []
  for (let i = 0; i < bodyLength; i++) {
    // save the position of the snake body for next round
    bodyArrayNextRound.push(headCoordinateArray[headCoordinateArray.length - 2 - i]);
  }



  // Read the game area from the file
  let gameArea = readFileSync(filePath, 'utf8');
  let gameAreaArray = gameArea.split('\n');

  // replace all positions with '⬜️'
  for (let i = 0; i < 20; i++) {
    let row = splitIntoChunks(gameAreaArray[i], 2);
    for (let j = 0; j < 23; j++) {
      row[j] = '⬜️';
    }
    gameAreaArray[i] = row.join('');
  }


  // show Game interface for next round
  // show snake head
  const hx = head[0];
  const hy = head[1];
  let headRowNextRound = splitIntoChunks(gameAreaArray[hx], 2);
  headRowNextRound[hy] = '🟨';
  gameAreaArray[hx] = headRowNextRound.join('');

  // show snake body
  for (const [x, y] of bodyArrayNextRound) {
    let bodyRowNextRound = splitIntoChunks(gameAreaArray[x], 2);
    bodyRowNextRound[y] = '🟫';
    gameAreaArray[x] = bodyRowNextRound.join('');
  }

  // show food
  for (const [x, y] of foodArray) {
    let foodRowNextRound = splitIntoChunks(gameAreaArray[x], 2);
    foodRowNextRound[y] = '🍎';
    gameAreaArray[x] = foodRowNextRound.join('');
  }

  // Save the updated game area
  saveGameArea(gameAreaArray.join('\n'));
}


function gameOver() {
  closeAllTimers()
  console.log('Game over!');
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