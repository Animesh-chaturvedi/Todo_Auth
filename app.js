var express = require("express"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    User = require("./models/user"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    port = 3000;

mongoose.connect("mongodb://localhost/auth_demo_app", {
    useNewUrlParser: true
});
var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(require("express-session")({
    secret: "Rusty is the best and cutest dog in the world",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//============
// ROUTES
//============

app.get("/", function (req, res) {
    res.render("todo");
});

app.get("/tododash", isLoggedIn, function (req, res) {
    res.render("todoDash");
});

// Auth Routes

//show sign up form
app.get("/signup", function (req, res) {
    res.render("signup");
});
//handling user sign up
app.post("/signup", function (req, res) {
    User.register(new User({
        username: req.body.username
    }), req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render('signup');
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect("/todoDash");
        });
    });
});

// LOGIN ROUTES
//render login form
app.get("/login", function (req, res) {
    res.render("login");
});
//login logic
//middleware
app.post("/login", passport.authenticate("local", {
    successRedirect: "/todoDash",
    failureRedirect: "/login"
}), function (req, res) {});

app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}


app.listen(port, process.env.IP, function () {
    console.log("server started.......");
})