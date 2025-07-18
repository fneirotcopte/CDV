import { checkAuth, infoUsuario } from '../auth.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Verificar autenticación
  const userData = checkAuth();
  if (!userData) {
    window.location.href = 'login.html';
    return;
  }

  // Mostrar información del usuario
  infoUsuario(userData);

  // Configurar logout
  document.querySelector('.logout-btn').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  });

  // Variables de estado
  let comercios = [];
  let totalRegistros = 0;
  const registrosPorPagina = 10;
  let paginaActual = 1;

  // Mapeo de categorías a rubros
  const categoriasRubros = {
    "Comercio en general": ["Supermercado","Panaderia", "Almacén", "Farmacia", "Carniceria"],
    "Vendedores ambulantes": ["Comida rápida", "Bebidas", "Artículos varios"],
    "Bares nocturnos": ["Bar", "Restaurante", "Pub"],
    "Food trucks": []
  };

  // Actualizar rubros al cambiar categoría
  document.getElementById('filtro-categoria').addEventListener('change', (e) => {
    const categoriaSeleccionada = e.target.value;
    const rubroSelect = document.getElementById('filtro-rubro');

    // Limpiar opciones anteriores
    rubroSelect.innerHTML = '<option value="">Todos</option>';

    // Cargar rubros correspondientes
    const rubros = categoriasRubros[categoriaSeleccionada] || [];
    rubros.forEach(rubro => {
      const opcion = document.createElement('option');
      opcion.value = rubro;
      opcion.textContent = rubro;
      rubroSelect.appendChild(opcion);
    });
  });

  // Cargar comercios desde la API
  async function fetchComercios(pagina = 1, filtros = {}) {
    const { categoria, rubro, busqueda } = filtros;
    const params = new URLSearchParams({
      pagina,
      porPagina: registrosPorPagina,
      ...(categoria && { categoria }),
      ...(rubro && { rubro }),
      ...(busqueda && { busqueda })
    });

    try {
      const response = await fetch(`/api/comercios?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      return { data: [], total: 0 };
    }
  }

  // Renderizar tabla
  function renderizarTabla() {
    const cuerpoTabla = document.getElementById('cuerpo-tabla');
    cuerpoTabla.innerHTML = '';

    comercios.forEach(comercio => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${comercio.nombre_comercial}</td>
        <td>${comercio.razon_social}</td>
        <td>${comercio.categoria}</td>
        <td>${comercio.rubro}</td>
        <td>${comercio.titular}</td>
        <td>
          <div class="acciones">
            <button class="btn-accion btn-ver" data-id="${comercio.id_comercio}">
              <i class="fas fa-eye"></i> Ver detalles
            </button>
          </div>
        </td>
      `;
      cuerpoTabla.appendChild(fila);
    });

    // Configurar evento para botones VER
    document.querySelectorAll('.btn-ver').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        window.location.href = `comercio.html?id=${id}`;
      });
    });

    actualizarPaginacion();
  }

  // Actualizar controles de paginación
  function actualizarPaginacion() {
    const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);
    document.getElementById('info-pagina').textContent = `Página ${paginaActual} de ${totalPaginas}`;
    document.getElementById('btn-anterior').disabled = paginaActual <= 1;
    document.getElementById('btn-siguiente').disabled = paginaActual >= totalPaginas;
  }

  // Aplicar filtros
  async function aplicarFiltros() {
    const filtros = {
      categoria: document.getElementById('filtro-categoria').value,
      rubro: document.getElementById('filtro-rubro').value,
      busqueda: document.getElementById('filtro-busqueda').value
    };
    const response = await fetchComercios(1, filtros);
    comercios = response.data;
    totalRegistros = response.total;
    paginaActual = 1;
    renderizarTabla();
  }

  // Resetear filtros
  function resetearFiltros() {
    document.getElementById('filtro-categoria').value = '';
    document.getElementById('filtro-rubro').value = '';
    document.getElementById('filtro-busqueda').value = '';
    
    // Limpiar y resetear el select de rubros
    const rubroSelect = document.getElementById('filtro-rubro');
    rubroSelect.innerHTML = '<option value="">Todos</option>';
    
    // Volver a cargar los datos iniciales
    aplicarFiltros();
  }

  // Event Listeners
  document.getElementById('btn-anterior').addEventListener('click', () => {
    if (paginaActual > 1) {
      paginaActual--;
      fetchComercios(paginaActual).then(response => {
        comercios = response.data;
        totalRegistros = response.total;
        renderizarTabla();
      });
    }
  });

  document.getElementById('btn-siguiente').addEventListener('click', () => {
    if (paginaActual < Math.ceil(totalRegistros / registrosPorPagina)) {
      paginaActual++;
      fetchComercios(paginaActual).then(response => {
        comercios = response.data;
        totalRegistros = response.total;
        renderizarTabla();
      });
    }
  });

  document.getElementById('btn-buscar').addEventListener('click', aplicarFiltros);
  document.getElementById('btn-reset').addEventListener('click', resetearFiltros);

  // Inicializar
  const response = await fetchComercios();
  comercios = response.data;
  totalRegistros = response.total;
  renderizarTabla();
});