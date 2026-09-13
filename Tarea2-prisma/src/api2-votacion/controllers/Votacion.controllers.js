import { prisma } from "../db.js"

//Listar
export const obtenerEncuestas = async (req, res) => {
    try {
        const encuestas = await prisma.encuestas.findMany({ include: { opciones: true } });
        return res.json(encuestas);
    } catch (error) {
        return res.status(500).json({ error: "Error interno del servidor al mostrar las encuestas." });
    }
};

//Crear
export const crearEncuesta = async (req, res) => {
    try {
        const { pregunta, opciones } = req.body;

        if (!pregunta || typeof pregunta !== "string" || pregunta.trim() === "") {
            return res.status(400).json({ error: "La pregunta es obligatoria y no puede estar vacia." });
        }

        if (!Array.isArray(opciones) || opciones.length < 2) {
            return res.status(400).json({ error: "La opciones son obligatorias y no pueden ser menos de dos." });
        }

        const opcionesInvalidas = opciones.some((op) => typeof op !== "string" || op.trim() === "");

        if (opcionesInvalidas) {
            return res.status(400).json({ error: "La opciones deben ser texto y no pueden estar vacias" });
        }

        const opcionesValidas = opciones.map((op) => op.trim());
        const opcionesUnicas = new Set(opcionesValidas.map((op) => op.toLowerCase()));

        if (opcionesUnicas.size !== opcionesValidas.length) {
            return res.status(400).json({ error: "Las opciones no pueden estar repetidas." });
        }

        const nuevaEncuestas = await prisma.encuestas.create({
            data: {
                pregunta: pregunta.trim(),
                opciones: {
                    create: opcionesValidas.map((texto) => ({ texto })),
                },
            },
            include: { opciones: true }
        });

        return res.status(201).json({ message: "Encuesta creada", nuevaEncuestas });

    } catch (error) {
        return res.status(500).json({ error: "Error interno del servidor al crear la encuesta." });
    }
};

//Votar
export const votarOpcion = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { opcion } = req.body;

        if (isNaN(id)) {
            return res.status(400).json({ error: "El ID de la encuesta debe ser un numero entero valido." });
        }

        if (!opcion || typeof opcion !== "string" || opcion.trim() === "") {
            return res.status(400).json({ error: "La opcion debe es obligatoria y no debe estar vacia." });
        }

        const buscarEncuesta = await prisma.encuestas.findUnique({ where: { id: id } });

        if (!buscarEncuesta) {
            return res.status(404).json({ error: "Encuesta no encontrada." });
        }
        const opcionLimpia = opcion.trim();
        const opcionValida = await prisma.opcion.findFirst({
            where: {
                encuestaId: id,
                texto: {
                    equals: opcionLimpia,
                    mode: "insensitive",
                },
            }
        });

        if (!opcionValida) {
            return res.status(404).json({ error: "La opcion ingresada no existe." });
        }

        const votosActualizados = await prisma.opcion.update({
            where: { id: opcionValida.id }, data: {
                votos: { increment: 1 }
            },
        });

        return res.json({ message: "Voto exitoso", votosActualizados });

    } catch (error) {
        return req.status(500).json({ error: "Error interno del servidor al realizar el voto." });
    }
};

//Resultados
export const resultadosEncuesta = async (req, res) => {

}

//Eliminar 
export const eliminarEncuesta = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id) || id <= 0) {
            return res.status(400).json({ error: "El ID de la encuesta debe ser un numero entero valido." });
        }

        const encuesta = await prisma.encuestas.findFirst({ where: { id } });
        if (!encuesta) {
            return res.status(404).json({ error: "Encuesta no encontrada." });
        }

        const encuestaEliminada = await prisma.encuestas.delete({ where: { id }, include: { opciones: true } });

        return res.json({ message: "Encuesta eliminada.", encuestaEliminada });

    } catch (error) {
        return res.status(500).json({ error: "Error interno del servidor al eliminar la encuesta." });
    }
};
