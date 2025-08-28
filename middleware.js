let isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //we store the url where the user have clicked and asked for login
        req.session.redirectUrl = req.originalUrl;
        //now we can use this url anywhere as it is stored in session
           req.flash("error", "You must be logged in to do that.");
            res.redirect("/login");
    } else {
        next();
    }
};

module.exports = {isLoggedIn};

module.exports.saveRedirectUrl = (req,res,next)=>{
if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
    //So we store them in the locals and passport dont have authority to access them
}
next();
};