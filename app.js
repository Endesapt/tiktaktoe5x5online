const express=require('express');
const path=require('path');
const fs=require('fs');
const session = require('express-session')
const{}=require('./controllers/controllers');

const app=express();
app.set('view engine','hbs');


let data=require('./data/data.json');
let lobbys={};


//middleware
app.use(session({
    secret: 'vatahell1313',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use('',express.static(path.join(__dirname,'static')));
app.use(express.json());
app.use(express.urlencoded())

//регистрация и логин
app.get('/',(req,res)=>{  
    if(req.session.username){
        res.render(path.join(__dirname,'static','hbs','index.hbs'),data[req.session.username]);    
    }else{
        res.render(path.join(__dirname,'static','hbs','register.hbs')); 
    }
});
app.post('/',(req,res)=>{
    if(data[req.body.username]?.password==req.body.password){
        req.session.username=req.body.username;
        res.redirect('/');

    }else{
        res.render(path.join(__dirname,'static','hbs','register.hbs'),{wrongpass:true});
    }
});
app.post('/register',(req,res)=>{
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
        fs.writeFileSync(path.join(__dirname,'data','data.json'), JSON.stringify(data));
        req.session.username=req.body.username;
        res.redirect('../');
    }
})

//все функции сайта

//проверка на зареганность
app.use((req,res,next)=>{
    if(req.session.username){
        next();
    }else{
        res.redirect('http://localhost:3000/');
    }
})

app.get('/local',(req,res)=>{
    res.render(path.join(__dirname,'static','hbs','localgame.hbs'))
});

app.listen(3000,()=>{console.log("http://localhost:3000")});