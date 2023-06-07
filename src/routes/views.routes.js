import { Router } from "express";
import productManager from "../api/dao/productManagerDB.js"
import cartManager from "../api/dao/cartManagerDB.js"
import userManager from "../api/dao/userManager.js"
import passport from "../config/passport.config.js"

const pManager = new productManager()
const cManager = new cartManager()
const uManager = new userManager()

const viewRoutes = (store) => {
    const router = Router()
    router.get(`/realtimeproducts`, async (req, res) => {
        let productos = []
        productos = await pManager.getProducts()
        res.render("realTimeProducts", { showProducts: productos })
    })

    router.get(`/`, async (req, res) => {
        store.get(req.sessionID, async (err, data) => {
            console.log(data)
            console.log(req.sessionID)
            if (data !== null && (req.session.userValidated || req.sessionStore.userValidated)) {
                let limit = parseInt(req.query.limit) || 10
                let page = parseInt(req.query.page) || 1
                let category = (req.query.category) || false
                let status = (req.query.status) || false
                let sort = (req.query.sort) == "asc" ? 1 : (req.query.sort) == "desc" ? -1 : false
                let filter = { limit: limit, page: page, category: category, status: status, sort: sort }
                let regex = new RegExp(/page=[0-9]+$/)
                let newNextLink
                const process = await pManager.getProductsLimit(filter)
                let prevLink = process.hasPrevPage == false ? null : process.page - 1
                let nextLink = process.hasNextPage == false ? null : process.page + 1
                let newPrevUrl = prevLink == null ? null : "localhost:8080" + req.url.replace(/page=[0-9]+$/, `page=${prevLink}`)
                let logo = req.query.logo
                let rol = req.query.rol
                console.log(logo)
                if (regex.test(req.url)) {
                    newNextLink = nextLink == null ? null : "localhost:8080" + req.url.replace(/page=[0-9]+$/, `page=${nextLink}`)
                } else {
                    newNextLink = nextLink == null ? null : "localhost:8080" + req.url + "&page=2"
                }

                process.prevLink = newPrevUrl
                process.nextLink = newNextLink


                res.render("products", { showProducts: process, logo: logo, rol: rol })
            } else {
                res.render("login")
            }
        })


    })

    router.get(`/chat`, async (req, res) => {

        res.render("chat", {})
    })

    router.get(`/products`, async (req, res) => {
        let limit = parseInt(req.query.limit) || 10
        let page = parseInt(req.query.page) || 1
        let category = (req.query.category) || false
        let status = (req.query.status) || false
        let sort = (req.query.sort) == "asc" ? 1 : (req.query.sort) == "desc" ? -1 : false
        let filter = { limit: limit, page: page, category: category, status: status, sort: sort }
        let regex = new RegExp(/page=[0-9]+$/)
        let newNextLink
        const process = await pManager.getProductsLimit(filter)
        let prevLink = process.hasPrevPage == false ? null : process.page - 1
        let nextLink = process.hasNextPage == false ? null : process.page + 1
        let newPrevUrl = prevLink == null ? null : "localhost:8080" + req.url.replace(/page=[0-9]+$/, `page=${prevLink}`)

        if (regex.test(req.url)) {
            newNextLink = nextLink == null ? null : "localhost:8080" + req.url.replace(/page=[0-9]+$/, `page=${nextLink}`)
        } else {
            newNextLink = nextLink == null ? null : "localhost:8080" + req.url + "?page=2"
        }

        process.prevLink = newPrevUrl
        process.nextLink = newNextLink


        res.render("products", { showProducts: process })



    })

    router.get(`/carts/:cid`, async (req, res) => {
        let cid = req.params.cid
        let products = []

        products = await cManager.listCartProducts(cid)

        res.render("cart", { showProducts: products })
    })

    router.get(`/login`, async (req, res) => {
        let msg = req.query.msg
        res.render("login", { msg: msg })
    })
    router.post(`/login`, async (req, res) => {
        const { userEmail, userPassword } = req.body
        if (userEmail === "adminCoder@coder.com" && userPassword === "adminCod3r123") {
            req.session.userValidated = req.sessionStore.userValidated = true
            req.session.errorMessage = req.sessionStore.errorMessage = ""
            res.redirect(`http://localhost:8080?logo=adminCoder&rol=admin`)
        } else {
            const user = await uManager.validateUser(userEmail, userPassword)
            if (user === "Usuario no existe") {
                req.session.userValidated = req.sessionStore.userValidated = false
                req.session.errorMessage = req.sessionStore.errorMessage = "Usuario invalido"
                res.render("login", { msg: "Usuario invalido" })
            } else if(user==="Clave invalida"){
                req.session.userValidated = req.sessionStore.userValidated = false
                req.session.errorMessage = req.sessionStore.errorMessage = "Clave invalida"
                res.render("login", { msg: "Clave invalida" })
            }else {
                req.session.userValidated = req.sessionStore.userValidated = true
                req.session.errorMessage = req.sessionStore.errorMessage = ""
                res.redirect(`http://localhost:8080?logo=${user.userName}&rol=${user.userRol}`)
            }
        }

    })
    router.get(`/registro`, async (req, res) => {
        
         let msg=req.session.messages===undefined?null:req.session.messages[0]
        res.render("register",{msg:msg})
    })
    router.post(`/registro`,passport.authenticate("register",{failureRedirect:"/registro",failureMessage:"Email ya registrado"}) ,async (req, res) => {
        let user
        const nUser = req.body
        user = await uManager.createUser(nUser)

        if (!user) {
            res.render("register", { msg: "El email ingresado ya se encuentra registrado" })
        } else {
            res.redirect("http://localhost:8080/login?msg=Usuario%20Creado%20Con%20Exito")
        }
    })
    router.get(`/logout`, async (req, res) => {
        req.session.userValidated = req.session.userValidated = false
        req.session.destroy((err) => {
            req.sessionStore.destroy(req.sessionID, (err) => {
                if (err) console.log(`Error al destruir la sesion (${err})`)
                console.log("sesion destruida")

            })
        })
        res.redirect("http://localhost:8080")
    })

    
    return router
}
export default viewRoutes