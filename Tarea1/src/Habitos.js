const express = require("express");
const app = express();

app.use(express.json());

app.listen(3000, () => {
    console.log("El servidor esta en el puerto 3000");
});

let habitos = [];
let nextid = 1;

//ListarHabitos
app.get("/Habitos", (req, res, next) => {
    res.json(habitos);
    next();
});

//CrearHabito
app.post("/CrearHabito", (req, res, next) => {
    const { nombre, meta } = req.body;

    if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
        return res.status(400).json({ error: "El nombre del habito es obligatorio." });
    }

    if (!meta || typeof meta !== "string" || meta.trim() === "") {
        return res.status(400).json({ error: "La meta del habito es obligatoria." });
    }

    const nuevoHabito = {
        id: nextid++,
        nombre: nombre,
        meta: meta,
        registros: []
    };

    habitos.push(nuevoHabito);
    res.status(201).json({ message: "Habito creado correctamente.", habito: nuevoHabito });
    next();
});

//RegistrarDia
app.post("/RegistrarHabito/:id", (req, res, next) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ error: "El ID proporcionado no es valido." });
    }

    const habito = habitos.find(h => h.id === id);

    if (!habito) {
        return res.status(404).json({ error: "Habito no encontrado." });
    }

    const fechaHoy = new Date().toISOString().split("T")[0];
    const yaRegistrado = habito.registros.find(r => r.fecha === fechaHoy);

    if (yaRegistrado) {
        return res.status(400).json({ error: "Este habito ya fue registrado el dia de hoy." });
    }

    const nuevoRegistro = {
        fecha: fechaHoy,
        completado: true
    };

    habito.registros.push(nuevoRegistro);

    res.json({ message: "Habito completado hoy exitosamente.", habito: habito });
    next();
});

//EstadisticasHabito
app.get("/EstadisticasHabito/:id", (req, res, next) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ error: "El ID proporcionado no es valido." });
    }

    const habito = habitos.find(h => h.id === id);

    if (!habito) {
        return res.status(404).json({ error: "Habito no encontrado." });
    }

    const registrosCompletados = habito.registros.filter(r => r.completado);

    if (registrosCompletados.length === 0) {
        res.json({
            habito: habito.nombre,
            totalCompletados: 0,
            rachaActual: 0,
            mejorRacha: 0,
            porcentajeCumplimiento: "0%"
        });
        return next();
    }

    registrosCompletados.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    let mejorRacha = 1;
    let rachaTemp = 1;

    for (let i = 1; i < registrosCompletados.length; i++) {
        const fechaAnterior = new Date(registrosCompletados[i - 1].fecha);
        const fechaActual = new Date(registrosCompletados[i].fecha);
        const diferenciaDias = Math.round((fechaActual - fechaAnterior) / (1000 * 60 * 60 * 24));

        if (diferenciaDias === 1) {
            rachaTemp++;
        } else {
            rachaTemp = 1;
        }

        if (rachaTemp > mejorRacha) {
            mejorRacha = rachaTemp;
        }
    }

    const hoy = new Date();
    const fechaHoy = hoy.toISOString().split("T")[0];
    const fechas = new Set(registrosCompletados.map(r => r.fecha));

    let rachaActual = 0;
    let fechaCheck = new Date(hoy);

    if (!fechas.has(fechaHoy)) {
        fechaCheck.setDate(fechaCheck.getDate() - 1);
    }

    while (true) {
        const fechaStr = fechaCheck.toISOString().split("T")[0];
        if (fechas.has(fechaStr)) {
            rachaActual++;
            fechaCheck.setDate(fechaCheck.getDate() - 1);
        } else {
            break;
        }
    }

    const primerDia = new Date(registrosCompletados[0].fecha);
    const diasTranscurridos = Math.max(1, Math.round((hoy - primerDia) / (1000 * 60 * 60 * 24)) + 1);
    const porcentaje = ((registrosCompletados.length / diasTranscurridos) * 100).toFixed(2);

    res.json({
        id: habito.id,
        nombre: habito.nombre,
        meta: habito.meta,
        totalCompletados: registrosCompletados.length,
        diasDesdeInicio: diasTranscurridos,
        rachaActual: rachaActual,
        mejorRacha: mejorRacha,
        porcentajeCumplimiento: `${porcentaje}%`
    });
    next();
});

//EliminarHabito
app.delete("/EliminarHabito/:id", (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ error: "El ID proporcionado no es valido." });
    }

    const indice = habitos.findIndex(h => h.id === id);

    if (indice === -1) {
        return res.status(404).json({ error: "Habito no encontrado." });
    }

    const eliminado = habitos.splice(indice, 1)[0];

    res.json({ message: "Habito eliminado correctamente.", habito: eliminado });
});