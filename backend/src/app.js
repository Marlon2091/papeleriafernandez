const path = require('path');
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const productosRoutes = require('./routes/productos.routes');
const categoriasRoutes = require('./routes/categorias.routes');
const unidadesMedidaRoutes = require('./routes/unidadesMedida.routes');
const proveedoresRoutes = require('./routes/proveedores.routes');
const serviciosRoutes = require('./routes/servicios.routes');
const movimientosRoutes = require('./routes/movimientos.routes');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Papelería Fernández API funcional' });
});

app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/unidades-medida', unidadesMedidaRoutes);
app.use('/api/proveedores', proveedoresRoutes);
app.use('/api/servicios', serviciosRoutes);
app.use('/api/movimientos', movimientosRoutes);

app.use((req, res) => {
  res.status(404).json({
    ok: false,
    message: 'Ruta no encontrada'
  });
});

app.use(errorHandler);

module.exports = app;
