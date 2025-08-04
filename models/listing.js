const mongoose = require("mongoose");

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
            type : String,
            //for our testing purpose
            default : "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bmF0dXJlJTIwaG91c2V8ZW58MHx8MHx8fDA%3D",
            //It is ternary operator
            //if user gives the image or not the image on client side
            //set is the one of the constraint of mongo db
            set : (v)=>{
                return v === ""
                ?
                "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bmF0dXJlJTIwaG91c2V8ZW58MHx8MHx8fDA%3D"
                :
                v
            }
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
        ]
    }
)

const listing = mongoose.model("listing",listing_Schema)
module.exports = listing;