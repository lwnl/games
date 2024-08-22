import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import rs from 'readline-sync';
import readline from 'readline';
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
  if (key.name === 'up') {
      console.log('向上');
  } else if (key.name === 'down') {
      console.log('向下');
  } else if (key.name === 'left') {
      console.log('向左');
  } else if (key.name === 'right') {
      console.log('向右');
  } else if (key.ctrl && key.name === 'c') {
      process.exit();
  }
})

console.clear();

// Get the path of the current file
const __filename = fileURLToPath(import.meta.url);
// Get the directory of the current file
const __dirname = path.dirname(__filename);
// Use absolute path
const filePath = path.join(__dirname, 'snake.md');

// initialize a 20x20 chessboard
let gameArea = [];
for (let i = 1; i <= 19; i++) {
  let Row = ''
  for (let j = 1; j <= 19; j++) {
    if (i === 19 && j === 10) {
      Row += '🟨 ';
    } else {
      Row += '⬜️ ';
    }
  }

  gameArea.push(Row);
}
// transform the chessboard to a string
const originalGameArea = gameArea.join('\n');
saveGameArea(originalGameArea)

// input player name
console.log('\nWelcome to the snake game!');
const player_1 = rs.question('Please enter name of Player_1:');

const positionArray = [];

// Main game loop
// while (true) {
//   // Player 1's move
//   playAndSave(player_1);

//   // Player 2's move
//   playAndSave(player_2);
// }


function playAndSave(player) {
  let chess, position
  let validMove = true;
  if (player === player_1) {
    chess = '🟤';
  }
  if (player === player_2) {
    chess = '⚪️';
  }
  console.log(`
Hi, ${player}, your chess color is ${chess}, it's your turn!`);

  do {
    if (!validMove) {
      console.log('Invalid move! Please try again.');
    }
    position = rs.question('Please enter the row and column coordinates: ').replace(/\s+/g, '');
    validMove = validatePosition(position).validMove;
  } while (!validMove);
  positionArray.push(validatePosition(position).row + validatePosition(position).column);
  const rowNumber = validatePosition(position).row;
  const columnLetter = validatePosition(position).column;

  let currtenChessboard = placeChess(rowNumber, columnLetter, chess)
  saveChessboard(currtenChessboard)

  const isWinner = checkWinner(currtenChessboard, chess);
  if (isWinner) {
    console.log(
      `
Congratulations!
After ${Math.ceil(positionArray.length / 2)} moves,
${player} wins!
`);
    process.exit();
  }
}


// Write the chessboard string to a file named chess.md
function saveGameArea(chessboard) {

  try {
    writeFileSync(filePath, chessboard, 'utf8');
  } catch (error) {
    console.error('Error saving data to file:', error);
  }
  const chessboardArray = chessboard.split(' ').join('').split('\n');
  for (let i = 0; i < 19; i++) {
    console.log(chessboardArray[i]);
  }
}



