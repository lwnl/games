"use strict";
const initialPlayerPosition = { row: 3, col: 3 };
/**
 * Initial positions of the boxes.
 * @type {Position[]}
 */
const initialBoxesPositions = [
    { row: 3, col: 4 },
    { row: 4, col: 5 },
    { row: 5, col: 5 },
    { row: 7, col: 2 },
    { row: 7, col: 4 },
    { row: 7, col: 5 },
    { row: 7, col: 6 },
];
let currentRow = initialPlayerPosition.row;
let currentCol = initialPlayerPosition.col;
let steps = 0;
/**
 * Initial stepsArray
 * @type {step[]}
 */
const stepsArray = [];
/**
 * Event handler for keyboard input to move the player.
 * @param {KeyboardEvent} event - The keyboard event.
 */
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            if (currentRow > 1) {
                checkAndMove(-1, 0);
            }
            break;
        case 'ArrowDown':
            if (currentRow < 8) {
                checkAndMove(1, 0);
            }
            break;
        case 'ArrowLeft':
            if (currentCol > 1) {
                checkAndMove(0, -1);
            }
            break;
        case 'ArrowRight':
            if (currentCol < 8) {
                checkAndMove(0, 1);
            }
            break;
    }
});
/**
 * Checks the move validity and performs the move if possible.
 * @param {number} rowOffset - The row offset for the move.
 * @param {number} colOffset - The column offset for the move.
 */
function checkAndMove(rowOffset, colOffset) {
    const playerCell = document.querySelector('.player'); // Find the current player cell
    const gameBoard = document.querySelector('.game-board');
    const cells = gameBoard.querySelectorAll('.cell');
    // Calculate new position
    const newRowOfPlayer = currentRow + rowOffset;
    const newColOfPlayer = currentCol + colOffset;
    // Ensure the new position is within grid boundaries
    if (newRowOfPlayer < 1 || newRowOfPlayer > 8 || newColOfPlayer < 1 || newColOfPlayer > 8) {
        return; // New position is out of bounds, do not move
    }
    // Calculate new cell index
    const newIndexOfPlayer = (newRowOfPlayer - 1) * 8 + (newColOfPlayer - 1);
    const newCellOfPlayer = cells[newIndexOfPlayer];
    // Ensure the new cell exists and is not a wall
    const step = document.querySelector('.step');
    if (newCellOfPlayer && !newCellOfPlayer.classList.contains('wall')) {
        if (newCellOfPlayer.classList.contains('box')) {
            // If the player moves onto a box, calculate the new box position
            const newBoxRow = newRowOfPlayer + rowOffset;
            const newBoxCol = newColOfPlayer + colOffset;
            const newBoxIndex = (newBoxRow - 1) * 8 + (newBoxCol - 1);
            const newBoxCell = cells[newBoxIndex];
            // Ensure the new box position is within grid boundaries
            if (newBoxRow < 1 || newBoxRow > 8 || newBoxCol < 1 || newBoxCol > 8) {
                return; // New box position is out of bounds, do not move
            }
            // Ensure the new box cell exists and is not a wall or another box
            if (newBoxCell && !newBoxCell.classList.contains('wall') && !newBoxCell.classList.contains('box')) {
                // Move the box and player
                move(newCellOfPlayer, newBoxCell); // Move the box
                move(playerCell, newCellOfPlayer, newRowOfPlayer, newColOfPlayer); // Move the player
                const oldBox = { row: newRowOfPlayer, col: newColOfPlayer };
                const newBox = { row: newBoxRow, col: newBoxCol };
                const newPlayer = { row: currentRow, col: currentCol };
                const oldPlayer = { row: currentRow - rowOffset, col: currentCol - colOffset };
                stepsArray.push({ oldBox, newBox, oldPlayer, newPlayer });
                steps++;
                step.textContent = `Steps: ${steps}`;
                // check if the box is placed on a goal position
                if (newBoxCell.classList.contains('goal')) {
                    newBoxCell.style.backgroundImage = 'url("box1.svg")';
                }
                setTimeout(() => checkWin(), 0); // ensure the win condition is checked after the move
            }
        }
        else {
            // Normal move (no box encountered)
            move(playerCell, newCellOfPlayer, newRowOfPlayer, newColOfPlayer);
            const newPlayer = { row: currentRow, col: currentCol };
            const oldPlayer = { row: currentRow - rowOffset, col: currentCol - colOffset };
            stepsArray.push({ oldPlayer, newPlayer });
            steps++;
            step.textContent = `Steps: ${steps}`;
        }
    }
}
/**
 * Event handler for undo button click.
 */
function undo() {
    if (stepsArray.length > 0) {
        const gameBoard = document.querySelector('.game-board');
        const cells = gameBoard.querySelectorAll('.cell');
        const lastStep = stepsArray.pop();
        console.log('Last Step:', lastStep); // 添加日志输出以检查 lastStep 内容
        if (lastStep.oldBox && lastStep.newBox) {
            const oldBoxIndex = (lastStep.oldBox.row - 1) * 8 + (lastStep.oldBox.col - 1);
            const newBoxIndex = (lastStep.newBox.row - 1) * 8 + (lastStep.newBox.col - 1);
            const oldBoxCell = cells[oldBoxIndex];
            const newBoxCell = cells[newBoxIndex];
            move(newBoxCell, oldBoxCell);
        }
        if (lastStep.oldPlayer && lastStep.newPlayer) {
            const oldPlayerIndex = (lastStep.oldPlayer.row - 1) * 8 + (lastStep.oldPlayer.col - 1);
            const newPlayerIndex = (lastStep.newPlayer.row - 1) * 8 + (lastStep.newPlayer.col - 1);
            const oldPlayerCell = cells[oldPlayerIndex];
            const newPlayerCell = cells[newPlayerIndex];
            move(newPlayerCell, oldPlayerCell);
            currentRow = lastStep.oldPlayer.row; // 更新当前玩家位置
            currentCol = lastStep.oldPlayer.col;
        }
        steps--;
        const step = document.querySelector('.step');
        step.textContent = `Steps: ${steps}`;
    }
}
/**
 * Moves an element from one cell to another.
 * @param {HTMLElement} oldCell - The cell from which the element is moving.
 * @param {HTMLElement} newCell - The cell to which the element is moving.
 * @param {number} [newRow] - The new row position (only for player).
 * @param {number} [newCol] - The new column position (only for player).
 */
function move(oldCell, newCell, newRow, newCol) {
    let imageUrl = '';
    let className = '';
    // Use if-else statements to decide class name and background image
    if (oldCell.classList.contains('player')) {
        className = 'player';
        imageUrl = `url('character.png')`;
    }
    else if (oldCell.classList.contains('box')) {
        className = 'box';
        imageUrl = `url('box.svg')`;
    }
    // Remove class from the old position
    oldCell.classList.remove(className);
    oldCell.style.backgroundImage = ''; // Clear the background image
    // Add class to the new position
    newCell.classList.add(className);
    newCell.style.backgroundImage = imageUrl;
    // If moving the player, update the current position
    if (className === 'player') {
        if (newRow !== undefined && newCol !== undefined) {
            currentRow = newRow;
            currentCol = newCol;
        }
    }
}
/**
 * Checks if all boxes are placed on goal positions.
 */
function checkWin() {
    const gameBoard = document.querySelector('.game-board');
    const targets = gameBoard.querySelectorAll('.goal');
    const player = gameBoard.querySelector('.player');
    const targetsArray = Array.from(targets);
    if (targetsArray.every(target => target.classList.contains('box'))) {
        player.classList.add('swing');
        setTimeout(() => { alert('You win!'); }, 100);
    }
}
/**
 * Resets the game to its initial state.
 */
function resetGame() {
    const gameBoard = document.querySelector('.game-board');
    const cells = gameBoard.querySelectorAll('.cell');
    // Clear playe and rall boxes
    cells.forEach(cell => {
        if (cell.classList.contains('player')) {
            cell.classList.remove('player');
            cell.style.backgroundImage = ''; // Clear background image
        }
        else if (cell.classList.contains('box')) {
            cell.classList.remove('box');
            cell.style.backgroundImage = ''; // Clear background image
        }
    });
    // Set initial positions for the player and boxes
    const playerCellIndex = (initialPlayerPosition.row - 1) * 8 + (initialPlayerPosition.col - 1);
    const playerCell = cells[playerCellIndex];
    playerCell.classList.add('player');
    playerCell.style.backgroundImage = 'url("character.png")';
    initialBoxesPositions.forEach(pos => {
        const boxIndex = (pos.row - 1) * 8 + (pos.col - 1);
        const boxCell = cells[boxIndex];
        boxCell.classList.add('box');
        if (boxCell.classList.contains('goal')) {
            boxCell.style.backgroundImage = 'url("box1.svg")';
        }
        else {
            boxCell.style.backgroundImage = 'url("box.svg")';
        }
    });
    // Reset current position
    currentRow = initialPlayerPosition.row;
    currentCol = initialPlayerPosition.col;
    steps = 0;
    const step = document.querySelector('.step');
    step.textContent = `Steps: ${steps}`;
}
