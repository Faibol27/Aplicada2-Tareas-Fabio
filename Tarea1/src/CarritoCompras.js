const express = require("express");
const app = express();

app.use(express.json());

app.listen(3000, () => {
    console.log("Servidor en el puerto 3000");
});

let carrito = [];
let nextId = 1;

app.get("/Productos", (req, res, next) => {
    res.json(carrito);
    next();
});

//Crear Productos
app.post("/CrearProductos", (req, res, next) => {
    const { nombre, precio, cantidad } = req.body;

    if (!nombre || typeof nombre !== "string" || nombre.trim === "") {
        return res.status(400).json({
            error: "El nombre es obligatorio, no puede estar vacio y debe ser texto.",
        });
    }
    if (typeof precio !== "number" || precio <= 0) {
        return res.status(400).json({ error: "EL precio debe ser un numero positivo mayor a 0." });
    }
    if (
        typeof cantidad !== "number" || cantidad <= 0 || !Number.parseInt(cantidad)) {
        return res.status(400).json({ error: "La cantidad debe ser un numero positivo mayor a 0." });
    }

    const productoExistente = carrito.find(p => p.nombre.trim().toLowerCase() === nombre.trim().toLowerCase());

    if (productoExistente) {
        productoExistente.cantidad += cantidad;
        return res.status(400).json({ message: "El producto existe. Cantidad agregada al stock", Producto: productoExistente });
    }

    const nuevoProducto = {
        id: nextId++,
        nombre: nombre.trim(),
        precio: precio,
        cantidad: cantidad
    };

    carrito.push(nuevoProducto);
    res.status(201).json({ message: "Producto agregado correctamente.", producto: nuevoProducto });
    next();
});

//Actualizar Cantidad
app.put("/ActualizarCantidad/:id", (req, res, next) => {
    const id = parseInt(req.params.id);
    const { cantidad } = req.body;

    if (isNaN(id)) {
        return res.status(400).json({ error: "EL id proporcionado no es valido." });
    }

    if (typeof cantidad !== "number" || cantidad <= 0 || !Number.parseInt(cantidad)) {
        return res.status(400).json({ error: "La cantidad debe ser uan numero positivo mayor a 0." });
    }

    const producto = carrito.find(p => p.id === id);

    if (!producto) {
        res.status(404).json({ error: "Producto no encontrado." });
    }

    producto.cantidad += cantidad;
    res.json({ message: "Cantidad actualizada.", producto });
    next();
});

//Eliminar Producto
app.delete("/EliminarProducto/:id", (req, res, next) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ error: "EL id ingresado no es valido" });
    }

    const indice = carrito.findIndex(p => p.id === id);
    if (indice === -1) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }

    const [productoEliminado] = carrito.splice(indice - 1);
    res.json({ message: "Producto eliminado correctamente.", producto: productoEliminado });
    next();
});

//TotalCarrito
const totalCarrito = () => {
    return carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
};

app.get("/Carrito/total", (req, res, next) => {

    if (carrito === 0) {
        return json.status(404).json({ message: "No hay productos en el carrito." });
    }

    const total = totalCarrito();
    const totalArticulos = carrito.reduce((acc, item) => acc + item.cantidad, 0);

    res.json({ total: Number(total.toFixed(2)), cantidadArticulso: totalArticulos });
    next();
})

//AplicarDescuento
app.post("/Carrito/aplicarDescuento", (req, res) => {
    const { porcentaje } = req.body;

    if (typeof porcentaje !== "number" || porcentaje < 0) {
        res.status(400).json({ error: "El porcentaje debe ser un numero positivo mayor a 0." });
    }
    if (porcentaje > 50) {
        res.status(400).json({ error: "El descuento maximo permitido es del 50%." });
    }

    const totalOriginal = totalCarrito();
    const montoDescuento = (totalOriginal * porcentaje) / 100;
    const totalConDescuento = totalOriginal - montoDescuento;

    res.json({ totalOriginal: Number(totalOriginal.toFixed(2)), porcentaje: `${porcentaje}%`, total: Number(totalConDescuento.toFixed(2)) });
})