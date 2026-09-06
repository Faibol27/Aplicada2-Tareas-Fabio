const express = require("express");
const app = express();

app.use(express.json());

app.listen(3000, () => {
    console.log("El servidor esta en el puerto 3000");
});

let inventario = [];
let nextid = 1;

//ListarInventario
app.get("/Inventario", (req, res, next) => {
    res.json(inventario)
    next();
});

//CrearProducto
app.post("/CrearProductos", (req, res, next) => {
    const { producto, stock, stockMinimo } = req.body;

    if (!producto || typeof producto !== "string" || producto.trim() === "") {
        return res.status(400).json({ error: "El nombre del producto es obligatorio." });
    }

    if (typeof stock !== "number" || stock < 0 || !Number.isInteger(stock)) {
        return res.status(400).json({ error: "El stock ingresado debe ser una numero positivo mayor a 0." });
    }

    let minStock = 5;
    if (stockMinimo !== undefined) {
        if (typeof stockMinimo === "number" || stockMinimo < 0 || Number.isInteger(stockMinimo)) {
            res.status(400).json({ error: "El stock minimo ingresado debe ser una numero positivo mayor a 0." });
        }
        minStock = stockMinimo;
    }
    const existe = inventario.find(p => p.producto.toLowerCase() === producto.toLowerCase().trim());
    if (existe) {
        res.status(400).json({ error: "Ya existe este producto." });
    }
    const nuevoProducto = {
        id: nextid++,
        producto: producto.trim(),
        stock: stock,
        stockMinimo: minStock
    }

    inventario.push(nuevoProducto);
    res.status(200).json({ message: "Producto agregado correctamente", producto: nuevoProducto });
    next();
});

//EntradaProducto
app.post("/Inventario/:id/entrada", (req, res, next) => {
    const id = parseInt(req.params.id);
    const { cantidad } = req.body;

    if (isNaN(id)) {
        return res.status(400).json({ error: "ID de producto invalido." });
    }

    if (typeof cantidad !== "number" || cantidad < 0 || !Number.isInteger(cantidad)) {
        return res.status(400).json({ error: "La cantidad de entrada debe ser un numero positivo mayor a 0." });
    }

    const item = inventario.find(e => e.id === id);
    if (!item) {
        return res.status(404).json({ erorr: "Producto no encontrado." });
    }

    item.stock += cantidad;

    res.json({ message: "Entrada registrada", producto: item });
    next();
});

//SalidaProducto
app.post("/Inventario/:id/salida", (req, res, next) => {
    const id = parseInt(req.params.id);
    const { cantidad } = req.body;

    if (isNaN(id)) {
        return res.status(400).json({ error: "ID de producto invalido." });
    }

    if (typeof cantidad !== "number" || cantidad < 0 || !Number.isInteger(cantidad)) {
        return res.status(400).json({ error: "La cantidad de entrada debe ser un numero positivo mayor a 0." });
    }

    const item = inventario.find(e => e.id === id);
    if (!item) {
        return res.status(404).json({ erorr: "Producto no encontrado." });
    }
    if (cantidad > item.stock) {
        return res.status(400).json({ error: `Stock insuficiente. Stock disponible: ${item.stock}.` });
    }

    item.stock -= cantidad;

    res.json({ message: "Salida registrada", producto: item, alertaStockBajo: item.stock < item.stockMinimo });
    next();
});
app.get("/Inventario/Alertas", (req, res) => {
    const alertas = inventario.filter(item => item.stock < item.stockMinimo).map(item => ({
        id: item.id,
        producto: item.producto,
        stock: item.stock,
        stockMinimo: item.stockMinimo,
        faltanteStockMinimo: item.stockMinimo - item.stock
    }));

    res.json({ totalAlertas: alertas.length, productosBajoMinimo: alertas });
})