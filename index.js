const express = require('express'),cookieSession=require('cookie-session'),
session=require('express-session'),cookieparser=require('cookie-parser'),
    app = express(),
    redis=require('redis'),
    redisStore = require('connect-redis')(session),
    client  = redis.createClient(),
    passport = require('passport');
    const auth = require('./auth.js');
    app.use(cookieparser());
    app.use(session({ secret: "cats" ,resave : false,name:"passport",
    saveUninitialized : true,cookie:{
        secure:false,
        maxAge: 0.125*60*60*1000
    },
        store: new redisStore({host: 'localhost',port: 6379,
            client: client,ttl:450})}));
    auth(passport);
    client.on('connect', function (err) {
  console.log('connected to redis successfully');
});
    app.use(passport.initialize());
    app.use(passport.session());
   app.set('view engine','ejs');
app.get('/', (req, res) => {
    //console.log(req);
    if(req.user){
        res.json({
            status: 'user authenticated',
            token:req.user
});}
        else{
        res.json({
            status: 'anonymous user'
});
        }
    
});
app.get('/auth/google', passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/userinfo.profile'],
    prompt: "select_account"
}));
app.get('/good',isauthenticated,(req,res)=>{
    res.send(req.user);
});
app.get('/profile',isauthenticated,(req,res)=>{
    //console.log(req);
    req.session.key = req.user.id;
    res.render('nextpage',{img:req.user.photos[0].value});
});
app.get('/logout',(req,res)=>{
    if(req.session.key){
        req.session.destroy();
        req.logout();res.clearCookie("passport");res.clearCookie("User");
        req.session=null;req.user=null;
        return res.redirect('/');
    }
});
app.get('/api/auth/google/callback',
    passport.authenticate('google',{failureRedirect:'/ghj'}),(req,res)=>{
      //console.log(req.user);
      req.session.key = req.user.id;
      res.cookie("User",req.user,{ maxAge: 2 * 60 * 60 * 1000, httpOnly: true ,secure: false});
      return res.redirect('/profile');
    }
);
function isauthenticated(req, res, next) {
  if (req.user) { return next(); }
  //console.log(req);
  res.redirect('/');
}
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
