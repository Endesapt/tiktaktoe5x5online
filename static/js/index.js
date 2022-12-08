
function getBestPlayers(){
    fetch('/getBestPlayers').then((response)=>{
        return response.json()
    }).then((answer)=>{
        for(el of answer.players){
            console.log(answer);
            document.getElementById("best_players").innerHTML+=`
            <li>${el[0]}<span style="color:blue" onclick='window.open("http://localhost:3000/users?username=${el[0]}");'>(see profile)</span> elo:${el[1]}</li>
            `
        }
    })
}