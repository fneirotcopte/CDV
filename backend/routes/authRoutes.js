// Actualizar authRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const authController = require('../controllers/authController');
const autorizarRol = require('../middlewares/autorizarRol');
const verificarToken = require('../middlewares/verificarToken');

// Ruta para registrar un nuevo usuario
router.post('/registrar', verificarToken, autorizarRol("administrador"), authController.registrar);

// Ruta para loguear un usuario
router.post('/login', authController.login);

// Ruta para eliminar usuario
router.delete('/eliminar', verificarToken, autorizarRol('administrador'), authController.eliminar);

// Ruta para actualizar usuario
router.put('/actualizar/:id_empleado', verificarToken, autorizarRol('administrador'), authController.actualizar);

// Ruta para desactivar usuario
router.put('/desactivar/:id_empleado', verificarToken, autorizarRol('administrador'), authController.desactivar);

// Ruta para activar usuario
router.put('/activar/:id_empleado', verificarToken, autorizarRol('administrador'), authController.activar);

// Agregar esta ruta al authRoutes.js
router.get('/usuarios', verificarToken, autorizarRol('administrador'), async (req, res) => {
  try {
    const [usuarios] = await db.query('SELECT id_empleado, nombre, apellido, dni, correo_electronico, rol, activo FROM empleado');
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});



module.exports = router;