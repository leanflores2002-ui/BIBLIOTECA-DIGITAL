# Biblioteca Digital

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/new/template?template=https://github.com/REEMPLAZAR_USUARIO_Y_REPOSITORIO)

Proyecto de biblioteca online con frontend HTML/CSS/JS y backend Node.js + Express conectado a MySQL en Aiven.

## Contenido

- `index.html`, `styles.css`, `script.js`: interfaz web de la biblioteca.
- `server.js`: servidor Express para frontend estatico y API.
- `config/db.js`: conexion MySQL con `mysql2/promise`, pool y SSL.
- `routes/`: rutas API para autenticacion, catalogo, usuario y administracion.
- `bd/`: esquema de base de datos, seed, consultas de prueba y documentacion.
- `railway.json`: configuracion de deploy para Railway con Nixpacks.

## Requisitos

- Node.js 18+ instalado.
- Base de datos MySQL disponible.
- Certificado CA de Aiven en `certs/ca.pem` para desarrollo local.

## Instalacion local

1. Copia `.env.example` a `.env`.
2. Reemplaza los valores de `.env` con tus datos reales.
3. Instala dependencias:

```bash
npm install
```

4. Importa la base de datos usando los archivos de `bd/`.
5. Inicia el servidor:

```bash
npm start
```

6. Abre:

```bash
http://localhost:4000
```

## API y conexion

- Variables esperadas: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_SSL_CA` o `DB_SSL_CA_CONTENT`, `JWT_SECRET`.
- En local, `DB_SSL_CA` puede apuntar a `./certs/ca.pem`.
- En Railway, usar `DB_SSL_CA_CONTENT` con el contenido completo del certificado CA.
- No subir `.env`, `DB_PASSWORD` ni secretos al repositorio.
- Endpoints de salud:
  - `GET /api/status`
  - `GET /api/health/env`
  - `GET /api/health/db`

## Deploy en Railway

El boton de deploy necesita la URL final del repositorio. Antes de usarlo, reemplaza `REEMPLAZAR_USUARIO_Y_REPOSITORIO` por `USUARIO/REPOSITORIO`.

Si el boton no funciona, usa la alternativa manual: deploy desde Railway Dashboard.

### A. Deploy desde GitHub

1. Subir el proyecto a GitHub.
2. Entrar a Railway.
3. Crear `New Project`.
4. Elegir `Deploy from GitHub repo`.
5. Seleccionar el repositorio.
6. Esperar el build.
7. Ir a `Variables`.
8. Cargar las variables de entorno.
9. Generar un dominio publico.
10. Probar la URL.

### B. Variables a configurar en Railway

En `Railway -> Service -> Variables`, agregar:

```env
PORT=4000
DB_HOST=bookonline00-114-pmccole14-ecdc.d.aivencloud.com
DB_PORT=21861
DB_USER=avnadmin
DB_PASSWORD=CONTRASEÑA_REAL_DE_AIVEN
DB_NAME=biblioteca_digital
DB_SSL_CA_CONTENT=CONTENIDO_COMPLETO_DEL_CA_PEM
JWT_SECRET=CLAVE_SECRETA_LARGA
```

Railway tambien define `PORT` automaticamente. Si ya existe `PORT`, no hace falta cargarlo manualmente.

Nunca subir `DB_PASSWORD` al codigo. Nunca subir `.env`.

### C. Como cargar DB_SSL_CA_CONTENT

Abrir `certs/ca.pem` y copiar todo el contenido, incluyendo:

```text
-----BEGIN CERTIFICATE-----
...
-----END CERTIFICATE-----
```

Pegar ese contenido en la variable `DB_SSL_CA_CONTENT` de Railway. Si Railway no conserva bien los saltos de linea, se puede pegar usando `\n`; `config/db.js` soporta ambas formas.

### D. Comando de inicio

Railway debe usar:

```bash
npm start
```

Si Railway no detecta el comando, configurar `Settings -> Deploy -> Start Command` con:

```bash
npm start
```

### E. Probar deploy

Una vez desplegado, probar:

```text
https://URL-DE-RAILWAY/api/status
```

Debe devolver:

```json
{ "status": "ok" }
```

Luego probar:

```text
https://URL-DE-RAILWAY/api/health/db
```

Debe devolver:

```json
{ "ok": true, "database": "biblioteca_digital" }
```

### F. Probar la web

Entrar a:

```text
https://URL-DE-RAILWAY/
```

Verificar catalogo de libros, login, registro, rutas de usuario, rutas de administrador y compras/alquileres si estan implementados.

## Usuarios precargados

- Administrador: `admin@example.com` / `admin1234`
- Administrador: `valeria@example.com` / `pass1234`
- Usuario normal: `santiago@example.com` / `user123`

Los usuarios precargados son de demostracion. Para produccion, reemplazar contrasenas y usar secretos fuertes.

## Carpeta `bd`

La carpeta `bd/` contiene:

- `schema_reparado.sql`: crea la base de datos con tablas, claves, restricciones e indices.
- `seed_reparado.sql`: inserta datos de prueba.
- `queries_test.sql`: consultas para validar la base.
- `der.md`: explicacion textual del DER y normalizacion.
- `README_BD.md`: instrucciones para importar la base.
