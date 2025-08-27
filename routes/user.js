const express = require("express");
const router = express.Router();
const User =  require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js")

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
})

router.post("/signup", wrapAsync(async (req, res)=>{
    try{
    let {username, email, password} = req.body;
    const newUser = new User({email, username});
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.flash("success","Welcome to wanderlust");
    res.redirect("/listings");
} catch(error){
    req.flash("error", error.message);
    res.redirect("/signup");
}

//here we used try catch because to impliment the functionality of if name is already exists then dont show only eror and stuck redirect to the teh signup again and fill the info again
})); 

module.exports = router;