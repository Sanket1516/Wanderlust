const express = require('express');
//express.router is a class provided by express helps you break your Express router into smaller, manageable pieces by grouping related routes together.
const router = express.Router({ mergeParams: true });
//also require all the dependencies required in this file just copy paste from the app.js let them there also
 const wrapAsync = require("../utils/wrapAsync.js");
 const ExpressError = require("../utils/ExpressError.js");
 const listingSchema = require("../schema.js");
 const reviewSchema = require("../schema.js");
 const Listing = require("../models/listing.js"); // Mongoose model for your listings
 const Review = require("../models/review.js");
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
    router.get("/new", wrapAsync((req, res) => {
        res.render("listings/newlisting.ejs");
        return;
    }));

    // GET Route: Display all listings
    router.get("/", wrapAsync(async (req, res) => {
        const allListings = await Listing.find({}); // Fetch all listings from the database
        res.render("listings/index.ejs", { allListings }); // Render the index page with all listings
        return;
    }));

    // POST Route: Save a new listing
    router.post("/",validateListing,wrapAsync(async (req, res) => {
        //if we validate like this every time it it repetative task so we will make an middelware for it forst it will called then async function will be called
        // let result = listingSchema.validate(req.body);
        // if (result.error) {
        //     throw new ExpressError(400, result.error.message);
        // }
        let newlisting = new Listing( // Create a new listing instance
            req.body.listing
        );
        await newlisting.save(); // Save the new listing to the database
        res.redirect("/listings"); // Redirect to the listings index page after saving
        return;
    }));

    // GET Route: Display details of a specific listing
    // This route is more general and should come after specific static routes (like /listings/new).
    router.get("/:id", wrapAsync(async (req, res) => {
        let { id } = req.params; // Destructure ID from URL parameters
        let data = await Listing.findById(id).populate("reviews"); // Find listing by ID

        // Important: Handle case where a listing with the given ID is not found
        if (!data) {
            throw new ExpressError(404, "Listing Not Found!");
        }
        res.render("listings/show.ejs", { data }); // Render the show page with listing data
        return;
    }));

    // GET Route: Display form to edit a specific listing
    router.get("/:id/edit", wrapAsync(async (req, res) => {
        let { id } = req.params; // Destructure ID from URL parameters
        let data = await Listing.findById(id); // Find listing by ID

        // Important: Handle case where a listing with the given ID is not found
        if (!data) {
            throw new ExpressError(404, "Listing Not Found!");
        }
        res.render("listings/edit.ejs", { data }); // Render the edit page with listing data
        return;
    }));

    // PUT Route: Update a specific listing
    router.put("/:id",validateListing, wrapAsync(async (req, res) => {
        let { id } = req.params; // Destructure ID from URL parameters
        // Find and update the listing with data from the request body
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        res.redirect(`/listings/${id}`); // Redirect to the updated listing's show page
        return;
    }));

    // DELETE Route: Delete a specific listing
    router.delete("/:id", wrapAsync(async (req, res) => {
        let { id } = req.params; // Destructure ID from URL parameters
        let deleted_listing = await Listing.findByIdAndDelete(id); // Find and delete the listing
        res.redirect("/listings"); // Redirect to the listings index page after deletion
        return;
    }));



module.exports = router;