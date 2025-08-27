const express = require("express");
const router = express.Router();
const User =  require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
import * as next from 'next';

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
})

router.post("/signup", wrapAsync(async (req, res)=>{
    try{
    let {username, email, password} = req.body;
    const newUser = new User({email, username});
    const registeredUser = await User.register(newUser, password);
    //added auto login after signup functionality
    req.login(registeredUser, (err)=>{
        if(err){
            next(err);
        }
        req.flash("success", "Welcome to wanderlust");
        res.redirect("/listings");
    });
} catch(error){
    req.flash("error", error.message);
    res.redirect("/signup");
}

//here we used try catch because to impliment the functionality of if name is already exists then dont show only eror and stuck redirect to the teh signup again and fill the info again
})); 

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})

//we use passort authenticate middleware before login to check eeather it exists or not
//It takes two parameters 
//1st strategy
//2nd If the authentication fails then where to redirect on which page
//flash = true if autyh fails then the flash message will be created and displayed
router.post("/login",
    passport.authenticate("local",{
        failureRedirect : "/login" , 
        failureFlash : true
    }),async(req,res)=>{
    req.flash("success","Welcome Back To wanderlust ");
    res.redirect("/listings");
});

//To logout the user
router.get("/logout",(req, res, next)=>{
    //if we are any error while logging out then it will be tackled here if passport middleware gets failed
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "You are logged out");
        res.redirect("/listings");
    });
})

module.exports = router;