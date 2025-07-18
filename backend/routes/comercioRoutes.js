const express = require('express');
const router = express.Router();
const db = require('../db');
const verificarToken = require('../middlewares/verificarToken');
const autorizarRol = require('../middlewares/autorizarRol');
const upload = require('../middlewares/multerconfig');
const comercioController = require('../controllers/comercioController');


// GET /api/comercios (con paginación y filtros)
router.get('/', verificarToken, async (req, res) => {
  try {
    const { categoria, rubro, busqueda, pagina = 1, porPagina = 10 } = req.query;
    const offset = (pagina - 1) * porPagina;

    // Base query con COALESCE para manejar NULLs
    let query = `
      SELECT 
        c.id_comercio,
        c.nombre_comercial,
        COALESCE(rs.razon_social, 'No registrada') AS razon_social,
        c.categoria,
        COALESCE(c.rubro, 'No especificado') AS rubro,
        CASE
          WHEN rs.persona_fisica = 1 THEN CONCAT(rs.nombre, ' ', rs.apellido, ' (', rs.dni, ')')
          ELSE COALESCE(rs.razon_social, 'Titular no registrado')
        END AS titular,
        c.direccion,
        c.telefono
      FROM comercio c
      LEFT JOIN razon_social rs ON c.id_razon_social = rs.id_razon_social
      WHERE 1=1
    `;

    const params = [];
    const whereConditions = [];

    // Filtros (se combinan con AND)
    if (categoria) {
      whereConditions.push('c.categoria = ?');
      params.push(categoria);
    }
    if (rubro) {
      whereConditions.push('c.rubro = ?');
      params.push(rubro);
    }
    if (busqueda) {
      whereConditions.push('(c.nombre_comercial LIKE ? OR rs.razon_social LIKE ?)');
      params.push(`%${busqueda}%`, `%${busqueda}%`);
    }

    // Aplicar condiciones WHERE
    if (whereConditions.length > 0) {
      query += ' AND ' + whereConditions.join(' AND ');
    }

    // Paginación
    query += ' ORDER BY c.nombre_comercial ASC LIMIT ? OFFSET ?';
    params.push(Number(porPagina), offset);

    // Consulta principal
    const [comercios] = await db.query(query, params);

    // Consulta para el total (excluyendo LIMIT/OFFSET)
    let countQuery = `
      SELECT COUNT(*) AS total 
      FROM comercio c
      LEFT JOIN razon_social rs ON c.id_razon_social = rs.id_razon_social
      WHERE 1=1
    `;
    if (whereConditions.length > 0) {
      countQuery += ' AND ' + whereConditions.join(' AND ');
    }
    const [[total]] = await db.query(countQuery, params.slice(0, -2));

    res.json({
      data: comercios,
      total: total.total,
      pagina: Number(pagina),
      porPagina: Number(porPagina)
    });

  } catch (err) {
    console.error('Error en GET /api/comercios:', err);
    res.status(500).json({ 
      error: 'Error al obtener comercios',
      detalles: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// GET /api/comercios/:id - Detalle completo de un comercio (para la página comercio.html)

router.get('/:id', verificarToken, async (req, res) => {
  try {
    const [comercio] = await db.query(`
      SELECT 
        c.*,
        rs.razon_social,
        rs.nombre AS titular_nombre,
        rs.apellido AS titular_apellido,
        rs.dni AS titular_dni,
        rs.domicilio AS titular_domicilio,
        rs.telefono AS titular_telefono,
        rs.correo_electronico AS titular_email,
        rs.cuit,
        CONCAT(e.nombre, ' ', e.apellido) AS inspector_registro
      FROM comercio c
      LEFT JOIN razon_social rs ON c.id_razon_social = rs.id_razon_social
      LEFT JOIN empleado e ON c.id_empleado_registro = e.id_empleado
      WHERE c.id_comercio = ?
    `, [req.params.id]);

    if (!comercio[0]) return res.status(404).json({ error: 'Comercio no encontrado' });
    
    // Asegurar formato consistente
    const resultado = {
      ...comercio[0],
      correo_electronico: comercio[0].correo_electronico || comercio[0].titular_email,
      activo: Boolean(comercio[0].activo)
    };

    res.json(resultado);
  } catch (err) {
    res.status(500).json({ 
      error: 'Error al obtener comercio',
      detalles: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});
// PUT /api/comercios/:id/estado
router.put('/:id/estado', verificarToken, autorizarRol(['administrador']), async (req, res) => {
  try {
    await db.query('UPDATE comercio SET activo = ? WHERE id_comercio = ?', 
      [req.body.activo, req.params.id]);
    res.json({ mensaje: 'Estado actualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// PUT /api/comercios/:id - Editar comercio
router.put('/:id', verificarToken, autorizarRol(['administrador', 'administrativo']), async (req, res) => {
  try {
    const { 
      nombre_comercial, 
      direccion, 
      telefono, 
      correo_electronico, 
      rubro, 
      categoria, 
      metros_cuadrados
    } = req.body;
    
    await db.query(
      `UPDATE comercio 
       SET nombre_comercial = ?, 
           direccion = ?, 
           telefono = ?, 
           correo_electronico = ?,
           rubro = ?, 
           categoria = ?,
           metros_cuadrados = ?
       WHERE id_comercio = ?`,
      [
        nombre_comercial, 
        direccion, 
        telefono, 
        correo_electronico,
        rubro, 
        categoria,
        metros_cuadrados,
        req.params.id
      ]
    );
    
    res.json({ mensaje: 'Comercio actualizado correctamente' });
  } catch (err) {
    console.error('Error detallado:', err); // Agregar logging detallado
    res.status(500).json({ 
      error: 'Error al actualizar comercio',
      detalles: err.message // Incluir el mensaje de error específico
    });
  }
});
// DELETE /api/comercios/:id - Baja lógica de comercio
router.delete('/:id', verificarToken, autorizarRol(['administrador', 'administrativo']), async (req, res) => {
  try {
    await db.query('UPDATE comercio SET activo = 0 WHERE id_comercio = ?', [req.params.id]);
    res.json({ mensaje: 'Comercio dado de baja correctamente' });
  } catch (err) {
    res.status(500).json({ 
      error: 'Error al dar de baja el comercio',
      detalles: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

const { registrarComercio } = require('../controllers/comercioController');
// const upload = require('multer'); // Ajusta la ruta según tu estructura


router.post('/registrar', 
  verificarToken,
  upload.fields([
    { name: 'dni_titular', maxCount: 1 },
    { name: 'certificado_residencia', maxCount: 1 },
    { name: 'foto_titular', maxCount: 1 }
  ]),
  comercioController.registrarComercio
);

module.exports = router;