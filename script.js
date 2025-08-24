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

    const emptySquares = () => {
        return boardArr.filter((square) => square.getSymbol() === "-").length;
    };

    const countSymbols = () => {
        let xCount = boardArr.filter(
            (square) => square.getSymbol() === "x"
        ).length;
        let oCount = boardArr.filter(
            (square) => square.getSymbol() === "o"
        ).length;

        let majority = "";
        if (xCount > oCount) {
            majority = "x";
        } else if (oCount > xCount) {
            majority = "o";
        } else {
            majority = null;
        }

        return { xCount, oCount, majority };
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
            let top = boardArr[i].getSymbol();
            //+3 brings you to the square directly under
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
    const increaseScore = () => ++score;

    return { name, symbol, increaseScore };
}

function playRound(player1, player2) {
    let players = [player1, player2];
    let activePlayer = player1;
    let roundWinner = null;

    const handOver = () => {
        activePlayer = activePlayer === player1 ? player2 : player1;
    };

    Gameboard.setUpBoard();
    Gameboard.printBoard();
    console.log(
        "New round. The board has been initialized. " +
            activePlayer.name +
            "'s turn."
    );

    do {
        let movePos = prompt(
            `${activePlayer.name}, enter the square where you will place your ${activePlayer.symbol}`
        );
        Gameboard.acceptMove(activePlayer, movePos);
        console.log("Move has been made to " + movePos);
        Gameboard.printBoard();
        handOver();
    } while (Gameboard.gameOver() === false);

    for (let player of players) {
        if (player.symbol === Gameboard.getWinSymbol()) {
            roundWinner = player;
            alert(`${roundWinner} wins this round!`);
        }
    }
}
function Game() {
    p1 = Player("Urien", "x");
    p2 = Player("Molina", "o");

    playRound(p1, p2);
}

//test for the Gameboard functions and Player object
function test() {}

Game();
