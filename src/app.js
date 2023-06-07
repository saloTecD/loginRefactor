import {} from "dotenv/config"
import express from "express";
import {__dirname} from "../src/utils.js"
import { engine } from "express-handlebars"
import session from "express-session"
import  mongoose from "mongoose"
import MongoStore from "connect-mongo"
import {Server} from "socket.io"
import chatManager from "./api/dao/chatManager.js"
import router from "../src/routes/products.routes.js"
import routerCart from "../src/routes/carts.routes.js"
import viewRoutes from "./routes/views.routes.js"

const cManager=new chatManager()
const PORT=parseInt(process.env.PORT)
const server = express()
const MONGOOSEURL=process.env.MONGOOSEURL
const SESSION_SECRET=process.env.SESSION_SECRET

try{
    await mongoose.connect(MONGOOSEURL)
    const httpServer=server.listen(PORT,()=>console.log("Listening on PORT 8080"))
    const io=new Server(httpServer)


// Integracion Chat----------------------------------------------------------------------------------
let messages=[]
io.on('connection',socket=>{
    console.log("Nuevo Cliente Conectado")
    socket.on('message',data=>{
        messages.push(data)
        cManager.addMessages(data)

        io.emit('messageLogs',messages)
    })
})
}catch(e){
    console.log("No se ha podido establecer la conexion con el puerto")
}

// Fin integracion Chat------------------------------------------------------------------------------

server.use(express.json())
server.use(express.urlencoded({ extended: true }))
const store=MongoStore.create({mongoUrl:MONGOOSEURL,mongoOptions:{useNewUrlParser:true,useUnifiedTopology:true},ttl:60})
server.use(session({
    store:store,
    secret:SESSION_SECRET,
    resave:false,
    saveUninitialized:false
}))
server.use("/api", router)
server.use("/api", routerCart)
server.use("/", viewRoutes(store))

server.use("/public",express.static(`${__dirname}/public`))


server.engine("handlebars", engine())
server.set("view engine", "handlebars")
server.set("views", `${__dirname}/views`)

