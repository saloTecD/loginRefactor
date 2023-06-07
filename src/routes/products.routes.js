import { Router } from "express";
import productManager from "../api/dao/productManagerDB.js"


const router = Router()
const pManager = new productManager()
const camposObligatorios = ["title", "description", "code", "price", "status", "stock", "category"]


router.get(`/products`, async (req, res) => {
     try {
            let limit = parseInt(req.query.limit)||10
            let page=parseInt(req.query.page)||1
            let category=(req.query.category)||false
            let status=(req.query.status)||false
            let sort=(req.query.sort)=="asc"?1:(req.query.sort)=="desc"?-1:false
            let filter={limit:limit,page:page,category:category,status:status,sort:sort}
            let regex=new RegExp(/page=[0-9]+$/)
            let newNextLink
            const process=await pManager.getProductsLimit(filter)
            let prevLink=process.hasPrevPage==false?null:process.page-1
            let nextLink=process.hasNextPage==false?null:process.page+1
            let newPrevUrl=prevLink==null?null:"localhost:8080/api"+req.url.replace(/page=[0-9]+$/,`page=${prevLink}`)
            
            if(regex.test(req.url)){
                newNextLink=nextLink==null?null:"localhost:8080/api"+req.url.replace(/page=[0-9]+$/,`page=${nextLink}`)
            }else{
                newNextLink=nextLink==null?null:"localhost:8080/api"+req.url+"&page=2"
            }
                       
            process.prevLink=newPrevUrl
            process.nextLink=newNextLink
            
            res.status(200).send({status:"OK",data:process})
        
        

     } catch (err) {
        res.status(500).send({status:"ERR", error: err })
     }
})


router.get(`/products/:pid`, async (req, res) => {
    try {
        let id = req.params.pid
        res.status(200).send(await pManager.getProductById(id))
    } catch (err) {
        res.status(500).send({ "error": err })
    }
})

router.post("/products", async (req, res) => {

try{
    if (camposObligatorios.every(e => Object.prototype.hasOwnProperty.call(req.body, e) && req.body[e] !== "" && typeof (req.body.price) === "number" && typeof (req.body.stock) === "number" && typeof (req.body.status) === "boolean")) {
       let nuevoProd = req.body
        if (!req.body.thumbnails) {
            nuevoProd.thumbnails = []
        }


        // res.status(200).send(await pManager.addProduct(nuevoProd.title, nuevoProd.description, nuevoProd.price, nuevoProd.thumbnails, nuevoProd.code, nuevoProd.stock))
        res.status(200).send(await pManager.addProduct(nuevoProd))
    } else {
        res.status(200).send(`Se deben completar todos los campos Y/O con el tipo correcto de datos`)
    }
}catch(err){
    res.status(500).send({ "error": err })
}
})

router.put("/products/:pid", async (req,res)=>{
    // try{
    let id=req.params.pid
    let update=req.body
    res.status(200).send(await pManager.updateProduct(id,update))
// }catch(err){
    // res.status(500).send({ "error": err })
// }
})

router.delete("/products/:pid",async (req,res)=>{
   try{
    let id=req.params.pid
    res.status(200).send(await pManager.deleteProduct(id))
}catch(err){
    res.status(500).send({ "error": err })
}
})

export default router