document.addEventListener('DOMContentLoaded', () => {


    // call the class grid
    const grid = document.querySelector('.grid');

    // collect the divs in class grid and turn them into an array
    // assigned the array to a variable
    let squares = Array.from(document.querySelectorAll('.grid div'));

    // call the score id
    const scoreDisplay = document.querySelector('.score');

    const lineDisplay = document.querySelector('.lines-score');

    // call the play-pause id
    const playBtn = document.querySelector('#play-pause');

    // call the instructions id
    const instructionsBtn = document.getElementById('#instructions');

    // call the new-game id
    const newGameBtn = document.querySelector('#new-game');

    // call the quit id
    const quitBtn = document.querySelector('#quit');

    const width = 10;

    let currentRandom;

    let timerId;

    let score = 0;

    let lines = 0;

    const colors = [
        'url(assets/img/blue_block.png)',
        'url(assets/img/pink_block.png)',
        'url(assets/img/purple_block.png)',
        'url(assets/img/peach_block.png)',
        'url(assets/img/yellow_block.png)',
        'url(assets/img/green_block.png)',
    ]
    // assign functions to keyCodes
    function control(e) {
        if (e.keyCode === 37) {
            // leftArrow pressed to move left
            moveLeft();
        } else if (e.keyCode === 38) {
            // upArrow pressed to rotate
            rotate();
        }
        else if (e.keyCode === 39) {
            // rightArrow pressed to move right
            moveRight();
        } else if (e.keyCode === 40) {
            // downArrow pressed to move down
            moveDown();
        }
    }

    document.addEventListener('keydown', control);

    // Tetris Tetrominoes
    // draw l-Tetromino
    const lTetromino = [
        [1, 2, width + 2, width * 2 + 2],
        [width + 2, width * 2, width * 2 + 1, width * 2 + 2],
        [0, width, width * 2, width * 2 + 1],
        [0, 1, 2, width]
    ]

    const jTetromino = [
        [width, width * 2, width * 2 + 1, width * 2 + 2],
        [0, 1, width, width * 2],
        [2, width + 2, width * 2 + 1, width * 2 + 2],
        [0, 1, 2, width + 2]
    ]

    // draw box-Tetromino
    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],

    ]

    // draw t-Tetromino
    const tTetromino = [
        [width + 1, width * 2, width * 2 + 1, width * 2 + 2],
        [0, 1, 2, width + 1],
        [0, width, width + 1, width * 2],
        [2, width + 1, width + 2, width * 2 + 2]
    ]

    // draw i-Tetromino
    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ]

    // draw z-Tetromino
    const zTetromino = [
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [2, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width * 2 + 1, width * 2 + 2]
    ]

    const tetrisTetrominoes = [lTetromino, jTetromino, oTetromino, tTetromino, iTetromino, zTetromino]
    let nextRandom = randomize();
    // console.log(`initial next random: ${nextRandom}`);

    currentRandom = nextRandom;
    // set number of array length of each tetromino
    let arrayPieceLength = 4;

    let currentPosition = 4;

    // randomly select a tetromino and one of its rotation
    let randomIndex = randomize();
    // console.log(`Random index: ${randomIndex}`);

    // randomly set initialRotation
    let initialRotation = Math.floor(Math.random() * arrayPieceLength);
    // console.log(`initial rotation: ${initialRotation}`);


    // current tetris
    let current = tetrisTetrominoes[nextRandom][initialRotation];
    // console.log(`Current: ${nextRandom}`);

    function randomize() {
        return Math.floor(Math.random() * tetrisTetrominoes.length);
    }
    // console.log(`Function randomize: ${randomize()}`);


    // draw a tetromino
    function draw() {
        current.forEach(index => {
            // add block class in each index with current array 
            squares[currentPosition + index].classList.add('block');
            // random = Math.floor(Math.random() * tetrisTetrominoes.length);
            squares[currentPosition + index].style.backgroundImage = colors[
                currentRandom
            ];
        })
    }

    //  undraw a tetromino
    function undraw() {
        current.forEach(index => {
            // add block class in each index with current array
            squares[currentPosition + index].classList.remove('block');
            squares[currentPosition + index].style.backgroundImage = 'none';
        })
    }

    // make the tetrominoes move down every second
    // timerId = setInterval(moveDown, 1000)

    // move down function
    function moveDown() {
        // undraw the tetromino as it moves down
        undraw()
        // add a whole width to the current position
        currentPosition = currentPosition += width
        // draw the tetromino in its current position
        draw()
        landed()
    }

    // move tetrominoes to the left when arrow keys are pressed
    function moveLeft() {
        undraw();

        const touchingLeftEdge = current.some(index => (currentPosition + index) % width === 0);

        if (!touchingLeftEdge) {
            // move the current tetromino to the left
            currentPosition -= 1
        };
        //tetromino collided with another block
        if (current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
            currentPosition += 1
        }
        draw();
    }

    // move tetrominoes to the right when arrow keys are pressed
    function moveRight() {
        undraw();

        const touchingRightEdge = current.some(index => (currentPosition + index) % width === width - 1);

        if (!touchingRightEdge) {
            // move the current tetromino to the right        
            currentPosition += 1
        };

        //tetromino collided with another block
        if (current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
            currentPosition -= 1
        }
        draw();
    }

    // rotate tetromino
    function rotate() {

        // if the tetromino is touching the left edge, rotate is disabled
        if (current.some(index => (currentPosition + index) % width === 0)) {
            return true;
        }

        // if the tetromino is touching the right edge, rotate is disabled
        if (current.some(index => (currentPosition + index) % width === width - 1)) {
            return true;
        }

        undraw();
        initialRotation++;
        if (initialRotation === current.length) {
            initialRotation = 0;
        }
        current = tetrisTetrominoes[currentRandom][initialRotation];
        draw();

        if (timerId === null) {
            return false;
        }
    }

    // show up-next tetromino in mini-grid display
    const displaySquares = document.querySelectorAll('.mini-grid div');
    // width of the mini-grid
    const displayWidth = 4
    // set index at 0
    let displayIndex = 0

    // the tetrominoes without rotations
    const upNextTetromino = [
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 2 + 2], //lTetromino
        [2, displayWidth + 2, displayWidth * 2 + 1, displayWidth * 2 + 2], //jTetromino
        [displayWidth + 1, displayWidth + 2, displayWidth * 2 + 1, displayWidth * 2 + 2], //oTetromino
        [displayWidth, displayWidth + 1, displayWidth + 2, displayWidth * 2 + 1], // tTetromino
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], //lTetromino
        [displayWidth, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 2 + 2] // zTetromino
    ]


    // landing function
    function landed() {
        // if tetromino reached the bottom
        if (current.some(index => squares[currentPosition + index + width].classList.contains('block3') || squares[currentPosition + index + width].classList.contains('block2'))) {
            // make it block2
            current.forEach(index => squares[currentPosition + index].classList.add('block2'));
            // start a new tetromino falling
            currentRandom = nextRandom;
            nextRandom = Math.floor(Math.random() * tetrisTetrominoes.length);
            // console.log(`next Random : ${currentRandom}`);
            current = tetrisTetrominoes[currentRandom][initialRotation];
            currentPosition = 4;
            draw();
            displayTetromino();
            addScore();
            gameOver();
        }
    }

    // display the Tetromino in the mini-grid
    function displayTetromino() {
        // remove trace of each tetromino from the entire grid
        displaySquares.forEach(squares => {
            squares.classList.remove('block')
            squares.style.backgroundImage = 'none'
        });

        upNextTetromino[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('block');
            displaySquares[displayIndex + index].style.backgroundImage = colors[nextRandom]
            // console.log(`nextRandom at upNext: ${nextRandom}`);
        });
    };

    // add functionality to the play-pause button
    playBtn.addEventListener('click', () => {
        const initialText = 'RESUME';
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
            playBtn.textContent = initialText;
        } else {
            draw();
            timerId = setInterval(moveDown, 1000);
            playBtn.textContent = 'PAUSE'
            displayTetromino();
        }
    });

    // add functionality to the start new game button
    newGameBtn.addEventListener('click', () => {
        newGame();
    });
    // add functionality to the quit button
    quitBtn.addEventListener('click', () => {
        close_window();
    });

    function close_window() {
        let message = "This tab will close.\nAre you sure you want to quit?";
        if (confirm(message) == true) {
            window.close();
        }
    };

    function newGame() {
        let message = "Are you sure you want to restart the game?";
        if (confirm(message) == true) {
            location.reload();
        }
    };

    // add score
    function addScore() {
        for (let count = 0; count < 199; count += width) {
            const row = [count, count + 1, count + 2, count + 3, count + 4, count + 5, count + 6, count + 7, count + 8, count + 9];
            if (row.every(index => squares[index].classList.contains('block2'))) {
                score += 100;
                lines += 1;
                scoreDisplay.innerHTML = score;
                lineDisplay.innerHTML = lines;
                row.forEach(index => {
                    squares[index].style.backgroundImage = 'none';
                    squares[index].classList.remove('block');
                    squares[index].classList.remove('block2');
                })
                // slice array
                const squaresRemoved = squares.splice(count, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    };

    // game over
    function gameOver() {
        for (let filled = 0; filled < 10; filled++) {
            if (current.some(index => squares[filled + index].classList.contains('block2'))) {
                alert('Game over! Try again.');
                location.reload();
                score = 0;
                lines = 0;
                clearInterval(timerId);
            }
        }
    }
});