const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

// Registrar nuevo usuario
const registrar = async (req, res) => {
  const { nombre, email, contrasena, rol } = req.body;

  if (!nombre || !email || !contrasena || !rol) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    // Verificar si el usuario ya existe
    userModel.obtenerUsuarioPorEmail(email, async (err, results) => {
      if (err) {
        console.error('Error al buscar usuario:', err.message);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }

      if (results.length > 0) {
        return res.status(400).json({ error: 'El usuario ya existe' });
      }

      // Encriptar contraseña
      const salt = await bcrypt.genSalt(10);
      const contrasenaEncriptada = await bcrypt.hash(contrasena, salt);

      // Crear usuario
      userModel.crearUsuario(nombre, email, contrasenaEncriptada, rol, (err, result) => {
        if (err) {
          console.error('Error al crear usuario:', err.message);
          return res.status(500).json({ error: 'Error interno del servidor' });
        }
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
      });
    });
  } catch (error) {
    console.error('Error al registrar:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Login de usuario
const login = (req, res) => {
  const { email, contrasena } = req.body;

  if (!email || !contrasena) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  userModel.obtenerUsuarioPorEmail(email, async (err, results) => {
    if (err) {
      console.error('Error al buscar usuario:', err.message);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const usuario = results[0];

    // Comparar contraseñas
    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!contrasenaValida) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.json({ message: 'Login exitoso', token });
  });
};

module.exports = {
  registrar,
  login
};
