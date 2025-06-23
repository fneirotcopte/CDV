
const pool = require('../db'); // Asumo que tienes un pool de conexión MySQL con promise

exports.registrarComercio = async (req, res) => {
  try {
    const {
      personaFisica, nombre, apellido, dni, razon_social, cuit, domicilio, tipoTitular,
      telefono_prop, email_prop,
      categoria, rubro, nombreComercial, metrosCuadrados, ubicacion, telefono, email,
      inputAnexo
    } = req.body;

    const fotoTitular = req.file; // multer single

    // Validaciones básicas
    if (!nombre || !apellido || !cuit || !domicilio || !telefono_prop || !email_prop ||
        !nombreComercial || !ubicacion || !telefono || !email || !rubro || !categoria) {
      return res.status(400).json({ error: "Todos los campos son obligatorios." });
    }

    // Guardar foto (si existe) path relativo
    const fotoPath = fotoTitular ? fotoTitular.path : null;

    // Insertar en Razon_Social
    const [resultRazon] = await pool.query(
      `INSERT INTO Razon_Social 
       (nombre, apellido, dni, razon_social, cuit, domicilio, telefono, correo_electronico, persona_fisica, tipo_titular, foto_persona) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, apellido, dni || null, razon_social || null, cuit, domicilio, telefono_prop, email_prop, personaFisica ? 1 : 0, tipoTitular, fotoPath]
    );

    const idRazonSocial = resultRazon.insertId;

    const idEmpleadoRegistro = req.usuario.id_empleado;  //     const idEmpleadoRegistro = req.usuario?.id_empleado || null;


    // // Verificación extra para evitar errores
    // if (!idEmpleadoRegistro) {
    //   return res.status(400).json({ error: "No se pudo determinar el empleado que registra." });
    // }

    // Insertar en Comercio
    const [resultComercio] = await pool.query(
      `INSERT INTO Comercio
       (nombre_comercial, direccion, telefono, correo_electronico, rubro, categoria, metros_cuadrados, id_razon_social, id_empleado_registro)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombreComercial, ubicacion, telefono, email, rubro, categoria, metrosCuadrados || null, idRazonSocial, idEmpleadoRegistro]
    );

    const idComercio = resultComercio.insertId;

    // Insertar en Comercio_Anexo (si inputAnexo no vacío)
    if (inputAnexo) {
      const rubros = Array.isArray(inputAnexo) ? inputAnexo : [inputAnexo];

      for (const r of rubros) {
        if (r && r.trim() !== '') {
          await pool.query(
            `INSERT INTO Comercio_Anexo (id_comercio, rubro) VALUES (?, ?)`,
            [idComercio, r.trim()]
          );
        }
      }
    }

    res.status(201).json({ message: "Registro exitoso.", idComercio });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al registrar." });
  }
};
