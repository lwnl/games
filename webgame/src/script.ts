type Position = {
    row: number;
    col: number;
};
const gameBoard = document.querySelector('.game-board') as HTMLElement;
const cells = gameBoard.querySelectorAll('.cell') as NodeListOf<HTMLElement>;
const initialPlayerPosition: Position = { row: 3, col: 3 };
const initialBoxesPositions: Position[] = [
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

type Step = {
    oldBox?: Position;
    newBox?: Position;
    oldPlayer: Position;
    newPlayer: Position;
};

const stepsArray: Step[] = [];

document.addEventListener('keydown', (event: KeyboardEvent) => {
    const moves: Record<string, [number, number]> = {
        ArrowUp: [-1, 0],
        ArrowDown: [1, 0],
        ArrowLeft: [0, -1],
        ArrowRight: [0, 1]
    };
    
    const move = moves[event.key];
    if (move) {
        const [rowOffset, colOffset] = move;
        if (isValidPosition(currentRow + rowOffset, currentCol + colOffset)) {
            checkAndMove(rowOffset, colOffset);
        }
    }
});

function checkAndMove(rowOffset: number, colOffset: number): void {
    const playerCell = document.querySelector('.player') as HTMLElement;
    const newRow = currentRow + rowOffset;
    const newCol = currentCol + colOffset;
    const newIndex = (newRow - 1) * 8 + (newCol - 1);
    const newCell = cells[newIndex];

    if (newCell && !newCell.classList.contains('wall')) {
        if (newCell.classList.contains('box')) {
            const boxNewRow = newRow + rowOffset;
            const boxNewCol = newCol + colOffset;
            const boxNewIndex = (boxNewRow - 1) * 8 + (boxNewCol - 1);
            const boxNewCell = cells[boxNewIndex];

            if (isValidPosition(boxNewRow, boxNewCol) && boxNewCell && !boxNewCell.classList.contains('wall') && !boxNewCell.classList.contains('box')) {
                move(newCell, boxNewCell);
                if (boxNewCell.classList.contains('goal')) {
                    boxNewCell.style.backgroundImage = 'url("box1.svg")';
                }
                move(playerCell, newCell, newRow, newCol);
                stepsArray.push({
                    oldBox: { row: newRow, col: newCol },
                    newBox: { row: boxNewRow, col: boxNewCol },
                    oldPlayer: { row: newRow - rowOffset, col: newCol - colOffset },
                    newPlayer: { row: newRow, col: newCol }
                });
                steps++;
                updateStepDisplay();
            }
        } else {
            move(playerCell, newCell, newRow, newCol);
            stepsArray.push({
                oldPlayer: { row: newRow - rowOffset, col: newCol - colOffset },
                newPlayer: { row: newRow, col: newCol }
            });
            steps++;
            updateStepDisplay();
        }
    }
    
    checkWin();
}

function isValidPosition(row: number, col: number): boolean {
    return row >= 1 && row <= 8 && col >= 1 && col <= 8;
}

function move(oldCell: HTMLElement, newCell: HTMLElement, newRow?: number, newCol?: number): void {
    const className = oldCell.classList.contains('player') ? 'player' : 'box';
    const imageUrl = className === 'player' ? 'url("character.png")' : 'url("box.svg")';

    oldCell.classList.remove(className);
    oldCell.style.backgroundImage = '';

    newCell.classList.add(className);
    newCell.style.backgroundImage = imageUrl;

    if (className === 'player' && newRow !== undefined && newCol !== undefined) {
        currentRow = newRow;
        currentCol = newCol;
    }
}

function updateStepDisplay(): void {
    const stepElement = document.querySelector('.step') as HTMLElement;
    if (stepElement) {
        stepElement.textContent = `Steps: ${steps}`;
    }
}

function checkWin(): void {
    const goals = Array.from(gameBoard.querySelectorAll('.goal')) as HTMLElement[];
    if (goals.every(goal => goal.classList.contains('box'))) {
        const player = document.querySelector('.player') as HTMLElement;
        if (player) {
            player.classList.add('swing');
        }
        setTimeout(() => alert('You win!'), 100);
    }
}

function undo(): void {
    if (stepsArray.length > 0) {
        const lastStep = stepsArray.pop()!;
        console.log(lastStep);

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
            currentRow = lastStep.oldPlayer.row;
            currentCol = lastStep.oldPlayer.col;
        }

        steps--;
        updateStepDisplay();
    }
}

function resetGame(): void {
    cells.forEach(cell => {
        cell.classList.remove('player', 'box');
        cell.style.backgroundImage = '';
    });

    const playerCell = cells[(initialPlayerPosition.row - 1) * 8 + (initialPlayerPosition.col - 1)];
    playerCell.classList.add('player');
    playerCell.style.backgroundImage = 'url("character.png")';

    initialBoxesPositions.forEach(pos => {
        const boxCell = cells[(pos.row - 1) * 8 + (pos.col - 1)];
        boxCell.classList.add('box');
        boxCell.style.backgroundImage = boxCell.classList.contains('goal') ? 'url("box1.svg")' : 'url("box.svg")';
    });

    currentRow = initialPlayerPosition.row;
    currentCol = initialPlayerPosition.col;
    steps = 0;
    updateStepDisplay();
}