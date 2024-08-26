"use strict";

/**
 * data type for the element of the game board grid.
 * @type {Position}
 */
type Position = {
    row: number;
    col: number;
};

const initialPlayerPosition: Position = { row: 3, col: 3 };

/**
 * Initial positions of the boxes.
 * @type {Position[]}
 */
const initialBoxesPositions: Position[] = [
    { row: 3, col: 4 },
    { row: 4, col: 5 },
    { row: 5, col: 5 },
    { row: 7, col: 2 },
    { row: 7, col: 4 },
    { row: 7, col: 5 },
    { row: 7, col: 6 },
];

let currentRow: number = initialPlayerPosition.row;
let currentCol: number = initialPlayerPosition.col;

/**
 * Event handler for keyboard input to move the player.
 * @param {KeyboardEvent} event - The keyboard event.
 */
document.addEventListener('keydown', (event: KeyboardEvent) => {
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
function checkAndMove(rowOffset: number, colOffset: number): void {
    const playerCell = document.querySelector('.player') as HTMLElement; // Find the current player cell
    const gameBoard = document.querySelector('.game-board') as HTMLElement;
    const cells = gameBoard.querySelectorAll('.cell') as NodeListOf<HTMLElement>;

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
                
                // check if the box is placed on a goal position
                if (newBoxCell.classList.contains('goal')) {
                    newBoxCell.style.backgroundImage = 'url("box1.svg")';
                }
                setTimeout(() => checkWin(), 0); // ensure the win condition is checked after the move
            }
        } else {
            // Normal move (no box encountered)
            move(playerCell, newCellOfPlayer, newRowOfPlayer, newColOfPlayer);
        }
    }
}

/**
 * Moves an element from one cell to another.
 * @param {HTMLElement} oldCell - The cell from which the element is moving.
 * @param {HTMLElement} newCell - The cell to which the element is moving.
 * @param {number} [newRow] - The new row position (only for player).
 * @param {number} [newCol] - The new column position (only for player).
 */
function move(oldCell: HTMLElement, newCell: HTMLElement, newRow?: number, newCol?: number): void {
    let imageUrl = '';
    let className = '';

    // Use if-else statements to decide class name and background image
    if (oldCell.classList.contains('player')) {
        className = 'player';
        imageUrl = `url('character.png')`;
    } else if (oldCell.classList.contains('box')) {
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
function checkWin(): void {
    const gameBoard = document.querySelector('.game-board') as HTMLElement;
    const targets = gameBoard.querySelectorAll('.goal') as NodeListOf<HTMLElement>;

    const targetsArray = Array.from(targets);
    if (targetsArray.every(target => target.classList.contains('box'))) {
        alert('You win!');
    }
}

/**
 * Resets the game to its initial state.
 */
function resetGame(): void {
    const gameBoard = document.querySelector('.game-board') as HTMLElement;
    const cells = gameBoard.querySelectorAll('.cell') as NodeListOf<HTMLElement>;

    // Clear all boxes and player
    cells.forEach(cell => {
        if (cell.classList.contains('player')) {
            cell.classList.remove('player');
            cell.style.backgroundImage = ''; // Clear background image
        } else if (cell.classList.contains('box')) {
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
        boxCell.style.backgroundImage = 'url("box.svg")';
    });

    // Reset current position
    currentRow = initialPlayerPosition.row;
    currentCol = initialPlayerPosition.col;
}