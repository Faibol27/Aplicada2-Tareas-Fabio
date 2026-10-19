import { Router } from 'express';
import { actualizarServicio, crearServicio, eliminarServicio, obtenerServicios } from '../../controllers/servicios/servicios.controller.js';
import { soloAdmin, verficarToken } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get("/", obtenerServicios);
router.post("/", verficarToken, soloAdmin, crearServicio);
router.put("/:id", verficarToken, soloAdmin, actualizarServicio)
router.delete("/:id", verficarToken, soloAdmin, eliminarServicio)

export default router;