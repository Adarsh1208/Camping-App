var express = require("express")
var router = express.Router()
var Campground = require("../models/campgrounds")
var middleware = require("../middleware")


//INDEX Route to show all campgrounds
router.get("/", function(req, res){
      //get all campgrounds from db
      Campground.find({} , function(err, allcampgrounds){
        if(err){
            console.log(err)
        }else{
            res.render("campgrounds/index", {campgrounds : allcampgrounds})
        }
    })
})

// CREATE Route to create the new campground
router.post("/", middleware.isLoggedIn, function(req, res){
    //get data from form add to campground array
   var name =  req.body.name
   var price = req.body.price
   var image = req.body.image
   var desc = req.body.description
   var author = {
       id : req.user._id,
       username : req.user.username 
   }
   
   var newCampground = {name: name, price : price , image: image, description : desc, author : author} 

   Campground.create(newCampground, function(err, newlyCreated){
       if(err){
        console.log(err)
       }else {
        res.redirect("/campgrounds")
       }
   })
})


//NEW - shows the form for creating the new campground
router.get("/new",middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new")
})


router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err)
        }else {
            console.log(foundCampground)
            res.render("campgrounds/Show", {campground : foundCampground})
        }
    })
})


//Edit Campground Route

router.get("/:id/edit", middleware.checkOwnership,function(req, res){
    Campground.findById(req.params.id , function(err, foundCampground){
        res.render("campgrounds/edit", {campground : foundCampground})
    })
})


//Update Route

router.put("/:id", middleware.checkOwnership , function(req, res){
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds")
        }else{
            res.redirect("/campgrounds/"+ req.params.id)
        }
    })
})

//Destroy Campground Route

router.delete("/:id", middleware.checkOwnership ,function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds")
        }else{
            res.redirect("/campgrounds")
        }
    })
})

module.exports = router