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

const obtenerEmpleadoPorApellido = async (apellido) => {
  const query = 'SELECT * FROM empleado WHERE apellido = ?';
  const [rows] = await db.query(query, [apellido]);
  return rows;
};


const actualizarEmpleado = async (id_empleado, datosActualizados) => {
  const { 
    nombre, 
    apellido, 
    dni, 
    domicilio, 
    telefono, 
    area, 
    correo_electronico, 
    rol,
    activo 
  } = datosActualizados;

  const query = `
    UPDATE empleado 
    SET 
      nombre = ?, 
      apellido = ?, 
      dni = ?, 
      domicilio = ?, 
      telefono = ?, 
      area = ?, 
      correo_electronico = ?, 
      rol = ?,
      activo = ?
    WHERE id_empleado = ?
  `;
  
  await db.query(query, [
    nombre, 
    apellido, 
    dni, 
    domicilio, 
    telefono, 
    area, 
    correo_electronico, 
    rol,
    activo,
    id_empleado
  ]);
};

const obtenerEmpleadoPorId = async (id_empleado) => {
  const query = 'SELECT * FROM empleado WHERE id_empleado = ?';
  const [rows] = await db.query(query, [id_empleado]);
  return rows[0];
};

const cambiarEstadoEmpleado = async (id_empleado, estado) => {
  const query = 'UPDATE empleado SET activo = ? WHERE id_empleado = ?';
  await db.query(query, [estado, id_empleado]);
};

// Actualizar el exports
module.exports = {
  crearEmpleado,
  obtenerEmpleadoPorEmail,
  obtenerEmpleadoPorApellido,
  obtenerEmpleadoPorDNI,
  actualizarEmpleado,
  obtenerEmpleadoPorId,
  cambiarEstadoEmpleado
};
