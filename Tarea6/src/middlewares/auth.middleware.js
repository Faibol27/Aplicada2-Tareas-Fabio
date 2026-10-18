import jwt from "jsonwebtoken";

export const verficarToken = async (req, res, next) => {
    const authToken = req.headers["authorization"];
    if (!authToken) return res.status(401).json({ Error: "Token requerido" });

    const token = authToken.split(" ")[1];
    if (!token) return res.status(401).json({ Error: "Token requerido" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded
        next()
    } catch (error) {
        res.status(401).json({ Error: "Token invalido" });
    }
}

export const soloAdmin = async (req, res, next) => {
    if (req.usuario.rol !== "admin") {
        return res.status(403).json({ Error: "Acceso denegado" });
    }
    next();
}