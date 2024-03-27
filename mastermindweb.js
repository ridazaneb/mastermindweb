const colors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple'];
const number_of_pegs = 4;
const max_attempts = 5;
let secret_code;
let currentRow = 0;
let board = [];

// Function to create the feedback grid for a given row
function createFeedbackGrid(rowContainer) {
  const feedbackGrid = document.createElement('div');
  feedbackGrid.classList.add('feedback-grid');

  // Create individual pegs for the 2x2 grid
  for (let i = 0; i < 4; i++) {
    const peg = document.createElement('div');
    peg.classList.add('feedback-peg');
    feedbackGrid.appendChild(peg);
  }

  rowContainer.appendChild(feedbackGrid);
  return feedbackGrid;
}

// Function to generate a random secret code
function generateSecretCode() {
  secret_code = [];
  for (let i = 0; i < number_of_pegs; i++) {
    const randomIndex = Math.floor(Math.random() * colors.length);
    secret_code.push(colors[randomIndex]);
  }
}

// Function to create the game board
function createBoard() {
  const gameBoard = document.querySelector('.game-board');
  for (let i = 0; i < max_attempts; i++) {
    const rowContainer = document.createElement('div');
    rowContainer.classList.add('row-container');

    const row = document.createElement('div');
    row.classList.add('row');
    for (let j = 0; j < number_of_pegs; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = i;
      cell.dataset.col = j;
      cell.addEventListener('drop', drop);
      cell.addEventListener('dragover', allowDrop);
      row.appendChild(cell);
    }
    rowContainer.appendChild(row);

    const feedbackRow = document.createElement('div');
    feedbackRow.classList.add('feedback-row');
    feedbackRow.id = `feedback-row-${i}`;
    rowContainer.appendChild(feedbackRow);

    gameBoard.appendChild(rowContainer);
    board.push([]);
  }
}

// Function to allow drop
function allowDrop(event) {
  event.preventDefault();
}

// Function to handle drop event
function drop(event) {
  event.preventDefault();
  const color = event.dataTransfer.getData('color');
  event.target.style.backgroundColor = color;
  const row = event.target.dataset.row;
  const col = event.target.dataset.col;
  board[row][col] = color;
}

// Function to check the guess and provide feedback
function checkGuess(guess) {
  let correct_colors = 0;
  let correct_positions = 0;

  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === secret_code[i]) {
      correct_positions++;
    } else if (secret_code.includes(guess[i])) {
      correct_colors++;
    }
  }

  const feedbackGrid = createFeedbackGrid(document.querySelector(`#feedback-row-${currentRow}`));
  feedbackGrid.innerHTML
 = ''; // Clear previous feedback
  let count = 0;
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      const peg = document.createElement('div');
      peg.classList.add('feedback-peg');
      if (count < correct_positions) {
        peg.style.backgroundColor = 'red';
      } else if (count < correct_positions + correct_colors) {
        peg.style.backgroundColor = 'black';
      }
      feedbackGrid.appendChild(peg);
      count++;
    }
  }

  if (correct_positions === number_of_pegs || currentRow === max_attempts - 1) {
    if (correct_positions === number_of_pegs) {
      // Game won
    } else {
      // Game lost
      revealSecretCode();
    }
    return true;
  } else {
    return false;
  }
}

// Function to reveal the secret code
function revealSecretCode() {
  const secretCodeContainer = document.createElement('div');
  secretCodeContainer.classList.add('secret-code-container');

  const secretCodeTitle = document.createElement('h2');
  secretCodeTitle.textContent = 'Secret Code';

  const secretCodePegs = document.createElement('div');
  secretCodePegs.classList.add('secret-code-pegs');

  secret_code.forEach(color => {
    const peg = document.createElement('div');
    peg.classList.add('cell');
    peg.style.backgroundColor = color;
    secretCodePegs.appendChild(peg);
  });

  secretCodeContainer.appendChild(secretCodeTitle);
  secretCodeContainer.appendChild(secretCodePegs);

  document.body.appendChild(secretCodeContainer);
}

// Submit button
document.getElementById('submit-guess').addEventListener('click', () => {
  if (board[currentRow].filter(color => color).length !== number_of_pegs) {
    alert(`Please select ${number_of_pegs} colors for your guess.`);
    return;
  }
  if (checkGuess(board[currentRow])) {
    document.querySelectorAll('.cell').forEach(cell => {
      cell.style.pointerEvents = 'none';
    });
    document.getElementById('submit-guess').disabled = true;
  } else {
    currentRow++;
  }
});

// Drag and drop functionality
const draggableColors = document.querySelectorAll('.draggable-color');
draggableColors.forEach(color => {
  color.addEventListener('dragstart', dragStart);
});

function dragStart(event) {
  event.dataTransfer.setData('color', event.target.style.backgroundColor);
}

generateSecretCode();
createBoard();
