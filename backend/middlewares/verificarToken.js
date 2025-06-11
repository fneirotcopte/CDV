const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. No se ha proporcionado un token.' });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET no está definido en las variables de entorno');
    }

    const decoded = jwt.verify(token, secret);
    req.empleado = decoded;
    next();
  } catch (err) {
    return res.status(400).json({ error: 'Token inválido' });
  }
};

module.exports = verificarToken;