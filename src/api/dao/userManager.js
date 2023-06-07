import mongoose from "mongoose";
import crypto from 'crypto';
import userModel from "./models/user.model.js"
import bcrypt from "bcrypt"

class UserManager {
    constructor() {
        this.uStatus = 1
    }

    static #encryptPassword = (pass) => {
        return bcrypt.hashSync(pass, bcrypt.genSaltSync(10))
    }
    static #comparePassword=(userInDb,pass)=>{
        return bcrypt.compareSync(pass,userInDb.userPassword)
    }
    static #findUser = async (email) => {
        const existUser = await userModel.find({ "userEmail": email }).lean()
        return existUser
    }
    createUser = async (nuevoUser) => {
        try {

            let userExist = await UserManager.#findUser(nuevoUser.userEmail)
            if (userExist == "") {
                nuevoUser.userPassword = UserManager.#encryptPassword(nuevoUser.userPassword)
                nuevoUser.userRol = "user"
                const nUser = await userModel.create(nuevoUser)
                return nUser
            }
            else {
                return false
            }
        } catch (e) {
            console.log(e.message)
        }
    }
    validateUser = async (userEmail, userPassword) => {
        try {
            let validated = await userModel.findOne({ userEmail: userEmail})
            if(validated===null){
            return "Usuario no existe"
            }else if(!UserManager.#comparePassword(validated,userPassword)){
                return "Clave invalida"
            }else{
                return validated
            }

        } catch (e) {
            console.log(e.msg)
        }
    }
}

export default UserManager