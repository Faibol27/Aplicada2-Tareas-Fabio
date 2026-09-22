import { Router } from "express";
import { alertasInventario, crearInventario, entradaInventario, obtenerInventario, salidaInventario } from "../controllers/Inventario.controllers.js"

const router = Router();

router.get("/", obtenerInventario);
router.post("/", crearInventario);
router.post("/:id", entradaInventario);
router.post("/:id/salida", salidaInventario);
router.get("/alertas",alertasInventario);

export default router;