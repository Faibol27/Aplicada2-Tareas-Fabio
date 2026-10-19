import { prisma } from "../../db.js";

// Obtener Servicios
export const obtenerServicios = async (req, res, next) => {
    try {
        const lista = await prisma.servicio.findMany();
        res.status(200).json(lista);
    } catch (error) {
        next(error);
    }
}

//Crear Servicio
export const crearServicio = async (req, res, next) => {
    try {
        const { nombre, descripcion, duracion, precio } = req.body;

        if (!nombre || typeof nombre !== "string" || nombre.trim() === "")
            return res.status(400).json({ Error: "El nombre es obligatorio" });

        if (!descripcion || typeof descripcion !== "string" || descripcion.trim() === "")
            return res.status(400).json({ Error: "La descripcion es obligatoria" });

        if (typeof duracion !== "number" || duracion <= 0)
            return res.status(400).json({ Error: "La duracion debe ser un numero entero positivo" });

        if (typeof precio !== "number" || precio <= 0)
            return res.status(400).json({ Error: "El precio es obligatorio" });

        const existe = await prisma.servicio.findFirst({ where: { nombre } });
        if (existe)
            return res.status(400).json({ Error: "Este servicio ya existe" });

        const nuevoServicio = await prisma.servicio.create({ data: { nombre: nombre, descripcion: descripcion, duracion: duracion, precio: precio } });
        res.status(201).json({ nuevoServicio });
    } catch (error) {
        next(error)
    }
}

//Actualizar Servicio
export const actualizarServicio = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const { nombre, descripcion, duracion, precio } = req.body;

        if (!nombre || typeof nombre !== "string" || nombre.trim() === "")
            return res.status(400).json({ Error: "El nombre es obligatorio" });

        if (!descripcion || typeof descripcion !== "string" || descripcion.trim() === "")
            return res.status(400).json({ Error: "La descripcion es obligatoria" });

        if (typeof duracion !== "number" || duracion <= 0)
            return res.status(400).json({ Error: "La duracion debe ser un numero entero positivo" });

        if (typeof precio !== "number" || precio <= 0)
            return res.status(400).json({ Error: "El precio es obligatorio" });

        const buscarServicio = await prisma.servicio.findFirst({ where: { id } });
        if (!buscarServicio)
            return res.status(404).json({ Error: "Este servicio no existe" });


        const existe = await prisma.servicio.findFirst({ where: { nombre, NOT: { id } } });
        if (existe)
            return res.status(400).json({ Error: "Este servicio ya existe" });


        const servicioActualizado = await prisma.servicio.update({ where: { id }, data: { nombre: nombre, descripcion: descripcion, duracion: duracion, precio: precio } });
        res.status(200).json({ servicioActualizado });

    } catch (error) {
        next(error)
    }
}

//Eliminar Servicio
export const eliminarServicio = async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        const buscarServicio = await prisma.servicio.findUnique({ where: { id } });
        if (!buscarServicio)
            return res.status(404).json({ Error: "Este servicio no existe" });

        const servicioEliminado = await prisma.servicio.delete({ where: { id } })
        res.status(200).json({ servicioEliminado });
    } catch (error) {
        next(error)
    }
}