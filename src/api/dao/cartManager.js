import * as fs from "fs"

class CartManager {
    static cid = 0;
    constructor(pathCustom) {
        // this.products = [];
        this.pathCustom = pathCustom;
    }

    writeToFile = async (cartProducts) => {
        await fs.promises.writeFile(this.pathCustom, JSON.stringify(cartProducts))
        
    }

    readFromFile = async () => {
        const cartFile = await fs.promises.readFile(this.pathCustom, `utf-8`)

        let cartFiles = JSON.parse(cartFile)

        return cartFiles
    }

    async createCart() {
        let array = await this.readFromFile()
        let arrayActualizado = [...array]
        
        if (array.length == 0) {
            CartManager.cid++
        } else {
            CartManager.cid = arrayActualizado[arrayActualizado.length - 1].id
            CartManager.cid++
            
        }
        const newCart = {
            id: CartManager.cid,
            products: []
        }
        arrayActualizado.push(newCart)
        await this.writeToFile(arrayActualizado)
        return `Carrito con ID:${CartManager.cid} creado`
    }

    async listCartProducts(cid) {
        let array = await this.readFromFile()
        const elemento = array.find(e => e.id === cid)
        if (elemento === undefined) {
            return "Este CID no existe"
        }
        else {
            return elemento.products
        }
    }

    async addCartProduct(cid, pid) {
        let array = await this.readFromFile()
        let arrayActualizado=[...array]
       
        const cartIndex = array.findIndex(e => {
            return e.id === cid
        })
        
        if (cartIndex === -1) {
            
            return "Este CID no existe"
            
        }
        else {
            const prodIndex=arrayActualizado[cartIndex].products.findIndex(e=>{
                return e.pid===pid
            })
            if(prodIndex=== -1){
                let newProd={
                    pid:pid,
                    quantity:1
                }
                arrayActualizado[cartIndex].products.push(newProd)
                await this.writeToFile(arrayActualizado)
            }
            else{
                arrayActualizado[cartIndex].products[prodIndex].quantity++
                await this.writeToFile(arrayActualizado)
                
            }
           return "Producto Agregado al Carrito"
        }

    }
}



const cart = new CartManager(`./cart.json`)


export default { cart }