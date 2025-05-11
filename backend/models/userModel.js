const db = require('../db');

const crearUsuario = (nombre, email, contrasenaEncriptada, rol, callback) => {
  const query = 'INSERT INTO usuarios (nombre, email, contrasena, rol) VALUES (?, ?, ?, ?)';
  db.query(query, [nombre, email, contrasenaEncriptada, rol], callback);
};

const obtenerUsuarioPorEmail = (email, callback) => {
  const query = 'SELECT * FROM usuarios WHERE email = ?';
  db.query(query, [email], callback);
};

module.exports = {
  crearUsuario,
  obtenerUsuarioPorEmail
};
