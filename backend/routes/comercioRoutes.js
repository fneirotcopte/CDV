const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const comercioController = require('../controllers/comercioController');
const verificarToken = require('../middlewares/verificarToken');
const autorizarRol = require('../middlewares/autorizarRol');  // corregí nombre archivo, estaba "aurotizarRol"

const storageFoto = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/fotos_titulares/'),
  filename: (req, file, cb) => cb(null, 'foto_' + Date.now() + path.extname(file.originalname)),
});

const uploadFoto = multer({ storage: storageFoto });

router.post(
  '/registro',
  verificarToken,
  uploadFoto.single('fotoTitular'),
  comercioController.registrarComercio
);

module.exports = router;

