require("dotenv").config();

const express = require("express");
const cors = require("cors");

const pool = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 4000;

console.log("Configuración BD cargada:");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_SSL_CA:", process.env.DB_SSL_CA);

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/status", (req, res) => {
  res.json({ status: "ok", message: "API de Biblioteca Digital activa" });
});

app.get("/api/health/db", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT DATABASE() AS database_name");
    res.json({ ok: true, database: rows[0]?.database_name || null });
  } catch (error) {
    console.error("Error en /api/health/db:", error);
    res.status(500).json({
      ok: false,
      error: "No se pudo conectar a la base de datos",
      detail: error.message
    });
  }
});

app.use((err, req, res, next) => {
  console.error("Error interno:", err);
  res.status(500).json({ error: "Error interno en el servidor" });
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});