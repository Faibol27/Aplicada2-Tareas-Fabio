import "dotenv/config"
import express from "express"
import authRoutes from "./routes/auth.route.js"
import serviciosRoutes from "./routes/servicios/servicios.route.js"

const app = express();
const PORT = process.env.PORT || 3000

app.use(express.json());

app.use("/auth", authRoutes)
app.use("/servicios", serviciosRoutes)

app.listen(PORT, () => {
    console.log(`Servidor en el puerto ${PORT}`);
});