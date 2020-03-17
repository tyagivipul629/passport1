
const GoogleStrategy = require('passport-google-oauth20');
var LocalStrategy    = require('passport-local').Strategy;
const mongoose = require('mongoose');
var options=require('./options.js');
mongoose.connect("mongodb://localhost:27017/vipul?authSource=admin",options)
.then(()=>console.log("connected"))
.catch((err)=>console.log("could not connect:",err));
const schema=mongoose.Schema;
const nameSchema=new schema({
    username: String,
    googleid: String
},{collection:"passport"});
const nameSchema1=new schema({
    email: String,
    password: String
},{collection:"Local"});
nameSchema1.methods.validPassword=function(password){
    if(this.password==password)
        return true;
    return false;
}
const detail=mongoose.model('passport',nameSchema);
const User=mongoose.model('Local',nameSchema1);
module.exports = (passport) => {
 passport.serializeUser((user, done) => {
        //console.log(user)
        done(null, user);
    });   
     passport.deserializeUser((user, done) => {
        /*console.log(user);
        detail.findOne({_id: user.id}).then((user)=>{done(null, user);});*/
        //console.log(user);
        done(null,user);
    });   
     passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true// allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {
            User.findOne({ 'email' :  email }, function(err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user)
                    return done(null, false);

                if (!user.validPassword(password))
                    return done(null, false);

                // all is well, return user
                else
                    return done(null, user);
            });

    }));
     passport.use(new GoogleStrategy({
            clientID: '584896804719-an40o5uvmp3paijm20f7vadu7co61a21.apps.googleusercontent.com',
            clientSecret: 'NU9zdYQ9RYpSio8ltXVt2uzv',
            callbackURL: 'http://127.0.0.1:3000/api/auth/google/callback'
        },
        (accessToken, refreshToken, profile,done) => {
            //console.log(profile);
            detail.findOne({googleid: profile.id}).then((currentuser)=>{
                if(currentuser){
                    //already have the user
                    done(null,profile);
                }
                else{
                    new detail({username: profile.displayName,googleid: profile.id}).save().then((newuser)=>{console.log(newuser);done(null,profile)});
                }
            });
            /*return done(null, {
                profile: profile,
                token: accessToken
            });*/
            //done(null,profile);
            
        }));
};
