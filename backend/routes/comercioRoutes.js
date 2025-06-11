// const express = require('express');
// const path = require('path');
// const multer = require('multer');
// const router = express.Router();
// const comercioController = require('../controllers/comercioController');

// // Configuración de multer
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
//   filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
// });
// const upload = multer({ storage });

// // // Ruta POST para registrar comercio con documentos
// router.post('/registro-comercio', upload.array('documentacion'), comercioController.registrarComercio);

// module.exports = router;

const express = require('express');
const path = require('path');
const multer = require('multer');
const router = express.Router();
const comercioController = require('../controllers/comercioController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Ruta POST usando el controlador y multer
router.post('/registro-comercio', upload.array('documentacion', 10), comercioController.registrarComercio);

// Exportar solo el router
module.exports = router;
