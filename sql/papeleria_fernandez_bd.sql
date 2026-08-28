-- Papelería Fernández — DDL de inventario (MVP)
-- Sin datos. MySQL 8.0+
-- NO EJECUTAR sin aprobación explícita del usuario.

CREATE DATABASE IF NOT EXISTS papeleria_fernandez
  DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE papeleria_fernandez;

DROP TABLE IF EXISTS movimientos_inventario;
DROP TABLE IF EXISTS producto_proveedor;
DROP TABLE IF EXISTS servicios;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS proveedores;
DROP TABLE IF EXISTS unidades_medida;
DROP TABLE IF EXISTS categorias;

-- ─────────────────────────────────────────────────────────────
-- Catálogos base
-- ─────────────────────────────────────────────────────────────

CREATE TABLE categorias (
  id_categoria   INT AUTO_INCREMENT PRIMARY KEY,
  nombre         VARCHAR(80) NOT NULL UNIQUE,
  descripcion    VARCHAR(255),
  activo         BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB;

-- unidad, pliego, resma, rollo, caja, paquete...
CREATE TABLE unidades_medida (
  id_unidad      INT AUTO_INCREMENT PRIMARY KEY,
  nombre         VARCHAR(40) NOT NULL UNIQUE,
  activo         BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB;

CREATE TABLE proveedores (
  id_proveedor   INT AUTO_INCREMENT PRIMARY KEY,
  nombre         VARCHAR(120) NOT NULL,
  contacto       VARCHAR(120),
  telefono       VARCHAR(30),
  email          VARCHAR(120),
  direccion      VARCHAR(255),
  activo         BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────
-- Usuarios (auth). Estructura alineada con backend/src/services/
-- auth.service.js y backend/src/startup/seedAdmin.js: el admin
-- inicial se crea automáticamente al arrancar el servidor, a partir
-- de ADMIN_NAME/ADMIN_EMAIL/ADMIN_PASSWORD en backend/.env — no hay
-- que insertarlo a mano aquí.
-- ─────────────────────────────────────────────────────────────

CREATE TABLE usuarios (
  id_usuario     INT AUTO_INCREMENT PRIMARY KEY,
  nombre         VARCHAR(100) NOT NULL,
  email          VARCHAR(150) NOT NULL UNIQUE,
  password       VARCHAR(255) NOT NULL,
  rol            ENUM('admin','empleado') NOT NULL DEFAULT 'empleado',
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────
-- Productos (afectan stock)
-- ─────────────────────────────────────────────────────────────

CREATE TABLE productos (
  id_producto        INT AUTO_INCREMENT PRIMARY KEY,
  sku                VARCHAR(40) UNIQUE,
  nombre             VARCHAR(150) NOT NULL,
  descripcion        VARCHAR(255),
  id_categoria       INT NOT NULL,
  id_unidad          INT NOT NULL,
  precio_venta       DECIMAL(10,2) NOT NULL DEFAULT 0,
  stock_actual       DECIMAL(10,2) NOT NULL DEFAULT 0,
  stock_minimo       DECIMAL(10,2) NOT NULL DEFAULT 0,
  activo             BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_en     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_prod_categoria FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria),
  CONSTRAINT fk_prod_unidad    FOREIGN KEY (id_unidad) REFERENCES unidades_medida(id_unidad),
  CONSTRAINT chk_prod_stock_actual  CHECK (stock_actual >= 0),
  CONSTRAINT chk_prod_stock_minimo  CHECK (stock_minimo >= 0)
) ENGINE=InnoDB;

-- Un producto puede tener varios proveedores, cada uno con su propio precio
-- de compra. es_principal marca cuál usar por defecto en el frontend
-- (solo uno por producto — se controla en el service layer, no aquí).
CREATE TABLE producto_proveedor (
  id_producto        INT NOT NULL,
  id_proveedor       INT NOT NULL,
  precio_compra      DECIMAL(10,2) NOT NULL DEFAULT 0,
  es_principal       BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (id_producto, id_proveedor),
  CONSTRAINT fk_pp_producto  FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE CASCADE,
  CONSTRAINT fk_pp_proveedor FOREIGN KEY (id_proveedor) REFERENCES proveedores(id_proveedor)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────
-- Servicios (NO afectan stock: corte de papel, impresión,
-- plastificado, argollado, sellos, digitalización...)
-- ─────────────────────────────────────────────────────────────

CREATE TABLE servicios (
  id_servicio    INT AUTO_INCREMENT PRIMARY KEY,
  nombre         VARCHAR(120) NOT NULL,
  descripcion    VARCHAR(255),
  precio         DECIMAL(10,2) NOT NULL DEFAULT 0,
  activo         BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────
-- Movimientos de inventario
-- stock_actual del producto se recalcula en el service layer,
-- dentro de una transacción con SELECT ... FOR UPDATE sobre la fila
-- del producto. Nunca se actualiza stock_actual directo desde un
-- controller ni se confía en id_usuario del body (siempre del JWT).
--
-- tipo:
--   entrada          -> suma cantidad
--   salida            -> resta cantidad
--   ajuste_positivo    -> suma cantidad (corrige stock hacia arriba)
--   ajuste_negativo    -> resta cantidad (corrige stock hacia abajo)
-- ─────────────────────────────────────────────────────────────

CREATE TABLE movimientos_inventario (
  id_movimiento  INT AUTO_INCREMENT PRIMARY KEY,
  id_producto    INT NOT NULL,
  id_usuario     INT NOT NULL,
  tipo           ENUM('entrada','salida','ajuste_positivo','ajuste_negativo') NOT NULL,
  cantidad       DECIMAL(10,2) NOT NULL,
  motivo         VARCHAR(255),
  creado_en      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_mov_producto FOREIGN KEY (id_producto) REFERENCES productos(id_producto),
  CONSTRAINT fk_mov_usuario  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
  CONSTRAINT chk_mov_cantidad CHECK (cantidad > 0)
) ENGINE=InnoDB;

CREATE INDEX idx_mov_producto_fecha ON movimientos_inventario (id_producto, creado_en);
CREATE INDEX idx_prod_categoria ON productos (id_categoria);
CREATE INDEX idx_prod_activo_stock ON productos (activo, stock_actual);
