var express = require('express')
var app = express()
var mongoose = require('mongoose')
var User = require('./models/User')

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy

var session = require('express-session')
var bodyParser = require("body-parser")

app.use(express.static("public"));
app.use(session({ 
    secret: "cats",
    resave: false,
    saveUninitialized: false
 }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://localhost/coinwaveuser')

var router = express.Router();


router.get('/register', function(req, res) {
    res.json({ });
});

router.post('/register', function(req, res) {
    console.log(req.body)
    User.create({email: req.body.email, password: req.body.password}, function (err, user) {
        if (err) {
            console.log(err)
            return res.json( { error : err });
        }
        
        console.log('no error');
        console.log(user);
        res.redirect('/');

    });
});

router.get('/login', function(req, res) {
    res.json({ user : req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
})

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function (email, password, done) {
    User.findOne({ email: email }, function (err, user) {
      if (err) { return done(err) }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' })
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' })
      }
      return done(null, user)
    })
  }
));


app.use('/auth/', router);

app.use(express.static(__dirname +'./../dist/')) // serves the index.html
app.listen(3000) // listens on port 3000 -> http://localhost:3000/