const Gameboard = (() => {
    //we'll have the array be nine elements long with values of
    //either 'x', 'o', or '' for empty.
    let boardArr = [];

    const setUpBoard = () => {
        for (let i = 0; i < 9; ++i) {
            boardArr[i] = new Square();
        }
    };

    //return the board
    const getBoard = () => boardArr;


    //returns amount of empty squares
    const emptySquares = () => {
        return boardArr.filter((square) => square.getSymbol() === '').length;
    };

    //the symbol used to retrieve the winning player
    let winningSymbol = null;
    const getWinSymbol = () => winningSymbol;

    //the big function to check if the game is won
    //ie. if there are three in a row
    const gameWon = () => {
        winningSymbol = null;

        //check the three columns for a vertical gameOver
        for (let i = 0; i < 3; ++i) {
            if (boardArr[i].getSymbol() === '') continue; //if one is empty then it can't be a win.

            let top = boardArr[i].getSymbol();
            //index+3 brings you to the square directly under
            let middle = boardArr[i + 3].getSymbol();
            let bottom = boardArr[i + 3 + 3].getSymbol();
            //eg. for the first column, the top is the symbol at index 0,
            // the middle is 3 and bottom is 6

            if (top === middle && middle === bottom) {
                winningSymbol = top;
                return true;
            }
        }
        //check the rows
        for (let i = 0; i < 9; i += 3) {
            if (boardArr[i].getSymbol() === "") continue; //if one is empty then it can't be a win.

            let left = boardArr[i].getSymbol();
            let middle = boardArr[i + 1].getSymbol(); //+1 brings you one square to the right
            let right = boardArr[i + 1 + 1].getSymbol();

            if (left === middle && middle === right) {
                winningSymbol = middle;
                return true;
            }
        }
        //check diagonally. I'll use 0 and 2 as the two top corners and go diagonally from each
        for (let i = 0; i <= 2; i += 2) {
            if (boardArr[i].getSymbol() === "") continue; //if one is empty then it can't be a win.

            let top, middle, bottom;
            switch (i) {
                case 0:
                    top = boardArr[i].getSymbol();
                    middle = boardArr[i + 3 + 1].getSymbol();
                    //+3 would be under, so that +1 is diagonally down-right
                    bottom = boardArr[i + 3 + 1 + 3 + 1].getSymbol();
                    if (top === middle && middle === bottom) {
                        winningSymbol = middle;
                        return true;
                    }
                    break;
                case 2:
                    top = boardArr[i].getSymbol();
                    middle = boardArr[i + 3 - 1].getSymbol(); //+3 would be under, so that -1 is diagonally down-left
                    bottom = boardArr[i + 3 - 1 + 3 - 1].getSymbol();
                    if (top === middle && middle === bottom) {
                        winningSymbol = middle;
                        return true;
                    }
                    break;
                default:
                    return false;
                    break;
            }
        }
    };

    const gameOver = () => {
        //if the game has been won or all the squares are used up
        if (gameWon() || !emptySquares()) {
            return true;
        } else {
            return false;
        }
    };

    return {
        setUpBoard,
        getBoard,
        gameOver,
        gameWon,
        getWinSymbol
    };
})(); //turned this to an IIFE, my first ever one in fact.


class Square {
    //this is how you make a field private
    #symbol;
    constructor() {
        this.#symbol = '';
    }

    acceptSymbol(player) {
        //symbol needs to be the empty string, if not cancel this
        if (this.#symbol !== '') return;

        if (player.getSymbol() === "x" || player.getSymbol() === "o") {
            this.#symbol = player.getSymbol();
        } else {
            console.error(
                "Invalid symbol for Tic-Tac-Toe. Please use an 'x' or 'o'."
            );
        }
    }

    getSymbol() { return this.#symbol }
}

class Player {
    constructor(name, symbol) {
        this.name = name;
        this.symbol = symbol;
        this.score = 0;
    }
    getName() { return this.name }
    getSymbol() { return this.symbol }
    getScore() { return this.score }
    increaseScore() { ++this.score }
    resetScore() { this.score = 0 }
}

const Game = function (p1name, p2name) {

    const players = [
        new Player(p1name, 'x'),
        new Player(p2name, 'o')
    ];

    let activePlayer = players[0];
    const getActivePlayer = () => activePlayer;

    //players take turns
    const handOver = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };


    let roundNumber = 1;
    const getRoundNumber = () => roundNumber;

    //start new round, increasing the round number
    const newRound = () => {
        if (roundNumber < 3)
            ++roundNumber;
        else
            console.error("Attempt to exceed round limit");
    };

    const isLastRound = () => roundNumber === 3;

    //after last round, evaluate and announce the final winner
    const winMessage = () => {
        const p1 = players[0];
        const p2 = players[1];
        if (p1.getScore() > p2.getScore()) {
            alert(
                p1.getName() +
                " IS THE FINAL WINNER WITH A SCORE OF " +
                p1.getScore() +
                "!"
            );
        } else if (p2.getScore() > p1.getScore()) {
            alert(
                `${p2.getName()} IS THE FINAL WINNER, SCORING ${p2.getScore()}!`
            );
        } else {
            alert(
                `The final result is a draw, with both players scoring ${p2.getScore()}`
            );
        }
        //end of the series
        location.reload();
    };

    //after round ends, give points to the winner
    //and announce the round outcome
    const roundEnd = () => {
        let roundWinner = null;
        //only call this when a round is over
        //
        //if the game is won, then give points
        if (Gameboard.gameWon()) {
            roundWinner = players.find((player) => player.getSymbol() === Gameboard.getWinSymbol())
            roundWinner.increaseScore();
            alert(`${roundWinner.getName()} wins this round!`);
        } else {
            //if it's a draw, then just say it's a draw
            alert(`This round is a draw!`);
        }
        handOver();
    };

    return {
        winMessage,
        getActivePlayer,
        handOver,
        roundEnd,
        newRound,
        isLastRound,
        getRoundNumber
    };
}


function ScreenController() {

    const ui_printForm = () => {

        //grab and populate container div
        const container = document.querySelector(".container");
        container.innerHTML = `
            <h2 class="intro-title">Welcome To Tic-Tac-Toe!</h2>
            <label for="p1name">Player 1, enter your name. You will be using x:</label>
            <input type="text" id="p1name" class="textbox">

            <label for="p2name">Player 2, enter your name. You will be using x:</label>
            <input type="text" id="p2name" class="textbox">

            <button class="startButton">Start!</button>

        `;

        //grab start button and apply event listener
        const startButton = document.querySelector(".startButton");
        startButton.addEventListener("click", () => {
            //
            //grab player names, clear the screen, and play the game using the names
            const p1name = document.querySelector("#p1name").value;
            const p2name = document.querySelector("#p2name").value;
            const game = Game(p1name, p2name);

            ui_printBoard(game);
        });
    };

    const ui_printBoard = (game) => {
        //set up the board and store a reference to it
        Gameboard.setUpBoard();
        const board = Gameboard.getBoard();

        //put the game title and board element on screen
        setGameTitle(game);
        addBoardDiv();

        //grab that board element and make sure it's empty
        const boardElement = document.querySelector(".board");
        boardElement.innerHTML = "";

        //fill it with the squares
        board.forEach((square, i) => {
            boardElement.innerHTML += `<button class="square" data-index="${i}">${square.getSymbol()}</button>`;
        });

        //add the click handler, but only if it's round 1
        if (game.getRoundNumber() !== 1) return;
        boardElement.addEventListener("click", (e) => {
            //implement the board move in code
            let uiSquare = e.target;
            const codeSquare = board[uiSquare.dataset.index];
            codeSquare.acceptSymbol(game.getActivePlayer());
            //display the move on screen
            uiSquare.textContent = codeSquare.getSymbol();

            //check if that move ended the round
            if (Gameboard.gameOver()) {
                //if this round isn't the final one
                if (!game.isLastRound()) {
                    //increase round number
                    game.newRound();

                    //wait a little then give the points & show message
                    setTimeout(
                        () => {
                            game.roundEnd();
                            ui_printBoard(game);
                        },
                        0.6
                    );

                }
                //if this is the final round, the series is over
                //annouce the round and series results
                else {
                    setTimeout(
                        () => {
                            game.roundEnd();
                            game.winMessage();
                        },
                        0.6
                    );
                }
            } else {
                //round isn't done
                //so switch turns and show active player's name in title
                game.handOver();
                setGameTitle(game);

            }
        });

    };

    //function for displaying title,
    //which consists of the round and the player's turn
    const setGameTitle = (game) => {

        //if title element is already there, just replace the text
        let title = document.querySelector("h2.title");
        let roundText = document.querySelector("p");

        if (title) {
            title.textContent = `
                ${game.getActivePlayer().getName()}'s turn. Place your ${game.getActivePlayer().getSymbol()}`;

            roundText.textContent = `
                Round ${game.getRoundNumber()}`

            return;
        }

        //if it's not there
        //grab the container and add them in
        const container = document.querySelector(".container");
        container.innerHTML = `
                <p>Round ${game.getRoundNumber()}</p><br/>
                <h2 class="title">${game.getActivePlayer().getName()}'s turn. Place your ${game.getActivePlayer().getSymbol()}</h2>
        `;
    };

    const addBoardDiv = () => {
        const container = document.querySelector(".container");
        const boardDiv = document.querySelector(".board");

        //if there's no board div, add it
        if (!boardDiv)
            container.innerHTML += `<div class="board"></div>`;

    };

    //start everything by printing the form
    ui_printForm();
}

ScreenController();
