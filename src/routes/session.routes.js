import { Router } from "express";
import passport from "../config/passport.config.js"

const sessionRoutes=(store)=>{
    const router=Router()

    router.get("/github",passport.authenticate("github",{scope:["user:email"]}),async(req,res)=>{
        
    })
    router.get("/githubcb",passport.authenticate("github",{failureRedirect:"/login"}),async(req,res)=>{
        req.session.userValidated = req.sessionStore.userValidated = true
       console.log(`-----------${JSON.stringify(req.session)}`)
        req.session.errorMessage = req.sessionStore.errorMessage = ""
        res.redirect("/")
    })
    return router
}

export default sessionRoutes