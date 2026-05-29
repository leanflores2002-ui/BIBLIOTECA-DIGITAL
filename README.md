# Biblioteca Digital

Proyecto de biblioteca online con frontend HTML/CSS/JS y backend Node.js + MySQL.

## Contenido

- `index.html`, `styles.css`, `script.js`: interfaz moderna basada en el diseño original.
- `server.js`: servidor Express para conectar la web con la base de datos.
- `config/db.js`: configuración de conexión a MySQL usando variables de entorno.
- `routes/`: rutas API para autenticación, catálogo, usuario y administración.
- `bd/`: esquema de base de datos, datos precargados, consultas de prueba y documentación del DER.

## Requisitos

- Node.js 18+ instalado
- MySQL o MariaDB en funcionamiento

## Instalación

1. Copia el archivo de ejemplo `.env.example` a `.env`.
2. Reemplaza los valores en `.env` con tus datos reales de conexión.
3. Instala dependencias:

```bash
npm install
```

4. Importa la base de datos:

```bash
mysql -u tu_usuario -p < bd/schema.sql
mysql -u tu_usuario -p < bd/seed.sql
```

5. Inicia el servidor:

```bash
npm start
```

6. Abre el navegador en:

```bash
http://localhost:4000
```

## Usuarios precargados

- Administrador: `admin@example.com` / `admin1234`
- Administrador: `valeria@example.com` / `pass1234`
- Usuario normal: `santiago@example.com` / `user123`
> Nota: los usuarios precargados usan contraseñas de demostración en el seed. Para un entorno real, reemplaza estos valores y utiliza hashing de contraseñas.
## API y conexión

- Variables de entorno definidas en `.env`: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`, `DB_SSL_CA`, `JWT_SECRET`.
- `DB_SSL_CA` debe apuntar al certificado CA de Aiven, p.ej. `./certs/ca.pem`.
- Endpoint de salud de la base de datos: `GET /api/health/db`.
- No se incluyen credenciales reales.

## Carpeta `/bd`

La carpeta `/bd` contiene:

- `schema.sql`: crea la base de datos con tablas, claves, restricciones e índices.
- `seed.sql`: inserta datos reales de libros, autores, categorías, usuarios, ventas, préstamos, reseñas e historial de precios.
- `queries_test.sql`: consultas de prueba para validar la base.
- `der.md`: explicación textual del DER y normalización.
- `README_BD.md`: instrucciones claras para importar la base.
