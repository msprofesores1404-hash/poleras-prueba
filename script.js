// Base de datos de productos
const productos = [
    {
        id: 1,
        nombre: "Polera Roblox Classic",
        descripcion: "Polera roja clásica de Roblox",
        precio: 15990,
        emoji: "👕",
        tallas: ["XS", "S", "M", "L", "XL", "XXL"]
    },
    {
        id: 2,
        nombre: "Polera Neon Gamer",
        descripcion: "Polera con efecto neon fluorescente",
        precio: 19990,
        emoji: "💡",
        tallas: ["S", "M", "L", "XL"]
    },
    {
        id: 3,
        nombre: "Polera Limited Edition",
        descripcion: "Edición limitada exclusiva de Roblox",
        precio: 24990,
        emoji: "⭐",
        tallas: ["M", "L", "XL", "XXL"]
    },
    {
        id: 4,
        nombre: "Polera Developer",
        descripcion: "Para los desarrolladores de Roblox",
        precio: 17990,
        emoji: "👨‍💻",
        tallas: ["XS", "S", "M", "L", "XL"]
    },
    {
        id: 5,
        nombre: "Polera Noob Life",
        descripcion: "Celebra tu vida de noob con estilo",
        precio: 14990,
        emoji: "🎮",
        tallas: ["XS", "S", "M", "L"]
    },
    {
        id: 6,
        nombre: "Polera Premium Gold",
        descripcion: "Polera premium con detalles dorados",
        precio: 29990,
        emoji: "👑",
        tallas: ["S", "M", "L", "XL", "XXL"]
    }
];

// Carrito de compras
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Función para cargar productos
function cargarProductos() {
    const grid = document.getElementById('productos-grid');
    grid.innerHTML = '';

    productos.forEach(producto => {
        const card = document.createElement('div');
        card.className = 'producto-card';
        card.innerHTML = `
            <div class="producto-imagen">${producto.emoji}</div>
            <div class="producto-info">
                <div class="producto-nombre">${producto.nombre}</div>
                <div class="producto-descripcion">${producto.descripcion}</div>
                <div class="producto-precio">$${producto.precio.toLocaleString('es-CL')}</div>
                <div class="producto-tallas">
                    <label for="talla-${producto.id}">Selecciona talla:</label>
                    <select id="talla-${producto.id}">
                        ${producto.tallas.map(talla => `<option value="${talla}">${talla}</option>`).join('')}
                    </select>
                </div>
                <button class="btn-agregar" onclick="agregarAlCarrito(${producto.id})">Agregar al Carrito</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Función para agregar al carrito
function agregarAlCarrito(productoId) {
    const producto = productos.find(p => p.id === productoId);
    const talla = document.getElementById(`talla-${productoId}`).value;
    
    if (!producto) return;

    // Verificar si el producto con la misma talla ya existe en el carrito
    const itemExistente = carrito.find(item => item.id === productoId && item.talla === talla);

    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        carrito.push({
            id: productoId,
            nombre: producto.nombre,
            precio: producto.precio,
            talla: talla,
            cantidad: 1,
            emoji: producto.emoji
        });
    }

    guardarCarrito();
    actualizarCarrito();
    mostrarNotificacion(`${producto.nombre} agregado al carrito`);
}

// Función para guardar el carrito en localStorage
function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Función para actualizar el carrito
function actualizarCarrito() {
    const carritoItems = document.getElementById('carrito-items');
    const cartCount = document.getElementById('cart-count');
    
    cartCount.textContent = carrito.length;

    if (carrito.length === 0) {
        carritoItems.innerHTML = '<div class="carrito-vacio">Tu carrito está vacío. ¡Agrega algunos productos!</div>';
        document.getElementById('subtotal').textContent = '$0';
        document.getElementById('total').textContent = '$5.000';
        return;
    }

    let html = '';
    let subtotal = 0;

    carrito.forEach((item, index) => {
        const total = item.precio * item.cantidad;
        subtotal += total;

        html += `
            <div class="carrito-item">
                <div style="font-size: 2rem;">${item.emoji}</div>
                <div class="item-detalles">
                    <div class="item-nombre">${item.nombre}</div>
                    <div class="item-talla">Talla: ${item.talla}</div>
                    <div class="item-cantidad">
                        <button onclick="cambiarCantidad(${index}, -1)" style="padding: 0.3rem 0.6rem; cursor: pointer;">-</button>
                        <input type="number" value="${item.cantidad}" onchange="cambiarCantidadDirecta(${index}, this.value)">
                        <button onclick="cambiarCantidad(${index}, 1)" style="padding: 0.3rem 0.6rem; cursor: pointer;">+</button>
                    </div>
                </div>
                <div class="item-precio">$${total.toLocaleString('es-CL')}</div>
                <button class="btn btn-danger" onclick="eliminarDelCarrito(${index})">Eliminar</button>
            </div>
        `;
    });

    carritoItems.innerHTML = html;
    
    const envio = 5000;
    const total = subtotal + envio;

    document.getElementById('subtotal').textContent = '$' + subtotal.toLocaleString('es-CL');
    document.getElementById('total').textContent = '$' + total.toLocaleString('es-CL');
}

// Función para cambiar cantidad
function cambiarCantidad(index, cambio) {
    if (carrito[index].cantidad + cambio > 0) {
        carrito[index].cantidad += cambio;
        guardarCarrito();
        actualizarCarrito();
    }
}

// Función para cambiar cantidad de forma directa
function cambiarCantidadDirecta(index, nuevaCantidad) {
    const cantidad = parseInt(nuevaCantidad);
    if (cantidad > 0) {
        carrito[index].cantidad = cantidad;
        guardarCarrito();
        actualizarCarrito();
    }
}

// Función para eliminar del carrito
function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    guardarCarrito();
    actualizarCarrito();
    mostrarNotificacion('Producto eliminado del carrito');
}

// Función para vaciar el carrito
function vaciarCarrito() {
    if (carrito.length === 0) {
        alert('El carrito ya está vacío');
        return;
    }

    if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
        carrito = [];
        guardarCarrito();
        actualizarCarrito();
        mostrarNotificacion('Carrito vaciado');
    }
}

// Función para procesar la compra
function procesarCompra() {
    if (carrito.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }

    const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const envio = 5000;
    const total = subtotal + envio;

    const resumen = carrito.map(item => `${item.emoji} ${item.nombre} (Talla: ${item.talla}) x${item.cantidad} - $${(item.precio * item.cantidad).toLocaleString('es-CL')}`).join('\n');

    const mensaje = `RESUMEN DE COMPRA:\n\n${resumen}\n\nSubtotal: $${subtotal.toLocaleString('es-CL')}\nEnvío: $${envio.toLocaleString('es-CL')}\nTOTAL: $${total.toLocaleString('es-CL')}\n\n¿Deseas confirmar tu compra?`;

    if (confirm(mensaje)) {
        // Simular procesamiento de pago
        alert('¡Gracias por tu compra! 🎉\n\nTu pedido ha sido confirmado.\nNos pondremos en contacto pronto para los detalles de envío.');
        carrito = [];
        guardarCarrito();
        actualizarCarrito();
        mostrarNotificacion('¡Compra realizada exitosamente!');
    }
}

// Función para enviar contacto
function enviarContacto(event) {
    event.preventDefault();
    const form = event.target;
    const nombre = form.children[0].value;
    const email = form.children[1].value;
    const mensaje = form.children[2].value;

    const mensajeContacto = `Nombre: ${nombre}\nEmail: ${email}\nMensaje: ${mensaje}`;
    
    alert(`¡Gracias por tu mensaje, ${nombre}!\n\nNos pondremos en contacto a ${email} pronto.`);
    form.reset();
    mostrarNotificacion('Mensaje enviado correctamente');
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje) {
    // Crear notificación temporal
    const notif = document.createElement('div');
    notif.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #4CAF50;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notif.textContent = mensaje;
    document.body.appendChild(notif);

    setTimeout(() => {
        notif.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notif.remove(), 300);
    }, 2000);
}

// Agregar animaciones con CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Inicializar la página
document.addEventListener('DOMContentLoaded', function() {
    cargarProductos();
    actualizarCarrito();
});
