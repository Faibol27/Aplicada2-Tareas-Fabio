const express = require("express");
const app = express();

app.use(express.json());

app.listen(3000, () => {
    console.log("El servidor esta en el puerto 3000");
});

let turnos = [];
let nextid = 1;

//ListarTurnos
app.get("/Turnos", (req, res, next) => {
    res.json(turnos);
    next();
});

//CrearTurnos
app.post("/CrearTurnos", (req, res, next) => {
    const { cliente, servicio } = req.body;

    if (!cliente || typeof cliente !== "string" || cliente.trim() === "") {
        res.status(400).json({ error: "El nombre del cliente es obligatorio." });
    }

    if (!servicio || typeof servicio !== "string" || servicio.trim() === "") {
        res.status(400).json({ error: "El servicio del cliente es obligatorio." });
    }

    const nuevoTurno = {
        id: nextid++,
        cliente: cliente,
        servicio: servicio,
        estado: "Esperando"
    }

    turnos.push(nuevoTurno);
    res.json({ message: "Turno creado correctamente", turno: nuevoTurno });
    next();
});

//SiguienteTurno
app.get("/SiguienteTurno", (req, res, next) => {
    const siguiente = turnos.find(s => s.estado === "Esperando")

    if (!siguiente) {
        res.status(200).json({ message: "No hay nadie esperando.", siguiente: null });
    }

    res.json({ message: "siguiente cliente en turno.", siguiente: siguiente });
    next();
});

//LlamarSiguiente
app.put("/LlamarTurno", (req, res, next) => {
    const turnoActivo = turnos.find(e => e.estado === "Atendiendo");

    if (turnoActivo) {
        res.status(400).json({ error: "Ya hay un turno en proceso por favor espere." });
    }

    const siguienteTurno = turnos.find(e => e.estado === "Esperando");

    if (!siguienteTurno) {
        res.status(404).json({ error: "No hay turnos en la cola de espera." });
    }

    siguienteTurno.estado = "Atendiendo";

    res.json({ message: `Llamando al siguiente cliente ${siguienteTurno.cliente}`, turno: siguienteTurno });
    next();
});

//FinalizarTurno
app.put("/FinalizarTurno/:id", (req, res, next) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ error: "El ID proporcionado no es válido." });
    }

    const turno = turnos.find(e => e.id === id);

    if (!turno) {
        return res.status(404).json({ error: "Turno no encontrado." });
    }
    if (turno.estado === "Finalizado") {
        return res.status(400).json({ error: "Este turno ya había sido finalizado." });
    }

    if (turno.estado === "Atendiendo") {
        turno.estado = "Finalizado";
    }
    else {
        res.json({ message: "El turno actual todavia no esta siendo atendido" });
    }

    res.json({ message: "Turno finalizado.", turno });
    next();
});

//Lista de espera
app.get("/ListaEspera", (req, res) => {

    const espera = turnos.filter(e => e.estado === "Esperando");

    res.json({ totalEnEspera: espera.length, turnos: espera });
});