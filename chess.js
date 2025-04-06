import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import rs from 'readline-sync';

function chess() {

  console.clear();

  // Get the path of the current file
  const __filename = fileURLToPath(import.meta.url);
  // Get the directory of the current file
  const __dirname = path.dirname(__filename);
  // Use absolute path
  const filePath = path.join(__dirname, 'chess.md');


  // initialize a 20x20 chessboard
  let chessboard = [];
  for (let i = 1; i <= 20; i++) {
    let chessboardRow = ''
    for (let j = 1; j <= 20; j++) {
      chessboardRow += '🟨 ';
    }
    chessboard.push(chessboardRow);
  }
  chessboard.push(' A  B  C  D  E  F  G  H  I  J  K  L  M  N  O  P  Q  R  S  T')
  // transform the chessboard to a string
  const originalChessboard = chessboard.join('\n');
  saveChessboard(originalChessboard)

  // input player name
  console.log('\nWelcome to the chess game!');
  const player_1 = rs.question('Please enter name of Player_1:');
  const player_2 = rs.question('Please enter name of Player_2:');

  const positionArray = [];

  // Main game loop
  while (true) {
    // Player 1's move
    playAndSave(player_1);

    // Player 2's move
    playAndSave(player_2);
  }

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
  function saveChessboard(chessboard) {

    try {
      writeFileSync(filePath, chessboard, 'utf8');
    } catch (error) {
      console.error('Error saving data to file:', error);
    }
    const chessboardArray = chessboard.split(' ').join('').slice(0, -20).split('\n');
    console.log('    A B C D E F G H I J K L M N O P Q R S T')
    for (let i = 0; i < 20; i++) {
      if (i < 9) {
        console.log(` ${i + 1} ${chessboardArray[i]} ${i + 1}`);
      } else {
        console.log(`${i + 1} ${chessboardArray[i]} ${i + 1}`);
      }
    }
    console.log('    A B C D E F G H I J K L M N O P Q R S T')
  }

  // Place chess on the chessboard
  function placeChess(rowNumber, columnLetter, chess) {
    const chessboard = readFileSync(filePath, 'utf8');
    const columnArray = 'abcdefghijklmnopqrst'.split('');
    const columnNumber = columnArray.indexOf(columnLetter);

    let chessboardArray = chessboard.split('\n');
    let rowArray = chessboardArray[rowNumber - 1].split(' ');
    rowArray[columnNumber] = chess;
    chessboardArray[rowNumber - 1] = rowArray.join(' ');
    return chessboardArray.join('\n');
  }

  function validatePosition(position) {
    let row, column;
    if (position.length < 2 || position.length > 3) return false;

    let validRow, validColumn, validPosition;
    if (!isNaN(position[0])) {
      row = Number(position.slice(0, -1), 10);
      column = position.slice(-1).toLowerCase();
      validRow = !isNaN(row) && row >= 1 && row <= 20;
      validColumn = 'abcdefghijklmnopqrst'.includes(column);
    } else {
      row = Number(position.slice(1), 10);
      column = position.slice(0, 1).toLowerCase();
      validRow = !isNaN(row) && row >= 1 && row <= 20;
      validColumn = 'abcdefghijklmnopqrst'.includes(column);
    }
    validPosition = !positionArray.includes(row + column);
    const validMove = validRow && validColumn && validPosition;

    return {
      validMove,
      row,
      column
    }
  }


  function checkWinner(chessboard, chess) {
    // Convert the chessboard
    let rows = chessboard.split('\n')
    rows.pop() // remove the last row of letters
    rows = rows.map(row => {
      row = row.split(' ')
      row.pop() // remove the last empty string
      return row
    });


    // Get the position coordinates
    const position = positionArray[positionArray.length - 1];
    const x = Number(position.slice(0, -1)) - 1;
    const y = 'abcdefghijklmnopqrst'.indexOf(position.slice(-1).toLowerCase());

    // Check if there are five consecutive pieces in the row
    const row = rows[x].join('');
    if (row.includes(chess.repeat(5))) return true;

    // Check if there are five consecutive pieces in the column
    const col = rows.map(row => row[y]).join('');
    if (col.includes(chess.repeat(5))) return true;

    // Check if there are five consecutive pieces in the diagonal
    let diagonal1 = '', diagonal2 = '';
    for (let i = -4; i <= 4; i++) {
      if (x + i >= 0 && x + i < 20 && y + i >= 0 && y + i < 20) {
        diagonal1 += rows[x + i][y + i] || '';
      }
      if (x + i >= 0 && x + i < 20 && y - i >= 0 && y - i < 20) {
        diagonal2 += rows[x + i][y - i] || '';
      }
    }

    if (diagonal1.includes(chess.repeat(5)) || diagonal2.includes(chess.repeat(5))) {
      return true;
    }

    console.log('diagonal1 = ', diagonal1)
    console.log('diagonal2 = ', diagonal2)
    console.log('row = ', row)
    console.log('col = ', col)

    return false;
  }
}

export default chess;
