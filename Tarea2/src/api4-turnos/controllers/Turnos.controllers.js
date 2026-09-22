import { prisma } from "../db.js";

export const obtenerTurnos = async (req, res) => {
    try {
        const turnos = await prisma.turnos.findMany();
        return res.json(turnos);
    } catch (error) {
        return res.status(500).json({ error: "Error interno al obtener los turnos." });
    }
};

// CrearTurnos
export const crearTurno = async (req, res) => {
    try {
        const { cliente, servicio } = req.body;

        if (!cliente || typeof cliente !== "string" || cliente.trim() === "") {
            return res.status(400).json({ error: "El nombre del cliente es obligatorio." });
        }

        if (!servicio || typeof servicio !== "string" || servicio.trim() === "") {
            return res.status(400).json({ error: "El servicio del cliente es obligatorio." });
        }

        const nuevoTurno = await prisma.turnos.create({
            data: {
                cliente: cliente.trim(),
                servicio: servicio.trim(),
                estado: "Esperando",
            },
        });

        return res.status(201).json({ message: "Turno creado correctamente", turnos: nuevoTurno });
    } catch (error) {
        return res.status(500).json({ error: "Error interno al crear el turno." });
    }
};

// SiguienteTurno
export const obtenerSiguienteTurno = async (req, res) => {
    try {
        const siguiente = await prisma.turnos.findFirst({
            where: { estado: "Esperando" },
            orderBy: { id: "asc" },
        });

        if (!siguiente) {
            return res.status(200).json({ message: "No hay nadie esperando.", siguiente: null });
        }

        return res.json({ message: "siguiente cliente en turno.", siguiente, });
    } catch (error) {
        return res.status(500).json({ error: "Error interno al consultar el turno." });
    }
};

// LlamarSiguiente
export const llamarTurno = async (req, res) => {
    try {
        const turnoActivo = await prisma.turnos.findFirst({
            where: { estado: "Atendiendo" },
        });

        if (turnoActivo) {
            return res.status(400).json({ error: "Ya hay un turno en proceso por favor espere." });
        }

        const siguienteTurno = await prisma.turnos.findFirst({
            where: { estado: "Esperando" },
            orderBy: { id: "asc" },
        });

        if (!siguienteTurno) {
            return res.status(404).json({ error: "No hay turnos en la cola de espera." });
        }

        const turnoActualizado = await prisma.turnos.update({
            where: { id: siguienteTurno.id },
            data: { estado: "Atendiendo" },
        });

        return res.json({ message: `Llamando al siguiente cliente ${turnoActualizado.cliente}`, turno: turnoActualizado });
    } catch (error) {
        return res.status(500).json({ error: "Error interno al llamar el turno." });
    }
};

// FinalizarTurno
export const finalizarTurno = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);

        if (isNaN(id)) {
            return res.status(400).json({ error: "El ID proporcionado no es válido." });
        }

        const turno = await prisma.turnos.findUnique({ where: { id }, });

        if (!turno) {
            return res.status(404).json({ error: "Turno no encontrado." });
        }

        if (turno.estado === "Finalizado") {
            return res.status(400).json({ error: "Este turno ya había sido finalizado." });
        }

        if (turno.estado !== "Atendiendo") {
            return res.status(400).json({
                message: "El turno actual todavia no esta siendo atendido",
            });
        }

        const turnoFinalizado = await prisma.turnos.update({
            where: { id },
            data: { estado: "Finalizado" },
        });

        return res.json({ message: "Turno finalizado.", turno: turnoFinalizado });
    } catch (error) {
        return res.status(500).json({ error: "Error interno al finalizar el turno." });
    }
};

// ListaEspera
export const obtenerListaEspera = async (req, res) => {
    try {
        const espera = await prisma.turnos.findMany({
            where: { estado: "Esperando" }
        });

        return res.json({ totalEnEspera: espera.length, turnos: espera });
    } catch (error) {
        return res.status(500).json({ error: "Error interno al obtener la lista de espera." });
    }
};