import { prisma } from "../db.js";

//Crear
export const crearHabito = async (req, res) => {
  try {
    const { nombre, meta } = req.body;

    if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
      return res.status(400).json({ error: "El nombre del hábito es obligatorio." });
    }

    if (!meta || typeof meta !== "string" || meta.trim() === "") {
      return res.status(400).json({ error: "La meta diaria es obligatoria." });
    }

    const nuevoHabito = await prisma.habito.create({
      data: {
        nombre: nombre.trim(),
        meta: meta.trim(),
      },
    });

    return res.status(201).json({
      message: "Hábito creado exitosamente",
      habito: nuevoHabito,
    });
  } catch (error) {
    return res.status(500).json({ error: "Error interno del servidor al crear el hábito." });
  }
};

//Listar
export const listarHabitos = async (req, res) => {
  try {
    const habitos = await prisma.habito.findMany({
      include: {
        registros: {
          orderBy: { fecha: "desc" },
        },
      },
    });

    return res.json(habitos);
  } catch (error) {
    return res.status(500).json({ error: "Error interno al listar los hábitos." });
  }
};

// RegistrarHabito
export const registrarHabitoHoy = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "El ID proporcionado no es válido." });
    }

    const habito = await prisma.habito.findUnique({
      where: { id },
    });

    if (!habito) {
      return res.status(404).json({ error: "Hábito no encontrado." });
    }

    const hoy = new Date().toISOString().split("T")[0];

    const registroExistente = await prisma.registro.findFirst({
      where: {
        habitoId: id,
        fecha: hoy,
      },
    });

    if (registroExistente) {
      return res.status(400).json({ error: "No se puede registrar el mismo hábito dos veces en el mismo día.", });
    }

    const nuevoRegistro = await prisma.registro.create({
      data: {
        habitoId: id,
        fecha: hoy,
        completado: true,
      },
    });

    return res.status(201).json({
      message: "Hábito marcado como completado para el día de hoy.",
      registro: nuevoRegistro,
    });
  } catch (error) {
    return res.status(500).json({ error: "Error interno al registrar el hábito." });
  }
};

// Estadisticas
export const obtenerEstadisticasHabito = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "El ID proporcionado no es válido." });
    }

    const habito = await prisma.habito.findUnique({
      where: { id },
      include: {
        registros: {
          where: { completado: true },
          orderBy: { fecha: "asc" },
        },
      },
    });

    if (!habito) {
      return res.status(404).json({ error: "Hábito no encontrado." });
    }

    const registros = habito.registros;
    if (registros.length === 0) {
      return res.json({
        id: habito.id,
        nombre: habito.nombre,
        rachaActual: 0,
        mejorRacha: 0,
        porcentajeCumplimiento: 0,
        totalDiasCumplidos: 0,
      });
    }

    let mejorRacha = 1;
    let rachaTemp = 1;

    for (let i = 1; i < registros.length; i++) {
      const fechaPrevia = new Date(registros[i - 1].fecha);
      const fechaActual = new Date(registros[i].fecha);
      const diffDias = Math.round((fechaActual - fechaPrevia) / (1000 * 60 * 60 * 24));

      if (diffDias === 1) {
        rachaTemp++;
      } else if (diffDias > 1) {
        rachaTemp = 1;
      }
      if (rachaTemp > mejorRacha) {
        mejorRacha = rachaTemp;
      }
    }
    const hoyStr = new Date().toISOString().split("T")[0];
    const hoy = new Date(hoyStr);
    const ultimaFecha = new Date(registros[registros.length - 1].fecha);
    const diffDiasUltimo = Math.round((hoy - ultimaFecha) / (1000 * 60 * 60 * 24));

    let rachaActual = 0;
    if (diffDiasUltimo <= 1) {
      rachaActual = 1;
      for (let i = registros.length - 1; i > 0; i--) {
        const actual = new Date(registros[i].fecha);
        const anterior = new Date(registros[i - 1].fecha);
        const diff = Math.round((actual - anterior) / (1000 * 60 * 60 * 24));

        if (diff === 1) {
          rachaActual++;
        } else {
          break;
        }
      }
    }

    const primerDia = new Date(registros[0].fecha);
    const diasTotalesTranscurridos = Math.max(
      1,
      Math.round((hoy - primerDia) / (1000 * 60 * 60 * 24)) + 1
    );

    const porcentajeCumplimiento = Math.min(
      100,
      parseFloat(((registros.length / diasTotalesTranscurridos) * 100).toFixed(2))
    );

    return res.json({
      id: habito.id,
      nombre: habito.nombre,
      rachaActual,
      mejorRacha,
      porcentajeCumplimiento,
      totalDiasCumplidos: registros.length,
    });
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    return res.status(500).json({ error: "Error interno al calcular estadísticas." });
  }
};

// Eliminar
export const eliminarHabito = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "El ID proporcionado no es válido." });
    }

    const habito = await prisma.habito.findUnique({
      where: { id },
    });

    if (!habito) {
      return res.status(404).json({ error: "Hábito no encontrado." });
    }
    await prisma.registro.deleteMany({
      where: { habitoId: id },
    });

    await prisma.habito.delete({
      where: { id },
    });

    return res.json({ message: "Hábito eliminado correctamente." });
  } catch (error) {
    console.error("Error al eliminar hábito:", error);
    return res.status(500).json({ error: "Error interno al eliminar el hábito." });
  }
};