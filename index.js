const $menu = document.getElementById("menus"),
  $templateCarrito = document.getElementById("tableCarrito").content,
  $carrito = document.querySelector(".datostabla"),
  $carritoConfirm = document.querySelector(".tabla_confirm")
  $template = document.getElementById("producto-menu").content,
  $fragmento = document.createDocumentFragment();
  $fragmentoCarrito = document.createDocumentFragment();
 
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];



async function productos_menu() {
  await fetch("data.json")
    .then((res) => res.json())
    .then((json) => {
  
      json.forEach((el,i) => {
        $template.querySelector(".cart").setAttribute("data-id",`${i+1}`);
        $template.querySelector(".imgProd").src = el.image.desktop;
        $template.querySelector(".imgProd").alt = el.name;

        let precio = el.price.toString();
        if (precio.length === 3) {
          precio = `${precio}0`;
        } else {
          precio = `${precio}.00`;
        }
        $template.querySelector("figcaption").innerHTML = `<span class="categoria">${el.category}</span>  <br> <span class="nombre">${el.name}</span> <br> <span class="precio">$${precio}</span>`;

        if(carrito.cantidad === undefined){
          carrito.cantidad=1
        }
        $template.getElementById("contar").textContent = carrito.cantidad;

        let $clone = document.importNode($template, true);
        $fragmento.appendChild($clone);
      });
      $menu.appendChild($fragmento);
      
    })
    .catch((err) => {
      console.log(err);
    });
}

function esconderBtnAdd(e) {
  
    if (e.target.matches(".btnAdd")) {
      e.target.classList.add("no_activo");
      e.target.classList.remove("activo");
      e.target.previousElementSibling.style.border ="2px solid  var(--Red)";
      creandoArregloCarrito(e);
    } else if (e.target.matches(".btnAdd *")) {
      e.target.parentNode.classList.add("no_activo");
      e.target.parentNode.classList.remove("activo");
      e.target.parentNode.previousElementSibling.style.border ="2px solid  var(--Red)";
      creandoArregloCarrito2(e);
    }
    
  };
  
  
function creandoArregloCarrito(e) {
    
    console.log(e.target.parentElement.children[0].getAttribute("src"))
    
    carrito.push({
      nombre: e.target.parentElement.parentElement.querySelector(".nombre").textContent,
      precio: e.target.parentElement.parentElement.querySelector(".precio").textContent,
      id: e.target.parentElement.parentElement.getAttribute("data-id"),
      cantidad:1,
      imagen: e.target.parentElement.children[0].getAttribute("src")
    })
    guardarLocalStorage();
    creandoCarrito();
  }
  
function creandoArregloCarrito2 (e) {
  
  
  carrito.push({
    nombre: e.target.parentElement.parentElement.parentElement.querySelector(".nombre").textContent,
    precio: e.target.parentElement.parentElement.parentElement.querySelector(".precio").textContent,
    id: e.target.parentElement.parentElement.parentElement.getAttribute("data-id"),
    cantidad:1,
    imagen: e.target.parentElement.parentElement.children[0].getAttribute("src")
  })
  guardarLocalStorage();
  creandoCarrito();
}

function creandoCarrito () {
    if (carrito.length > 0){
          $carrito.innerHTML ="";
          let total = 0;

          carrito.forEach(producto => {
              
            let  subtotal = parseFloat(producto.precio.slice(1,5) * producto.cantidad)
              
               $templateCarrito.querySelector("table").innerHTML =`
               <tr >
               <td class="nombreProd">${producto.nombre}</td>
        
                  <td rowspan="2" class="cerrar"><div ><img class="eliminarProd" data-id="${producto.id}" src="assets/images/icon-remove-item.svg" alt="Eliminar"></div></td>
        
                </tr>
               
               <tr>
               <td> <span class="cantProd">${producto.cantidad}x  </span>  
               <span class="precioProd">@ ${producto.precio}  </span> 
               <span class="subProd">$${subtotal}</span> 
               </td>
               
               </tr>
               
               `;
            
               let $cloneCarrito = document.importNode($templateCarrito, true);
               $fragmentoCarrito.appendChild($cloneCarrito);
               total += subtotal
               
              });
         
              $carrito.appendChild($fragmentoCarrito);
              
              $carrito.insertAdjacentHTML("beforeend",` <div class="OrderTotal">
              <p>Order Total</p> <p class="precioOrder">$${total}</p>
              </div>`);
              
              $carrito.insertAdjacentHTML("beforeend",`<div class="delivery"> <img src="assets/images/icon-carbon-neutral.svg" alt="delivery">This is a <b>carbon-neutal</b> delivery</div>`);

              $carrito.insertAdjacentHTML("beforeend",`<button class="confirOrder">Confirm Order</button>`);


    } else {
          $carrito.innerHTML = `
           <img src="assets/images/illustration-empty-cart.svg" alt="">
            <p class="letrascarrito">Your added items will appear here</p>
          `;

    }
  
     
     document.querySelector(".countProd").textContent = carrito.length
     
   

  }

function sumarCantidadCarrito (e) {
    const existe = carrito.some(prod => prod.id === e.target.parentElement.parentElement.parentElement.parentElement.getAttribute("data-id"))
    

      if (existe){
        const total = carrito.map(tota => {
          
          if(tota.id === e.target.parentElement.parentElement.parentElement.   parentElement.getAttribute("data-id")){
            
            tota.cantidad++
            e.target.parentElement.parentElement.querySelector("#contar").textContent = tota.cantidad
            return tota;
          }else{
            return tota;
          }
       
        })  
        carrito = [...total]
        creandoCarrito();
      }
   
}

function restarCantidadCarrito (e) {
  const existe = carrito.some(prod => prod.id === e.target.parentElement.parentElement.parentElement.getAttribute("data-id"))

    if (existe){
      const total = carrito.map(tota => {
        
        if(tota.id === e.target.parentElement.parentElement.parentElement.getAttribute("data-id")){
          
          if (tota.cantidad >= 2){
              
            tota.cantidad--
          }
          
          e.target.parentElement.parentElement.querySelector("#contar").textContent = tota.cantidad
          return tota;
        }else{
          return tota;
        }

      })

      carrito = [...total]
      creandoCarrito();
      
    }
}

function guardarLocalStorage () {
  localStorage.setItem("carrito", JSON.stringify(carrito))
}

function buscarProductosAgregados(){


  setTimeout(() => {


    document.querySelectorAll(".cart").forEach((cart,i) => {

      if (carrito.length === 0){
        document.querySelectorAll(".cart")[i].children[0].children[1].classList.remove("no_activo");
        document.querySelectorAll(".cart")[i].children[0].children[1].classList.add("activo");
        document.querySelectorAll(".cart")[i].children[0].children[0].style.border ="none";
        document.querySelectorAll(".cart")[i].children[0].children[2].children[1].textContent = 1;
        
      }


   
      carrito.forEach(prod => {


        if(cart.getAttribute("data-id") === prod.id){

          document.querySelectorAll(".cart")[i].children[0].children[2].children[1].textContent = prod.cantidad;

          document.querySelectorAll(".cart")[i].children[0].children[0].style.border ="2px solid  var(--Red)";
          document.querySelectorAll(".cart")[i].children[0].children[1].classList.add("no_activo");
          document.querySelectorAll(".cart")[i].children[0].children[1].classList.remove("activo");
          
        }
        
      })


    })
  }, 100);



}

function eliminarProducto (e) {
  if (e.target.matches(".eliminarProd")){
   
    carrito = carrito.filter(prod => prod.id !== e.target.getAttribute("data-id"));   
    
    document.querySelectorAll(".cart").forEach((cart,i) => {
      
      if(cart.getAttribute("data-id") === e.target.getAttribute("data-id")){
          
          document.querySelectorAll(".cart")[i].children[0].children[1].classList.remove("no_activo");
          document.querySelectorAll(".cart")[i].children[0].children[1].classList.add("activo");

           document.querySelectorAll(".cart")[i].children[0].children[0].style.border ="none"
           document.querySelectorAll(".cart")[i].children[0].children[0].textContent = 1
           
      }
      
    })

    guardarLocalStorage();
    creandoCarrito();
    
  }
}

function tablaConfirm (e) {
  $carritoConfirm.innerHTML ="";
          let total = 0;

          carrito.forEach(producto => {
              
            let  subtotal = parseFloat(producto.precio.slice(1,5) * producto.cantidad)
              
               $templateCarrito.querySelector("table").innerHTML =`
               <tr >

               <td class="tdImg">
                  <img class="imgconfirm" src="${producto.imagen}" alt="">
               </td>

              <td class="nomConfirm"> 
                 <span>${producto.nombre}</span>
                 <br>   
                 <span class="cantProd">${producto.cantidad}x
                 <span class="precioconfirm">@ ${producto.precio}  </span>
                 
              </td>
              <td>
              <span class="subconfirm">$${subtotal}</span>
              </td>
                 
               </tr>
               
               
               
               `;
            
               let $cloneCarrito = document.importNode($templateCarrito, true);
               $fragmentoCarrito.appendChild($cloneCarrito);
               total += subtotal
               
              });
         
              $carritoConfirm.appendChild($fragmentoCarrito);
              $carritoConfirm.insertAdjacentHTML("beforeend",` <div class="OrderTotal">
                <p>Order Total</p> <p class="precioOrder">$${total}</p>
                </div>`);

                document.getElementById("confir_order").classList.remove("no_activo");
              document.getElementById("confir_order").classList.add("confir_order");
}

document.addEventListener("click",(e) => {
  esconderBtnAdd(e);
  eliminarProducto(e);

  if (e.target.matches(".sumar")){
    sumarCantidadCarrito(e)
    guardarLocalStorage()
  }
  if (e.target.matches(".restar")){
    restarCantidadCarrito(e)
    guardarLocalStorage()
  }
  if(e.target.matches(".confirOrder")){
    tablaConfirm(e);
  }
  if(e.target.matches(".newOrder")){
    carrito = [];
    guardarLocalStorage()
    creandoCarrito()
    buscarProductosAgregados()
    document.getElementById("confir_order").classList.add("no_activo");
    document.getElementById("confir_order").classList.remove("confir_order");
  }
})

document.addEventListener("DOMContentLoaded", (e) => {
  productos_menu();
  creandoCarrito();
  buscarProductosAgregados()
  document.getElementById("confir_order").classList.add("no_activo");
  document.getElementById("confir_order").classList.remove("confir_order");
  

  
})
