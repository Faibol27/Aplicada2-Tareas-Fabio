import { prisma } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Crear Usuario
export const crearUsuario = async (req, res, next) => {
    try {
        const { nombre, email, password, rol } = req.body;

        if (!nombre || typeof nombre !== "string" || nombre.trim() === "")
            return res.status(400).json({ Error: "El nombre es obligatorio" });

        if (!email || typeof email !== "string" || email.trim() === "")
            return res.status(400).json({ Error: "El email es obligatorio" });

        if (!password || typeof password !== "string" || password.trim() === "")
            return res.status(400).json({ Error: "La contraseña es obligatoria" });

        const existe = await prisma.usuario.findUnique({ where: { email } });
        if (existe)
            return res.status(400).json({ Error: "Email en uso" });

        const hash = await bcrypt.hash(password, 10)
        const nuevoUsuario = await prisma.usuario.create({ data: { nombre: nombre, email: email, password: hash, rol: rol || "usuario" } });
        res.status(201).json({ Exito: "Usuario creado correctamente", id: nuevoUsuario.id, nombre: nuevoUsuario.nombre, email: nuevoUsuario.email, rol: nuevoUsuario.rol });

    } catch (error) {
        next(error);
    }
}

// Iniciar Session
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const usuario = await prisma.usuario.findUnique({ where: { email } });
        if (!usuario)
            return res.status(401).json({ Error: "Email o contraseña invalidos" });

        const validarPassword = bcrypt.compare(password, usuario.password);
        if (!validarPassword)
            return res.status(401).json({ Error: "Email o contraseña invalidos" });

        const token = jwt.sign(
            { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        )

    } catch (error) {
        next(error);
    }
}