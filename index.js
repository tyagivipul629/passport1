const express = require('express'),cookieSession=require('cookie-session'),session=require('express-session'),cookieparser=require('cookie-parser'),
    app = express(),
    redis=require('redis'),
    redisStore = require('connect-redis')(session),
    client  = redis.createClient(),
    passport = require('passport');
    /*app.use(cookieSession({
        name:'session',
        maxAge: 24*60*60,
        keys:['mynameisvipul']
    }));*Hello/
    const auth = require('./auth.js');
    app.use(session({ secret: "cats" ,resave : false,
    saveUninitialized : false,cookie:{
        maxAge:24*60*60
    },
        store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl :  300})}));
    auth(passport);
    //app.use(session({secret: 'some secret value, changeme'}));
    app.use(passport.initialize());
    app.use(passport.session());
   // app.use(cookieparser());
   app.set('view engine','ejs');
app.get('/', (req, res) => {
    if(req.session){res.cookie('key', req.session.key);
        res.json({
            status: 'session cookie set',
            token:req.session.key
});}
        else{
            res.cookie('key', '')
        res.json({
            status: 'session cookie not set'
});
        }
    
});
app.get('/auth/google', passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/userinfo.profile']
}));
app.get('/good',isauthenticated,(req,res)=>{
    res.send(req.user);
});
app.get('/profile',isauthenticated,(req,res)=>{
    console.log(req.user.photos[0].value);
    res.render('nextpage',{img:req.user.photos[0].value});
});
app.get('/logout',(req,res)=>{
    if(req.session.key){
        req.session.destroy();
        res.redirect('/');
    }
});
app.get('/api/auth/google/callback',
    passport.authenticate('google',{failureRedirect:'/ghj'}),(req,res)=>{
      console.log(req.user);
      req.session.key = req.user.id;
      res.redirect('/profile');
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
