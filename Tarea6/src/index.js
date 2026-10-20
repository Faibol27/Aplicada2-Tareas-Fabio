import "dotenv/config"
import express from "express"
import cors from "cors"
import authRoutes from "./routes/auth.route.js"
import serviciosRoutes from "./routes/servicios/servicios.route.js"

const app = express();
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json());

app.use("/auth", authRoutes)
app.use("/servicios", serviciosRoutes)

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor en el puerto ${PORT}`);
});