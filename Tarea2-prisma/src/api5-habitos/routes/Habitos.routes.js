import { Router } from "express";
import { crearHabito, eliminarHabito, listarHabitos, obtenerEstadisticasHabito, registrarHabitoHoy, } from "../controllers/habitos.controllers.js";

const router = Router();

router.post("/", crearHabito);
router.get("/", listarHabitos);
router.post("/:id/registrar", registrarHabitoHoy);
router.get("/:id/estadisticas", obtenerEstadisticasHabito);
router.delete("/:id", eliminarHabito);

export default router;