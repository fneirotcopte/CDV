const db = require('../db');

const Usuario = {
  crear: (nombre, email, contrasena, rol, callback) => {
    const sql = 'INSERT INTO usuarios (nombre, email, contrasena, rol) VALUES (?, ?, ?, ?)';
    db.query(sql, [nombre, email, contrasena, rol], callback);
  },

  buscarPorEmail: (email, callback) => {
    const sql = 'SELECT * FROM usuarios WHERE email = ?';
    db.query(sql, [email], callback);
  },

  buscarPorId: (id, callback) => {
    const sql = 'SELECT * FROM usuarios WHERE id = ?';
    db.query(sql, [id], callback);
  }
};

module.exports = Usuario;
