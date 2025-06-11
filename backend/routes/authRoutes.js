const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const autorizarRol = require('../middlewares/autorizarRol');
const verificarToken = require('../middlewares/verificarToken');

// Ruta para registrar un nuevo usuario
// router.post('/registrar', authController.registrar);
// router.post('/registrar', autorizarRol("administrador"), authController.registrar);
router.post('/registrar', verificarToken, autorizarRol("administrador"), authController.registrar);
// Ruta para loguear un usuario
router.post('/login', authController.login);
//Ruta para eliminar usuario
router.delete('/eliminar', verificarToken, autorizarRol('administrador'), authController.eliminar);


module.exports = router;

