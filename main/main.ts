// Selecting DOM elements
const boxes = document.querySelectorAll<HTMLElement>(".box");
const gameInfo = document.querySelector<HTMLElement>(".game-info");
const newGameBtn = document.querySelector<HTMLElement>(".btn");

// Initializing game variables
let currentPlayer: "X" | "O";
let gameGrid: string[];

// Array of winning positions in Tic Tac Toe
const winningPositions: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Function to initialize the game
function initGame(): void {
  currentPlayer = "X";
  gameGrid = ["", "", "", "", "", "", "", "", ""];

  // Reset UI for each box
  boxes.forEach((box, index) => {
    box.innerText = ""; // Clear text content
    box.style.pointerEvents = "all"; // Enable pointer events
    box.className = `box box${index + 1}`; // Reset box class
  });

  // Hide new game button
  newGameBtn?.classList.remove("active");

  // Display current player
  gameInfo!.innerText = `Current Player - ${currentPlayer}`;
}

// Initial game setup
initGame();

// Function to swap turns between X and O
function swapTurn(): void {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  // Update UI with current player
  gameInfo!.innerText = `Current Player - ${currentPlayer}`;
}

// Function to check if the game is over
function checkGameOver(): void {
  let answer = "";

  // Check all winning combinations
  winningPositions.forEach((position) => {
    // Check if all three positions in a winning combination are the same and not empty
    if (
      gameGrid[position[0]] !== "" &&
      gameGrid[position[0]] === gameGrid[position[1]] &&
      gameGrid[position[1]] === gameGrid[position[2]]
    ) {
      // Determine the winner
      answer = gameGrid[position[0]];

      // Disable pointer events on boxes
      boxes.forEach((box) => {
        box.style.pointerEvents = "none";
      });

      // Highlight winning boxes
      boxes[position[0]].classList.add("win");
      boxes[position[1]].classList.add("win");
      boxes[position[2]].classList.add("win");
    }
  });

  // If there is a winner
  if (answer !== "") {
    gameInfo!.innerText = `Winner Player - ${answer}`;
    newGameBtn?.classList.add("active"); // Show new game button
    return;
  }

  // If no winner and all boxes are filled (tie game)
  let fillCount = 0;
  gameGrid.forEach((box) => {
    if (box !== "") fillCount++;
  });

  if (fillCount === 9) {
    gameInfo!.innerText = "Game Tied !";
    newGameBtn?.classList.add("active"); // Show new game button
  }
}

// Function to handle box click
function handleClick(index: number): void {
  if (gameGrid[index] === "") {
    boxes[index].innerText = currentPlayer; // Update box with current player (X or O)
    gameGrid[index] = currentPlayer; // Update game grid
    boxes[index].style.pointerEvents = "none"; // Disable further clicks on this box
    swapTurn(); // Swap turn to the next player
    checkGameOver(); // Check if game is over
  }
}

// Event listeners for each box
boxes.forEach((box, index) => {
  box.addEventListener("click", () => {
    handleClick(index);
  });
});

// Event listener for new game button
newGameBtn?.addEventListener("click", initGame);
