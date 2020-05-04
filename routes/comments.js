var express = require("express")
var router = express.Router({mergeParams : true})
var Campground = require("../models/campgrounds")
var Comment = require("../models/comment")
var middleware = require("../middleware")


//comments new

router.get("/new", middleware.isLoggedIn ,function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err)
        }else{
            res.render("comments/new", {newcampground : campground})
        }
    })
})


//comments create

router.post("/", middleware.isLoggedIn ,function(req, res){
    //lookup campground using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err)
            res.redirect("/campgrounds")
        }else {
            //create new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong")
                    console.log(err)
                }else{ 
                    //connect new comment to campground
                    //add username and id to comment
                    comment.author.id = req.user._id
                    comment.author.username = req.user.username
                    comment.save()
                    campground.comments.push(comment)
                    campground.save()
                    //redirect campground show page

                    console.log(comment)
                    req.flash("success", "Successfully added comment")
                    res.redirect("/campgrounds/" + campground._id)
                }
            })
        }
    })
})


//Edit comments
router.get("/:comment_id/edit", middleware.checkCommentOwnership ,function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back")
        }else{
            res.render("comments/edit" , {campground_id : req.params.id, comment: foundComment})
        }
    })
})

//Update comment

router.put("/:comment_id", middleware.checkCommentOwnership ,function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back")
        }else{
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})

//Delete Comment

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back")
        }else{  
            req.flash("success", "Successfully deleted comment")
            res.redirect("/campgrounds/"+ req.params.id)
        }
    })
})



module.exports = router