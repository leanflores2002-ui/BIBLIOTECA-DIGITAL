const fs = require("fs");
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

const connectionConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "biblioteca_digital",
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: "+00:00"
};

if (process.env.DB_SSL_CA) {
  try {
    connectionConfig.ssl = {
      ca: fs.readFileSync(process.env.DB_SSL_CA)
    };
  } catch (err) {
    console.error("No se pudo leer DB_SSL_CA:", err.message);
  }
}

const pool = mysql.createPool(connectionConfig);

module.exports = pool;
