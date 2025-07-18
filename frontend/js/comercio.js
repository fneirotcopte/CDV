import { checkAuth, infoUsuario } from '../auth.js';

// Variables globales
let modoEdicion = false;
let idComercio = null;
let comercioOriginal = null;

// Función helper para asignar contenido seguro
/* function safeSetContent(id, value, suffix = '') {
  const element = document.getElementById(id);
  if (!element) {
    console.error(`Elemento no encontrado: #${id}`);
    return;
  }
  
  // Manejo especial para campos de fecha
  if (id === 'fecha-vencimiento' || id === 'fecha-registro') {
    if (value) {
      const date = new Date(value);
      const formattedDate = date.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      element.value = formattedDate;
    } else {
      element.value = 'No especificado';
    }
    return;
  }

  // Manejo normal para otros campos
  if (element.tagName === 'INPUT') {
    element.value = value ? `${value}${suffix}` : '';
  } else {
    element.textContent = value ? `${value}${suffix}` : 'No especificado';
  }
} */
/*
function safeSetContent(id, value, suffix = '') {
  const element = document.getElementById(id);
  if (!element) {
    console.error(`Elemento no encontrado: #${id}`);
    return;
  }
  
  // Manejo especial para campos de fecha
  if (id === 'fecha-vencimiento' || id === 'fecha-registro') {
    if (value) {
      const date = new Date(value);
      
      // Verificación extra para fechas inválidas
      if (isNaN(date.getTime())) {
        console.error(`Fecha inválida para ${id}:`, value);
        element.textContent = 'Fecha inválida';
        return;
      }
      
      const formattedDate = date.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      
      // SOLUCIÓN CLAVE: Usar textContent para elementos <p>
      element.textContent = formattedDate;
    } else {
      element.textContent = 'No especificado';
    }
    return;
  }

  // Manejo normal para otros campos
  const displayValue = value ? `${value}${suffix}` : 'No especificado';
  if (element.tagName === 'INPUT' || element.tagName === 'SELECT') {
    element.value = displayValue;
  } else {
    element.textContent = displayValue;
  }
} */
function safeSetContent(id, value) {
  const element = document.getElementById(id);
  if (!element) return;

  const formatDate = (dateValue) => {
    try {
      const date = new Date(dateValue);
      return isNaN(date.getTime()) ? 'Fecha inválida' : 
        date.toLocaleDateString('es-AR');
    } catch {
      return 'Fecha inválida';
    }
  };

  const displayValue = !value ? 'No especificado' : 
    (id.includes('fecha') ? formatDate(value) : value);

  if (element.tagName === 'INPUT') {
    element.value = displayValue;
  } else {
    element.textContent = displayValue;
  }
}
// Función para activar/desactivar el modo edición
function toggleModoEdicion() {
  modoEdicion = !modoEdicion;
  const btnEditar = document.getElementById('btn-editar');
  const btnCancelar = document.getElementById('btn-cancelar');
  const btnBaja = document.getElementById('btn-baja');
  
  if (modoEdicion) {
    btnEditar.innerHTML = '<i class="fas fa-save"></i> Guardar cambios';
    btnEditar.classList.remove('boton-primario');
    btnEditar.classList.add('boton-exito');
    btnCancelar.style.display = 'inline-block';
    btnBaja.style.display = 'none';
    
    document.querySelectorAll('.campo-edit').forEach(input => {
      input.disabled = false;
    });

    const fechaVencimiento = document.getElementById('fecha-vencimiento');
    if (fechaVencimiento) {
      fechaVencimiento.readOnly = true;
    }
  } else {
    btnEditar.innerHTML = '<i class="fas fa-edit"></i> Editar Comercio';
    btnEditar.classList.remove('boton-exito');
    btnEditar.classList.add('boton-primario');
    btnCancelar.style.display = 'none';
    btnBaja.style.display = 'inline-block';
    
    document.querySelectorAll('.campo-edit').forEach(input => {
      input.disabled = true;
    });
  }
}

// Función para guardar los cambios
async function guardarCambios() {
  try {
    const datosActualizados = {
      nombre_comercial: document.getElementById('nombre-comercial').value,
      razon_social: document.getElementById('razon-social').value,
      direccion: document.getElementById('direccion').value,
      telefono: document.getElementById('telefono').value,
      correo_electronico: document.getElementById('correo').value,
      rubro: document.getElementById('rubro').value,
      categoria: document.getElementById('categoria').value,
      metros_cuadrados: document.getElementById('metros').value
    };

    const response = await fetch(`/api/comercios/${idComercio}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datosActualizados)
    });

    if (!response.ok) throw new Error(await response.text());
    window.location.reload();
    
  } catch (error) {
    console.error('Error al guardar:', error);
    alert('Error al guardar cambios: ' + error.message);
    cargarDatosComercio(comercioOriginal);
    toggleModoEdicion();
  }
}

// Función para cargar los datos del comercio
function cargarDatosComercio(comercio) {
  safeSetContent('nombre-comercial', comercio.nombre_comercial);
  safeSetContent('razon-social', comercio.razon_social);
  safeSetContent('direccion', comercio.direccion);
  safeSetContent('telefono', comercio.telefono);
  safeSetContent('correo', comercio.correo_electronico);
  safeSetContent('rubro', comercio.rubro);
  safeSetContent('categoria', comercio.categoria);
  safeSetContent('metros', comercio.metros_cuadrados);
  safeSetContent('empleado-registro', comercio.inspector_registro);
  safeSetContent('fecha-vencimiento', comercio.fecha_vencimiento);
  safeSetContent('fecha-registro', comercio.fecha_registro);

  const estadoHabilitacion = document.getElementById('estado-habilitacion');
  if (estadoHabilitacion) {
    const hoy = new Date();
    const vencimiento = new Date(comercio.fecha_vencimiento);
    const estaVencido = vencimiento < hoy;

    if (estaVencido) {
      estadoHabilitacion.textContent = 'Habilitación vencida';
      estadoHabilitacion.className = 'estado-inactivo';
    } else {
      estadoHabilitacion.textContent = 'Habilitación al día';
      estadoHabilitacion.className = 'estado-activo';
    }
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // 1. Verificar autenticación
    const userData = checkAuth();
    if (!userData) {
      window.location.href = 'login.html';
      return;
    }
    infoUsuario(userData);

    // 2. Configurar logout
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
      });
    }

    // 3. Obtener ID de la URL
    const urlParams = new URLSearchParams(window.location.search);
    idComercio = urlParams.get('id');
    if (!idComercio) throw new Error('ID de comercio no especificado');

    // 4. Cargar datos del comercio
    const response = await fetch(`/api/comercios/${idComercio}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) throw new Error(`Error ${response.status}: ${await response.text()}`);

    const comercio = await response.json();
    comercioOriginal = {...comercio};

    // 5. Mostrar datos
    cargarDatosComercio(comercio);

    // 6. Configurar visibilidad según rol
    const contenedorAcciones = document.getElementById('contenedor-acciones');
    const estadoComercialCampo = document.querySelector('.campo:has(#btn-estado-comercial)');
    
    // Ocultar elementos por defecto
    if (contenedorAcciones) contenedorAcciones.style.display = 'none';
    if (estadoComercialCampo) estadoComercialCampo.style.display = 'none';

    if (userData.rol === 'inspector') {
      // Crear contenedor exclusivo para inspector
      const contenedorInspector = document.createElement('div');
      contenedorInspector.className = 'footer-acciones inspector-actions';
      contenedorInspector.id = 'contenedor-inspector';
      
      // Crear y configurar botón de procedimiento
      const btnProcedimiento = document.createElement('button');
      btnProcedimiento.id = 'btn-procedimiento';
      btnProcedimiento.className = 'boton-primario';
      btnProcedimiento.innerHTML = '<i class="fas fa-clipboard-check"></i> Registrar Procedimiento';
      
      // Insertar en el DOM
      document.querySelector('.detalle-comercio').appendChild(contenedorInspector);
      contenedorInspector.appendChild(btnProcedimiento);
      
      // Configurar evento
      btnProcedimiento.addEventListener('click', () => {
        window.location.href = `procedimiento.html?id_comercio=${idComercio}`;
      });
    } 
    else if (['administrador', 'administrativo'].includes(userData.rol)) {
      // Mostrar elementos para admin/administrativos
      if (contenedorAcciones) contenedorAcciones.style.display = 'flex';
      if (estadoComercialCampo) estadoComercialCampo.style.display = 'block';

      // Configurar botón de estado comercial
      const btnEstadoComercial = document.getElementById('btn-estado-comercial');
      if (btnEstadoComercial) {
        const textoEstado = document.getElementById('texto-estado');
        if (comercio.activo) {
          btnEstadoComercial.className = 'estado-comercial-btn activo';
          textoEstado.textContent = 'Activo';
        } else {
          btnEstadoComercial.className = 'estado-comercial-btn inactivo';
          textoEstado.textContent = 'Inactivo';
        }

        btnEstadoComercial.addEventListener('click', async () => {
          const accion = comercio.activo ? 'inactivar' : 'reactivar';
          if (confirm(`¿Está seguro que desea ${accion} este comercio?`)) {
            try {
              const response = await fetch(`/api/comercios/${idComercio}/estado`, {
                method: 'PUT',
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  activo: !comercio.activo
                })
              });
              
              if (!response.ok) throw new Error(await response.text());
              window.location.reload();
            } catch (error) {
              console.error('Error:', error);
              alert(`Error: ${error.message}`);
            }
          }
        });
      }

      // Configurar botones de edición/baja
      const btnEditar = document.getElementById('btn-editar');
      const btnCancelar = document.getElementById('btn-cancelar');
      const btnBaja = document.getElementById('btn-baja');

      if (btnEditar) {
        btnEditar.addEventListener('click', async () => {
          if (modoEdicion) {
            await guardarCambios();
          } else {
            toggleModoEdicion();
          }
        });
      }

      if (btnCancelar) {
        btnCancelar.addEventListener('click', () => {
          cargarDatosComercio(comercioOriginal);
          toggleModoEdicion();
        });
      }

      if (btnBaja) {
        btnBaja.innerHTML = comercio.activo 
          ? '<i class="fas fa-trash"></i> Dar de Baja' 
          : '<i class="fas fa-redo"></i> Reactivar';
        
        btnBaja.addEventListener('click', async () => {
          const accion = comercio.activo ? 'inactivar' : 'reactivar';
          if (confirm(`¿Está seguro que desea ${accion} este comercio?`)) {
            try {
              const response = await fetch(`/api/comercios/${idComercio}/estado`, {
                method: 'PUT',
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  activo: !comercio.activo
                })
              });
              
              if (!response.ok) throw new Error(await response.text());
              window.location.reload();
            } catch (error) {
              console.error('Error:', error);
              alert(`Error: ${error.message}`);
            }
          }
        });
      }
    }

  } catch (error) {
    console.error('Error general:', error);
    
    const detalleComercio = document.getElementById('detalle-comercio');
    if (detalleComercio) {
      detalleComercio.innerHTML = `
        <div class="error-message">
          <i class="fas fa-exclamation-triangle"></i>
          <p>${error.message}</p>
          <a href="lista-comercios.html" class="boton-volver">
            <i class="fas fa-arrow-left"></i> Volver al listado
          </a>
        </div>
      `;
    } else {
      alert(`Error: ${error.message}`);
    }
  }
});