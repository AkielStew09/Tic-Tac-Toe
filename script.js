const Gameboard = (() => {
    //we'll have the array be nine elements long with values of
    //either 'x', 'o', or '' for empty.
    let boardArr = [];
    const setUpBoard = () => {
        for (let i = 0; i < 9; ++i) {
            boardArr[i] = new Square();
        }
    };

    let winningSymbol = null;

    const posArr = [
        "topLeft",
        "topMiddle",
        "topRight",
        "centerLeft",
        "center",
        "centerRight",
        "bottomLeft",
        "bottomMiddle",
        "bottomRight",
    ];

    //returns amount of empty squares
    const emptySquares = () => {
        return boardArr.filter((square) => square.getSymbol() === '').length;
    };

    //Function that takes board postion string and converts it to the
    // corresponding array index.
    const interpret = (position) => {
        //the position param is a string that should be in the posArr below.
        let index = posArr.findIndex(pos => pos === position);
        if (index === -1)
            console.error("Invalid board position");
        return index;

        // for (let i = 0; i < posArr.length; ++i) {
        //     if (posArr[i] === position) {
        //         return i;
        //     }
        // }
        // console.error("Invalid board position");
        // return -1;
    };

    //return the board
    const getBoard = () => boardArr;

    //show the board
    const printBoard = () => {
        for (let i = 0; i < 3; ++i) {
            //This prints the boardArr in three rows of three.
            //slice(start, end - not including end)
            //first example: slice(0, 3)

            console.log(
                boardArr
                    .slice(i * 3, i * 3 + 3)
                    .map((Square) => Square.getSymbol())
            );
        }
    };

    const acceptMove = (player, boardPosition) => {
        //retrieve the index given the board position
        let indexOfMove = interpret(boardPosition);
        //retrieve the Square object at that index
        let square = boardArr[indexOfMove];

        if (square.getSymbol() === "") {
            square.acceptSymbol(player);
        } else {
            console.error("Invalid Move. The square is already occupied.");
        }
    };

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

    const getWinSymbol = () => winningSymbol;

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
        printBoard,
        acceptMove,
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

    const handOver = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    let roundNumber = 1;

    const newRound = () => {
        if (roundNumber < 3)
            ++roundNumber;
    }

    const getRoundNumber = () => roundNumber;

    const isLastRound = () => {
        if (roundNumber === 3)
            return true;
        else
            return false;

    };

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

    const playRound = (roundNum) => {

        Gameboard.setUpBoard();
        console.log(`Board initialized.\nScores: ${player1.getName()}-${player1.getScore()}, 
        ${player2.getName()}-${player2.getScore()}`);
        Gameboard.printBoard();
        // alert(
        //     `Round ${roundNum} has started. ` +
        //     activePlayer.getName() +
        //     "'s turn."
        // );

        do {
            //read move from input
            let movePos = prompt(
                `${activePlayer.getName()}, place your ${activePlayer.getSymbol()}.`
            );
            Gameboard.acceptMove(activePlayer, movePos);
            console.log(activePlayer.getName() + " has moved to " + movePos);
            Gameboard.printBoard();
            handOver();
        } while (Gameboard.gameOver() === false);

        //akiel checkpoint, come here and make this its own function 
        roundEnd();
    };

    //this function gives points to the winner
    //and displays message of the round outcome
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
    }

    function playGame(player1name = "Player 1", player2name = "Player 2") {
        // alert("Welcome to Tic-tac-toe!");
        // let name1 = prompt("Player 1, enter your name. You will be using x");
        // let name2 = prompt("Player 2, enter your name. You will be using o");
        const rounds = 3;
        // alert(`The winner will be decided over ${rounds} rounds.`);
        p1 = new Player(player1name, "x");
        p2 = new Player(player2name, "o");

        for (let currentRound = 1; currentRound <= rounds; ++currentRound) {
            playRound(p1, p2, currentRound);
        }
        winMessage(p1, p2);
    }

    return {
        playGame,
        winMessage,
        playRound,
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

        //set the game title and put board div on screen
        setGameTitle(game);
        addBoardDiv();

        //grab that board element and make sure it's empty
        const boardElement = document.querySelector(".board");
        boardElement.innerHTML = "";

        //populate it with the squares
        board.forEach((square, i) => {
            boardElement.innerHTML += `<button class="square" data-index="${i}">${square.getSymbol()}</button>`;
        });

        //add event listener to the board, only if it's round 1
        if (game.getRoundNumber() !== 1) return;

        boardElement.addEventListener("click", (e) => {
            //implement the board move in code
            let uiSquare = e.target;
            const square = board[uiSquare.dataset.index];
            square.acceptSymbol(game.getActivePlayer());
            //display the board move on screen
            uiSquare.textContent = square.getSymbol();

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
                //switch turns and show active player's name in title
                game.handOver();
                setGameTitle(game);

            }
            // ui_printBoard(game, round);

        });

    };

    const setGameTitle = (game) => {

        //if title element is already there, just replace the text
        let title = document.querySelector("h2.title");
        let roundText = document.querySelector("p");

        if (title) {
            title.textContent = `
                ${game.getActivePlayer().getName()}'s turn`;

            roundText.textContent = `
                Round ${game.getRoundNumber()}`

            return;
        }

        //if not
        //grab the container and put the title in
        const container = document.querySelector(".container");
        container.innerHTML = `
                <p>Round ${game.getRoundNumber()}</p><br/>
                <h2 class="title">${game.getActivePlayer().getName()}'s turn</h2>
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
