import "dotenv/config";
import express from "express";

import carritoRoutes from "./routes/Votacion.routes.js"

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.use("/encuestas", carritoRoutes);

app.listen(PORT, () => {
    console.log(`Servidor en el puerto ${PORT}`);
})