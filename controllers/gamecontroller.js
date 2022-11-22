const path=require('path');
const uniqid = require('uniqid');

//data
let lobbies={};


function checkWin(map,x,y,turn){
    //проверяем от ншего хода по четырем нправлениям | - \ /
    let s=['','','',''];
    for(let i=x-4;i<x+5;i++)s[0]+=map[i][y];
    for(let i=y-4;i<y+5;i++)s[1]+=map[x][i];
    for(let i=x-4,j=y-4;i<x+5;i++,j++){s[2]+=map[i][j];}
    for(let i=x+4,j=y-4;i>x-5;i--,j++)s[3]+=map[i][j];
    if(s[0].indexOf(turn.repeat(5))!==-1 || s[1].indexOf(turn.repeat(5))!==-1 || 
    s[2].indexOf(turn.repeat(5))!==-1 ||
    s[3].indexOf(turn.repeat(5))!==-1
    )return true;
    return false;
}
function checkAFK(arr,id){
    if(arr[arr.length-1]==lobbies[id].lastmoves[11]){
        delete lobbies[id]
    }else{
        setTimeout(checkAFK,30*1000,[...(lobbies[id].lastmoves)],id);
    }
}
function createNewLobby(req,res){
    let id=uniqid();
    lobbies[id]={
        map:Array.apply(null, Array(50)).map(function (x) { 
        return (Array.apply(null, Array(50)).map(function (x) { return ' '; })) 
        }),
        players:[req.session.username],
        turn:'x',
        lastmoves:['','','','','','','','','','','',''],
        win:'',
    };//новое лобби
    //АФК Система
    setTimeout(checkAFK,30*1000,[...(lobbies[id].lastmoves)],id);
    console.log(lobbies);
    res.redirect(`http://localhost:3000/online/${id}`);
}
function getLobby(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.render(path.join(__dirname,'..','static','hbs','game.hbs'),{onlinegame:true});
}
function makeMove(req,res){
    if(lobbies[id].win){res.send('Game is ended');return;}
    let {x,y}=req.body;
    id=req.params.id;
    res.set('Content-Type', 'text/html');

    if((lobbies[id].turn=='x' && lobbies[id].players[0]==req.session.username)||
    (lobbies[id].turn=='o' && lobbies[id].players[1]==req.session.username)
    ){
        if(lobbies[id].map[x][y]==' '){
            lobbies[id].map[x][y]=lobbies[id].turn;
            lobbies[id].lastmoves.shift();
            lobbies[id].lastmoves.push({x:x,y:y,turn:lobbies[id].turn});
            if(checkWin(lobbies[id].map,x,y,lobbies[id].turn)){
                lobbies[id].win=lobbies[id].turn;
                setTimeout(()=>{delete lobbies[id]}, 30*1000);
            }
            lobbies[id].turn=lobbies[id].turn=='x'?'o':'x';
            res.send('OK');
        }else{
            res.send(`There is a move already at x:${x} y:${y}`);
        }
    }else{
        res.status(304).send('Its not your turn');
    }


}
function getMatchInfo(req,res){
    id=req.params.id;
    res.send(JSON.stringify({
        turn:lobbies[id].turn,
        lastmoves:lobbies[id].lastmoves,
        win:lobbies[id].win,
    }));

}
function getMapInfo(req,res){
    id=req.params.id;
    res.send(JSON.stringify(lobbies[id]));
}
function checkLobby(req,res,next){
    id=req.params.id;
    if(lobbies[id]){
        if(lobbies[id].players.includes(req.session.username)){
            next();
        }else if(lobbies[id].players.length<2){
            lobbies[id].players.push(req.session.username);
            next();
        }else{
            res.send('Sorry lobby is full');
        }
    }else{
        res.status(404).send('No such a lobby or game has ended');
    }
}
module.exports={checkWin,createNewLobby,getLobby,makeMove,getMatchInfo,getMapInfo,checkLobby};