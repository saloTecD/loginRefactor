import passport from "passport"
import mongoose from "mongoose"
import local from "passport-local"
import userModel from "../api/dao/models/user.model.js"

const LocalStrategy = local.Strategy

const verifyUserRegistration = async (username, password, done) => {
    try {

        const user = await userModel.findOne({ userEmail: username })
        if (user === null) {
            console.log("entre aqui")
            return done(null, { id:new mongoose.Types.ObjectId(0) })
        } else {
            return done(null, false, { msg: "Email ya se encuentra registrado" })
        }


    } catch (e) {
        return done(e.message)
    }
}

passport.use("register", new LocalStrategy({ usernameField: "userEmail", passwordField: "userPassword" }, verifyUserRegistration))

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await userModel.findById(id);
        done(null, user);
    } catch (err) {
        done(err.message);
    }
});

export default passport