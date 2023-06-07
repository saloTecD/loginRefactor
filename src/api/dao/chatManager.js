import mongoose from "mongoose"
import messagesModel from "../dao/models/messages.model.js"

class ChatManager{

    addMessages=async(data)=>{
        try{
            console.log(data)
            const arreglo=await messagesModel.collection.insertOne(data)
            console.log(arreglo)
        }catch(e){
            console.log("Error en el Chat")
        }
    
    }

}

export default ChatManager