export const soloAdmin = async (req, res, next) => {
    if (req.usuario.rol !== "admin") {
        return res.status(403).json({ Error: "Acceso denegado" });
    }
    next();
}