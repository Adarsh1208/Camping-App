 var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require("mongoose"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    flash = require("connect-flash"),
    Campground = require("./models/campgrounds"),
    seedDb = require("./seeds"),
    User = require("./models/user"),
    Comment = require("./models/comment")


//requiring routes

var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds")
    authRoutes          = require("./routes/authentication")


var ServerPort = process.env.PORT || 7050

// seedDb();  //seed the database
    
mongoose.connect("mongodb+srv://addy:Adarsh123@#@yelpcamp-q4wsy.mongodb.net/test?retryWrites=true&w=majority"
,{
    useNewUrlParser :true,
    useUnifiedTopology :true
})

// mongoose.connect("mongodb://localhost/yelp_camp_v10", {
//     useNewUrlParser : true,
//     useUnifiedTopology : true 
// })

//mongodb+srv://addy:Adarsh123@#@yelpcamp-q4wsy.mongodb.net/test?retryWrites=true&w=majority


app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")
app.use('/public',express.static(__dirname + "/public"))
app.use(methodOverride("_method"))
app.use(flash())

//Passport Configuration
app.use(require("express-session")({
    secret : "This is a very long string",
    resave : false,
    saveUninitialized : false
})) 

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use(function(req, res, next){
    res.locals.currentUser = req.user
    res.locals.error = req.flash("error")
    res.locals.success = req.flash("success")
    next()
})



app.use("/campgrounds",campgroundRoutes)
app.use("/campgrounds/:id/comments" ,commentRoutes)
app.use(authRoutes)


app.listen(ServerPort, function(){
    console.log("Server started")
})