const autorizarRol = (rolesPermitidos) => {
  return (req, res, next) => {
    const usuario = req.usuario; // lo establecimos en verificarToken

    if (!usuario || !rolesPermitidos.includes(usuario.rol)) {
      return res.status(403).json({ error: 'Acceso denegado: rol no autorizado' });
    }

    next();
  };
};

module.exports = autorizarRol;

