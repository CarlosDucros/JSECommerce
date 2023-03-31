let productos = []

fetch('../jsons/plushies.json')
    .then( response=> response.json())
    .then( (data)=> productos = data )
    .finally(()=> {
        mostrarGaleria(productos)
        agregarEventoBotonCompra()
    });


// Mostrar el array de cards

function mostrarGaleria() {
    let card = document.getElementById("card");
    for (let producto of productos) {
        card.innerHTML +=
            `<div class="col-4 md-4 mt-3">
        <div class="card p-3 ps-5 pe-5 justify-content-center" data-id="${producto.id}">
            <h4 class="text-center">${producto.nombre}</h4>
            <div style="height:220px; overflow:hidden; ">
                <img src="${producto.src}" width="100%" />
            </div>
            <p class="mt-2">${producto.desc}</p>
            <span>${producto.precio}$</span>
            <button class="btn btn-primary w-100 mx-auto btnCompra"> Comprar </button>
        </div>
        </div>
        `

    }
}

// mostrarGaleria(productos);

// Mostrar el carrito
function pintarCarrito() {
    // Busco carrito en el localStorage y si devuelve null devuelvo un array vacio
    let carrito = revisarStorage();
    // Defino resultado como string porque voy a concatenar el $
    let resultado = '';
    if (carrito) {
        let total = 0;
        carrito.forEach(producto => {
            total+= producto.precio * producto.cantidad
            resultado += `
        <tr data-id="${producto.id}">
        <td><div style="height:120px; overflow:hidden;"><img src="${producto.src}" width="100px"></div></td>
        <td><p>${producto.nombre}</p></td>
        <td><span>${producto.precio}$</span></td>
        <td><div class="d-flex"><button data-accion="reducir" class="btn btn-secondary w-20 mx-auto reducir">-</button><input data-focus="out" type="number" class="form-control" style="max-width: 55px" value="${producto.cantidad}"/><button data-accion="aumentar" class="btn btn-secondary w-20 mx-auto aumentar">+</button></div></td>
        <td><span>${(producto.precio * producto.cantidad).toFixed(2)}$</span></td>
        <td><button data-accion="eliminar" class="btn btn-danger w-20 mx-auto">X</button></td>
        </tr>
        `
        });
        resultado+= `<tr><td style="text-align:right" class="fs-5 fw-bold" colspan="6">Total: ${total.toFixed(2)}$</td></tr>`
    }
    let carritoHTML = document.querySelector('#tbody');
    carritoHTML.innerHTML = resultado;
}

function sobreescribirCarrito(e) {
    //Obtener producto seleccionado
    let id = e.target.parentNode.getAttribute("data-id");
    let infoCarrito = getInfoCarrito(id);
    let indiceCarrito = infoCarrito.indice;
    let carrito = infoCarrito.carrito;
    let productoSeleccionado = infoCarrito.productoSeleccionado;
    console.log(e, id, infoCarrito, indiceCarrito, carrito, productoSeleccionado);
    // Si no esta pushearlo y si existe sumarle uno a la cantidad
    if (indiceCarrito === undefined) {
        carrito.push({ ...productoSeleccionado, cantidad: 1 })
    } else {
        carrito[indiceCarrito].cantidad += 1;
    }
    localStorage.setItem("carrito", JSON.stringify(carrito))
    pintarCarrito();

}
// Carga inicial de los items de localStorage
pintarCarrito();

function getInfoCarrito(id){
    //Busca el producto en el array de productos
    let productoSeleccionado = productos.find((producto) => {
        return producto.id === parseInt(id)
    })
    let carrito = revisarStorage();
    let indiceCarrito;
    // Recorre carrito y si encuentra su id asigna el indice a indiceCarrito
    carrito.forEach((producto, indice) => {
        if (producto.id === productoSeleccionado?.id) {
            indiceCarrito = indice;
        }
    })
    return {indice: indiceCarrito,carrito, productoSeleccionado};
}

// Buscar si existe ya en el carrito
function revisarStorage(){
let carritoJSON = localStorage.getItem('carrito');
let carrito = JSON.parse(carritoJSON);
if (!carrito) {
    carrito = [];
}
return carrito;
}

// Identificar el boton de compra
const agregarEventoBotonCompra = () => {
    let btnCompra = document.querySelectorAll(".btnCompra");

    for (let boton of btnCompra) {
        boton.addEventListener("click", sobreescribirCarrito);
    }
}

// Operaciones en una función para ahorrar codigo
function operarCarrito(id,operacion,valor){
        let infoCarrito = getInfoCarrito(id);
        let indiceCarrito = infoCarrito.indice;
        let carrito = infoCarrito.carrito;
        
        if(operacion === 'aumentar'){
            carrito[indiceCarrito].cantidad+=1;
        }else if(operacion === 'reducir'){
            carrito[indiceCarrito].cantidad-=1;
        if(carrito[indiceCarrito].cantidad === 0){
            carrito.splice(indiceCarrito,1)
        }
        }else if(operacion === 'eliminar'){
            carrito.splice(indiceCarrito,1)
        }else if(operacion === 'actualizar'){
            carrito[indiceCarrito].cantidad= parseInt(valor)
            if(carrito[indiceCarrito].cantidad === 0){
            carrito.splice(indiceCarrito,1)
        }
        }
        
        localStorage.setItem("carrito",JSON.stringify(carrito));
        pintarCarrito();
}
// Identificar los botones de aumentar, reducir y eliminar
document.body.addEventListener('click',function(e) {
    if( e.target.getAttribute("data-accion") === 'aumentar' ) {
        let id = e.target.parentNode.parentNode.parentNode.getAttribute("data-id");
        operarCarrito(id,'aumentar')
    }else if(e.target.getAttribute("data-accion") === 'reducir'){
        let id = e.target.parentNode.parentNode.parentNode.getAttribute("data-id");
        operarCarrito(id,'reducir');
    }else if(e.target.getAttribute("data-accion") === "eliminar"){
        let id = e.target.parentNode.parentNode.getAttribute("data-id");
        operarCarrito(id,'eliminar');
    }
  });
  // Hacer que tome el valor del input cuando se aprete fuera
document.body.addEventListener('focusout',function(e){
    if(e.target.getAttribute("data-focus") === "out"){
        let id = e.target.parentNode.parentNode.parentNode.getAttribute("data-id");
        operarCarrito(id,'actualizar',e.target.value)
    }
})
// Mostrar y ocultar carrito

let btnCarrito = document.getElementById("btnCarrito")

btnCarrito.addEventListener("click", function () {

    let carrito = document.getElementById("carrito");

    if (carrito.style.display === "block") {
        carrito.style.display = "none";
    } else {
        carrito.style.display = "block";
    }
})

let cerrarCarrito = document.getElementById("cerrarCarrito")

cerrarCarrito.addEventListener("click", function () {

    let carrito = document.getElementById("carrito");

    if (carrito.style.display === "block") {
        carrito.style.display = "none";
    } else {
        carrito.style.display = "block";
    }
})

