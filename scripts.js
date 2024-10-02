const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');
const grid = 32;
const cols = canvas.width / grid;
const rows = canvas.height / grid;

const tetrominoes = {
    'I': [
        [1, 1, 1, 1]
    ],
    'O': [
        [1, 1],
        [1, 1]
    ],
    'T': [
        [0, 1, 0],
        [1, 1, 1]
    ],
    'S': [
        [0, 1, 1],
        [1, 1, 0]
    ],
    'Z': [
        [1, 1, 0],
        [0, 1, 1]
    ],
    'J': [
        [1, 0, 0],
        [1, 1, 1]
    ],
    'L': [
        [0, 0, 1],
        [1, 1, 1]
    ]
};

let board = Array.from({ length: rows }, () => Array(cols).fill(0));
let currentPiece = null;
let score = 0;

// Skapa en slumpmässig tetromino
function createPiece() {
    const keys = Object.keys(tetrominoes);
    const key = keys[Math.floor(Math.random() * keys.length)];
    return {
        shape: tetrominoes[key],
        x: Math.floor(cols / 2) - 1,
        y: 0
    };
}

// Rita brädet
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (board[row][col]) {
                ctx.fillStyle = 'white';
                ctx.fillRect(col * grid, row * grid, grid - 1, grid - 1);
            }
        }
    }
}

// Rita tetrominon
function drawPiece(piece) {
    for (let row = 0; row < piece.shape.length; row++) {
        for (let col = 0; col < piece.shape[row].length; col++) {
            if (piece.shape[row][col]) {
                ctx.fillStyle = 'red';
                ctx.fillRect((piece.x + col) * grid, (piece.y + row) * grid, grid - 1, grid - 1);
            }
        }
    }
}

// Kolla kollisioner
function checkCollision(piece) {
    for (let row = 0; row < piece.shape.length; row++) {
        for (let col = 0; col < piece.shape[row].length; col++) {
            if (piece.shape[row][col]) {
                let newX = piece.x + col;
                let newY = piece.y + row;

                if (newX < 0 || newX >= cols || newY >= rows || board[newY][newX]) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Sänk tetrominon och lägg till den på brädet
function dropPiece() {
    currentPiece.y++;
    if (checkCollision(currentPiece)) {
        currentPiece.y--;
        mergePiece(currentPiece);
        clearRows();
        currentPiece = createPiece();
        if (checkCollision(currentPiece)) {
            resetGame();
        }
    }
}

// Lägg tetrominon på brädet
function mergePiece(piece) {
    for (let row = 0; row < piece.shape.length; row++) {
        for (let col = 0; col < piece.shape[row].length; col++) {
            if (piece.shape[row][col]) {
                board[piece.y + row][piece.x + col] = 1;
            }
        }
    }
}

// Rensa rader och uppdatera poäng
function clearRows() {
    for (let row = rows - 1; row >= 0; row--) {
        if (board[row].every(col => col)) {
            board.splice(row, 1);
            board.unshift(Array(cols).fill(0));
            score += 10;
            document.getElementById('score').innerText = score;
        }
    }
}

// Starta om spelet
function resetGame() {
    board = Array.from({ length: rows }, () => Array(cols).fill(0));
    score = 0;
    document.getElementById('score').innerText = score;
    currentPiece = createPiece();
}

// Flytta tetrominon
document.addEventListener('keydown', event => {
    if (!currentPiece) return;

    if (event.key === 'ArrowLeft') {
        currentPiece.x--;
        if (checkCollision(currentPiece)) {
            currentPiece.x++;
        }
    } else if (event.key === 'ArrowRight') {
        currentPiece.x++;
        if (checkCollision(currentPiece)) {
            currentPiece.x--;
        }
    } else if (event.key === 'ArrowDown') {
        dropPiece();
    } else if (event.key === 'ArrowUp') {
        rotatePiece();
        if (checkCollision(currentPiece)) {
            rotatePiece(false);
        }
    }
});

// Rotera tetrominon
function rotatePiece(clockwise = true) {
    const rotatedShape = currentPiece.shape[0].map((val, index) =>
        currentPiece.shape.map(row => row[index])
    );
    currentPiece.shape = clockwise ? rotatedShape.reverse() :
