# Papelería Fernández — Backend

Backend con Express, MySQL, bcrypt, JWT y roles `admin` / `empleado`.

## 1. Base de datos

Ejecuta `../sql/papeleria_fernandez_bd.sql` en MySQL.

## 2. Variables de entorno

Copia:

`.env.example` → `.env`

y completa las credenciales de MySQL y `JWT_SECRET`.

## 3. Instalar

```bash
npm install
```

## 4. Ejecutar

```bash
npm run dev
```

API: `http://localhost:3000`

## Rutas

Públicas:
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/health`

Protegidas (requieren `Authorization: Bearer <token>`; `admin`/`empleado` pueden crear y editar, desactivar/activar es solo `admin`):
- `/api/productos` (+ `GET /api/productos/stock-bajo` para el dashboard, filtros `?id_categoria=` y `?id_proveedor=`)
- `/api/categorias`
- `/api/unidades-medida` (solo `GET` y `POST`, sin editar/desactivar)
- `/api/proveedores`
- `/api/servicios`
- `/api/movimientos` (`GET` con filtros `?id_producto=&desde=&hasta=`, `POST` para registrar entrada/salida/ajuste — recalcula `stock_actual` en transacción, rechaza con `409` si el movimiento deja el stock en negativo)

## Flujo de autenticación

Registro → bcrypt.hash → MySQL → login → bcrypt.compare → JWT → middleware → autorización por rol → CRUD.
