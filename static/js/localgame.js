
$('#table_wrapper').scrollLeft(($('#game_table').width() - $('#table_wrapper').width()) / 2);
$('#table_wrapper').scrollTop(($('#game_table').height() - $('#table_wrapper').height()) / 2);
for(let i=0;i<50;i++){
    let tr=document.createElement('tr');
    for(let j=0;j<50;j++){
        let td=document.createElement('td');
        td.setAttribute('y',i);
        td.setAttribute('x',j);
        tr.appendChild(td);
    }
    $('#game_table').append(tr);
        
}
function drawElement(x,y,type){
    img=document.createElement('img');
    img.src=(type=='x'?'images/tic.png':'images/tac.png');
    if($(`#game_table td[x=${x}][y=${y}]`).html()=='')$(`#game_table td[x=${x}][y=${y}]`).append(img);
    

}


let map=Array.apply(null, Array(50)).map(function (x) { 
    return (Array.apply(null, Array(50)).map(function (x) { return ' '; })) 
});//карта
let turn='x';
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
$('#game_table').click(function (e) { //Offset mouse Position
    var posX = $(this).offset().left,
    posY = $(this).offset().top;
    x=Math.ceil((e.pageX - posX)/56)-1;
    y=Math.ceil((e.pageY - posY)/56)-1;
    if(map[x][y]!=' ')return;
    drawElement(x,y,turn);
    map[x][y]=turn;
    if(checkWin(map,x,y,turn)){
        $('#win').text(`${turn} выиграл!`);
    }
    turn=(turn=='x'?'o':'x');
    $('#turn').text(turn);

});


