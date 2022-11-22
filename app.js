const express=require('express');
const path=require('path');
const session = require('express-session');
const{getMainPage,login,register,startLocalGame}=require('./controllers/appcontroller');
const{checkLogin}=require('./middleware/app_middleware');




const app=express();
app.set('view engine','hbs');
const online=require('./routes/onlinerouter.js');






//middleware
app.use(session({
    secret: 'vatahell1313',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        httpOnly:false,
        secure: false 
    }
}));
app.use('',express.static(path.join(__dirname,'static')));
app.use(express.json());
app.use(express.urlencoded())


//регистрация и логин
app.get('/',getMainPage);
app.post('/',login);
app.post('/register',register);
//все функции сайта

//проверка на зареганность
app.use(checkLogin);

app.get('/local',startLocalGame);

app.use('/online',online);

app.listen(3000,()=>{console.log("http://localhost:3000")});
