const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); 
const db = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

dotenv.config();

const app = express(); 
app.use(cors()); 

const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Middleware para servir archivos estáticos (frontend)
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Ruta básica de prueba
app.get('/', (req, res) => {
  res.send('API funcionando');
});

// Importar y usar rutas de autenticación
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Ruta protegida (requiere token)
const verificarToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. No se ha proporcionado un token.' });
  }

  try {
    const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET || 'secreto');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(400).json({ error: 'Token inválido' });
  }
};

app.get('/perfil', verificarToken, (req, res) => {
  res.json({ mensaje: `Bienvenido ${req.user.nombre}`, rol: req.user.rol });
});

// Levantar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
