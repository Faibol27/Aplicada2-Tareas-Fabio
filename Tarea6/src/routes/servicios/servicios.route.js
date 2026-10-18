import { Router } from 'express';
import { actualizarServicio, crearServicio, eliminarServicio, obtenerServicios } from '../../controllers/servicios/servicios.controller';

const router = Router();

router.get("/", obtenerServicios);
router.post("/", crearServicio);
router.put("/:id", actualizarServicio)
router.delete("/:id", eliminarServicio)

export default router;