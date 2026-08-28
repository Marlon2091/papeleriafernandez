# Probar el backend con Thunder Client

Guía paso a paso para probar todos los endpoints de la API con la extensión
**Thunder Client** de VS Code. No requiere colección importada: solo sigue el
orden de abajo, cada petición usa el resultado de la anterior (el token, el
`id_equipo`, etc.).

## 0. Preparación

1. Instala la extensión **Thunder Client** en VS Code (ícono de rayo ⚡ en la barra lateral).
2. Levanta el backend:
   ```bash
   cd backend
   npm install --ignore-scripts
   npm run dev
   ```
3. Confirma que responde:
   - **Método:** `GET`
   - **URL:** `http://localhost:3000/api/health`
   - **Respuesta esperada (200):**
     ```json
     { "ok": true, "message": "Papelería Fernández API funcional" }
     ```

Todas las rutas siguientes usan como base: `http://localhost:3000/api`

---

## 1. Auth — Registro

Crea un usuario nuevo. **Siempre se crea con rol `empleado`** (no existe forma de auto-asignarse `admin` desde el registro público).

- **Método:** `POST`
- **URL:** `http://localhost:3000/api/auth/register`
- **Headers:** `Content-Type: application/json` (Thunder Client lo agrega solo si eliges body tipo `JSON`)
- **Body (JSON):**
  ```json
  {
    "nombre": "Empleado Prueba",
    "email": "empleado_prueba@papeleria.local",
    "password": "Empleado123"
  }
  ```
- **Respuesta esperada (201):**
  ```json
  { "ok": true, "message": "Usuario registrado", "id_usuario": 5 }
  ```
- **Errores posibles:**
  - `400` — falta `nombre`, `email` o `password`.
  - `409` — el correo ya está registrado.

---

## 2. Auth — Login

- **Método:** `POST`
- **URL:** `http://localhost:3000/api/auth/login`
- **Body (JSON):**
  ```json
  {
    "email": "admin@papeleria.local",
    "password": "Admin123*"
  }
  ```
  > Ese es el admin que se crea automáticamente al arrancar el backend (variables `ADMIN_*` de `backend/.env`). Ajusta el email/password si tu `.env` tiene otros valores.

- **Respuesta esperada (200):**
  ```json
  {
    "ok": true,
    "user": {
      "id_usuario": 1,
      "nombre": "Administrador",
      "email": "admin@papeleria.local",
      "rol": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Errores posibles:** `401` — credenciales incorrectas.

### Guarda el `token`

Copia el valor completo de `"token"` — lo necesitas para **todas** las peticiones siguientes.

En Thunder Client, en cada petición protegida ve a la pestaña **Headers** y agrega:

| Header | Valor |
|---|---|
| `Authorization` | `Bearer <pega-aquí-el-token>` |

(También puedes usar la pestaña **Auth** → tipo `Bearer` → pegar solo el token, sin escribir la palabra `Bearer`.)

Repite el login con `empleado_prueba@papeleria.local` / `Empleado123` (el que registraste en el paso 1) para tener un segundo token de prueba con rol `empleado`, y así comparar qué le permite el backend a cada rol.

---

## 3. Equipos — Listar (público para cualquier usuario logueado)

> Nota: `equipos` es el módulo de ejemplo heredado, todavía en migración hacia
> el CRUD de productos/inventario. Esta sección se actualizará cuando se
> convierta.

- **Método:** `GET`
- **URL:** `http://localhost:3000/api/equipos`
- **Headers:** `Authorization: Bearer <token>`
- **Respuesta esperada (200):**
  ```json
  {
    "ok": true,
    "data": [
      {
        "id_equipo": 3,
        "nombre": "Portátil",
        "marca": "Lenovo",
        "modelo": "ThinkPad",
        "imagen": "1787200800491-149419823.png",
        "created_at": "2026-08-20T04:00:00.000Z"
      }
    ]
  }
  ```
  > `imagen` es solo el nombre de archivo. La URL completa para verla en el navegador es:
  > `http://localhost:3000/uploads/equipos/<valor-de-imagen>`

---

## 4. Equipos — Obtener uno

- **Método:** `GET`
- **URL:** `http://localhost:3000/api/equipos/3` (cambia `3` por un `id_equipo` real que hayas visto en el paso anterior)
- **Headers:** `Authorization: Bearer <token>`
- **Respuesta esperada (200):** un solo objeto equipo (mismo formato que arriba).
- **Error:** `404` si el `id` no existe.

---

## 5. Equipos — Crear (con imagen)

Esta ruta es **multipart/form-data**, no JSON, porque incluye un archivo.

- **Método:** `POST`
- **URL:** `http://localhost:3000/api/equipos`
- **Headers:** `Authorization: Bearer <token>` (rol `admin` o `empleado`, ambos pueden crear)
- **Body:** en Thunder Client, elige tipo **`Form`** (no `JSON`), y agrega estos campos:

  | Campo | Tipo | Valor |
  |---|---|---|
  | `nombre` | Text | `Impresora` |
  | `marca` | Text | `HP` |
  | `modelo` | Text | `LaserJet` |
  | `imagen` | **File** | selecciona un `.jpg`, `.png` o `.webp` de tu computador (máx. 2MB) |

  > El campo `imagen` es opcional — puedes crear un equipo sin imagen, simplemente no lo agregues.

- **Respuesta esperada (201):**
  ```json
  {
    "ok": true,
    "data": {
      "id_equipo": 6,
      "nombre": "Impresora",
      "marca": "HP",
      "modelo": "LaserJet",
      "imagen": null,
      "created_at": "2026-08-20T04:57:25.000Z"
    }
  }
  ```
- **Errores posibles:**
  - `400` — falta `nombre`, o el archivo no es `jpg`/`png`/`webp`, o pesa más de 2MB.
  - `403` — si usas un token sin sesión válida.

---

## 6. Equipos — Editar (con o sin nueva imagen)

- **Método:** `PUT`
- **URL:** `http://localhost:3000/api/equipos/6` (usa el `id_equipo` que te devolvió el paso anterior)
- **Headers:** `Authorization: Bearer <token>`
- **Body:** tipo **`Form`**, mismos campos que crear:

  | Campo | Tipo | Valor |
  |---|---|---|
  | `nombre` | Text | `Impresora HP` |
  | `marca` | Text | `HP` |
  | `modelo` | Text | `LaserJet Pro` |
  | `imagen` | File (opcional) | si subes una nueva, **reemplaza** la anterior y borra el archivo viejo del servidor automáticamente |

  > Si no adjuntas `imagen`, el equipo conserva la que ya tenía.

- **Respuesta esperada (200):**
  ```json
  { "ok": true, "message": "Equipo actualizado" }
  ```
- **Error:** `404` si el `id` no existe.

---

## 7. Equipos — Eliminar (solo `admin`)

- **Método:** `DELETE`
- **URL:** `http://localhost:3000/api/equipos/6`
- **Headers:** `Authorization: Bearer <token-de-admin>`
- **Respuesta esperada (200):**
  ```json
  { "ok": true, "message": "Equipo eliminado" }
  ```
- **Prueba de rol:** repite esta misma petición con el token del usuario `empleado` del paso 2 — debe devolver:
  ```json
  { "ok": false, "message": "No tienes permisos para realizar esta operación" }
  ```
  con status `403`. Eso confirma que el backend valida el rol, no solo el frontend.

---

## Resumen rápido de rutas

| Método | Ruta | Body | Rol requerido |
|---|---|---|---|
| GET | `/api/health` | — | público |
| POST | `/api/auth/register` | JSON | público |
| POST | `/api/auth/login` | JSON | público |
| GET | `/api/equipos` | — | logueado (cualquier rol) |
| GET | `/api/equipos/:id` | — | logueado (cualquier rol) |
| POST | `/api/equipos` | Form-data (con `imagen` opcional) | `admin` o `empleado` |
| PUT | `/api/equipos/:id` | Form-data (con `imagen` opcional) | `admin` o `empleado` |
| DELETE | `/api/equipos/:id` | — | solo `admin` |

## Notas

- El token JWT expira según `JWT_EXPIRES_IN` en `.env` (por defecto `2h`). Si te empieza a dar `401 Token inválido o expirado`, vuelve a hacer login (paso 2).
- Nunca envíes `Content-Type` manualmente en las peticiones con archivo — Thunder Client (igual que el navegador) arma el header `multipart/form-data; boundary=...` automáticamente al elegir body tipo `Form`. Si lo escribes a mano, se rompe la subida.
