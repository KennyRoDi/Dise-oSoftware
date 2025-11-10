import express from "express";
import cors from "cors";
import fs from "fs/promises"; 
import path from "path";

const __dirname = path.dirname(new URL(import.meta.url).pathname.substring(1)); 
const DB_PATH = path.join(__dirname, "db.json");
const PORT = 3001; // Puerto para el microservicio

const app = express();

app.use(cors());
app.use(express.json());



const readDb = async () => {
  try {
    const data = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      await writeDb({ solicitudes: [] });
      return { solicitudes: [] };
    }
    console.error("Error leyendo la BD:", error);
    throw error;
  }
};

const writeDb = async (data) => {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
};


//
app.get("/api/solicitudes", async (req, res) => {
  try {
    const db = await readDb();
    res.status(200).json(db.solicitudes);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las solicitudes" });
  }
});

//[POST] /api/solicitudes
app.post("/api/solicitudes", async (req, res) => {
  try {
    const solicitudRecibida = req.body;

    const nuevaSolicitud = {
      ...solicitudRecibida,
      id: Date.now().toString(), // El backend debe generar el ID
      estado: "pendiente", // El backend debe asignar el estado inicial 
    };

    const db = await readDb();
    db.solicitudes.push(nuevaSolicitud);
    await writeDb(db);

    res.status(201).json(nuevaSolicitud);
  } catch (error) {
    console.error("Error al guardar solicitud:", error);
    res.status(500).json({ message: "Error al guardar la solicitud" });
  }
});

// --- Iniciar Servidor ---
app.listen(PORT, () => {
  console.log(
    `Microservicio 'microservice-js' corriendo en http://localhost:${PORT}`
  );
});
