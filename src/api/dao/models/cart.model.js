import mongoose from "mongoose"
mongoose.pluralize(null)
const collection = "carts"

const subSchema = new mongoose.Schema({
    pid: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"products"
    },
    quantity: Number
}, { _id: false })
const schema = new mongoose.Schema({
    products: [subSchema]
})

const cartModel = mongoose.model(collection, schema)

export default cartModel