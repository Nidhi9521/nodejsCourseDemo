require('dotenv').config();
const express = require('express')
var https = require('https');
const helmet = require('helmet')
const fs = require('fs')
const path = require('path');
const app = express();
const passport = require('passport')
const { Strategy } = require('passport-google-oauth20')
const cookieSession = require('cookie-session')
const port = process.env.PORT

// app.use(helmet());
console.log(process.env.CLIENT_SECRET);

const config = {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    COOKIE_KEY_1: process.env.COOKIE_KEY_1,
    COOKIE_KEY_2: process.env.COOKIE_KEY_2,

};

function verifyCallback(accessToken, refreshToken, profile, done) {
    console.log('Google profile', profile);
    done(null, profile);
}

passport.use(new Strategy({
    callbackURL: '/auth/google/callback',
    clientID: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET,
}, verifyCallback))



passport.serializeUser((user,done)=>{
    done(null,user.id);
})

passport.deserializeUser((obj,done)=>{
    // USer.findById(id).then(user=>{
    //     done(null,user)
    // })
     done(null,obj);
})


app.use(cookieSession({
    name:'session',
    maxAge: 24 * 60 * 60 * 1000,
    keys: [config.COOKIE_KEY_1,config.COOKIE_KEY_2]
      //,'secret key'
}))

app.use(passport.initialize());
app.use(passport.session())

function checkLoggedIn(req, res, next) { //req.user
    console.log('Current user is:', req.user);
    const isLoggedIn = req.user && req.isAuthenticated();
        if (!isLoggedIn) {
        return res.status(401).json({
            error: 'You must login'
        });
    }
    next();
}

app.get('/auth/google', passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email']
}))

app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/failure',
    successRedirect: '/asd',
    session: true,
}), (req, res) => {
    console.log('google called us back!');
    // res.redirect();
})

app.get('/failure', (req, res) => {
    return res.send('Failed to log in');
})


app.get('/auth/logout', (req, res) => {
    req.logout(); 
    return res.redirect('/');
})

app.get('/secret', checkLoggedIn, (req, res) => res.send('Hello World!'))
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

https.createServer({
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
}, app).listen(port, () => {
    console.log(`Listening on port ${port}`);
});

