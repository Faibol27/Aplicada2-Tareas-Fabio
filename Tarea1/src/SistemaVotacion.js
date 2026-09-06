const express = require("express");
const app = express();

app.use(express.json());

app.listen(3000, () => {
    console.log("El servidor esta en el puerto 3000");
});

let encuestas = [];
let nextid = 1;

//ListarEncuestas
app.get("/Encuestas", (re, res, next) => {
    res.json(encuestas);
    next();
});

//CrearEncuestas
app.post("/CrearEncuestas", (req, res, next) => {
    const { pregunta, opciones } = req.body;

    if (!pregunta || typeof pregunta !== "string" || pregunta.trim() === "") {
        return res.status(400).json({ error: "La pregunta es obligatoria y no puede estar vacia." });
    }
    if (!Array.isArray(opciones) || opciones.length < 2) {
        return res.status(400).json({ error: "Las opciones son obligatoria y deben ser mas de 2." });
    }

    const opcionesLimpias = opciones.map(op => (typeof op === 'string' ? op.trim() : ''));
    const opcionesUnicas = new Set(opcionesLimpias.map(op => op.toLowerCase()));

    if (opcionesUnicas.size !== opcionesLimpias.length) {
        return res.status(400).json({ error: 'Las opciones no pueden estar repetidas.' });
    }

    const nuevaEncuesta = {
        id: nextid++,
        pregunta: pregunta,
        opciones: opciones.map(texto => ({ texto: texto.trim(), votos: 0 }))
    };

    encuestas.push(nuevaEncuesta);

    res.status(201).json({ message: "Encuesta creada correctamente.", encuesta: nuevaEncuesta })
    next();
});

//Votar
app.post("/Encuestas/:id/votar", (req, res, next) => {
    const id = parseInt(req.params.id);
    const { opcion } = req.body;

    if (isNaN(id)) {
        return res.status(400).json({ error: "El ID de la encuesta debe ser un numero entero valido." });
    }
    if (!opcion || typeof opcion !== "string" || opcion.trim() === "") {
        return res.status(400).json({ error: "Debes enviar la opcion elegida." });
    }

    const encuesta = encuestas.find(e => e.id === id);

    if (!encuesta) {
        return res.status(404).json({ error: "Encuesta no encontrada." });
    }

    const opcionElegida = encuesta.opciones.find(e => e.texto.toLowerCase() === opcion.trim().toLocaleLowerCase());

    if (!opcionElegida) {
        return res.status(404).json({ error: `La opcion "${opcion}" no existe en la encuesta. Opciones validad ${encuesta.opciones.map(e => e.texto).join(", ")} ` });
    }

    opcionElegida.votos++;

    res.json({ message: "Votacion registrada", opcionVotada: opcionElegida.texto, totalVotosOpcion: opcionElegida.votos });
    next();
});

//Resultados
app.get("/Encuestas/:id/resultados", (req, res, next) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ error: "El ID de la encuesta debe ser un numero entero valido." });
    }

    const encuesta = encuestas.find(e => e.id === id);
    if (!encuesta) {
        return res.status(404).json({ error: "Encuesta no encontrada" });
    }
    const totalVotos = encuesta.opciones.reduce((acc, item) => acc + item.votos, 0);

    const resultados = encuesta.opciones.map(e => {
        const porcentaje = totalVotos === 0 ? 0 : (e.votos / totalVotos) * 100;
        return {
            opcion: e.texto,
            votos: e.votos,
            porcentaje: `${porcentaje.toFixed(2)}`
        };
    });

    let ganador = null;

    if (totalVotos === 0) {
        ganador = "Aun no hay votos registrados.";
    } else {

        const maxVotos = Math.max(...encuesta.opciones.map(e => e.votos));
        const candidato = encuesta.opciones.filter(e => e.votos === maxVotos);

        if (candidato.length > 1) {
            ganador = `Empate entre: ${candidato.map(c => c.texto).join(', ')} (${maxVotos} votos)`;
        } else if (candidato.length === 1) {
            ganador = `${candidato[0].texto} (${maxVotos} votos)`;
        } else {
            ganador = "No se pudo determinar un ganador.";
        }
    }

    res.json({ id: encuesta.id, pregunta: encuesta.pregunta, totalVotos: totalVotos, ganador: ganador, resultados });
    next();
});

//EliminarEncuestas
app.delete("/EliminarEncuesta/:id", (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        res.status(400).json({ error: "El ID de la encuesta debe ser un numero entero valido." });
    }

    const indice = encuestas.find(e => e.id === id);

    if (indice === -1) {
        return res.status(404).json({ error: "Encuesta no encontrada." }); 5
    }

    const [encuestaEliminada] = encuestas.splice(indice, 1);

    res.json({ message: 'Encuesta eliminada exitosamente.', encuesta: encuestaEliminada });
})