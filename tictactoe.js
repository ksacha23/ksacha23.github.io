var startBoard;
const humanPlayer = 'X';
const aiPlayer = 'O';
const winCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]

const cells = document.querySelectorAll('.cell');
startGame();

function startGame(){
    document.querySelector(".endgame").style.display = "none";
    startBoard = Array.from(Array(9).keys());
    for(var i=0; i < cells.length; i++){
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
}

function turnClick(square){
    if(typeof startBoard[square.target.id] == 'number'){
        turn(square.target.id, humanPlayer);
        if(!checkWin(startBoard, humanPlayer) && !checkTie()){
            turn(bestSpot(), aiPlayer);
        }
    }
}

function turn(squareId, player) {
    startBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(startBoard, player);
    if(gameWon){
        gameOver(gameWon);
    }
}

function checkWin(board, player){
    let plays = board.reduce((a,e,i) =>
    (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for(let [index, win] of winCombos.entries()){
        if(win.every(elem => plays.indexOf(elem) > -1)){
            gameWon = {index: index, player: player};
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon){
    for(let index of winCombos[gameWon.index]){
        document.getElementById(index).style.backgroundColor = gameWon.player == humanPlayer ? "blue" : "red";
    }
    for(var i = 0; i < cells.length; i++){
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player == humanPlayer ? "You won!" : "I told you you wouldn't win!");
}

function declareWinner(who){
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
}

function emptySquares(){
    return startBoard.filter(s => typeof s == 'number'); 
}

function bestSpot(){
    return minimax(startBoard, aiPlayer).index;
}

function checkTie(){
    if(emptySquares().length == 0){
        for(var i = 0; i < cells.length; i++){
            cells[i].style.backgroundColor = "green";
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner("That is the best you will do!");
        return true;
    }
    return false;
}

function minimax(newBoard, player){
    var availableSpots = emptySquares();

    if(checkWin(newBoard, humanPlayer)){
        return {score: -10};
    }else if(checkWin(newBoard, aiPlayer)){
        return {score: 10};
    }else if(availableSpots.length === 0){
        return {score: 0};
    }
    var moves = [];
    for(var i = 0; i < availableSpots.length; i++){
        var move = {};
        move.index = newBoard[availableSpots[i]];
        newBoard[availableSpots[i]] = player;

        if(player == aiPlayer){
            var result = minimax(newBoard, humanPlayer);
            move.score = result.score;
        }else{
            var result = minimax(newBoard, aiPlayer);
            move.score = result.score;
        }

        newBoard[availableSpots[i]] = move.index;
        moves.push(move);
    }

        var bestMove;
        if(player === aiPlayer){
            var bestScore = Number.NEGATIVE_INFINITY;
            for(var i = 0; i < moves.length; i++){
                if(moves[i].score > bestScore){
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }else{
            var bestScore = Number.POSITIVE_INFINITY;
            for(var i = 0; i < moves.length; i++){
                if(moves[i].score < bestScore){
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }

        return moves[bestMove];
    }



