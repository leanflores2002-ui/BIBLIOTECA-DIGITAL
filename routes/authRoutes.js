const express = require("express");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    const [existing] = await pool.query("SELECT user_id FROM users WHERE email = ?", [email]);
    if (existing.length) {
      return res.status(409).json({ error: "El email ya está registrado" });
    }

    const [role] = await pool.query("SELECT role_id FROM roles WHERE role_name = 'user' LIMIT 1");
    const roleId = role[0]?.role_id || 2;
    const [result] = await pool.query(
      "INSERT INTO users (first_name, last_name, email, password_hash, role_id, status) VALUES (?, ?, ?, ?, ?, 'active')",
      [first_name, last_name, email, password, roleId]
    );

    const token = jwt.sign(
      { user_id: result.insertId, email, role: "user" },
      process.env.JWT_SECRET || "secret_demo",
      { expiresIn: "8h" }
    );

    res.json({ token, user: { user_id: result.insertId, first_name, last_name, email, role: "user" } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudo registrar el usuario" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email y contraseña son obligatorios" });
    }

    const [rows] = await pool.query("SELECT u.user_id, u.first_name, u.last_name, u.email, u.password_hash, r.role_name FROM users u JOIN roles r ON u.role_id = r.role_id WHERE u.email = ? LIMIT 1", [email]);
    const user = rows[0];
    if (!user || user.password_hash !== password) {
      return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email, role: user.role_name },
      process.env.JWT_SECRET || "secret_demo",
      { expiresIn: "8h" }
    );

    res.json({
      token,
      user: {
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role_name
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudo iniciar sesión" });
  }
});

module.exports = router;
