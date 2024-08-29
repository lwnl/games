import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import readline from 'readline';
import readlineSync from 'readline-sync';
import { fileURLToPath } from 'url';

// snake();

function snake() {

  // set the input mode of the terminal
  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }

  let head = [19, 11];
  let headCoordinateArray = [[19, 11]];
  let currentDirection = ''
  let bodyLength = 0;
  let speed = 250; // Speed of the snake
  let n = 5; // Number of food
  let foodArray = [];
  let gameInterval = null;

  // Listen for keypress events
  process.stdin.on('keypress', (str, key) => {
    if (['up', 'down', 'left', 'right'].includes(key.name)) {
      // Only update direction and reset timer if the new direction is different from the current direction
      if (key.name !== currentDirection) {
        currentDirection = key.name;  // Update the current direction
        if (gameInterval) clearInterval(gameInterval);  // Stop the current timer

        gameInterval = setInterval(() => {
          updateGameArea(currentDirection);
        }, speed);
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

    // Generate random food coordinates
    foodArray = generateFood(n);

    // Update the game area with the food
    addFood(foodArray);

    console.log(`\nWelcome to the snake game! Use the arrow keys to move the snake. Speed = ${speed}ms, Number of food = ${n}\n`);
  }

  // Generate n random food coordinates within the 19x23 game area
  function generateFood(n) {
    let food = [];
    let x
    let y
    do {
      let isPositionValid = true;
      x = Math.floor(Math.random() * 19);
      y = Math.floor(Math.random() * 23);
      if (x === 19 && y === 11) {
        isPositionValid = false;
      }
      for (const [fx, fy] of food) {
        if (x === fx && y === fy) {
          isPositionValid = false;
          break;
        }
      }
      if (isPositionValid) {
        food.push([x, y]);
      }
    } while (food.length < n)
    // for (let i = 0; i < n; i++) {
    //   let x = Math.floor(Math.random() * 19);
    //   let y = Math.floor(Math.random() * 23);
    //   food.push([x, y]);
    // }
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
    if (x < 0 || x > 19 || y < 0 || y > 22)
      hitWall = true;
    let hitBody = false;
    // get the current body position
    let bodyArray = []
    for (let i = 0; i < bodyLength; i++) {
      bodyArray.push(headCoordinateArray[headCoordinateArray.length - 2 - i]);
    }

    // check if the snake head has hit the body
    if (bodyArray.length > 0) {
      const [b0x, b0y] = bodyArray[0];
      // if snake head is left to the body and direction is right
      if (head[0] === b0x && head[1] <= b0y && direction === 'right') {
        hitBody = true;
      }
      // if snake head is right to the body and direction is left
      if (head[0] === b0x && head[1] >= b0y && direction === 'left') {
        hitBody = true;
      }
      // if snake head is above the body and direction is down
      if (head[0] <= b0x && head[1] === b0y && direction === 'down') {
        hitBody = true;
      }
      // if snake head is below the body and direction is up
      if (head[0] >= b0x && head[1] === b0y && direction === 'up') {
        hitBody = true;
      }
    }
    // if the snake run into itself, game over
    for (let i = 1; i < bodyLength; i++) {
      const [x, y] = bodyArray[i];
      if (head[0] === x && head[1] === y) {
        hitBody = true;
        break;
      }
    }

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
      head = [x - 1, y]
    } else if (direction === 'down') {
      head = [x + 1, y]
    } else if (direction === 'left') {
      head = [x, y - 1]
    } else if (direction === 'right') {
      head = [x, y + 1]
    }
    // save the position of the snake head for next round
    headCoordinateArray.push(head);

    // calculate the position of the snake body for next round
    let bodyArrayNextRound = []
    for (let i = 0; i < bodyLength; i++) {
      // save the position of the snake body for next round
      if (head[0] < 0 || head[0] > 19 || head[1] < 0 || head[1] > 22) {
        bodyArrayNextRound.push(headCoordinateArray[headCoordinateArray.length - 3 - i]);
      } else {
        bodyArrayNextRound.push(headCoordinateArray[headCoordinateArray.length - 2 - i]);
      }
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
    let hx = head[0];
    if (hx < 0) {
      hx = 0;
    } else if (hx > 19) {
      hx = 19;
    }
    let hy = head[1];
    if (hy < 0) {
      hy = 0;
    } else if (hy > 22) {
      hy = 22;
    }
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
    clearInterval(gameInterval); // Stop the timer
    console.log('Game over!');
    process.exit();
  }

  // Split a string into chunks of a specific size
  function splitIntoChunks(str, chunkSize) {
    console.log(str)
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
}

export default snake;