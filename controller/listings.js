const Listing = require("../models/listing");


module.exports.index = async (req, res,next) => {
        const allListings = await Listing.find({}); // Fetch all listings from the database
        res.render("listings/index.ejs", { allListings }); // Render the index page with all listings
        return;
};