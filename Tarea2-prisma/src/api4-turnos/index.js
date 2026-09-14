import "dotenv/config";
import express from "express"

import turnosRoutes from "./routes/Turnos.routes.js"

const PORT = process.env.PORT || 3000
const app = express();

app.use(express.json());

app.use("/turnos", turnosRoutes);

app.listen(PORT, () => {
    console.log("Servidor en el puerto 3000");
});