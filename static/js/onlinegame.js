$('#table_wrapper').scrollLeft(($('#game_table').width() - $('#table_wrapper').width()) / 2);
$('#table_wrapper').scrollTop(($('#game_table').height() - $('#table_wrapper').height()) / 2);
let lastmoves=['','','','','','','','','','','','',''];
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


$('#game_table').click(async function (e) { //Offset mouse Position
    var posX = $(this).offset().left,
    posY = $(this).offset().top;
    x=Math.ceil((e.pageX - posX)/56)-1;
    y=Math.ceil((e.pageY - posY)/56)-1;
    fetch(window.location+'/makeMove', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          x:x,
          y:y
        })
      });

});


//подкачиваем инфу о карте 2500*2500 один раз чтобы если вдруг перезайти то все норм было
fetch(window.location+'/getMapInfo').then((response)=>{
  return response.json()
}).then((answer)=>{
  $('#turn').text(answer.turn);
  let map=answer.map;
  if(answer.win){
    $('#win').text(`${answer.win} win! Победитель получит 20 эло`);
  }
  for(x in map){
    for(y in map[x]){
      if(map[x][y]!=' '){
        img=document.createElement('img');
        img.src=(map[x][y]=='x'?'http://localhost:3000/images/tic.png':'http://localhost:3000//images/tac.png');
        $(`#game_table td[x=${x}][y=${y}]`).append(img);
        lastmoves.shift();
        lastmoves.push({x:x,y:y});
      }
    }
  }

  let opponent=document.createElement('div');

  let oppstr=answer.opponent?(answer.opponent+`<span style="color:blue" onclick='window.open("http://localhost:3000/users?username=${answer.opponent}");'>(see profile)</span>`)
  :"there is no opponent yet";
  opponent.innerHTML=`Your opponent: ${oppstr}`;
  document.getElementById('game_info').appendChild(opponent);
  console.log(answer);
  $("#opened").text(`type of lobby: ${answer.opened?'opened':'closed'}`);

},()=>{return})

async function getMap(){
  await fetch(window.location+'/getMatchInfo').then((response)=>{
    if(response.status==404){
      window.location.reload();
    }
    return response.json()
  }).then((answer)=>{
    if(answer.win){
      $('#win').text(`${answer.win} win! Победитель получит 20 эло`);
    }
    for(pos of answer.lastmoves){
      if(!lastmoves.some( 
        value => { return (pos.x==value.x&&pos.y==value.y) } ) 
        && pos!=''){
          $('#turn').text(answer.turn);
          img=document.createElement('img');
          img.src=(pos.turn=='x'?'http://localhost:3000/images/tic.png':'http://localhost:3000//images/tac.png');
          $(`#game_table td[x=${pos.x}][y=${pos.y}]`).append(img);
          lastmoves.shift();
          lastmoves.push(pos);
      }
    }
  },()=>{return})
}

setInterval(getMap,100)