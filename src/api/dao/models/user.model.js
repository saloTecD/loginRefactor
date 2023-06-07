import mongoose from "mongoose"
mongoose.pluralize(null)
const collection = "users"

const schema=new mongoose.Schema({
    userName:String,
    userLastName:String,
    userPassword:String,
    userEmail:String,
    userRol:String
})

const userModel=mongoose.model(collection,schema)

export default userModel