var path = require('path')
/**Express setup */

const express = require('express');
const app = express ();

app.use(express.static(__dirname, './passportjs'));

const bodyParser = require('body-parser');

const expressSessioin = require('express-session')({
    secret: 'secret',
    resave : false,
    saveUninitialized: false
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded ({extended: true}));
app.use(expressSessioin);

const port = process.env.PORT || 4040;
app.listen(port, ()=> console.log(`App is listening at port ${port}`))

/**Passport setup */
const Passport = require('passport');

app.use(Passport.initialize());
app.use(Passport.session());

/**MONGOOSE SETUP*/

const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const passport = require('passport');

mongoose.connect('mongodb://localhost/MyDatabase', {useNewUrlParser:true, useUnifiedTopology: true});
  
const Schema = mongoose.Schema;
const UserDetail = new Schema({
    username: String,
    password: String,
});

UserDetail.plugin(passportLocalMongoose);

const UserDetail = mongoose.model('userInfo', UserDetails, 'userInfo');

/**PASSPORT LOCAL AUTHENTICATION */

passport.use(UserDetails.createStrategy());
passport.deserializeUser(UserDetails.deserializeUser());

/**ROUTES */

const connectEnsureLongin = require('connect-ensure-login');

app.post('/login', (req, res, next)=>{
    passport.authenticate('local',(err,user, info)=>{
        if(err){
            return next(err);
        }
    if (!user){
        return res.redirect('/login?info=' + info);
    }
    req.logIn(user, function(err){
        if(err){
            return next(err)
        }
        return res.redirect('/');
        });
    })(req, res, next);
});

/**GET LOGIN PAGE */
app.get('/login', (req, res)=> res.sendFile('html/login.html', {root: __dirname})
);
/**GET HOME PAGE */
app.get('/',
  connectEnsureLongin.ensureLoggedIn(),
  (req, res)=> res.sendFile('login/login.html,', {root: __dirname,})
);

app.get('/private', connectEnsureLongin.ensureLoggedIn(),
(req, res)=>
    res.sendFile('/private/private.html')
);

app.get('/user', connectEnsureLongin.ensureLoggedIn(),
(req,res) => res.send('/login/login.html')
);

/**REGISTER SOME USERS */

UserDetails.register({username:'sher', active: false}, 'sher');
UserDetails.register({username:'sarir', active: false}, 'sarir');
UserDetails.register({username:'karim', active: false}, 'karim');





























