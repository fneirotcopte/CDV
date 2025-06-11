const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const empleadoModel = require('../models/empleadoModel');

const registrar = async (req, res) => {
  const { nombre, apellido, dni, domicilio, telefono, area, contraseña, correo_electronico, rol } = req.body;

  if (!nombre || !apellido || !dni || !domicilio || !telefono || !area || !contraseña || !correo_electronico  || !rol) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const empleado = await empleadoModel.obtenerEmpleadoPorEmail(correo_electronico);
    if (empleado.length > 0) {
      return res.status(400).json({ error: 'El empleado ya está registrado.' });
    }

    const salt = await bcrypt.genSalt(10);
    const contraseñaEncriptada = await bcrypt.hash(contraseña, salt);

    await empleadoModel.crearEmpleado(nombre, apellido, dni, domicilio, telefono, area, contraseñaEncriptada, correo_electronico, rol);
    res.status(201).json({ message: 'Empleado registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};




const login = async (req, res) => {
  const { correo_electronico, contraseña } = req.body;

  if (!correo_electronico || !contraseña) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const empleados = await empleadoModel.obtenerEmpleadoPorEmail(correo_electronico);

    if (empleados.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const empleado = empleados[0];
    const contraseñaValida = await bcrypt.compare(contraseña, empleado.contraseña);

    if (!contraseñaValida) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ nombre: empleado.nombre, id_empleado: empleado.id_empleado, rol: empleado.rol }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.json({ message: 'Login exitoso', token });
  } catch (error) {
    console.error('Error al hacer login:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


const eliminar = async (req, res) => {
  const { dni, correo_electronico } = req.body;

  if (!dni && !correo_electronico) {
    return res.status(400).json({ error: 'Debes proporcionar un DNI o un correo electrónico para eliminar al empleado.' });
  }

  try {
    if (dni) {
      await empleadoModel.eliminarEmpleadoPorDni(dni);
      return res.status(200).json({ message: `Empleado eliminado correctamente.` });
    }

    if (correo_electronico) {
      await empleadoModel.eliminarEmpleadoPorEmail(correo_electronico);
      return res.status(200).json({ message: `Empleado eliminado correctamente.` });
    }
  } catch (error) {
    console.error('Error al eliminar empleado:', error.message);
    return res.status(500).json({ error: 'Error al eliminar empleado.' });
  }
};




module.exports = {
  registrar,
  login,
  eliminar
};


