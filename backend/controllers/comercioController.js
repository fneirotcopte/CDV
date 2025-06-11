// const connection = require('../db');

// exports.registrarComercio = (req, res) => {
//   const {
//     nombre,
//     apellido,
//     cuit,
//     domicilio,
//     telefono_prop, 
//     email_prop,

//     nombre_comercial,
//     ubicacion,
//     telefono_com,
//     email_com,
//     rubro
//   } = req.body;

//   const archivos = req.files || [];

//   connection.beginTransaction(err => {
//     if (err) {
//       console.error('Error al iniciar transacción:', err);
//       return res.status(500).send('Error interno');
//     }


//     const buscarRazonSocialQuery = `SELECT id_razon_social FROM Razon_Social WHERE cuit = ?`;

//     connection.query(buscarRazonSocialQuery, [cuit], (err, results) => {
//       if (err) {
//         return connection.rollback(() => {
//           console.error('Error al buscar razón social:', err);
//           res.status(500).send('Error al buscar razón social');
//         });
//       }

//       if (results.length > 0) {

//         const id_razon_social = results[0].id_razon_social;
//         insertarComercio(id_razon_social);
//       } else {

//         const insertarRazonSocialQuery = `
//           INSERT INTO Razon_Social (nombre, apellido, cuit, domicilio, telefono, correo_electronico)
//           VALUES (?, ?, ?, ?. ?, ?)
//         `;
//         const usuarioParams = [, email_prop, 'razon social'];

//         connection.query(insertarRazonSocialQuery, razonParams, (err, razonResult) => {
//           if (err) {
//             return connection.rollback(() => {
//               console.error('Error al insertar usuario:', err);
//               res.status(500).send('Error al crear usuario');
//             });
//           }

//           const id_razon_social = usuarioResult.insertId;

//           const insertarRazonSocialQuery = `
//           INSERT INTO Razon_Social (nombre, apellido, cuit, domicilio, telefono, correo_electronico)
//           VALUES (?, ?, ?, ?. ?, ?)
//           `;
//           const razonParams = [nombre, apellido, cuit, domicilio, telefono, correo_electronico];

//           connection.query(insertarRazonSocialQuery, razonParams, (err) => {
//             if (err) {
//               return connection.rollback(() => {
//                 console.error('Error al insertar razón social:', err);
//                 res.status(500).send('Error al registrar razón social');
//               });
//             }

//             insertarComercio(id_razon_social);
//           });
//         });
//       }

//       function insertarComercio(id_razon_social) {
//         const comercioQuery = `
//           INSERT INTO Comercio (nombre_comercial, dirección, teléfono, correo_electronico, id_razon_social)
//           VALUES (?, ?, ?, ?, ?)
//         `;
//         const comercioParams = [
//           nombre_comercial,
//           ubicacion,
//           telefono_com,
//           email_com,
//           id_usuario
//         ];

//         connection.query(comercioQuery, comercioParams, (err, comercioResult) => {
//           if (err) {
//             return connection.rollback(() => {
//               console.error('Error al insertar comercio:', err);
//               res.status(500).send('Error al registrar comercio');
//             });
//           }

//           const id_comercio = comercioResult.insertId;

//           // Insertar documentos asociados
//           const promesasDocs = archivos.map(file => {
//             return new Promise((resolve, reject) => {
//               const docQuery = `
//                 INSERT INTO Documentos (id_comercio, nombre_archivo, ruta)
//                 VALUES (?, ?, ?)
//               `;
//               const docParams = [id_comercio, file.filename, file.path];

//               connection.query(docQuery, docParams, (err) => {
//                 if (err) return reject(err);
//                 resolve();
//               });
//             });
//           });

//           Promise.all(promesasDocs)
//             .then(() => {
//               connection.commit(err => {
//                 if (err) {
//                   return connection.rollback(() => {
//                     console.error('Error al hacer commit:', err);
//                     res.status(500).send('Error al confirmar transacción');
//                   });
//                 }

//                 res.send('Comercio y documentos registrados correctamente.');
//               });
//             })
//             .catch(err => {
//               connection.rollback(() => {
//                 console.error('Error al insertar documentos:', err);
//                 res.status(500).send('Error al registrar documentos');
//               });
//             });
//         });
//       }
//     });
//   });
// };


// const express = require("express");
// const router = express.Router();
// const db = require("../db"); // conexión a MySQL
// const multer = require("multer");
// const path = require("path");

// // Configuración de multer
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/"); // asegurate de tener esta carpeta
//   },
//   filename: function (req, file, cb) {
//     const uniqueName = Date.now() + "-" + file.originalname;
//     cb(null, uniqueName);
//   }
// });
// const upload = multer({ storage });

// router.post("/registro-comercio", upload.array("archivos", 10), async (req, res) => {
//   const archivos = req.files;
//   const {
//     nombre,
//     apellido,
//     cuit,
//     domicilio,
//     telefono_prop,
//     email_prop,
//     nombre_comercial,
//     ubicacion,
//     telefono_com,
//     email_com,
//     rubro
//   } = req.body;

//   if (
//     !nombre || !apellido || !cuit || !domicilio || !telefono_prop || !email_prop ||
//     !nombre_comercial || !ubicacion || !telefono_com || !email_com || !rubro
//   ) {
//     return res.status(400).json({ error: "Todos los campos son obligatorios." });
//   }

//   const connection = await db.promise().getConnection();
//   try {
//     await connection.beginTransaction();

//     // 1. Verificar si la razón social ya existe
//     const [razonResult] = await connection.query(
//       "SELECT id_razon_social FROM Razon_Social WHERE cuit = ?",
//       [cuit]
//     );

//     let id_razon_social;
//     if (razonResult.length > 0) {
//       id_razon_social = razonResult[0].id_razon_social;
//     } else {
//       const [insertResult] = await connection.query(
//         `INSERT INTO Razon_Social (nombre, apellido, cuit, domicilio, telefono, correo_electronico)
//          VALUES (?, ?, ?, ?, ?, ?)`,
//         [nombre, apellido, cuit, domicilio, telefono_prop, email_prop]
//       );
//       id_razon_social = insertResult.insertId;
//     }

//     // 2. Insertar el comercio
//     const [comercioResult] = await connection.query(
//       `INSERT INTO Comercio (nombre_comercial, direccion, telefono, correo_electronico, rubro, id_razon_social)
//        VALUES (?, ?, ?, ?, ?, ?)`,
//       [nombre_comercial, ubicacion, telefono_com, email_com, rubro, id_razon_social]
//     );
//     const id_comercio = comercioResult.insertId;

//     // 3. Insertar documentos asociados
//     const promesasDocs = archivos.map(file => {
//       return connection.query(
//         `INSERT INTO Documentos (id_comercio, nombre_archivo, ruta)
//          VALUES (?, ?, ?)`,
//         [id_comercio, file.filename, file.path]
//       );
//     });

//     await Promise.all(promesasDocs);

//     // 4. Confirmar la transacción
//     await connection.commit();
//     res.status(201).json({ message: "Comercio y documentos registrados correctamente." });

//   } catch (err) {
//     console.error("Error durante la transacción:", err);
//     await connection.rollback();
//     res.status(500).json({ error: "Error al registrar el comercio y documentos." });
//   } finally {
//     connection.release();
//   }
// });

// module.exports = router;

// // comercioController.js
// const db = require("../db");

// exports.registrarComercio = async (req, res) => {
//   const archivos = req.files;
//   const {
//     nombre,
//     apellido,
//     cuit,
//     domicilio,
//     telefono_prop,
//     email_prop,
//     nombre_comercial,
//     ubicacion,
//     telefono_com,
//     email_com,
//     rubro
//   } = req.body;

//   if (
//     !nombre || !apellido || !cuit || !domicilio || !telefono_prop || !email_prop ||
//     !nombre_comercial || !ubicacion || !telefono_com || !email_com || !rubro
//   ) {
//     return res.status(400).json({ error: "Todos los campos son obligatorios." });
//   }

//   // const connection = await db.promise().getConnection();
//   // try {
//   //   await connection.beginTransaction();
//   let pool;
//   try {
//      pool = await db.getConnection(); 
//      await pool.beginTransaction();

//     const [razonResult] = await pool.query(
//       "SELECT id_razon_social FROM Razon_Social WHERE cuit = ?",
//       [cuit]
//     );

//     let id_razon_social;
//     if (razonResult.length > 0) {
//       id_razon_social = razonResult[0].id_razon_social;
//     } else {
//       const [insertResult] = await pool.query(
//         `INSERT INTO Razon_Social (nombre, apellido, cuit, domicilio, telefono, correo_electronico)
//          VALUES (?, ?, ?, ?, ?, ?)`,
//         [nombre, apellido, cuit, domicilio, telefono_prop, email_prop]
//       );
//       id_razon_social = insertResult.insertId;
//     }

//     const [comercioResult] = await pool.query(
//       `INSERT INTO Comercio (nombre_comercial, direccion, telefono, correo_electronico, rubro, id_razon_social)
//        VALUES (?, ?, ?, ?, ?, ?)`,
//       [nombre_comercial, ubicacion, telefono_com, email_com, rubro, id_razon_social]
//     );
//     const id_comercio = comercioResult.insertId;

//     const promesasDocs = archivos.map(file => {
//       return pool.query(
//         `INSERT INTO Documentos (id_comercio, nombre_archivo, ruta)
//          VALUES (?, ?, ?)`,
//         [id_comercio, file.filename, file.path]
//       );
//     });

//     await Promise.all(promesasDocs);
//     await pool.commit();
//     res.status(201).json({ message: "Comercio y documentos registrados correctamente." });

//   } catch (err) {
//     console.error("Error durante la transacción:", err);
//     await pool.rollback();
//     res.status(500).json({ error: "Error al registrar el comercio y documentos." });
//   } finally {
//     pool.release();
//   }
// };

const db = require("../db"); 

exports.registrarComercio = async (req, res) => {
  const archivos = req.files;
  const {
    nombre,
    apellido,
    cuit,
    domicilio,
    telefono_prop,
    email_prop,
    nombre_comercial,
    ubicacion,
    telefono_com,
    email_com,
    rubro
  } = req.body;

  if (
    !nombre || !apellido || !cuit || !domicilio || !telefono_prop || !email_prop ||
    !nombre_comercial || !ubicacion || !telefono_com || !email_com || !rubro
  ) {
    return res.status(400).json({ error: "Todos los campos son obligatorios." });
  }

  let connection;
  try {
    connection = await db.getConnection(); 
    await connection.beginTransaction();

    const [razonResult] = await connection.query(
      "SELECT id_razon_social FROM Razon_Social WHERE cuit = ?",
      [cuit]
    );

    let id_razon_social;
    if (razonResult.length > 0) {
      id_razon_social = razonResult[0].id_razon_social;
    } else {
      const [insertResult] = await connection.query(
        `INSERT INTO Razon_Social (nombre, apellido, cuit, domicilio, telefono, correo_electronico)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [nombre, apellido, cuit, domicilio, telefono_prop, email_prop]
      );
      id_razon_social = insertResult.insertId;
    }

    const [comercioResult] = await connection.query(
      `INSERT INTO Comercio (nombre_comercial, direccion, telefono, correo_electronico, rubro, id_razon_social)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre_comercial, ubicacion, telefono_com, email_com, rubro, id_razon_social]
    );
    const id_comercio = comercioResult.insertId;

    const promesasDocs = archivos.map(file => {
      return connection.query(
        `INSERT INTO Documentos (id_comercio, nombre_archivo, ruta)
         VALUES (?, ?, ?)`,
        [id_comercio, file.filename, file.path]
      );
    });

    await Promise.all(promesasDocs);
    await connection.commit();
    res.status(201).json({ message: "Comercio y documentos registrados correctamente." });

  } catch (err) {
    console.error("Error durante la transacción:", err);
    if (connection) await connection.rollback();
    res.status(500).json({ error: "Error al registrar el comercio y documentos." });
  } finally {
    if (connection) connection.release();
  }
};
