const createGameboard =()=>{
    let boardArr = [];
    return {boardArr};
}

function createPlayer(name){
    let score = 0;
    const increaseScore =()=> ++score;

    return {name, increaseScore};
}