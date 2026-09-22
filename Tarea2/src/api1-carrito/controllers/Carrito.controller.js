import { prisma } from "../db.js";

//Listar
export const obtenerCarritos = async (req, res) => {
    try {
        const carrito = await prisma.carrito.findMany();
        res.json(carrito);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor al listar los carrito." });
    }
};

//Crear
export const crearCarritos = async (req, res) => {
    try {
        const { nombre, precio, cantidad } = req.body;

        if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
            return res.status(400).json({ error: "El nombre es obligatorio, no puede estar vacio y debe ser texto." });
        }

        if (typeof precio !== "number" || precio <= 0) {
            return res.status(400).json({ error: "EL precio debe ser un numero positivo mayor a 0." });
        }

        if (typeof cantidad !== "number" || cantidad <= 0 || !Number.isInteger(cantidad)) {
            return res.status(400).json({ error: "La cantidad debe ser un numero positivo mayor a 0." });
        }

        const nombreLimpio = nombre.trim();

        const productoExistente = await prisma.carrito.findFirst({ where: { nombre: nombreLimpio } });

        if (productoExistente) {
            const productoActualizado = await prisma.carrito.update({
                where: { id: productoExistente.id },
                data: { cantidad: { increment: cantidad } },
            });
            return res.status(200).json({ message: "El carrito existe. Cantidad actualizada.", productoActualizado });
        }

        const nuevo = await prisma.carrito.create({ data: { nombre: nombreLimpio, precio, cantidad } });

        return res.status(201).json({ message: "Creado correctamente.", nuevo });

    } catch (error) {
        return res.status(500).json({ error: "Error interno del servidor al crear el carrito." });
    }
};

//Actualizar
export const actualizarCantidad = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { cantidadSumar } = req.body;

        if (isNaN(id)) {
            return res.status(400).json({ error: "El parametro id debe ser un entero positivo mayor que 0." });
        }
        if (typeof cantidadSumar !== "number" || cantidadSumar <= 0 || !Number.isInteger(cantidadSumar)) {
            return res.status(400).json({ error: "La cantidad debe ser un numero entero positivo mayor a 0." });
        }

        const carrito = await prisma.carrito.findUnique({ where: { id: id } });

        if (!carrito) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        const carritoActualizado = await prisma.carrito.update({ where: { id }, data: { cantidad: { increment: cantidadSumar } } });

        return res.status(200).json({ message: "Cantidad actualizada", carritoActualizado });
    } catch (error) {
        return res.status(500).json({ error: "Error interno del servidor al actualizar la cantidad." });
    }
};

//Eliminar
export const eliminarCarrito = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: "El parametro id debe ser un entero positivo mayor que 0." });
        }
        const carrito = await prisma.carrito.findUnique({ where: { id: id } });

        if (!carrito) {
            return res.status(404).json({ error: "Carrito no encontrado." });
        }

        const carritoEliminado = await prisma.carrito.delete({ where: { id: id } });
        return res.json({ message: "Carrito eliminado", carritoEliminado });
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor al eliminar el carrito." });
    }
};

//Total
export const totalCarrito = async (req, res) => {
    try {
        const producto = await prisma.carrito.findMany({ select: { precio: true, cantidad: true } });

        if (producto.length === 0) {
            return res.status(404).json({ error: "No hay productos en el carrito." });
        }

        const total = producto.reduce((acc, productos) => acc + productos.precio * productos.cantidad, 0);

        return res.status(200).json({ total: Number(total.toFixed(2)) });
    } catch (error) {
        return res.status(500).json({ error: "Error interno del servidor para mostrar el total" });
    }
};

//Descuento 
export const descuentoCarrito = async (req, res) => {
    try {
        const { descuento } = req.body;

        if (typeof descuento !== "number" || descuento <= 0) {
            return res.status(400).json({ error: "El porcentaje debe ser un numero positivo mayor a 0." });
        }
        if (descuento > 50) {
            return res.status(400).json({ error: "El descuento maximo permitido es del 50%." });
        }

        const producto = await prisma.carrito.findMany({ select: { precio: true, cantidad: true } })

        if (producto.length === 0) {
            return res.status(404).json({ error: "No hay productos en el carrito para aplicar descuento." });
        }

        const montoOriginal = producto.reduce((acc, productos) => acc + productos.precio * productos.cantidad, 0)
        const montoDescuento = (montoOriginal * descuento) / 100;
        const totalConDescuento = montoOriginal - montoDescuento;

        return res.status(200).json({ totalOriginal: Number(montoOriginal.toFixed(2)), totalConDescuento: Number(totalConDescuento.toFixed(2)) });
    } catch (error) {
        return res.status(500).json({ error: "Error interno del servidor para hacer el descuento" });
    }
};