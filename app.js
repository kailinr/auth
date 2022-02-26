//jshint esversion:6
require('dotenv').config() 
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require('md5');


const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

//---------------------Mongo Initialization --*
mongoose.connect(process.env.DB, {useNewURLParser: true})

const userSchema = new mongoose.Schema ({
  email: String,
  password: String,
});

const secret = process.env.SECRET;

const User = new mongoose.model("User", userSchema); //User = collection
//----------------------------------End Mongo Initialization --*

app.get("/", function(req, res){
  res.render("home");
});


app.get("/login", function(req, res){
  res.render("login");
});


app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
    const newUser = new User({
      email: req.body.username,
      password: md5(req.body.password),
    });

    newUser.save(function(err){
        if (err){
          console.log(err);
        } else {
          res.render("secrets")
        }
    });

});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = md5(req.body.password);     
              //db email: form input username
  User.findOne({email: username}, function(err, foundUser) {
    if (err) {
        console.log(err);
      } else {
        if(foundUser) {
          if (foundUser.password === password) {
            res.render("secrets")
          }
        }
      }
    });
});

app.get("/logout", function(req, res){
  res.render("home")
});


app.get("/home", function(req,res){
  res.render('home')
});


app.listen(5500, function(){
  console.log("Server started on port 5500");
})