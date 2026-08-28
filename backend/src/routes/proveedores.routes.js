const express = require('express');
const controller = require('../controllers/proveedores.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authenticate);

router.get('/', controller.list);
router.get('/:id', controller.getById);
router.post('/', authorize('admin', 'empleado'), controller.create);
router.put('/:id', authorize('admin', 'empleado'), controller.update);
router.patch('/:id/desactivar', authorize('admin'), controller.deactivate);
router.patch('/:id/activar', authorize('admin'), controller.activate);

module.exports = router;
