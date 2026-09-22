import { prisma } from "../db.js";

//Listar
export const obtenerInventario = async (req, res) => {
    try {
        const productos = await prisma.inventario.findMany();
        return res.json(productos);
    } catch (error) {
        return res.status(500).json({ error: "Error interno del servidor al listar el inventario" });
    }
};

//Crear
export const crearInventario = async (req, res) => {
    try {
        const { producto, stock, stockMinimo } = req.body;
        if (!producto || typeof producto !== "string" || producto.trim() === "") {
            return res.status(400).json({ error: "El nombre del producto es obligatorio y no debe estar vacio." });
        }
        if (typeof stock !== "number" || stock <= 0 || !Number.isInteger(stock)) {
            return res.status(400).json({ error: "El stock debe ser un numero entero positivo mayor que 0." });
        }
        const stockMinimoValido = Number(stockMinimo);
        if (typeof stockMinimoValido !== "number" || !Number.isInteger(stockMinimoValido) || stockMinimoValido < 0) {
            return res.status(400).json({ error: "El stock minimo debe ser de minimo 5." });
        }

        const existe = await prisma.inventario.findFirst({ where: { producto: { equals: producto.trim(), mode: 'insensitive' } } });
        if (existe) {
            return res.status(400).json({ error: "Ya existe este producto" });
        }

        const nuevo = await prisma.inventario.create({ data: { producto: producto.trim(), stock, stockMinimo: stockMinimoValido } });
        return res.json({ message: "Producto creado", nuevo });
    } catch (error) {
        return res.status(500).json({ error: "Error interno del servidor al crear un producto." });
    }
};

//Entrada

export const entradaInventario = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { cantidad } = req.body;
        if (isNaN(id)) {
            return res.status(400).json({ error: "El ID de la encuesta debe ser un numero entero valido." });
        }
        if (typeof cantidad !== "number" || !Number.isInteger(cantidad) || cantidad <= 0) {
            return res.status(400).json({ error: "El numero deber ser un numero entero positivo mayor que 0." });
        }

        const producto = await prisma.inventario.findFirst({ where: { id: id } });
        if (!producto) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        const actualizarCantidad = await prisma.inventario.update({ where: { id: id }, data: { stock: { increment: cantidad } } });

        return res.json({ message: "Cantidad actualizada", actualizarCantidad });

    } catch (error) {
        return res.status(500).json({ error: "Error interno del servidor al crear un producto." });
    }
};

//Salida
export const salidaInventario = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { cantidad } = req.body;
        if (isNaN(id)) {
            return res.status(400).json({ error: "El ID de la encuesta debe ser un numero entero valido." });
        }
        if (typeof cantidad !== "number" || !Number.isInteger(cantidad) || cantidad <= 0) {
            return res.status(400).json({ error: "El numero deber ser un numero entero positivo mayor que 0." });
        }

        const producto = await prisma.inventario.findFirst({ where: { id: id } });
        if (!producto) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        const actualizarCantidad = await prisma.inventario.update({ where: { id: id }, data: { stock: { decrement: cantidad } } });

        return res.json({ message: "Cantidad actualizada", actualizarCantidad });

    } catch (error) {
        return res.status(500).json({ error: "Error interno del servidor al crear un producto." });
    }
};

//Alertas
export const alertasInventario = async (req, res) => {
    try {
        const productos = await prisma.inventario.findMany({
            select: {
                id: true,
                producto: true,
                stock: true,
                stockMinimo: true,
            },
        });

        const alertas = productos
            .filter((item) => item.stock < item.stockMinimo)
            .map((item) => ({
                id: item.id,
                producto: item.producto,
                stock: item.stock,
                stockMinimo: item.stockMinimo,
                faltanteStockMinimo: item.stockMinimo - item.stock,
            }));

        return res.json({
            totalAlertas: alertas.length,
            productosBajoMinimo: alertas,
        });
    } catch (error) {
        console.error("Error al obtener alertas de inventario:", error);
        return res.status(500).json({
            error: "Error interno del servidor al consultar las alertas.",
        });
    }
};