const express = require('express');
const router = express.Router();
const db = require('../db');
const verificarToken = require('../middlewares/verificarToken');
const autorizarRol = require('../middlewares/autorizarRol');
const upload = require('../middlewares/multerconfig');

// GET /api/procedimientos - Listar con filtros
router.get('/', verificarToken, async (req, res) => {
  try {
    const { comercio } = req.query;
    
    let query = `
      SELECT p.*, CONCAT(e.nombre, ' ', e.apellido) AS inspector_nombre
      FROM procedimiento p
      LEFT JOIN empleado e ON p.id_inspector = e.id_empleado
      WHERE 1=1
    `;
    
    const params = [];
    
    if (comercio) {
      query += ' AND p.id_comercio = ?';
      params.push(comercio);
    }
    
    query += ' ORDER BY p.fecha_procedimiento DESC';
    
    const [procedimientos] = await db.query(query, params);
    res.json(procedimientos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/procedimientos/:id - Obtener un procedimiento
router.get('/:id', verificarToken, async (req, res) => {
  try {
    const [procedimiento] = await db.query(`
      SELECT p.*, CONCAT(e.nombre, ' ', e.apellido) AS inspector_nombre
      FROM procedimiento p
      LEFT JOIN empleado e ON p.id_inspector = e.id_empleado
      WHERE p.id_procedimiento = ?
    `, [req.params.id]);
    
    if (!procedimiento[0]) return res.status(404).json({ error: 'Procedimiento no encontrado' });
    res.json(procedimiento[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// POST /api/procedimientos - Crear nuevo procedimiento
/*
router.post('/', 
  verificarToken,
  autorizarRol(['inspector']),
  upload.array('fotos', 5), // Máximo 5 fotos
  async (req, res) => {
    try {
      const { tipo_procedimiento, fecha_procedimiento, resultado, observacion, documentacion, id_comercio, id_inspector } = req.body;
      
      // Verificar si hay archivos subidos
      /*
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No se subieron archivos' });
      }
      
      const fotos = req.files.map(file => file.filename).join(',') || [];
     


      await db.query(
        `INSERT INTO procedimiento 
        (tipo_procedimiento, fecha_procedimiento, resultado, observacion, documentacion, fotos, id_comercio, id_inspector)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [tipo_procedimiento, fecha_procedimiento, resultado, observacion, documentacion, fotos, id_comercio, id_inspector]
      );
      
      res.json({ mensaje: 'Procedimiento registrado correctamente' });
    } catch (err) {
      // Manejar errores específicos de Multer
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: 'El archivo es demasiado grande (máximo 5MB)' });
      }
      if (err.message.includes('Solo se permiten imágenes')) {
        return res.status(400).json({ error: err.message });
      }
      
      console.error('Error al registrar procedimiento:', err);
      res.status(500).json({ error: 'Error al registrar el procedimiento' });
    }
  }
); 
*/

// POST /api/procedimientos - Crear nuevo procedimiento
router.post('/', 
  verificarToken,
  autorizarRol(['inspector']),
  upload.array('fotos', 5), // Middleware Multer (pero ahora será opcional)
  async (req, res) => {
    try {
      const { tipo_procedimiento, fecha_procedimiento, resultado, observacion, documentacion, id_comercio, id_inspector } = req.body;
      
      // Manejar fotos (opcional)
      const fotos = req.files ? req.files.map(file => file.filename).join(',') : null; // Cambiado a null si no hay archivos

      await db.query(
        `INSERT INTO procedimiento 
        (tipo_procedimiento, fecha_procedimiento, resultado, observacion, documentacion, fotos, id_comercio, id_inspector)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [tipo_procedimiento, fecha_procedimiento, resultado, observacion, documentacion, fotos, id_comercio, id_inspector]
      );
      
      res.json({ mensaje: 'Procedimiento registrado correctamente' });
    } catch (err) {
      // Manejar errores específicos de Multer (solo si se subieron archivos)
      if (req.files) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(413).json({ error: 'El archivo es demasiado grande (máximo 5MB)' });
        }
        if (err.message.includes('Solo se permiten imágenes')) {
          return res.status(400).json({ error: err.message });
        }
      }
      
      console.error('Error al registrar procedimiento:', err);
      res.status(500).json({ error: 'Error al registrar el procedimiento' });
    }
  }
);

module.exports = router;