    const express = require("express")
    const app = express();
    const mongoose = require("mongoose")
    const mongoose_url = "mongodb://127.0.0.1:27017/vanderlust";
    const listing = require("./models/listing.js")
    const path = require("path");
    const methodOverride = require("method-override")
    let port = 8080;
    const wrapAsync = require("./utils/wrapAsync.js");
    const ExpressError = require("./utils/ExpressError.js");
    //Require ejs mate
    const ejsmate = require("ejs-mate");


    app.set("view engine","ejs");
    app.set("views",path.join(__dirname,"views"));
    app.use(express.urlencoded({extended:true}));
    app.use(methodOverride("_method"));
    app.use(express.static(path.join(__dirname,"public")))
    //set ejs mate
    app.engine("ejs",ejsmate);



    async function main() {
        mongoose.connect(mongoose_url);
    }

    main()
    .then(
        (res)=>{
            console.log("Connected succesfully")
        }
    )
    .catch(
        (err)=>{
            console.log(err)
        }
    )

    app.get("/",(req,res)=>{
        res.send("Root")
    })

    app.delete("/listings/:id",
        wrapAsync(async (req,res)=>{
        let {id : id} = req.params;
        let deleted_listing = await listing.findByIdAndDelete(id);
        console.log("deleted")
        res.redirect("/listings")
        }));

    app.put("/listings/:id",
        wrapAsync(async (req,res)=>{
        let {id : id} = req.params;
        if(!req.body.listing){
            throw new ExpressError(400,"send a valid data for listing")
        }
        await listing.findByIdAndUpdate(id,{...req.body.listing});
        res.redirect(`/listings/${id}`);
    }));

    app.get("/listings/:id/edit",
        wrapAsync(async (req,res)=>{
        let {id : id} = req.params;
        let data = await listing.findById(id);
        res.render("listings/edit.ejs",{data});
    }))

    app.post("/listings",
        wrapAsync(async (req,res)=>{
            //We are doing this to give proper message to the user what is happened
            //If user dont send the listing object
            if(!req.body.listing){
                throw new ExpressError(400,"send a valid data for listing");
            }
        let newlisting = new listing(
            req.body.listing
        );
        await newlisting.save();
        res.redirect("/listings")
    }));

    app.get("/listings/new",
        wrapAsync((req,res)=>{
        res.render("listings/newlisting.ejs");
    }));

    app.get("/listings",
        wrapAsync(async (req,res)=>{
        const allListings = await listing.find({});
        res.render("listings/index.ejs",{allListings})
    }));

    app.get("/listings/:id",
        wrapAsync(async (req,res)=>{
        let {id : id} = req.params;
        let data = await listing.findById(id);
        res.render("listings/show.ejs",{data})
    }));

    //This is for a if the req come and do not match any of the above routes then it will come here 
    //and it islike logic like if it not matches at all then we will send a a error page not found
    app.use((req,res,next)=>{
        next(new ExpressError(404,"Page Not Found"));
    })
    //We can also use app.use above but to use app.all is better practice and is stritly recommended

    //why this is not working
    // app.all("*",(req,res,next)=>{
    //     next(new ExpressError(404,"Page Not Found"));
    // })


    app.use((err,req,res,next)=>{
        let {statusCode = 500, message = "Something went wrong"} = err;
        //for displaying the error we cana make a different file named error.ejs
        res.status(statusCode).render("errors/error.ejs",{message});
    })


    app.listen(port, () => {
        console.log("You are listening to port " + port);
    });