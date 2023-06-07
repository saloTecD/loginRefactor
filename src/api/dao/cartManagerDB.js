import mongoose from "mongoose"
import cartModel from "./models/cart.model.js"
import productModel from "./models/product.model.js"

class CartManager {
    constructor() {
        this.cStatus = 1
    }

    createCart = async () => {
        const nCart = await cartModel.collection.insertOne({})
        return nCart
    }
    listCartProducts = async (id) => {
        try {
            const arreglo = await cartModel.findById(id).populate({path:"products.pid",model:productModel}).lean()
            if (arreglo === null) {
                return "El ID del carrito que busca no existe"
            } else {
                return arreglo
            }
        } catch (e) {

            console.log("Update Product error de formato de codigo")
            console.log(e.message)
            return "Formato de codigo erroneo"
        }
    }
    addCartProduct = async (cid, pid) => {
        // try {
            const arreglo = await cartModel.findById(cid)
            
            if (arreglo === null) {
                return "El ID del carrito que busca no existe"
            } else {
                
                const existe = await cartModel.find({ "_id": cid, "products.pid": new mongoose.Types.ObjectId(pid) })
                

                if (existe == "") {
                    
                    await cartModel.updateOne(
                        { "_id": new mongoose.Types.ObjectId(cid) },
                        { $push: { products: { pid: new mongoose.Types.ObjectId(pid), quantity: 1 } } }
                    )
                    
                } else {
                    
                    const found = existe[0].products.findIndex(e => JSON.stringify(e.pid) == JSON.stringify(pid))

                    
                    let cantidad = existe[0].products[found].quantity

                    cantidad++

                    await cartModel.updateOne({ "_id": new mongoose.Types.ObjectId(cid), "products.pid": new mongoose.Types.ObjectId(pid) }, { $set: { "products.$.quantity": cantidad } })
                }
                return "Producto Agregado Correctamente"
            }
        // } catch (e) {
        //     console.log("Update Product error de formato de codigo")
        //     return "Formato de codigo erroneo"
        // }
    }
    deleteCartProduct = async (cid, pid) => {
        try {
            let fil = { $pull: { "products": { pid: new mongoose.Types.ObjectId(pid) } } }
            const arreglo = await cartModel.updateOne({ "_id": new mongoose.Types.ObjectId(cid) }, fil)

            if (arreglo.matchedCount == 0) {
                return "El ID del carrito no existe"
            } else if (arreglo.modifiedCount == 0) {
                return "El id del Producto indicado no esta en este carrito"
            } else {
                return "Producto eliminado exitosamente"
            }

        } catch (e) {
            console.log("Update Product error de formato de codigo")
            return "Formato de codigo erroneo"
        }
    }

    addListProductCart = async (cid, prodArray) => {
        try {
            
            let result = prodArray.products.map((e) => e.pid)
            
            let test = await productModel.find({ "_id": { $in: result } })
            if (result.length != test.length) {
                return "Uno o mas Productos que intenta agregar no son validos"
            } else {

                let fil = { $push: { products: prodArray.products } }
                const arreglo = await cartModel.updateOne({ "_id": new mongoose.Types.ObjectId(cid) }, fil)
                return arreglo
            }
        } catch (e) {
            console.log("Update Product error de formato de codigo!!")
            return "Formato de codigo erroneo"
        }
    }
    addQuantProdCart = async (cid, pid, quant) => {
        try {

            let fil = { $set: { "products.$[elem].quantity": quant } }
            const arreglo = await cartModel.updateOne({ "_id": new mongoose.Types.ObjectId(cid) }, fil, { arrayFilters: [{ "elem.pid": pid }] })

            return arreglo
        }
        catch (e) {
            console.log("Update Product error de formato de codigo")
            return "Formato de codigo erroneo"
        }
    }

    emptyCart = async (cid) => {
        try {
            let fil = { $unset: { products: "" } }
            const arreglo = await cartModel.updateOne({ "_id": new mongoose.Types.ObjectId(cid) }, fil)
            return arreglo
        } catch (e) {
            console.log("Update Product error de formato de codigo")
            return "Formato de codigo erroneo"
        }
    }
}



export default CartManager