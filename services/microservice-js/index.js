import express from "express";
import cors from "cors";
import fs from "fs/promises"; // Usamos el módulo de 'File System' con promesas
import path from "path";

// Configuración para obtener la ruta absoluta en ES Modules
const __dirname = path.dirname(new URL(import.meta.url).pathname.substring(1)); // El substring(1) es para Windows
const DB_PATH = path.join(__dirname, "db.json");
const PORT = 3001; // Puerto para el microservicio

const app = express();

// --- Middleware ---
// 1. CORS: Permite que tu frontend Vue (ej. localhost:5173) hable con este backend
app.use(cors());
// 2. JSON Parser: Permite a Express entender el JSON que envía el frontend en el 'body'
app.use(express.json());

// --- Funciones Helpers para la BD ---

/**
 * Lee el archivo db.json y devuelve su contenido parseado.
 */
const readDb = async () => {
  try {
    const data = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // Si el archivo no existe, lo creamos
    if (error.code === "ENOENT") {
      await writeDb({ solicitudes: [] });
      return { solicitudes: [] };
    }
    console.error("Error leyendo la BD:", error);
    throw error;
  }
};

/**
 * Escribe el objeto 'data' en el archivo db.json.
 */
const writeDb = async (data) => {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
};

// --- Rutas de la API (Endpoints) ---

/**
 * [GET] /api/solicitudes
 * Obtiene la lista completa de todas las solicitudes.
 * (Esto lo usará el artista para ver sus solicitudes pendientes)
 */
app.get("/api/solicitudes", async (req, res) => {
  try {
    const db = await readDb();
    res.status(200).json(db.solicitudes);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las solicitudes" });
  }
});

/**
 * [POST] /api/solicitudes
 * Recibe una nueva solicitud desde el formulario de Agendar.vue.
 * (Esto lo usará el cliente al enviar el formulario)
 */
app.post("/api/solicitudes", async (req, res) => {
  try {
    // 1. Recibimos la nueva solicitud que envía el frontend.
    // req.body contiene el objeto 'nuevaSolicitud' que antes guardabas en localStorage
    const solicitudRecibida = req.body;

    // 2. (Validación futura aquí)
    // Por ahora, confiamos en que el frontend envía los datos correctos [cite: 156-167]

    // 3. Asignamos un ID y estado en el backend por seguridad
    const nuevaSolicitud = {
      ...solicitudRecibida,
      id: Date.now().toString(), // El backend debe generar el ID
      estado: "pendiente", // El backend debe asignar el estado inicial [cite: 167]
    };

    // 4. Leemos la BD, añadimos la nueva solicitud y guardamos
    const db = await readDb();
    db.solicitudes.push(nuevaSolicitud);
    await writeDb(db);

    // 5. Respondemos al frontend con éxito (201 = Creado)
    res.status(201).json(nuevaSolicitud);
  } catch (error) {
    console.error("Error al guardar solicitud:", error);
    res.status(500).json({ message: "Error al guardar la solicitud" });
  }
});

// --- Iniciar Servidor ---
app.listen(PORT, () => {
  console.log(
    `✅ Microservicio 'microservice-js' corriendo en http://localhost:${PORT}`
  );
});
