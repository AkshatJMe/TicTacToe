// Constants & Types
type Player = "X" | "O" | " ";
const HUMAN: Player = "X";
const AI: Player = "O";
const EMPTY: Player = " ";

let board: Player[] = Array(9).fill(EMPTY);
let humanTurn = true;
let gameOver = false;

const boxes = Array.from(document.querySelectorAll(".box")) as HTMLDivElement[];
const gameInfo = document.querySelector(".game-info") as HTMLDivElement;
const line = document.querySelector(".line") as HTMLDivElement;
const btnHuman = document.getElementById("humanFirst") as HTMLButtonElement;
const btnAI = document.getElementById("aiFirst") as HTMLButtonElement;

const wins: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Initialize board UI
boxes.forEach((box, i) => {
  box.addEventListener("click", () => handleHumanMove(i));
});

// Render board
function render(): void {
  board.forEach((val, i) => {
    boxes[i].textContent = val;
  });
}

// Winner detection
function checkWinner(b: Player[]): number[] | null {
  for (const w of wins) {
    if (b[w[0]] !== EMPTY && b[w[0]] === b[w[1]] && b[w[1]] === b[w[2]]) {
      return w;
    }
  }
  return null;
}

function isFull(b: Player[]): boolean {
  return b.every((c) => c !== EMPTY);
}

// Minimax Algorithm
function minimax(b: Player[], isMaximizing: boolean, depth: number): number {
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
        bestScore = Math.max(bestScore, minimax(b, false, depth + 1));
        b[i] = EMPTY;
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (b[i] === EMPTY) {
        b[i] = HUMAN;
        bestScore = Math.min(bestScore, minimax(b, true, depth + 1));
        b[i] = EMPTY;
      }
    }
    return bestScore;
  }
}

// Best AI Move
function bestMove(b: Player[]): number {
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
  return move;
}

// Game control
function startGame(first: "H" | "A"): void {
  board = Array(9).fill(EMPTY);
  gameOver = false;
  humanTurn = first === "H";
  hideWinLine();
  render();

  gameInfo.textContent = humanTurn ? "Your Turn" : "AI Thinking...";

  if (!humanTurn) {
    setTimeout(aiMove, 400);
  }
}

function handleHumanMove(i: number): void {
  if (!humanTurn || gameOver || board[i] !== EMPTY) return;

  board[i] = HUMAN;
  render();

  if (checkEnd()) return;

  humanTurn = false;
  gameInfo.textContent = "AI Thinking...";
  setTimeout(aiMove, 350);
}

function aiMove(): void {
  if (gameOver) return;

  const move = bestMove(board);
  if (move !== -1) board[move] = AI;

  render();

  if (checkEnd()) return;

  humanTurn = true;
  gameInfo.textContent = "Your Turn";
}

function checkEnd(): boolean {
  const wLine = checkWinner(board);

  if (wLine) {
    const winner = board[wLine[0]];
    gameInfo.textContent = winner === HUMAN ? "You Win!" : "AI Wins!";
    drawWinLine(wLine);
    gameOver = true;
    return true;
  }

  if (isFull(board)) {
    gameInfo.textContent = "Draw!";
    gameOver = true;
    return true;
  }

  return false;
}

// Win Line Drawing
function drawWinLine(w: number[]): void {
  const start = boxes[w[0]].getBoundingClientRect();
  const end = boxes[w[2]].getBoundingClientRect();
  const boardRect = (
    document.querySelector(".tic-tac-toe") as HTMLDivElement
  ).getBoundingClientRect();

  const x1 = start.left + start.width / 2 - boardRect.left;
  const y1 = start.top + start.height / 2 - boardRect.top;

  const x2 = end.left + end.width / 2 - boardRect.left;
  const y2 = end.top + end.height / 2 - boardRect.top;

  const length = Math.hypot(x2 - x1, y2 - y1);
  const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;

  line.style.width = `${length}px`;
  line.style.top = `${y1}px`;
  line.style.left = `${x1}px`;
  line.style.transform = `rotate(${angle}deg)`;
  line.style.display = "block";
}

function hideWinLine(): void {
  line.style.display = "none";
}

// Button binding
btnHuman.addEventListener("click", () => startGame("H"));
btnAI.addEventListener("click", () => startGame("A"));

// Initialize text
gameInfo.textContent = "Choose who plays first:";
