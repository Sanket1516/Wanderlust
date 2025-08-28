const express = require('express');
//express.router is a class provided by express helps you break your Express router into smaller, manageable pieces by grouping related routes together.
const router = express.Router({ mergeParams: true });
//also require all the dependencies required in this file just copy paste from the app.js let them there also
 const wrapAsync = require("../utils/wrapAsync.js");
 const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
 const Listing = require("../models/listing.js"); // Mongoose model for your listings
 const Review = require("../models/review.js");
const {isLoggedIn,isOwner} = require("../middleware.js");
const listing = require('../models/listing.js');

 const validateListing = (req, res, next) => {
        //we have directly extracted error object from result
        let {error} = listingSchema.validate(req.body);
        if(error){
            //The details object is carraying the list of additional details about the error
            //the below fuction means every element from the details object remove it message and join them with comma
            let errmsg = error.details.map((el) => el.message).join(",");
            throw new ExpressError(400, errmsg);
        }else{
            next();
        }
    }


 //Replaced all the app with the router
 //also replaced if only /listings as a / and removed the /listngs from all the routes only in the http request not in callbacks

 // GET Route: Display form to create a new listing
    // This must come BEFORE '/listings/:id' to ensure '/listings/new' is correctly matched.
    router.get("/new", isLoggedIn, wrapAsync((req, res) => {
        // //To check if the user which is trying to create the new listing must be authenticated or login to create a new listing
        // //We have the passport method is authenticated to check whether the user is logged in or not in current session
        // if(!req.isAuthenticated()){
        //     req.flash("error", "You must be logged in to create a listing.");
        //     return res.redirect("/login");
        // }
        //Transferred this logic to middleware
        res.render("listings/newlisting.ejs");
        return;
    }));

    // GET Route: Display all listings
    router.get("/", wrapAsync(async (req, res,next) => {
        const allListings = await Listing.find({}); // Fetch all listings from the database
        res.render("listings/index.ejs", { allListings }); // Render the index page with all listings
        return;
    }));

    // POST Route: Save a new listing
    router.post("/",isLoggedIn,validateListing,wrapAsync(async (req, res) => {
        //if we validate like this every time it it repetative task so we will make an middelware for it forst it will called then async function will be called
        // let result = listingSchema.validate(req.body);
        // if (result.error) {
        //     throw new ExpressError(400, result.error.message);
        // }
        let newlisting = new Listing( // Create a new listing instance
            req.body.listing
        );
        newlisting.owner = req.user._id; // Set the owner of the listing to the authenticated user
        await newlisting.save(); // Save the new listing to the database
        req.flash("success", "New Listing Created!");
        res.redirect("/listings"); // Redirect to the listings index page after saving
        return;
    }));

    // GET Route: Display details of a specific listing
    // This route is more general and should come after specific static routes (like /listings/new).
    router.get("/:id", wrapAsync(async (req, res) => {
        let { id } = req.params; // Destructure ID from URL parameters
        let data = await Listing.findById(id).populate("reviews").populate("owner"); // Find listing by ID

        // Important: Handle case where a listing with the given ID is not found
        if (!data) {
            req.flash("error", "Listing Not Found!");
            res.redirect("/listings");
        }
        res.render("listings/show.ejs", { data }); // Render the show page with listing data
        return;
    }));

    // GET Route: Display form to edit a specific listing
    router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(async (req, res) => {
        let { id } = req.params; // Destructure ID from URL parameters
        let data = await Listing.findById(id); // Find listing by ID

        // Important: Handle case where a listing with the given ID is not found
        if (!data) {
            req.flash("error", "Listing Not Found!");
            res.redirect("/listings");
        }
        res.render("listings/edit.ejs", { data }); // Render the edit page with listing data
        return;
    }));

    // PUT Route: Update a specific listing
    router.put("/:id", isLoggedIn,isOwner, validateListing, wrapAsync(async (req, res) => {
        let { id } = req.params; // Destructure ID from URL parameters
        // Find and update the listing with data from the request body

        //this is logic for the server side validation
        // let listing = await Listing.findById(id);
        // if(!listing.owner.equals(res.locals.currUser._id)){
        //     req.flash("error", "You do not have permission to edit this listing!");
        //     return res.redirect(`/listings/${id}`);
        // }
        
       await Listing.findByIdAndUpdate(id, {
           ...req.body.listing
       });
       req.flash("success", "Successfully updated listing!");
       res.redirect(`/listings/${id}`); // Redirect to the updated listing's show page
       return;
    }));

    // DELETE Route: Delete a specific listing
    router.delete("/:id",isLoggedIn,isOwner, wrapAsync(async (req, res) => {
        let { id } = req.params; // Destructure ID from URL parameters
        let deleted_listing = await Listing.findByIdAndDelete(id); // Find and delete the listing
        req.flash("success", `Successfully deleted ${deleted_listing.title}`);
        res.redirect("/listings"); // Redirect to the listings index page after deletion

        return;
    }));



module.exports = router;