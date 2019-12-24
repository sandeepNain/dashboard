const express = require('express');
const app = express();
var mongoose = require('mongoose');
var cors = require('cors')
var  path = require('path');
app.use(cors());

var passport = require('passport');
var util = require('util');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

app.use(express.static(path.join(__dirname, 'build')));

let constant = require('./constant');

// var session = require('express-session');
// var GoogleStrategy = require('../').Strategy;
// var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;


const sql = require('mssql');
var CronJob = require('cron').CronJob;

const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT;

var GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
var GOOGLE_CLIENT_SECRET  = process.env.GOOGLE_CLIENT_SECRET;

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

// passport.use(
// 	new GoogleStrategy(
// 		{
// 			clientID: GOOGLE_CLIENT_ID,
// 			clientSecret: GOOGLE_CLIENT_SECRET,
// 			callbackURL: "http://localhost:4000/auth/google/callback"
// 		},
// 		function(accessToken, refreshToken, profile, done) {
// 			var userData = {
// 				email: profile.emails[0].value,
// 				name: profile.displayName,
// 				token: accessToken
//             };
//             console.log("User data is ", userData);
// 			done(null, userData);
// 		}
// 	)
// );

app.use( express.static(__dirname + '/public'));
app.use( cookieParser()); 
app.use( bodyParser.json());
app.use( bodyParser.urlencoded({
	extended: true
}));

app.use( passport.initialize());

// app.get(
// 	"/auth/google",
// 	passport.authenticate("google", { scope: ["profile", "email"] })
// );
// app.get(
// 	"/auth/google/callback",
// 	passport.authenticate("google", { failureRedirect: "/", session: false }),
// 	function(req, res) {
// 		var token = req.user.token;
// 		console.log("token is ", token);
//         res.redirect("http://localhost:3000?token=" + token);
// 	}
// );

// database config
var config = {
    server: '10.160.12.47',
    user: 'ssisUser',
    password: 'EHP@naLytic$!',
    database: 'msdb',
}

sql.connect(config, err => {
    if(err){
        console.log('error while connect.');
        // throw err;
    } else {
        console.log("connected");
    }
});

sql.on('error', err => {
    // ... error handler
    console.log("Error occure while connecting to the database.");
    throw err;
});

var options = { useNewUrlParser: true }

mongoose.connect(constant.dbURL, options, function(error) {
    if(error){
        console.log("Error in connecting with mongoose", error);
    } else {
        console.log("Connected with database mongoose.");
    }
});

var routers = require('./router');

app.use('/', routers);

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });

app.listen(port, ()=>{
    console.log("Server started at the port ", port);
});