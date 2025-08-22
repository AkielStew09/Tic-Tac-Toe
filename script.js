const Gameboard = () => {
    //we'll have the array be nine elements long with values of
    //either 'x', 'o', or '-' for empty.
    let boardArr = [];
    const setUpBoard = () => {
        for (let i = 0; i < 9; ++i) {
            boardArr[i] = '-';
        }
    };

    const printBoard = ()=>{
        let printArr = [];
        //I'm trying to split printArr into three separate arrays of three
        for(let i = 0; i < 3; ++i){
            printArr[i] = [];

            for(let j = 0; j < 3; ++j){
                printArr[i].push(boardArr[i]);     
            }

            console.log(printArr[i]);
        }
    }

    return { boardArr };
};

function Player(name, symbol) {
    let score = 0;
    const increaseScore = () => ++score;

    return { name, symbol, increaseScore };
}
