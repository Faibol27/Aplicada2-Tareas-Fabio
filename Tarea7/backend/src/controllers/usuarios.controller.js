import { prisma } from "../db.js";

export const actualizarPerfil = async (req, res) => {
  try {
    const { nombre } = req.body;
    if (!nombre || !nombre.trim()) {
      return res.status(400).json({ error: "El nombre es obligatorio." });
    }
    const usuarioId = req.usuario.id;
    const usuarioActualizado = await prisma.usuario.update({
      where: { id: usuarioId },
      data: { nombre: nombre.trim() },
      select: { id: true, nombre: true, email: true, rol: true },
    });
    res.json(usuarioActualizado);
  } catch (error) {
    res.status(500).json({ error: "No pudimos actualizar el perfil." });
  }
};