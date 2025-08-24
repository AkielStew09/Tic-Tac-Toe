const Gameboard = (() => {
    //we'll have the array be nine elements long with values of
    //either 'x', 'o', or '-' for empty.
    let boardArr = [];
    const setUpBoard = () => {
        for (let i = 0; i < 9; ++i) {
            boardArr[i] = Square();
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
        return boardArr.filter((square) => square.getSymbol() === "-").length;
    };

    //Function that takes board postion string and converts it to the
    // corresponding array index.
    const interpret = (position) => {
        //the position param is a string that should be in the posArr below.
        for (let i = 0; i < posArr.length; ++i) {
            if (posArr[i] === position) {
                return i;
            }
        }
        console.error("Invalid board position");
        return -1;
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

        if (square.getSymbol() === "-") {
            square.acceptSymbol(player);
        } else {
            console.error("Invalid Move. The square is already occupied.");
        }
    };

    //function to check if the game is won, ie. if there are three in a row
    const gameWon = () => {
        //check the three columns for a vertical gameOver
        for (let i = 0; i < 3; ++i) {
            if (boardArr[i].getSymbol() === "-") continue; //if one is empty then it can't be a win.

            let top = boardArr[i].getSymbol();
            //index+3 brings you to the square directly under
            let middle = boardArr[i + 3].getSymbol();
            let bottom = boardArr[i + 3 + 3].getSymbol();
            //eg. for the first column, the top is the symbol at index 0,
            // the middle is 3 and bottom is 6

            if (top === middle && middle === bottom) {
                winningSymbol = middle;
                return true;
            }
        }
        //check the rows
        for (let i = 0; i < 9; i += 3) {
            if (boardArr[i].getSymbol() === "-") continue; //if one is empty then it can't be a win.

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
            if (boardArr[i].getSymbol() === "-") continue; //if one is empty then it can't be a win.

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
        getWinSymbol,
    };
})(); //turned this to an IIFE, my first ever one in fact.

const Square = () => {
    let symbol = "-";

    //function to be drawn in by a player. A setter, essentially.
    const acceptSymbol = (player) => {
        if (player.symbol === "x" || player.symbol === "o") {
            symbol = player.symbol;
        } else {
            console.error(
                "Invalid symbol for Tic-Tac-Toe. Please use an 'x' or 'o'."
            );
        }
    };

    //getter
    const getSymbol = () => symbol;

    return { acceptSymbol, getSymbol };
};

function Player(name, symbol) {
    let score = 0;

    const getName = () => name;
    const getSymbol = () => symbol;
    const getScore = () => score;
    const increaseScore = () => ++score;
    const resetScore = () => (score = 0);

    return { getName, getSymbol, getScore, increaseScore, resetScore };
}

const Game = (function () {
    const winMessage = (p1, p2) => {
        if (p1.getScore() > p2.getScore()) {
            alert(
                p1.getName() +
                    " IS THE WINNER WITH A SCORE OF " +
                    p1.getScore() +
                    "!"
            );
        } else if (p2.getScore() > p1.getScore()) {
            alert(
                `${p1.getName()} IS THE WINNER WITH A SCORE OF ${p1.getScore()}!`
            );
        } else {
            alert(
                `The final result is a draw, with both players scoring ${p2.getScore()}`
            );
        }
    };

    const playRound = (player1, player2, roundNum) => {
        let players = [player1, player2];
        let roundWinner = null;
        let activePlayer = player1;

        const handOver = () => {
            activePlayer = activePlayer === player1 ? player2 : player1;
        };

        Gameboard.setUpBoard();
        Gameboard.printBoard();
        alert(
            `Round ${roundNum} has started. The board has been initialized. ` +
                activePlayer.getName() +
                "'s turn."
        );

        do {
            //read move from input
            let movePos = prompt(
                `${activePlayer.getName()}, place your ${activePlayer.getSymbol()}.`
            );
            Gameboard.acceptMove(activePlayer, movePos);
            alert(activePlayer.getName() + " has moved to " + movePos);
            Gameboard.printBoard();
            handOver();
        } while (Gameboard.gameOver() === false);

        if (Gameboard.gameWon()) {
            players.map((player) => {
                if (player.getSymbol() === Gameboard.getWinSymbol()) {
                    roundWinner = player;
                    roundWinner.increaseScore();
                    alert(`${roundWinner} wins this round!`);
                }
            });
        } else {
            //a draw
            alert(`This round is a draw!`);
        }
    };
    function playGame() {
        alert("Welcome to Tic-tac-toe!");
        let name1 = prompt("Player 1, enter you name. You will be using x");
        let name2 = prompt("Player 2, enter you name. You will be using o");
        rounds = 3;
        alert(`The winner will be decided over ${rounds} rounds.`);
        p1 = Player(name1, "x");
        p2 = Player(name2, "o");

        for (let i = 0; i < rounds; ++i) {
            let currentRound = i + 1;
            playRound(p1, p2, currentRound);
        }
        winMessage(p1, p2);
    }

    return {playGame};
})();

Game.playGame();
