'use strict';

/*array de mis productos*/

let productos = [
    {
        id: 1,
        nombre: 'Gomigas con jugo',
        descripcion: 'Surtido de gomitas con agregado de jugo natural',
        precio: 500,
        imagen: 'con_jugo.jpg',
        categoría: 'Clásico',
    },
    {
        id: 2,
        nombre: 'Gomigas artesanales',
        descripcion: 'Delicadas mermeladas artesanales hechas por nuestros maestros',
        precio: 600,
        imagen: 'artesanal.jpg',
        categoría: 'Para regalo',
    },
    {
        id: 3,
        nombre: 'Ositas de goma',
        descripcion: 'Ositas de goma famosas',
        precio: 350,
        imagen: 'ocitos_de_goma.jpg',
        categoría: 'Forma',
    },
    {
        id: 4,
        nombre: 'Golosinas',
        descripcion: 'Surtido de golosinas de varios sabores',
        precio: 250,
        imagen: 'golosinas.jpg',
        categoría: 'Clásico',
    },
    {
        id: 5,
        nombre: 'Conjuntos de regalo',
        descripcion: '1 kg de gomitas en un bonito empaque de regalo',
        precio: 4000,
        imagen: 'conjuntos_de_regalo.jpg',
        categoría: 'Para regalo',
    },
    {
        id: 6,
        nombre: 'Gomitas de forma frutas',
        descripcion: 'Una variedad de sabores de frutas en las gomitas',
        precio: 450,
        imagen: 'Gomitas_de_formas_de_frutas.jpg',
        categoría: 'Forma',
    },
];

//*los filtros de productos

document.addEventListener('DOMContentLoaded', function() {
    const categoryButtons = document.querySelectorAll('#minicarrito a');

    categoryButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();

            const category = this.textContent.trim();
            filterByCategory(category);
        });
    });

    const clearFilterLink = document.querySelector('#minicarrito a:last-child');
    clearFilterLink.addEventListener('click', function(event) {
        event.preventDefault();
        showAllCards();
    });
});

function filterByCategory(category) {
    const products = document.querySelectorAll('.productos .card');
    
    products.forEach(product => {
        const productId = parseInt(product.querySelector('.category').getAttribute('data-productid'));
        const selectedProduct = productos.find(item => item.id === productId);
        
        if (category === 'Borrar filtros' || selectedProduct.categoría === category) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

function showAllCards() {
    const products = document.querySelectorAll('.productos .card');
    
    products.forEach(product => {
        product.style.display = 'block';
    });
}


//Carrito
let cartItems = []; // array para carrito

// datos de carrito
function updateCartInfo() {
    const itemsAgregados = document.getElementById('itemsAgregados');
    const total = document.getElementById('total');

    // Cantidad de productos en carrito
    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    itemsAgregados.textContent = totalItems;

    // Precio total en carrito
    const totalPrice = cartItems.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    total.textContent = totalPrice.toFixed(2); 
}

// Agregar producto en carrito
function addToCart(productId) {
    const productElement = document.querySelector(`[data-productid="${productId}"]`);
    const priceSpan = productElement.querySelector('span');
    const price = parseFloat(priceSpan.textContent); 

    const productInCart = cartItems.find(item => item.id === productId);

    if (productInCart) {
        productInCart.quantity += 1;
    } else {
        cartItems.push({ id: productId, price: price, quantity: 1 });
    }

    updateCartInfo();
}

document.querySelector('#btn-ver-carrito').addEventListener('click', function() {
    displayCartItems(); // activar informacion que esta en carrito
});



function displayCartItems() {
    const cartItemList = document.getElementById('cartItemList');
    cartItemList.innerHTML = '';

    const itemCounts = {}; // para contar la cantidad de cada producto,si es era agregar mas de dos vezes

    cartItems.forEach(item => {
        const product = productos.find(producto => producto.id === item.id);
        if (product) {
            const listItem = document.createElement('li');
            const productName = `${product.nombre} - $${item.price}`;

            // para contar la cantidad de cada producto
            itemCounts[item.id] = itemCounts[item.id] ? itemCounts[item.id] + item.quantity : item.quantity;

            listItem.textContent = `${productName} (x${itemCounts[item.id]})`;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.classList.add('btn', 'btn-primary');
            deleteButton.onclick = function () {
                // Borrar de carrito
                removeFromCart(item.id);
                displayCartItems(); // Actualizar la lista de productos
                updateCartInfo(); // Actualizar la información del carrito en página 
            };
        
            listItem.appendChild(deleteButton);
            cartItemList.appendChild(listItem);
        }
    });

    function removeFromCart(productId) {
        cartItems = cartItems.filter(item => item.id !== productId);
    }

    // Cantidad y precio totales en carrito
    const totalItems = Object.values(itemCounts).reduce((acc, count) => acc + count, 0);
    const totalPrice = cartItems.reduce((acc, item) => acc + (item.quantity * item.price), 0).toFixed(2);

    document.getElementById('modalTotalItems').textContent = totalItems;
    document.getElementById('modalTotalPrice').textContent = totalPrice;
}
