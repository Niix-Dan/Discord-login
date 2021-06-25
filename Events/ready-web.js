const express  = require('express');
const session  = require('express-session');
const app = express();
const passport = require('passport');
const Strategy = require('./lib/strategy.js').Strategy;
const { checkAuth } = require('./utils/checkAuth.js');

module.exports = async client => {

app.use(session({
    secret: 'youshallnotpass',
    resave: false,
    saveUninitialized: false
}));

passport.serializeUser(function(user, done) { done(null, user); });
passport.deserializeUser(function(obj, done) { done(null, obj); });

const scopes = ['identify', 'email', 'guilds'];

passport.use(new Strategy({
    clientID: '816072360628715530', // Id do bot
    clientSecret: 'urRgpyKUlb6nBn9PAMKGnZD-h_VaaXgo', // ClientSecret, pode ser pegado na pagina do bot no discord applications
    callbackURL: 'https://LoginComDiscord.srnox.repl.co/callback', // Callback url, exemplo: mydomain.com/callback
    scope: scopes
}, function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
        return done(null, profile);
    });
}));

app.use(passport.initialize());
app.use(passport.session())

app.get('/', function (req, res) {
    res.render(__dirname + "/views/index.ejs", {
      logged: req.isAuthenticated(),
      username: req.user ? req.user.username : ""
   });
});

app.get('/login', passport.authenticate('discord', { scope: scopes }), function(req, res) {});
app.get('/callback', passport.authenticate('discord', { failureRedirect: '/' }), function(req, res) { res.redirect('/info') } );
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

app.get('/info', checkAuth, function(req, res) {
    res.json(req.user);
});
let PORT = process.env.PORT || 3000;
app.listen(PORT, function (err) {
   console.log("Listening on: "+PORT);
})

}

