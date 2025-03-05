const colorBox = document.getElementById('color-box');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('start-button');

let score = 0;
let gameStarted = false;
let gameInterval;

// Function to generate a random color
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Function to move the color box to a random position
function moveBox() {
    const container = document.getElementById('game-container');
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    const boxSize = colorBox.clientWidth;
    const maxX = containerWidth - boxSize;
    const maxY = containerHeight - boxSize;

    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    colorBox.style.left = `${randomX}px`;
    colorBox.style.top = `${randomY}px`;
    colorBox.style.backgroundColor = getRandomColor();
}

// Function to update the score
function updateScore() {
    score++;
    scoreElement.textContent = `Score: ${score}`;
}

// Function to start the game
function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        colorBox.style.display = 'block'; // Show the color box
        score = 0;
        updateScore();
        moveBox();
        gameInterval = setInterval(moveBox, 1000); // Move the box every second
    }
}

// Event listener for the color box click
colorBox.addEventListener('click', () => {
    updateScore();
    moveBox();
});

// Event listener for the start button
startButton.addEventListener('click', () => {
    startGame();
});