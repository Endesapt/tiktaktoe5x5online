const path=require('path');
const fs=require('fs');

//data
let data=require('../data/data.json');


function getMainPage(req,res){  
    if(req.session.username){
        res.setHeader('Access-Control-Allow-Credentials', 'true')
        res.render(path.join(__dirname,'..','static','hbs','index.hbs'),data[req.session.username]);    
    }else{
        res.render(path.join(__dirname,'..','static','hbs','register.hbs')); 
    }
}
function login(req,res){
    if(data[req.body.username]?.password==req.body.password){
        req.session.username=req.body.username;
        res.redirect('/');

    }else{
        res.render(path.join(__dirname,'..','static','hbs','register.hbs'),{wrongpass:true});
    }
}
function register(req,res){
    if(data[req.body.username]){
        res.redirect('../');
    }else{
        data[req.body.username]={
            password:req.body.password,
            elo:0,
            games:0,
            wongames:0,
            username:req.body.username,
        }
        fs.writeFileSync(path.join(__dirname,'..','data','data.json'), JSON.stringify(data));
        req.session.username=req.body.username;
        res.redirect('../');
    }
}
function startLocalGame(req,res){
    res.render(path.join(__dirname,'..','static','hbs','game.hbs'),{localgame:true});
}
module.exports={getMainPage,login,register,startLocalGame};