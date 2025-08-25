//we have installed it first
//required joi package 
const joi = require("joi");

//write any name of the validate schema
//joi.object tells it will  take one object as a argument
const listingSchema = joi.object({
    //if we have request to this object we should always have the object named listing and it is required
    listing:joi.object({
        //it tells what we should have in our object/listing what to check
        //title should be string and is required
        title : joi.string().required(),
        description : joi.string().required(),
        location : joi.string().required(),
        country : joi.string().required(),
        //we wil also accept the image url with space or a not at all
        image : joi.string().allow("",null),
        //Our price minimum value must be 0 not be negative
        price : joi.number().required().min(0)



    }).required()
})


//Schema for review
const reviewSchema = joi.object({
    review : joi.object({
        comment : joi.string().required(),
        rating : joi.number().required().min(1).max(5),
    }).required()
});


// Make a single export statement at the end of the file
module.exports = {
  listingSchema,
  reviewSchema,
};
