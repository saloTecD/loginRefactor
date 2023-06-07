const btns=document.querySelectorAll(".bbtt")
btns.forEach(btn=>{
    btn.addEventListener("click",event=>{
        fetch(`http://localhost:8080/api/carts/646d00ea6cd6b881894179cf/product/${event.target.id}`,{
            method:"POST",
            headers:{
                "Accept":"application/json",
                "Content-Type":"application/json"
            }
        })
        .then(response=>response.json())
        .then(response=>
            Swal.fire({
                title:JSON.stringify(response.data)+" en el Cart con id ....9cf"
            })
        )
        console.log(event.target.id)
    })
})

