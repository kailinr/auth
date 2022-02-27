//jshint esversion:6
const dotenv = require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session')
const passport = require("passport");
const passportLocalMongoose = require("passport-local-Mongoose");


const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

const secret = process.env.PASSPORT;


//--------------------- Passport Session INIT -----------*
app.use(session({
  secret: process.env.PASSPORT,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
//----------------- END Passport Session INIT -----------*


//---------------------Mongoose Schema INIT --*
mongoose.connect(process.env.DB, {useNewURLParser: true})

const userSchema = new mongoose.Schema ({
  email: String,
  password: String,
});

userSchema.plugin(passportLocalMongoose); //init passport mongoose, salt & hash passpwrds

const User = new mongoose.model("User", userSchema); //User = collection

//from local-mongoose
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//----------------------- END Mongo INIT ------------*

app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/logout", function(req, res){
  res.render("home")
});

app.get("/register", function(req, res){
  res.render("register");
});

app.get("/home", function(req,res){
  res.render('home')
});

app.post("/register", function(req, res){

});


app.post("/login", function(req, res){

});



app.listen(5500, function(){
  console.log("Server started on port 5500");
});