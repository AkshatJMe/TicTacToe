// --- Constants & state ---
const HUMAN = "X";
const AI = "O";
const EMPTY = "";

let board = Array(9).fill(EMPTY);
let humanTurn = true;
let gameOver = false;

// DOM elements
const boxes = document.querySelectorAll(".box");
const gameInfo = document.querySelector(".game-info");
const newGameBtn = document.querySelector(".btn");
const humanFirstBtn = document.getElementById("humanFirst");
const aiFirstBtn = document.getElementById("aiFirst");

// Winning positions
const winningPositions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// --- Initialization: setup UI click handlers for boxes ---
boxes.forEach((box, index) => {
  box.addEventListener("click", () => {
    if (!humanTurn || gameOver || board[index] !== EMPTY) return;

    makeMove(index, HUMAN);
    if (checkEnd()) return;

    humanTurn = false;
    gameInfo.innerText = "AI is thinking...";
    setTimeout(() => aiMove(), 250);
  });
});

// --- Start choice buttons ---
humanFirstBtn.addEventListener("click", () => startGame("H"));
aiFirstBtn.addEventListener("click", () => startGame("A"));

// New game button
newGameBtn.addEventListener("click", () => {
  showChoiceButtons(true);
  resetUI();
  gameInfo.innerText = "Choose who goes first:";
});

// --- Core helpers ---
function startGame(first) {
  showChoiceButtons(false);
  board = Array(9).fill(EMPTY);
  gameOver = false;
  humanTurn = first === "H";

  // Reset UI boxes
  boxes.forEach((b) => {
    b.innerText = "";
    b.classList.remove("win");
    b.style.pointerEvents = "all";
  });

  newGameBtn.classList.remove("active");

  gameInfo.innerText = humanTurn ? "Your turn!" : "AI is thinking...";
  if (!humanTurn) setTimeout(() => aiMove(), 250);
}

function resetUI() {
  board = Array(9).fill(EMPTY);
  gameOver = false;
  humanTurn = true;
  boxes.forEach((b) => {
    b.innerText = "";
    b.classList.remove("win");
    b.style.pointerEvents = "all";
  });
  newGameBtn.classList.remove("active");
}

// Show/hide the start choice buttons
function showChoiceButtons(show) {
  const controls = document.querySelector(".controls");
  controls.style.display = show ? "flex" : "none";
}

// Make a move (update board and UI)
function makeMove(index, player) {
  board[index] = player;
  boxes[index].innerText = player;
  boxes[index].style.pointerEvents = "none";
}

// Check winner
function checkWinner(b) {
  for (let w of winningPositions) {
    if (b[w[0]] !== EMPTY && b[w[0]] === b[w[1]] && b[w[1]] === b[w[2]]) {
      return w;
    }
  }
  return null;
}

function isFull(b) {
  return b.every((c) => c !== EMPTY);
}

// Check game end and update UI
function checkEnd() {
  const winLine = checkWinner(board);
  if (winLine) {
    const winner = board[winLine[0]];
    gameInfo.innerText = winner === HUMAN ? "You win!" : "AI wins!";
    winLine.forEach((i) => boxes[i].classList.add("win"));
    gameOver = true;
    boxes.forEach((b) => (b.style.pointerEvents = "none"));
    newGameBtn.classList.add("active");
    return true;
  }

  if (isFull(board)) {
    gameInfo.innerText = "It's a draw!";
    gameOver = true;
    newGameBtn.classList.add("active");
    return true;
  }

  return false;
}

// --- AI: Minimax ---
function minimax(b, isMaximizing, depth) {
  const winLine = checkWinner(b);
  const winner = winLine ? b[winLine[0]] : EMPTY;

  if (winner === AI) return 10 - depth;
  if (winner === HUMAN) return depth - 10;
  if (isFull(b)) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (b[i] === EMPTY) {
        b[i] = AI;
        const score = minimax(b, false, depth + 1);
        b[i] = EMPTY;
        bestScore = Math.max(bestScore, score);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (b[i] === EMPTY) {
        b[i] = HUMAN;
        const score = minimax(b, true, depth + 1);
        b[i] = EMPTY;
        bestScore = Math.min(bestScore, score);
      }
    }
    return bestScore;
  }
}

function bestMove(b) {
  let bestScore = -Infinity;
  let move = -1;

  for (let i = 0; i < 9; i++) {
    if (b[i] === EMPTY) {
      b[i] = AI;
      const score = minimax(b, false, 0);
      b[i] = EMPTY;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  // fallback - take first empty if something odd happens
  if (move === -1) {
    for (let i = 0; i < 9; i++) if (b[i] === EMPTY) return i;
  }
  return move;
}

function aiMove() {
  if (gameOver) return;

  const mv = bestMove(board);
  // defensive check
  if (mv === -1) return;

  makeMove(mv, AI);

  if (checkEnd()) return;

  humanTurn = true;
  gameInfo.innerText = "Your turn!";
}

// Show initial controls
showChoiceButtons(true);
gameInfo.innerText = "Choose who goes first:";
