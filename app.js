    // ===============================================
    // 1. Module Imports
    // ===============================================
    const express = require("express"); // Express.js framework for building web applications
    const app = express(); // Initialize Express app
    const mongoose = require("mongoose"); // Mongoose for MongoDB object modeling
    const path = require("path"); // Node.js path module for working with file and directory paths
    const methodOverride = require("method-override"); // Middleware to use HTTP verbs like PUT or DELETE in places where the client doesn't support it
    const ejsmate = require("ejs-mate"); // Require ejs mate for layout, partial, and block support in EJS templates

    // Custom utility imports
    const wrapAsync = require("./utils/wrapAsync.js"); // Utility to wrap async route handlers for error handling
    const ExpressError = require("./utils/ExpressError.js"); // Custom error class

    //joi schema validation imports
    const listingSchema = require("./schema.js");
    const reviewSchema = require("./schema.js");

    // Model imports
    const Listing = require("./models/listing.js"); // Mongoose model for your listings
    const Review = require("./models/review.js");

    // ===============================================
    // 2. Configuration Variables
    // ===============================================
    const mongoose_url = "mongodb://127.0.0.1:27017/vanderlust"; // MongoDB connection URL
    let port = 8080; // Port on which the server will listen

    // ===============================================
    // 3. Database Connection
    // ===============================================
    async function main() {
        mongoose.connect(mongoose_url); // Connect to MongoDB
    }

    main()
        .then(
            (res) => {
                console.log("Connected succesfully"); // Log success message
            }
        )
        .catch(
            (err) => {
                console.log(err); // Log any connection errors
            }
        );

    // ===============================================
    // 4. Express Middleware Setup
    // ===============================================
    // Set view engine to EJS and specify views directory
    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, "views"));

    // Parse URL-encoded bodies (for form data submission)
    app.use(express.urlencoded({ extended: true }));

    // Use method-override for PUT and DELETE requests
    app.use(methodOverride("_method"));

    // Serve static files (CSS, JavaScript, etc.) from the "public" directory
    app.use(express.static(path.join(__dirname, "public")));

    // Set ejs-mate as the EJS engine for layout support
    app.engine("ejs", ejsmate);

    //Schema validation middleware
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

    const validateReview = (req, res, next) => {
        let {error} = reviewSchema.validate(req.body);
        if(error){
            let errmsg = error.details.map((el) => el.message).join(", ");
            throw new ExpressError(400, errmsg);
        }else{
            next();
        }
    }

    // ===============================================
    // 5. Routes
    //
    // IMPORTANT: Order of routes matters in Express.
    // Place more specific routes (like /listings/new) before more general ones
    // (like /listings/:id) to ensure they are matched correctly.
    // ===============================================

    // Root Route: Basic confirmation that the server is running
    app.get("/", (req, res) => {
        res.send("Root");
        return; // Added return for consistency, though Express handles it.
    });

    // GET Route: Display form to create a new listing
    // This must come BEFORE '/listings/:id' to ensure '/listings/new' is correctly matched.
    app.get("/listings/new", wrapAsync((req, res) => {
        res.render("listings/newlisting.ejs");
        return;
    }));

    // GET Route: Display all listings
    app.get("/listings", wrapAsync(async (req, res) => {
        const allListings = await Listing.find({}); // Fetch all listings from the database
        res.render("listings/index.ejs", { allListings }); // Render the index page with all listings
        return;
    }));

    // POST Route: Save a new listing
    app.post("/listings",validateListing,wrapAsync(async (req, res) => {
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
    app.get("/listings/:id", wrapAsync(async (req, res) => {
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
    app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
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
    app.put("/listings/:id",validateListing, wrapAsync(async (req, res) => {
        let { id } = req.params; // Destructure ID from URL parameters
        // Find and update the listing with data from the request body
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        res.redirect(`/listings/${id}`); // Redirect to the updated listing's show page
        return;
    }));

    // DELETE Route: Delete a specific listing
    app.delete("/listings/:id", wrapAsync(async (req, res) => {
        let { id } = req.params; // Destructure ID from URL parameters
        let deleted_listing = await Listing.findByIdAndDelete(id); // Find and delete the listing
        res.redirect("/listings"); // Redirect to the listings index page after deletion
        return;
    }));

    //reviews
    app.post("/listings/:id/reviews", validateReview ,wrapAsync(async (req, res) => {
        let listing = await Listing.findById(req.params.id)
        let newreview = new Review(req.body.review);

        listing.reviews.push(newreview);

        await newreview.save();
        await listing.save();

        res.redirect(`/listings/${req.params.id}`);
    }))

    // ===============================================
    // 6. Error Handling Middleware
    //    (These MUST be placed at the very end of your routes and other middleware)
    // ===============================================

    // This is for if the request comes and does not match any of the above routes,
    // then it will come here. It's like logic: if it doesn't match at all,
    // then we will send a "Page Not Found" error.
    // app.use((req, res, next) => {
    //     next(new ExpressError(404, "Page Not Found"));
    // });
    // We can also use app.use above, but to use app.all is better practice and is strictly recommended
    // (Note: `app.use` works here as a catch-all when placed last,
    // `app.all('*', ...)` is also a common and explicit way for a catch-all for all HTTP methods)

    // why this is not working
    // app.all("*",(req,res,next)=>{
    //     next(new ExpressError(404,"Page Not Found"));
    // })


    // General Error Handler: Catches all errors passed via `next(err) or throw new error()`.
    app.use((err, req, res, next) => {
        console.log(err); // Log the full error to the console for debugging

        // Destructure error properties with default values
        let { statusCode = 500, message = "Something went wrong" } = err;

        // working: Set the response status code and render the custom error page
        res.status(statusCode).render("errors/error.ejs", { message });
        return;
    });

    // ===============================================
    // 7. Start Server
    // ===============================================
    app.listen(port, () => {
        console.log("You are listening to port " + port); // Log server start message
    });