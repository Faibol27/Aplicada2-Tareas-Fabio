import { Router } from "express";
import { verficarToken } from "../middlewares/auth.middleware.js";
import { actualizarPerfil } from "../controllers/usuarios.controller.js";

const router = Router();
router.put("/perfil", verficarToken, actualizarPerfil);
export default router;