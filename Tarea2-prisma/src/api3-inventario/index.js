import "dotenv/config";
import express from "express"

import inventario from "./routes/Inventario.routes.js"

const PORT = process.env.PORT || 3000
const app = express();

app.use(express.json());

app.use("/inventario", inventario);

app.listen(PORT, () => {
    console.log("Servidor en el puerto 3000");
});