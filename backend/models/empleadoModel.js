// const db = require('../db');

// const crearEmpleado = (nombre, apellido, dni, domicilio, telefono, area, contraseña, correo_electronico, rol) => {
//   return new Promise((resolve, reject) => {
//     const query = 'INSERT INTO empleado (nombre, apellido, dni, domicilio, telefono, area, contraseña, correo_electronico, rol) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
//     db.query(query, [nombre, apellido, dni, domicilio, telefono, area, contraseña, correo_electronico, rol], (err, results) => {
//       if (err) reject(err);
//       else resolve(results);
//     });
//   });
// };

// const obtenerEmpleadoPorEmail = (correo_electronico) => {
//   return new Promise((resolve, reject) => {
//     const query = 'SELECT * FROM empleado WHERE correo_electronico = ?';
//     db.query(query, [correo_electronico], (err, results) => {
//       if (err) reject(err);
//       else resolve(results);
//     });
//   });
// };

// const obtenerEmpleadoPorDNI = (dni) => {
//   return new Promise((resolve, reject) => {
//     const query = 'SELECT * FROM empleado WHERE dni = ?';
//     db.query(query, [dni], (err, results) => {
//       if (err) reject(err);
//       else resolve(results);
//     });
//   });
// };

// // agregar eliminar empleado

// module.exports = {
//   crearEmpleado,
//   obtenerEmpleadoPorEmail,
//   obtenerEmpleadoPorDNI
// };


const db = require('../db');

const crearEmpleado = async (nombre, apellido, dni, domicilio, telefono, area, contraseña, correo_electronico, rol) => {
  const query = `
    INSERT INTO empleado (nombre, apellido, dni, domicilio, telefono, area, contraseña, correo_electronico, rol) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  await db.query(query, [nombre, apellido, dni, domicilio, telefono, area, contraseña, correo_electronico, rol]);
};

const obtenerEmpleadoPorEmail = async (correo_electronico) => {
  const query = 'SELECT * FROM empleado WHERE correo_electronico = ?';
  const [rows] = await db.query(query, [correo_electronico]);
  return rows;
};

const obtenerEmpleadoPorDNI = async (dni) => {
  const query = 'SELECT * FROM empleado WHERE dni = ?';
  const [rows] = await db.query(query, [dni]);
  return rows;
};

const eliminarEmpleadoPorDni = async (dni) => {
  const query = 'DELETE FROM empleado WHERE dni = ?';
  await db.query(query, [dni]);
};

const eliminarEmpleadoPorEmail = async (correo_electronico) => {
  const query = 'DELETE FROM empleado WHERE correo_electronico = ?';
  await db.query(query, [correo_electronico]);
};




module.exports = {
  crearEmpleado,
  obtenerEmpleadoPorEmail,
  obtenerEmpleadoPorDNI,
  eliminarEmpleadoPorDni,
  eliminarEmpleadoPorEmail
};
