// const db = require('./db');
// const bcrypt = require('bcryptjs');

                                                                                                         // //se usa para prueba se encripta solo.


// db.query('SELECT * FROM empleado', async (err, results) => {
//   if (err) {
//     console.error('Error al obtener los usuarios:', err.message);
//     return;
//   }

//   for (const empleado of results) {
//     // Si ya está encriptada no vuelve a encriptar
//      if (/^\$2[aby]\$.{56}$/.test(empleado.contraseña)) {
//        console.log(`El empleado ${empleado.correo_electronico} ya tiene la contraseña encriptada.`);
//      continue;
//    }

//     const hash = await bcrypt.hash(empleado.contraseña, 10);

//     db.query(
//       'UPDATE empleado SET contraseña = ? WHERE id_empleado = ?',
//       [hash, empleado.id_empleado],
//       (err) => {
//         if (err) {
//           console.error(`Error actualizando a ${empleado.correo_electronico}:`, err.message);
//         } else {
//           console.log(`Contraseña encriptada para ${empleado.correo_electronico}`);
//         }
//       }
//     );
//   }
// });


                                                                                                                       // si funciona todo eliminar esto.