import "dotenv/config";
import express from "express";
import habitosRoutes from "./routes/Habitos.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/habitos", habitosRoutes);

app.listen(PORT, () => {
  console.log(`Servidor de Hábitos escuchando en el puerto ${PORT}`);
});