import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import rs from 'readline-sync';

console.clear();

// Get the path of the current file
const __filename = fileURLToPath(import.meta.url);
// Get the directory of the current file
const __dirname = path.dirname(__filename);
// Use absolute path
const filePath = path.join(__dirname, 'Othello.md');


// initialize a 8x8 chessboard
let chessboard = [];
for (let i = 1; i <= 8; i++) {
  let chessboardRow = ''
  for (let j = 1; j <= 8; j++) {

    if (i === 4 && j === 4) {
      chessboardRow += '⚪️ ';
    } else if (i === 4 && j === 5) {
      chessboardRow += '🟤 ';
    } else if (i === 5 && j === 5) {
      chessboardRow += '⚪️ ';
    } else if (i === 5 && j === 4) {
      chessboardRow += '🟤 ';
    } else {
      chessboardRow += '🟩 ';
    }
  }
  chessboard.push(chessboardRow);
}
chessboard.push(' A  B  C  D  E  F  G  H')
// transform the chessboard to a string
const originalChessboard = chessboard.join('\n');

saveChessboard(originalChessboard)

// input player name
console.log('\nWelcome to the chess game!');
const player_1 = rs.question('Please enter name of Player_1: ');
const player_2 = rs.question('Please enter name of Player_2, press enter to play with computer: ');
if (player_2 === '') {
  player_2 = 'Computer';
}

let positionArray = ['4d', '4e', '5d', '5e'];
// Main game loop
while (true) {
  // Player 1's move
  playAndSave(player_1);

  // Player 2's move
  playAndSave(player_2);
}

function playAndSave(player) {
  let chess, validation
  let validMove = true;

  
  if (player === player_1) {
    chess = '🟤';
  }
  if (player === player_2) {
    chess = '⚪️';
  }

  showPossibleMoves(chess)

  console.log(`
Hi, ${player}, your chess color is ${chess}, it's your turn!`);



  do {
    do {
      if (!validMove) {
        console.log('Invalid move! Please try again.');
      }
      const position = rs.question('Please enter the row and column coordinates: ').replace(/\s+/g, '');
      validation = validatePosition(position)
      validMove = validation.validMove;
    } while (!validMove);


    const rowNumber = validation.row;
    const columnLetter = validation.column;

    positionArray.push(rowNumber + columnLetter);

    const currtenChessboard = placeChess(rowNumber, columnLetter, chess) // return a string of chessboard
    validMove = followRules(currtenChessboard, chess)
  } while (!validMove)

  const chessboardString = convertCheckArrayToChessboard(validMove)// validMove is a 2D array of the chessboard
  saveChessboard(chessboardString)
}

function showPossibleMoves(chess) {
  // turn the chessboard to a checkArray
  let chessboard = readFileSync(filePath, 'utf8');
  let chessboardRows = chessboard.split(' ').join('')
  let chessboardRowsArray = chessboardRows.split('\n');
  chessboardRowsArray.pop(); // Remove the last row
  let checkArray = chessboardRowsArray.map(row => row.replace(/🟤/g, '1').replace(/⚪️/g, '2').replace(/🟩|⬛️/g, '.'));
  const currentChessNumber = chess === '🟤' ? '1' : '2';
  const opponentChessNumber = currentChessNumber === '1' ? '2' : '1';


  // find all the location of the current chess, put them into an array

  const currentChessLocationArray = []
  checkArray.forEach((row, rowIndex) => {
    row.split('').forEach((chess, columnIndex) => {
      if (chess === currentChessNumber) {
        currentChessLocationArray.push([rowIndex, columnIndex])
      }
    })
  })

  // find all the possible moves
  const possibleMoves = []
  const directions = [
    { dr: -1, dc: 0 },  // up
    { dr: 1, dc: 0 },   // down
    { dr: 0, dc: -1 },  // left
    { dr: 0, dc: 1 },   // right
    { dr: -1, dc: -1 }, // up-left
    { dr: -1, dc: 1 },  // up-right
    { dr: 1, dc: -1 },  // down-left
    { dr: 1, dc: 1 }    // down-right
  ];

  for (const [r, c] of currentChessLocationArray) {
    for (const { dr, dc } of directions) {
      let row = r + dr;
      let column = c + dc;
      let foundOpponentChessNumber = false;
      let foundEmpty = false;
      while (row >= 0 && row < 8 && column >= 0 && column < 8) {
        if (checkArray[row][column] === opponentChessNumber) {
          do {
            row += dr;
            column += dc;
            if (row >= 0 && row < 8 && column >= 0 && column < 8) {
              if (checkArray[row][column] === opponentChessNumber) {
                continue;
              } else if (checkArray[row][column] === '.') {
                foundEmpty = true;
                possibleMoves.push([row, column])
                break;
              }
            } else {
              break;
            }
          } while (true)
        } 
        row += dr;
        column += dc;
      }
    }
  }

  // put the possible moves into checkArray, possible moves are marked as '3'
  possibleMoves.forEach(([r, c]) => {
    checkArray[r] = checkArray[r].split('');
    checkArray[r][c] = '3';
    checkArray[r] = checkArray[r].join('');
  })

  console.log('checkArray = ', checkArray)  

  // turn the checkArray to a chessboardArray
  const chessboardString = convertCheckArrayToChessboard(checkArray)
  saveChessboard(chessboardString)
}

function checkChess(checkArray, currentNumber) {
  const opponentNumber = currentNumber === '1' ? '2' : '1';
  const position = positionArray[positionArray.length - 1];
  const rowNumber = Number(position[0]) - 1;
  const columnNumber = 'abcdefgh'.indexOf(position[1]);
  checkArray = checkArray.map(row => row.split(''));

  let positionsToTurn = [];

  const directions = [
    { dr: -1, dc: 0 },  // up
    { dr: 1, dc: 0 },   // down
    { dr: 0, dc: -1 },  // left
    { dr: 0, dc: 1 },   // right
    { dr: -1, dc: -1 }, // up-left
    { dr: -1, dc: 1 },  // up-right
    { dr: 1, dc: -1 },  // down-left
    { dr: 1, dc: 1 }    // down-right
  ];

  for (const { dr, dc } of directions) {
    let r = rowNumber + dr;
    let c = columnNumber + dc;
    let foundOtherChess = false;

    while (r >= 0 && r < 8 && c >= 0 && c < 8) {
      if (checkArray[r][c] === opponentNumber) {
        foundOtherChess = true;
        positionsToTurn.push([r, c]);
      } else if (checkArray[r][c] === currentNumber) {
        if (foundOtherChess) {
          for (const [tr, tc] of positionsToTurn) {
            checkArray[tr][tc] = currentNumber;
          }
        }
        break;
      } else {
        break;
      }
      r += dr;
      c += dc;
    }
  }
  if (positionsToTurn.length === 0) {
    positionArray.pop();
    return false;
  } else {
    return checkArray.map(row => row.join(''));
  }
}

function convertCheckArrayToChessboard(checkArray) {
  checkArray.push(' A  B  C  D  E  F  G  H')
  const chessboard = checkArray.map(row => row.replace(/1/g, '🟤 ').replace(/2/g, '⚪️ ').replace(/3/g, '⬛️ ').replace(/\./g, '🟩 ')).join('\n');
  return chessboard
}

function followRules(chessboard, chess) {
  const chessboardRows = chessboard.split(' ').join('')
  const chessboardRowsArray = chessboardRows.split('\n');
  chessboardRowsArray.pop(); // Remove the last row
  let checkArray = chessboardRowsArray.map(row => row.replace(/🟤/g, '1').replace(/⚪️/g, '2').replace(/🟩/g, '.'));
  const chessNumber = chess === '🟤' ? '1' : '2';

  return checkChess(checkArray, chessNumber)
}


// Write the chessboard string to a file named chess.md
function saveChessboard(chessboard) {

  try {
    writeFileSync(filePath, chessboard, 'utf8');
  } catch (error) {
    console.error('Error saving data to file:', error);
  }
  const chessboardArray = chessboard.split(' ').join('').split('\n');
  console.log('\n')
  for (let i = 0; i < 8; i++) {
    console.log(` ${i + 1} ${chessboardArray[i]}`);
  }
  console.log('    A B C D E F G H')
}

// Place chess on the chessboard
function placeChess(rowNumber, columnLetter, chess) {
  const chessboard = readFileSync(filePath, 'utf8');
  const columnArray = 'abcdefgh'.split('');
  const columnNumber = columnArray.indexOf(columnLetter);

  let chessboardArray = chessboard.split('\n');
  let rowArray = chessboardArray[rowNumber - 1].split(' ');
  rowArray[columnNumber] = chess;
  chessboardArray[rowNumber - 1] = rowArray.join(' ');
  const chessboardRows = chessboardArray.join('\n');
  return chessboardRows
}

function validatePosition(position) {
  let row, column;
  if (position.length < 2 || position.length > 3) return false;

  let validRow, validColumn, validPosition;
  if (!isNaN(position[0])) {
    row = Number(position.slice(0, -1), 10);
    column = position.slice(-1).toLowerCase();
    validRow = !isNaN(row) && row >= 1 && row <= 8;
    validColumn = 'abcdefgh'.includes(column);
  } else {
    row = Number(position.slice(1), 10);
    column = position.slice(0, 1).toLowerCase();
    validRow = !isNaN(row) && row >= 1 && row <= 8;
    validColumn = 'abcdefgh'.includes(column);
  }

  validPosition = !positionArray.includes(row + column);
  const validMove = validRow && validColumn && validPosition;

  return {
    validMove,
    row,
    column
  }
}


