//jshint esversion:6
require('dotenv').config() 
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

//Mongo Initialization --*
mongoose.connect(process.env.DB, {useNewURLParser: true})

const userSchema = new mongoose.Schema ({
  email: String,
  password: String,
});


const secret = process.env.SECRET;
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password']}); //add password from userSchema above.

const User = new mongoose.model("User", userSchema); //User is collection
//End Mongo Initialization --*

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
      password: req.body.password,
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
  const password = req.body.password;     
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