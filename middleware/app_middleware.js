function checkLogin(req,res,next){
    if(req.session.username){
        next();
    }else{
        res.redirect('http://localhost:3000/');
    }
}
module.exports={checkLogin};