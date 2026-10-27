import { prisma } from "../../db.js";

// Obtener Reservas Admin (todas)
export const obtenerReservas = async (req, res, next) => {
    try {
        const lista = await prisma.reservas.findMany({ include: { usuario: true, servicio: true } });
        res.status(200).json(lista);
    } catch (error) {
        next(error)
    }
}

// Obtener Reservas Cliente (solo las suyas)
export const obtenerReservasCliente = async (req, res, next) => {
    try {
        const usuarioId = req.usuario.id;
        const lista = await prisma.reservas.findMany({ where: { usuarioId }, include: { servicio: true } });
        res.status(200).json(lista);
    } catch (error) {
        next(error)
    }
}

// Crear Reserva (cliente autenticado, estado siempre pendiente, fecha no pasada)
export const crearReserva = async (req, res, next) => {
    try {
        const usuarioId = req.usuario.id;
        const servicioId = Number(req.body.servicioId);
        const { fecha, hora } = req.body;

        if (isNaN(servicioId) || servicioId <= 0)
            return res.status(400).json({ Error: "id del servicio invalido" });
        if (!fecha || !hora)
            return res.status(400).json({ Error: "La fecha y la hora son obligatorias" });

        const servicioExiste = await prisma.servicio.findUnique({ where: { id: servicioId } });
        if (!servicioExiste)
            return res.status(404).json({ Error: "El servicio no existe" });

        // No se puede reservar una fecha pasada (comparar solo la fecha, sin hora)
        const fechaReserva = new Date(`${fecha}T00:00:00`);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        if (fechaReserva < hoy)
            return res.status(400).json({ Error: "No se puede reservar una fecha pasada" });

        // Formatear hora para Prisma (@db.Time espera ISO-8601: HH:mm:ss)
        const horaFormateada = hora.includes(":") && hora.split(":").length === 2
            ? `${hora}:00`
            : hora;

        // El estado inicial siempre es pendiente
        const nuevaReserva = await prisma.reservas.create({
            data: { fecha: fechaReserva, hora: horaFormateada, estado: "pendiente", usuarioId, servicioId }
        });

        res.status(201).json({ mensaje: "Reserva realizada", nuevaReserva });

    } catch (error) {
        next(error);
    }
}

// Actualizar estado de una reserva
// - Solo el admin puede cambiar a "completada"
// - El cliente solo puede modificar sus propias reservas (ej. cancelar)
export const actualizarReserva = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const { estado } = req.body;

        if (isNaN(id) || id <= 0)
            return res.status(400).json({ error: "id de reserva inválido" });
        if (!estado)
            return res.status(400).json({ error: "El estado es obligatorio" });

        const reservaExistente = await prisma.reservas.findUnique({ where: { id } });
        if (!reservaExistente)
            return res.status(404).json({ error: "Esta reserva no existe" });

        // Solo el admin puede cambiar el estado a completada
        if (estado === "completada" && req.usuario.rol !== "admin") {
            return res.status(403).json({ error: "Solo el administrador puede marcar una reserva como completada" });
        }

        // El cliente solo puede tocar sus propias reservas
        if (req.usuario.rol !== "admin" && reservaExistente.usuarioId !== req.usuario.id) {
            return res.status(403).json({ error: "No puedes modificar esta reserva" });
        }

        const reservaActualizada = await prisma.reservas.update({ where: { id }, data: { estado } });

        return res.status(200).json({
            mensaje: "Reserva actualizada con éxito", reserva: reservaActualizada
        });

    } catch (error) {
        next(error);
    }
}

// Cancelar una reserva (cliente solo puede cancelar las suyas)
export const cancelarReserva = async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id) || id <= 0)
            return res.status(400).json({ error: "id de reserva inválido" });

        const reservaExistente = await prisma.reservas.findUnique({ where: { id } });
        if (!reservaExistente)
            return res.status(404).json({ error: "Esta reserva no existe" });

        // El cliente solo puede cancelar sus propias reservas
        if (req.usuario.rol !== "admin" && reservaExistente.usuarioId !== req.usuario.id) {
            return res.status(403).json({ error: "No puedes cancelar esta reserva" });
        }

        const reservaCancelada = await prisma.reservas.update({ where: { id }, data: { estado: "cancelada" } });

        return res.status(200).json({
            mensaje: "Reserva cancelada con éxito", reserva: reservaCancelada
        });

    } catch (error) {
        next(error);
    }
};
