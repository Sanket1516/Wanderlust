const express = require("express")
const app = express();
const mongoose = require("mongoose")
const mongoose_url = "mongodb://127.0.0.1:27017/vanderlust";
const listing = require("./models/listing.js")
const path = require("path");
const methodOverride = require("method-override")
let port = 8080;
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

app.delete("/listings/:id",async (req,res)=>{
    let {id : id} = req.params;
    let deleted_listing = await listing.findByIdAndDelete(id);
    console.log("deleted")
    res.redirect("/listings")
})

app.put("/listings/:id",async (req,res)=>{
    let {id : id} = req.params;
    await listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
})

app.get("/listings/:id/edit",async (req,res)=>{
    let {id : id} = req.params;
    let data = await listing.findById(id);
    res.render("listings/edit.ejs",{data});
})

app.post("/listings",async (req,res)=>{
    let newlisting = new listing(
        req.body.listing
    );
    await newlisting.save();
    res.redirect("/listings")
})

app.get("/listings/new",(req,res)=>{
    res.render("listings/newlisting.ejs");
})

app.get("/listings", async (req,res)=>{
    const allListings = await listing.find({});
    res.render("listings/index.ejs",{allListings})
})

app.get("/listings/:id",async (req,res)=>{
    let {id : id} = req.params;
    let data = await listing.findById(id);
    res.render("listings/show.ejs",{data})
});


app.listen(port,()=>{
    console.log("You are listning to port "+ port);
})

