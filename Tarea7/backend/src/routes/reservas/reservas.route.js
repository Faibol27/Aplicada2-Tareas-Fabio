import { Router } from 'express';
import { obtenerReservas, obtenerReservasCliente, crearReserva, actualizarReserva, cancelarReserva } from '../../controllers/reservas/reservas.controller.js';
import { verficarToken } from '../../middlewares/auth.middleware.js';
import { soloAdmin } from '../../middlewares/esAdmin.middleware.js';

const router = Router();

router.get('/', verficarToken, soloAdmin, obtenerReservas);
router.get('/cliente', verficarToken, obtenerReservasCliente);
router.post('/', verficarToken, crearReserva);
router.put('/:id', verficarToken, actualizarReserva);
router.delete('/:id', verficarToken, cancelarReserva);

export default router;
