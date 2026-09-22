import { Router } from "express";
import {
    obtenerCarritos, crearCarritos, actualizarCantidad, eliminarCarrito, totalCarrito, descuentoCarrito
} from "../controllers/Carrito.controller.js"

const router = Router();

router.get("/", obtenerCarritos);
router.post("/", crearCarritos);
router.put("/:id", actualizarCantidad);
router.delete("/:id", eliminarCarrito);
router.get("/total", totalCarrito)
router.post("/descuento", descuentoCarrito)

export default router;