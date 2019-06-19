var passportLocalMongoose = require('passport-local-mongoose'),
    LocalStrategy = require('passport-local'),
    expressSession = require('express-session'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    express = require('express'),
    User = require('./models/user'),
    app = express(),
    PORT = 3000;


//mongoose setup
mongoose.connect("mongodb://localhost/todo_app", {
    useNewUrlParser: true
});


app.use(bodyParser.urlencoded({
    extended: true
}));
app.set("view engine", "ejs");
app.use(passport.initialize());
app.use(passport.session());
app.use(expressSession({
    secret: "kese ho",
    resave: false,
    saveUninitialized: false
}));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.serializeUser());

//landing route
app.get("/", function (req, res) {
    res.render("todo");
});

app.get("/todoDash", isLoggedIn, function (req, res) {
    res.render("todoDash");
});

///////////////////////////////
//signup get routes 
app.get("/signup", function (req, res) {
    res.render("register");
});

//Route to get user info and setting up credentials
app.post("/signup", function (req, res) {
    User.register(new User({
        username: req.body.username,
    }), req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render("register");
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/todoDash");
                console.log("signed in")
            })
        }
    })
});

////////////////////////////////
//login routes
///////////////////////////////
app.get("/login", function (req, res) {
    res.render("login");
});

//checking user credentials
app.post("/login", passport.authenticate("local", {
    successRedirect: "/todoDash",
    failureRedirect: "/login",
    failureFlash: true
}), function (req, res) {});
//////logout route
app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});


///////////////////  functions    ///////////
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
}


app.listen(PORT, process.env.IP, function () {
    console.log("TodoAuth has started");
});