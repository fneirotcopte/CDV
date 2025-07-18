const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); 
const db = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const verificarToken = require('./middlewares/verificarToken');
const detectarInyeccionSQL = require('./middlewares/detectarInySQL');

dotenv.config();

const app = express(); 
app.use(cors()); 

const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());
// Middleware para servir archivos estáticos (frontend)
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads/documentos'));

app.use(detectarInyeccionSQL);

app.get('/test', (req, res) => {
  res.send('Ruta accesible');
});

// Ruta básica de prueba
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/login.html'));
});

// Importar y usar rutas de 
//autenticacion
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

//registro comercio
const comercioRoutes = require('./routes/comercioRoutes');
app.use('/', comercioRoutes);
app.use('/api/comercios', comercioRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// procedimiento
const procedimientoRoutes = require('./routes/procedimientoRoutes');
app.use('/api/procedimientos', procedimientoRoutes);

// Levantar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


