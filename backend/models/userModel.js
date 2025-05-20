const db = require('../db');

const crearUsuario = (nombre, email, contrasena, rol) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO usuarios (nombre, email, contrasena, rol) VALUES (?, ?, ?, ?)';
    db.query(query, [nombre, email, contrasena, rol], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

const obtenerUsuarioPorEmail = (email) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM usuarios WHERE email = ?';
    db.query(query, [email], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

const obtenerUsuarioPorId = (id) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM usuarios WHERE id = ?';
    db.query(query, [id], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

module.exports = {
  crearUsuario,
  obtenerUsuarioPorEmail,
  obtenerUsuarioPorId
};
