const mongoose = require("mongoose");
const Review = require("./review");
const schema = mongoose.Schema;
const listing_Schema = new schema(
    {
        title : {
            type : String,
            required : true
        },
        description : {
            type : String,
            required : true,
        },
        image : {
            url : String,
            filename : String,
            
        },
        price : {
            type : Number
        },
        location : {
            type : String
        },
        country : {
            type : String,
            required : true
        },
        reviews :[
            {
                type : schema.Types.ObjectId,
                ref : "Review"
            }
        ],
        owner :{
            type : schema.Types.ObjectId,
            ref : "User"
        }
    }
)

//we will also add our mongoose middlewares here only like post or pre
//delete listing delete all reviews delete middleware
listing_Schema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}})
    }
});

const listing = mongoose.model("listing",listing_Schema)
module.exports = listing;