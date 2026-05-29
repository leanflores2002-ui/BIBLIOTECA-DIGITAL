const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

const requiredEnvVars = [
  "DB_HOST",
  "DB_PORT",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME"
];

const missingEnvVars = requiredEnvVars.filter((name) => !process.env[name]);

if (!process.env.DB_SSL_CA_CONTENT && !process.env.DB_SSL_CA) {
  missingEnvVars.push("DB_SSL_CA or DB_SSL_CA_CONTENT");
}

if (missingEnvVars.length) {
  throw new Error(`Faltan variables de entorno requeridas: ${missingEnvVars.join(", ")}`);
}

let ca;

if (process.env.DB_SSL_CA_CONTENT) {
  ca = process.env.DB_SSL_CA_CONTENT.replace(/\\n/g, "\n");
} else {
  const caPath = path.resolve(process.cwd(), process.env.DB_SSL_CA);
  try {
    ca = fs.readFileSync(caPath, "utf8");
  } catch (err) {
    throw new Error(`No se pudo leer el certificado DB_SSL_CA en ${caPath}: ${err.message}`);
  }
}

const connectionConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: "+00:00",
  ssl: {
    ca,
    rejectUnauthorized: true
  }
};

const pool = mysql.createPool(connectionConfig);

module.exports = pool;
