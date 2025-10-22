import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    name : {type : String , required : true},
    description : {type : Array , required : true},
    price : {type : Number , required : true},
    offerPrice :{type : Number , required : true},
    image : {type : Array , required : true},
    category : {type : String , required : true},
    inStock :{type : Boolean , required : true},
} , {timestamps : true})

const Product = mongoose.models.Product || mongoose.model("Product" , productSchema)

// mongoose.models → contains all already compiled models.
// mongoose.model("Product", schema) → creates a new model if one doesn’t exist.
// If you call mongoose.model("Product", schema) more than once with the same name, Mongoose will throw an OverwriteModelError.

// So the correct pattern is:

// First, check if the model already exists in mongoose.models.
// If yes → reuse it.
// If no → create it.

export default Product;