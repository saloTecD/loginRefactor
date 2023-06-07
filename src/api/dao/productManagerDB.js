import mongoose from "mongoose"
import productModel from "../dao/models/product.model.js"

class ProductManager {
    static sid = 0;
    constructor() {
        this.status = 1;
        this.statusMessage = "iniciando"
    }

    getProducts = async () => {
        try {
            const arreglo = await productModel.find().lean()
            return arreglo
        } catch (err) {
            this.status = -1
            this.statusMessage = `getProducts:${err}`
        }
    }

    getProductsLimit = async (n) => {
        let q
        let op
        q=n.category?{category:n.category}:n.status?{status:n.status}:{}
        op=n.sort===false?{limit:n.limit,page:n.page,lean:true}:{limit:n.limit,page:n.page,sort:{price:n.sort},lean:true}
        
        const arreglo = await productModel.paginate(q,op)
        return arreglo
    }

    getProductById = async (id) => {
        const arreglo = await productModel.findById(id)
        if (arreglo === null) {
            return "Not Found"
        } else {
            return arreglo
        }
    }

    addProduct = async (nuevoProd) => {

        let codigoRepetido = nuevoProd.code
        console.log(codigoRepetido)
        const arreglo = await productModel.find({ "code": codigoRepetido })
        console.log(arreglo == "" ? "es vacio" : "no esta vacio")
        if (arreglo == "") {
            await productModel.collection.insertOne(nuevoProd)
            console.log("Articulo agregado satisfactoriamente")
            return "Articulo agregado satisfactoriamente"

        } else {
            console.log("El codigo ingresado ya existe, por favor seleccione otro")
            return "El codigo ingresado ya existe, por favor seleccione otro"
        }

    }


    updateProduct = async (id, update) => {
        try {
            const arreglo = await productModel.findById(id)
            console.log(update)
            if (arreglo === null) {
                return "El ID que busca no existe"
            } else {
                const actualizado = await productModel.updateOne({ "_id": new mongoose.Types.ObjectId(id) }, update)
                console.log(actualizado)
                return "Producto Actualizado"
            }
        } catch (e) {
            console.log("Update Product error de formato de codigo")
            return "Formato de codigo erroneo"
        }

    }

    deleteProduct = async (id) => {
        try {
            const arreglo = await productModel.findById(id)
            if (arreglo === null) {
                return "El ID que busca no existe"
            } else {
                const actualizado = await productModel.deleteOne({ "_id": new mongoose.Types.ObjectId(id) })
                console.log(actualizado)
                return `Producto Eliminado con el id:${id}`
            }
        }catch(e){
            console.log("Update Product error de formato de codigo")
            return "Formato de codigo erroneo"
        }
}


}













export default ProductManager