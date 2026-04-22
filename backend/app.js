const express = require("express");
const cors = require("cors");
const routes = require("./routes/index");

/**
 * Punto de entrada del servidor Express.
 *
 * Nota de mantenimiento:
 * - Este archivo se limita a cablear middlewares y rutas (no contiene lógica de negocio).
 * - La lógica de negocio vive en `controllers/` y el enrutamiento en `routes/`.
 */
const app = express();

// Habilita CORS para permitir que el frontend (otro origen) consuma la API durante desarrollo.
// Si se requiere endurecer seguridad, se configurarán orígenes/métodos permitidos sin cambiar contratos de la API.
app.use(cors());

// Middleware para parsear JSON en el cuerpo de la request (req.body) en endpoints POST/PUT.
app.use(express.json());

// Registra el router principal: centraliza los endpoints bajo `/api/...`.
app.use(routes);

// Endpoint raíz de salud (health-check) para verificar que el proceso está levantado.
app.get("/", (req, res) => {
  res.send("Backend funcionando 🚀");
});

// Puerto fijo para desarrollo/local. En despliegues reales suele configurarse por variable de entorno.
app.listen(3000, () => {
  console.log("Servidor en http://localhost:3000");
});
