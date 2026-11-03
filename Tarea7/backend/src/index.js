import "dotenv/config"
import express from "express"
import authRoutes from "./routes/auth.route.js"
import serviciosRoutes from "./routes/servicios/servicios.route.js"
import reservasRoutes from "./routes/reservas/reservas.route.js"
import usuarioRoutes from "./routes/usuarios.route.js"

const app = express();
const PORT = process.env.PORT || 3000

app.use(express.json());

app.use("/auth", authRoutes)
app.use("/servicios", serviciosRoutes)
app.use("/reservas", reservasRoutes)
app.use("/usuarios", usuarioRoutes)

app.listen(PORT, () => {
    console.log(`Servidor ${PORT}`);
});