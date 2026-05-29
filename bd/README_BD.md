# Biblioteca Digital - Base de Datos

## Importación de la base de datos

1. Crea la base de datos e importa el esquema:
   - Ejecuta `schema.sql` en tu servidor MySQL/MariaDB.

2. Carga los datos precargados:
   - Ejecuta `seed.sql` después de `schema.sql`.

3. Ejecuta consultas de prueba:
   - Usa `queries_test.sql` para verificar que la base de datos funciona correctamente.

## Orden correcto de ejecución

1. `schema.sql`
2. `seed.sql`
3. `queries_test.sql`

## Configuración de la conexión

El backend usa variables de entorno para la conexión:

- `DB_HOST`: host de la base de datos.
- `DB_USER`: usuario de la base.
- `DB_PASSWORD`: contraseña del usuario.
- `DB_NAME`: nombre de la base de datos.
- `DB_PORT`: puerto de MySQL/MariaDB.
- `JWT_SECRET`: clave secreta para los tokens JWT.

## Archivo de ejemplo

Copia `.env.example` a `.env` y reemplaza los valores con tus datos reales.

Ejemplo:

```
DB_HOST=localhost
DB_USER=mi_usuario
DB_PASSWORD=mi_contraseña_segura
DB_NAME=biblioteca_digital
DB_PORT=3306
JWT_SECRET=mi_clave_secreta
```

## Recomendaciones

- No comites el archivo `.env` con credenciales reales.
- Asegúrate de que el servidor MySQL/MariaDB esté en ejecución antes de iniciar el backend.
- Si importas en un servidor remoto, actualiza `.env` con la dirección y credenciales del servidor.
