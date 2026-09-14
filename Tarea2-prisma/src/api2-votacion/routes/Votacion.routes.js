import { Router } from "express"

import { obtenerEncuestas, crearEncuesta, votarOpcion, eliminarEncuesta } from "../controllers/Votacion.controllers.js"
const router = Router();

router.get("/", obtenerEncuestas);
router.post("/", crearEncuesta);
router.post("/:id", votarOpcion);
router.delete("/:id", eliminarEncuesta);

export default router;