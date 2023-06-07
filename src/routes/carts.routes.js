import { Router } from "express";
import cartManager from "../api/dao/cartManagerDB.js"
import productManager from "../api/dao/productManagerDB.js"

const router = Router()
const cManager = new cartManager()
const pManager = new productManager()
router.post(`/carts`, async (req, res) => {
    res.status(200).send(await cManager.createCart())
})

router.get(`/carts/:cid`, async (req, res) => {
    let id = req.params.cid
    res.status(200).send(await cManager.listCartProducts(id))
})

router.post(`/carts/:cid/product/:pid`, async (req, res) => {
    let cid = req.params.cid
    let pid = req.params.pid
    if (await pManager.getProductById(pid) === "Not Found") {

        res.status(200).send("El producto que quieres agregar no existe")
    } else {
        const process=await cManager.addCartProduct(cid, pid)
        res.status(200).send({status:"OK",data:process})
    }
})

router.delete(`/carts/:cid/products/:pid`, async (req, res) => {
    let cid = req.params.cid
    let pid = req.params.pid
    const process = await cManager.deleteCartProduct(cid, pid)
    res.status(200).send({ status: "OK", data: process })
})

router.put(`/carts/:cid`, async (req, res) => {
    let cid = req.params.cid
    let prodArray = req.body
    const process = await cManager.addListProductCart(cid, prodArray)
    res.status(200).send({ status: "OK", data: process })
})

router.put(`/carts/:cid/products/:pid`, async (req, res) => {
    let cid = req.params.cid
    let pid = req.params.pid
    let quant = req.body.quantity
    const process = await cManager.addQuantProdCart(cid, pid, quant)
    res.status(200).send({ status: "OK", data: process })
})

router.delete(`/carts/:cid`, async (req, res) => {
    let cid = req.params.cid
    const process = await cManager.emptyCart(cid)
    res.status(200).send({ status: "OK", data: process })
})
export default router