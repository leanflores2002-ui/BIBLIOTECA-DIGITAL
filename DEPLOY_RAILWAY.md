# Deploy en Railway

Guia detallada para desplegar Biblioteca Digital en Railway usando GitHub, Node.js, Express y MySQL en Aiven.

## Requisitos previos

- Cuenta en GitHub.
- Cuenta en Railway.
- Proyecto subido a un repositorio de GitHub.
- Base de datos MySQL creada en Aiven.
- Certificado CA de Aiven disponible en `certs/ca.pem`.
- Variables reales de conexion: host, puerto, usuario, password y nombre de base.

## Subir a GitHub

1. Verificar que `.env` no este versionado.
2. Verificar que `.gitignore` incluya `.env` y `node_modules/`.
3. Confirmar que no haya credenciales reales en el codigo.
4. Subir el repositorio a GitHub.

No subir `DB_PASSWORD`, `JWT_SECRET` real ni archivos con credenciales privadas. El certificado CA publico de Aiven puede mantenerse como archivo local si no contiene secretos privados.

## Crear proyecto en Railway

1. Entrar a Railway.
2. Crear `New Project`.
3. Elegir `Deploy from GitHub repo`.
4. Seleccionar el repositorio de Biblioteca Digital.
5. Esperar a que Railway detecte el proyecto Node.js con Nixpacks.
6. Confirmar que el comando de inicio sea `npm start`.

El archivo `railway.json` ya define:

```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start"
  }
}
```

## Configurar variables

En `Railway -> Service -> Variables`, cargar:

```env
DB_HOST=bookonline00-114-pmccole14-ecdc.d.aivencloud.com
DB_PORT=21861
DB_USER=avnadmin
DB_PASSWORD=CONTRASEÑA_REAL_DE_AIVEN
DB_NAME=biblioteca_digital
DB_SSL_CA_CONTENT=CONTENIDO_COMPLETO_DEL_CA_PEM
JWT_SECRET=CLAVE_SECRETA_LARGA
```

`PORT` es definido automaticamente por Railway. Si queres declararlo manualmente para pruebas, puede ser:

```env
PORT=4000
```

## Cargar DB_SSL_CA_CONTENT

1. Abrir `certs/ca.pem`.
2. Copiar todo el contenido:

```text
-----BEGIN CERTIFICATE-----
...
-----END CERTIFICATE-----
```

3. Pegar el contenido completo en `DB_SSL_CA_CONTENT`.

Si Railway no conserva los saltos de linea, se puede reemplazar cada salto por `\n`. El backend convierte esos `\n` a saltos reales antes de crear el pool MySQL.

En local se puede seguir usando:

```env
DB_SSL_CA=./certs/ca.pem
```

En Railway, si usas `DB_SSL_CA_CONTENT`, no hace falta configurar `DB_SSL_CA`.

## Revisar logs

En Railway:

1. Entrar al servicio.
2. Abrir `Deployments` o `Logs`.
3. Revisar errores de build, inicio o conexion.

El servidor no imprime `DB_PASSWORD`, `JWT_SECRET` ni el contenido del certificado. Solo muestra si las variables principales estan configuradas.

## Probar endpoints

Despues de generar el dominio publico, probar:

```text
https://URL-DE-RAILWAY/api/status
```

Respuesta esperada:

```json
{ "status": "ok" }
```

Probar diagnostico seguro:

```text
https://URL-DE-RAILWAY/api/health/env
```

Respuesta esperada:

```json
{
  "ok": true,
  "node_env": "production",
  "db_host_configured": true,
  "db_name_configured": true,
  "ssl_configured": true
}
```

Probar conexion a base:

```text
https://URL-DE-RAILWAY/api/health/db
```

Respuesta esperada:

```json
{ "ok": true, "database": "biblioteca_digital" }
```

Probar catalogo:

```text
https://URL-DE-RAILWAY/api/books
```

## Probar la web

Abrir:

```text
https://URL-DE-RAILWAY/
```

Verificar:

- Catalogo de libros.
- Login.
- Registro.
- Rutas de usuario.
- Rutas de administrador.
- Compras y alquileres si estan implementados.

El frontend usa rutas relativas como `/api/books`, por lo que funciona desde la misma URL publica de Railway.

## Errores comunes y soluciones

### Application failed to respond

Revisar que `server.js` use:

```js
const PORT = process.env.PORT || 4000;
```

Tambien revisar que Railway use `npm start`.

### Access denied for user

Revisar `DB_USER` y `DB_PASSWORD`. Confirmar que el password sea el real de Aiven y que no tenga espacios extra.

### Unknown database

Revisar `DB_NAME`. Debe existir en Aiven y coincidir con el nombre configurado.

### SSL error

Revisar `DB_SSL_CA_CONTENT`. Debe incluir el certificado completo desde `-----BEGIN CERTIFICATE-----` hasta `-----END CERTIFICATE-----`.

Si se uso `\n`, confirmar que no se hayan eliminado caracteres.

### Cannot find module

Correr localmente:

```bash
npm install
```

Luego verificar que toda dependencia usada este declarada en `package.json`.

### npm start not found

Revisar que `package.json` tenga:

```json
"scripts": {
  "start": "node server.js"
}
```

Si Railway no lo detecta, configurar `Settings -> Deploy -> Start Command` con `npm start`.

### La web carga pero no aparecen libros

Probar:

```text
https://URL-DE-RAILWAY/api/books
```

Si falla, revisar logs, variables de base de datos y `/api/health/db`.

### El login o registro falla

Revisar que `JWT_SECRET` este configurado y que existan las tablas esperadas (`users`, `roles`) en la base de datos.

## Comando local de verificacion

```bash
npm install
npm start
```

Luego probar:

```text
http://localhost:4000/api/status
http://localhost:4000/api/health/env
http://localhost:4000/api/health/db
http://localhost:4000/api/books
http://localhost:4000/
```
