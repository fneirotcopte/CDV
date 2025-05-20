const db = require('./db');
const bcrypt = require('bcryptjs');

db.query('SELECT * FROM usuarios', async (err, results) => {
  if (err) {
    console.error('Error al obtener los usuarios:', err.message);
    return;
  }

  for (const usuario of results) {
    // Si ya está encriptada, la saltamos (esto es útil si se ejecuta más de una vez por accidente)
     if (/^\$2[aby]\$.{56}$/.test(usuario.contrasena)) {
       console.log(`El usuario ${usuario.email} ya tiene la contraseña encriptada.`);
     continue;
   }

    const hash = await bcrypt.hash(usuario.contrasena, 10);

    db.query(
      'UPDATE usuarios SET contrasena = ? WHERE id = ?',
      [hash, usuario.id],
      (err) => {
        if (err) {
          console.error(`Error actualizando a ${usuario.email}:`, err.message);
        } else {
          console.log(`Contraseña encriptada para ${usuario.email}`);
        }
      }
    );
  }
});
