const ws = io('ws://localhost:8081');
    let btnDel = document.getElementById("delBtn")
    let btnAdd = document.getElementById("aggProductoBtn")

    ws.on("connect", () => {
        ws.emit("eventTest", "Evento de conexion prueba")

        ws.on("confirmacion_Server", (msg) => {
            console.log(msg)
        })

        btnDel.addEventListener("click", () => {
            let userID = document.getElementById("pid").value
            ws.emit("delProduct", userID)
        })
        btnAdd.addEventListener("click", () => {
            let titulo = document.getElementById("npTitulo").value
            let desc = document.getElementById("npDescripcion").value
            let precio = document.getElementById("npPrecio").value
            let imagen = document.getElementById("npImagen").value
            let codigo = document.getElementById("npCodigo").value
            let stock = document.getElementById("npStock").value
            let estado = document.getElementById("npEstado").value
            const prod = {
                title: titulo,
                description: desc,
                price: precio,
                thumbnails: [imagen],
                code: codigo,
                stock: stock,
                status: estado
            }
            const valores = [...Object.values(prod)]
            const empty = (e) => e == ""
            if (valores.some(empty)) {
                alert("se deben completar todos los campos para agregar algun producto")
            } else {
                ws.emit("addProduct", prod)
            }

        })
        ws.on("deleteProduct", (msg) => {
            deleteProduct(msg)
        })
        ws.on("addNewProd",(msg)=>{
            addProduct(msg)
        })

    })


    deleteProduct = (pid) => {
        let id = pid
        let cardP = document.getElementById(`id${id}`)
        cardP.parentNode.removeChild(cardP)

    }
    


    addProduct = (newProduct) => {
        console.log("me ejecute")
        const rowContainer = document.getElementById("rowContainer")

        const col = document.createElement("div")
        col.id = newProduct.id
        col.className = "col my-3 "
        const card = document.createElement("div")
        card.className = "card"
        card.style = "width: 18rem;"

        const img = document.createElement("img")
        img.src = newProduct.thumbnails
        img.alt = newProduct.title
        img.className = "card-img-top"

        const cardBody = document.createElement("div")
        cardBody.className = "card-body"

        const h5 = document.createElement("h5")
        h5.className = "card-title"
        h5.textContent = newProduct.title

        const cardText = document.createElement("p")
        cardText.className = "card-text"
        cardText.textContent = newProduct.description

        const cardPrice = document.createElement("p")
        cardPrice.className = "my-4"
        cardPrice.textContent = "Precio x Und: "

        const bprecio = document.createElement("b")
        bprecio.textContent = newProduct.price

        const pid = document.createElement("p")
        pid.textContent = `ID: ${newProduct.id}`

        card.appendChild(img)

        cardBody.appendChild(h5)
        cardBody.appendChild(cardText)
        cardPrice.appendChild(bprecio)
        cardBody.appendChild(cardPrice)


        card.appendChild(cardBody)

        col.appendChild(card)
        cardBody.appendChild(pid)
        rowContainer.appendChild(col)

    }