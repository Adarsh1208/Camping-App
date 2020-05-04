//all the middleware
var Campground = require("../models/campgrounds")
var Comment = require("../models/comment")

var middlewareObj = {
    checkOwnership : function(req,res, next){
        if(req.isAuthenticated()){
            //does user own the campground
            Campground.findById(req.params.id , function(err, foundCampground){
                if(err){
                    req.flash("error", "Campground not found")
                    res.redirect("back")
                }else{
                    if(foundCampground.author.id.equals(req.user._id)){
                        next()
                    }else{
                        req.flash("error", "You don't have permission to do that")
                        res.redirect("back")
                    }
                }
            }) 
    
        }else{
            req.flash("error", "You need to be logged in to do that")
            res.redirect("back")
        }
    },

    checkCommentOwnership : function(req, res, next){
    if(req.isAuthenticated()){
        //does user own the campground
        Comment.findById(req.params.comment_id , function(err, foundComment){
            if(err){
                req.flash("Comment not found")
                res.redirect("back")
            }else{
                if(foundComment.author.id.equals(req.user._id)){
                    next()
                }else{
                    req.flash("You don't have permission to do that")
                    res.redirect("back")
                }
            }
        }) 

    }else{
        req.flash("error", "You need to be logged in to do that")
        res.redirect("back")
        }
    },

    isLoggedIn : function (req, res , next){
        if(req.isAuthenticated()){
            return next()
        }else{
            req.flash("error", "You need to be logged in to do that")
            res.redirect("/login")
        }
    }
}



module.exports = middlewareObj