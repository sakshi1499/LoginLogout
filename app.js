var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var passport = require("passport");
var ejs = require("ejs");
var User = require("./models/user");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var app = express();
app.use(require("express-session")({
  secret : "Rosy momma be the best",
  resave : false,
  saveUninitialized : false
}));
mongoose.connect("mongodb://localhost:27017/authenDB", { useNewUrlParser : true});
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded ({extended : true}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.get("/",function(req,res){
  res.render("home");
});
app.get("/secret",isLoggedIn, function(req,res){
  res.render("secret");
});
app.get("/register",function(req,res){
  res.render("register");
});
app.post("/register",function(req,res){

  User.register( new User({username: req.body.username}), req.body.password, function(err,user){
    if(err)
    {
      console.log(err);
      return res.render("register");
    }
        passport.authenticate("local")(req,res, function(){
        res.redirect("/secret");
      });
    });
    });
app.get("/login",function(req,res){
  res.render("login");
});
app.post("/login",passport.authenticate("local",{
successRedirect: "/secret",
failureRedirect: "/login"
}),function(req,res){

});
app.get("/logout",function(req,res){
  req.logout();
  res.redirect("/");
});
function isLoggedIn(req,res,next)
{
  if(req.isAuthenticated())
  {
    return next();
  }
  res.redirect("/login");
}
app.listen(3000,function(){
  console.log("Server is starting");
});
