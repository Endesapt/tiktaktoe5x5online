const express=require('express');
const router = express.Router();
const path=require('path');
const uniqid = require('uniqid');


let lobbies={};

// Home page route.
router.get('/createNewLobby',(req,res)=>{
    let id=uniqid();
    lobbies[id]=Array.apply(null, Array(50)).map(function (x) { 
        return (Array.apply(null, Array(50)).map(function (x) { return ' '; })) 
    });//новая карта
    console.log(lobbies);
    res.redirect(`http://localhost:3000/online/${id}`);
})
router.get("/:id", function (req, res) {
    res.render(path.join(__dirname,'..','static','hbs','game.hbs'),{localgame:true});
});


module.exports=router;
