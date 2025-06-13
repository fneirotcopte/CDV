const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); 
const db = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const verificarToken = require('./middlewares/verificarToken');


dotenv.config();

const app = express(); 
app.use(cors()); 

const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());
// Middleware para servir archivos estáticos (frontend)
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.urlencoded({ extended: true }));

// Ruta básica de prueba
app.get('/', (req, res) => {
  res.send('API funcionando');
});



// Importar y usar rutas de 
//autenticacion
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

//registro comercio
const comercioRoutes = require('./routes/comercioRoutes');
app.use('/', comercioRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//verificarRol
// const autorizarRol = (rolPermitido) => {
//   return (req, res, next) => {
//     if (!req.user || req.user.rol !== rolPermitido) {
//       return res.status(403).json({ error: 'No autorizado' });
//     }
//     next();
//   };
// };

// module.exports = autorizarRol;



// Ruta protegida (requiere token)
// const verificarToken = (req, res, next) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');

//   if (!token) {
//     return res.status(401).json({ error: 'Acceso denegado. No se ha proporcionado un token.' });
//   }

//   try {
//     const secret = process.env.JWT_SECRET;
//     if (!secret) {
//       throw new Error('JWT_SECRET no está definido en las variables de entorno');
//     }

//     const decoded = jwt.verify(token, secret);
//     req.empleado = decoded;
//     next();
//   } catch (err) {
//     return res.status(400).json({ error: 'Token inválido' });
//   }
// };



app.get('/perfil', verificarToken, (req, res) => {
  res.json({ mensaje: `Bienvenido ${req.empleado.nombre}`, rol: req.empleado.rol });
});


// Levantar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

