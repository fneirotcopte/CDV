const autorizarRol = (rolPermitido) => {
  return (req, res, next) => {
    if (!req.empleado || req.empleado.rol !== rolPermitido) {
      return res.status(403).json({ error: 'No autorizado' });
    }
    next();
  };
};

module.exports = autorizarRol;

