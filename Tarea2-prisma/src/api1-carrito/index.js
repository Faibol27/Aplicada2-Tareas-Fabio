import "dotenv/config";
import express from "express";

import carritoRoutes from "./routes/Carrito.routes.js"

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.use("/carrito", carritoRoutes);

app.listen(PORT, () => {
    console.log(`Servidor en el puerto ${PORT}`);
})