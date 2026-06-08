require('dotenv').config(); // 1. Cargamos las variables de entorno (.env) primero
const express = require("express");
const cors = require("cors");
const routes = require("./routes/index");
const dashboardRoutes = require("./routes/dashboard");

const pool = require('./models/db');

const app = express();

// 2. Definimos la variable 'port' leyendo del .env (o usando 3000 por defecto)
const port = process.env.PORT || 3000; 

// Middlewares
app.use(cors());
app.use(express.json());
//rutas principales:
app.use(routes);
//Rutas del dashboard profesional:
app.use("/api", dashboardRoutes);

// Endpoint raíz de salud (health-check)
app.get("/", (req, res) => {
  res.send("Backend funcionando 🚀");
});

// Ruta de prueba de base de datos
app.get('/test-db', async (req, res) => {
  try {
      const [rows] = await pool.query('SELECT 1 + 1 AS resultado');
      res.json({ mensaje: 'Conectado a MySQL con éxito', data: rows });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// 3. UN SOLO app.listen al final de todo
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});