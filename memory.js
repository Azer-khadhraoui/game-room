const memoryGrid = document.getElementById('memoryGrid');
const player1ScoreElement = document.getElementById('player1Score');
const player2ScoreElement = document.getElementById('player2Score');
const currentPlayerElement = document.getElementById('currentPlayer');
const winnerMessageElement = document.getElementById('winnerMessage');
const cards = [
    'A', 'A', 'B', 'B', 'C', 'C', 'D', 'D',
    'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H'
];

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let player1Score = 0;
let player2Score = 0;
let currentPlayer = 1;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createBoard() {
    memoryGrid.innerHTML = '';
    shuffle(cards);
    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('memory-card');
        cardElement.dataset.card = card;
        cardElement.addEventListener('click', flipCard);
        memoryGrid.appendChild(cardElement);
    });
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flipped');
    this.textContent = this.dataset.card;

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    if (firstCard.dataset.card === secondCard.dataset.card) {
        disableCards();
        updateScore();
        checkForWinner();
    } else {
        unflipCards();
    }
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    if (currentPlayer === 1) {
        firstCard.classList.add('matched-player1');
        secondCard.classList.add('matched-player1');
    } else {
        firstCard.classList.add('matched-player2');
        secondCard.classList.add('matched-player2');
    }
    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        firstCard.textContent = '';
        secondCard.textContent = '';
        switchPlayer();
        resetBoard();
    }, 1500);
}

function updateScore() {
    if (currentPlayer === 1) {
        player1Score++;
        player1ScoreElement.textContent = `Player 1: ${player1Score}`;
    } else {
        player2Score++;
        player2ScoreElement.textContent = `Player 2: ${player2Score}`;
    }
}

function switchPlayer() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    currentPlayerElement.textContent = `Current Player: ${currentPlayer}`;
}

function checkForWinner() {
    const totalPairs = cards.length / 2;
    if (player1Score + player2Score === totalPairs) {
        if (player1Score > player2Score) {
            winnerMessageElement.textContent = 'Player 1 Wins!';
        } else if (player2Score > player1Score) {
            winnerMessageElement.textContent = 'Player 2 Wins!';
        } else {
            winnerMessageElement.textContent = 'It\'s a Tie!';
        }
        winnerMessageElement.style.display = 'block';
    }
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

function startNewGame() {
    player1Score = 0;
    player2Score = 0;
    currentPlayer = 1;
    player1ScoreElement.textContent = 'Player 1: 0';
    player2ScoreElement.textContent = 'Player 2: 0';
    currentPlayerElement.textContent = 'Current Player: 1';
    winnerMessageElement.style.display = 'none';
    createBoard();
}

createBoard();