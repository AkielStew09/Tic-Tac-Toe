const Gameboard = (() => {
    //we'll have the array be nine elements long with values of
    //either 'x', 'o', or '-' for empty.
    let boardArr = [];
    const setUpBoard = () => {
        for (let i = 0; i < 9; ++i) {
            boardArr[i] = Square();
        }
    };
    
    const getBoard = ()=> boardArr;

    const printBoard = ()=>{
        
        for(let i = 0; i < 3; ++i){
           
            //slice(start, end - not including end)
            //first example: slice(0, 3)
            console.log(boardArr.slice(i*3, i*3 +3));
        }
    }
    
    const acceptMove = (player, indexOfMove)=>{
        //retrieve the Square object at that index
        let square = boardArr[indexOfMove];

        if(square.getSymbol() === '-' ){
            square.acceptSymbol(player);
        } 
    }

    return { setUpBoard, getBoard, printBoard, acceptMove };
})();//turned this to an IIFE, my first ever one in fact.

const Square = ()=>{
    let symbol = '-';

    //function to be drawn in by a player. A setter, essentially.
    const acceptSymbol =(player)=>{
        if (player.symbol === 'x' || player.symbol === 'o' ){
            symbol = player.symbol;
        }else{
            console.error("Invalid symbol for Tic-Tac-Toe. Please use an 'x' or 'o'.");
        }
    }

    //getter
    const getSymbol = ()=>symbol;

    return{acceptSymbol, getSymbol};
}

function Player(name, symbol) {
    let score = 0;
    const increaseScore = () => ++score;

    return { name, symbol, increaseScore };
}
