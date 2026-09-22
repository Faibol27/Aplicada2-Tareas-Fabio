import { Router } from "express";
import { crearTurno, finalizarTurno, llamarTurno, obtenerListaEspera, obtenerSiguienteTurno, obtenerTurnos } from "../controllers/Turnos.controllers.js";

const router = Router();

router.get("/", obtenerTurnos);
router.post("/", crearTurno);
router.get("/siguiente", obtenerSiguienteTurno);
router.put("/llamar", llamarTurno);
router.put("/:id/finalizar", finalizarTurno);
router.get("/espera", obtenerListaEspera);

export default router;

