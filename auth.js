
const GoogleStrategy = require('passport-google-oauth20');
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
const detail=mongoose.model('passport',nameSchema);
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