const express = require('express');
const controller = require('../controllers/movimientos.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authenticate);

router.get('/', controller.list);
router.post('/', authorize('admin', 'empleado'), controller.create);

module.exports = router;
