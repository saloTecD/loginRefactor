import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"
mongoose.pluralize(null)
const collection="products"

const schema=new mongoose.Schema({
    id:Number,
    title:String,
    description:String,
    price:Number,
    thumbnails:Array,
    code:String,
    stock:Number,
    status:Boolean
})
schema.plugin(mongoosePaginate)
const productModel=mongoose.model(collection,schema)

export default productModel