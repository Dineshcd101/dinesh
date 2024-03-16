document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const status = document.getElementById('status');
    const singleplayerButton = document.getElementById('singleplayerButton');
    const multiplayerButton = document.getElementById('multiplayerButton');
    const restartButtonBottom = document.getElementById('restartButtonBottom');
    let currentMode = ''; // Variable to store current game mode

    // Event listeners for mode buttons
    singleplayerButton.addEventListener('click', () => initializeGame('singleplayer'));
    multiplayerButton.addEventListener('click', () => initializeGame('multiplayer'));

    function initializeGame(mode) {
        currentMode = mode; // Update current game mode
        let currentPlayer = 'X';
        let gameActive = true;
        const cells = [];

        // Clear board before initializing
        board.innerHTML = '';

        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.addEventListener('click', () => handleCellClick(i));
            board.appendChild(cell);
            cells.push(cell);
        }

        // Update status to display current game mode
        status.innerText = `Mode: ${mode}, Turn: ${currentPlayer}`;

        function handleCellClick(index) {
            if (gameActive && cells[index].innerText === '') {
                cells[index].innerText = currentPlayer;
                if (isWinner()) {
                    gameActive = false;
                    status.innerText = `${currentPlayer} wins!`;
                    showResultPopup(`${currentPlayer} wins!`);
                } else if (isBoardFull()) {
                    gameActive = false;
                    status.innerText = 'It\'s a draw!';
                    showResultPopup('It\'s a draw!');
                } else {
                    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                    status.innerText = `Mode: ${mode}, Turn: ${currentPlayer}`;
                    if (mode === 'singleplayer' && currentPlayer === 'O') {
                        setTimeout(makeAIMove, 500);
                    }
                }
            }
        }

        function isBoardFull() {
            return cells.every(cell => cell.innerText !== '');
        }

        function isWinner() {
            const winPatterns = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
                [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
                [0, 4, 8], [2, 4, 6]             // Diagonals
            ];

            return winPatterns.some(pattern => {
                const [a, b, c] = pattern;
                return cells[a].innerText !== '' && cells[a].innerText === cells[b].innerText && cells[a].innerText === cells[c].innerText;
            });
        }

        function showResultPopup(message) {
            const popup = document.createElement('div');
            popup.classList.add('popup');
            popup.innerHTML = `
                <div class="popup-content">
                    <p>${message}</p>
                    <button id="restartButton">Restart</button>
                </div>
            `;
            document.body.appendChild(popup);

            const restartButton = document.getElementById('restartButton');

            restartButton.addEventListener('click', restartGame); // Add event listener here

            restartButtonBottom.addEventListener('click', restartGame);

            function restartGame() {
                gameActive = true;
                currentPlayer = 'X';
                status.innerText = `Mode: ${currentMode}, Turn: ${currentPlayer}`;

                cells.forEach(cell => {
                    cell.innerText = '';
                });

                document.body.removeChild(popup);

                if (mode === 'singleplayer' && currentPlayer === 'O') {
                    setTimeout(makeAIMove, 500);
                }
            }
        }

        function makeAIMove() {
            if (gameActive && currentPlayer === 'O') {
                let bestScore = -Infinity;
                let move;
                for (let i = 0; i < cells.length; i++) {
                    if (cells[i].innerText === '') {
                        cells[i].innerText = currentPlayer;
                        let score = minimax(cells, 0, false, -Infinity, Infinity);
                        cells[i].innerText = '';
                        if (score > bestScore) {
                            bestScore = score;
                            move = i;
                        }
                    }
                }
                handleCellClick(move);
            }
        }

        function minimax(cells, depth, isMaximizing, alpha, beta) {
            if (isWinner()) {
                return isMaximizing ? -10 + depth : 10 - depth;
            } else if (isBoardFull()) {
                return 0;
            }

            if (isMaximizing) {
                let maxScore = -Infinity;
                for (let i = 0; i < cells.length; i++) {
                    if (cells[i].innerText === '') {
                        cells[i].innerText = 'O';
                        let score = minimax(cells, depth + 1, false, alpha, beta);
                        cells[i].innerText = '';
                        maxScore = Math.max(score, maxScore);
                        alpha = Math.max(alpha, score);
                        if (beta <= alpha)
                            break;
                    }
                }
                return maxScore;
            } else {
                let minScore = Infinity;
                for (let i = 0; i < cells.length; i++) {
                    if (cells[i].innerText === '') {
                        cells[i].innerText = 'X';
                        let score = minimax(cells, depth + 1, true, alpha, beta);
                        cells[i].innerText = '';
                        minScore = Math.min(score, minScore);
                        beta = Math.min(beta, score);
                        if (beta <= alpha)
                            break;
                    }
                }
                return minScore;
            }
        }
    }
});
