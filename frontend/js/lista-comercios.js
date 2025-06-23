import { checkAuth, infoUsuario } from '../auth.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Verificar autenticación
  const userData = checkAuth();
  if (!userData) return;

  // Mostrar información del usuario
  infoUsuario(userData);

  // Configurar logout
  document.querySelector('.logout-btn').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = "login.html";
  });
  // Datos de ejemplo (en producción vendrían de una API)
  let comercios = [
    {
      id: 1,
      nombreComercial: "Supermercado Don José",
      razonSocial: "Don José S.A.",
      categoria: "Comercio en general",
      rubro: "Supermercado",
      titular: "José Pérez (12345678)"
    },
    {
      id: 2,
      nombreComercial: "La Parrilla de Pepe",
      razonSocial: "Parrillas Pepe S.R.L.",
      categoria: "Bares nocturnos",
      rubro: "Parrilla",
      titular: "Pepe González (23456789)"
    },
    {
      id: 3,
      nombreComercial: "Food Truck Delicias",
      razonSocial: "Delicias Móviles S.A.",
      categoria: "Food Track",
      rubro: "Comida rápida",
      titular: "María Gómez (34567890)"
    }
  ];

  // Mapeo de categorías a rubros
  const categoriasRubros = {
    "Comercio en general": [
      "Supermercado",
      "Almacén",
      "Kiosco",
      "Farmacia",
      "Librería",
      "Ropa",
      "Electrodomésticos",
      "Ferretería",
      "Juguetería",
      "Otros"
    ],
    "Vendedores ambulantes": [
      "Comida rápida",
      "Bebidas",
      "Ropa",
      "Accesorios",
      "Artículos para el hogar",
      "Otros"
    ],
    "Bares nocturnos": [
      "Bar",
      "Pub",
      "Discoteca",
      "Restaurante",
      "Cervecería",
      "Otros"
    ],
    "Food Track": [
      "Comida rápida",
      "Comida étnica",
      "Postres",
      "Bebidas",
      "Otros"
    ]
  };

  let paginaActual = 1;
  const registrosPorPagina = 10;

  // Función para renderizar la tabla
  function renderizarTabla() {
    const cuerpoTabla = document.getElementById('cuerpo-tabla');
    cuerpoTabla.innerHTML = '';

    const inicio = (paginaActual - 1) * registrosPorPagina;
    const fin = inicio + registrosPorPagina;
    const comerciosPagina = comercios.slice(inicio, fin);

    comerciosPagina.forEach(comercio => {
      const fila = document.createElement('tr');

      fila.innerHTML = `
        <td>${comercio.nombreComercial}</td>
        <td>${comercio.razonSocial}</td>
        <td>${comercio.categoria}</td>
        <td>${comercio.rubro}</td>
        <td>${comercio.titular}</td>
        <td>
          <div class="acciones">
            <button class="btn-accion btn-ver" data-id="${comercio.id}">
              <i class="fas fa-eye"></i>
            </button>
            <button class="btn-accion btn-editar" data-id="${comercio.id}">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn-accion btn-eliminar" data-id="${comercio.id}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      `;

      cuerpoTabla.appendChild(fila);
    });

    // Actualizar paginación
    actualizarPaginacion();
  }

  // Función para actualizar la paginación
  function actualizarPaginacion() {
    const totalPaginas = Math.ceil(comercios.length / registrosPorPagina);
    document.getElementById('info-pagina').textContent = `Página ${paginaActual} de ${totalPaginas}`;

    document.getElementById('btn-anterior').disabled = paginaActual <= 1;
    document.getElementById('btn-siguiente').disabled = paginaActual >= totalPaginas;
  }

  // Event listeners para paginación
  document.getElementById('btn-anterior').addEventListener('click', () => {
    if (paginaActual > 1) {
      paginaActual--;
      renderizarTabla();
    }
  });

  document.getElementById('btn-siguiente').addEventListener('click', () => {
    const totalPaginas = Math.ceil(comercios.length / registrosPorPagina);
    if (paginaActual < totalPaginas) {
      paginaActual++;
      renderizarTabla();
    }
  });

  // Event listener para búsqueda
  document.getElementById('btn-buscar').addEventListener('click', aplicarFiltros);

  function aplicarFiltros() {
    const categoria = document.getElementById('filtro-categoria').value;
    const rubro = document.getElementById('filtro-rubro').value;
    const busqueda = document.getElementById('filtro-busqueda').value.toLowerCase();

    // Filtrar comercios
    let resultados = [...comercios];

    if (categoria) {
      resultados = resultados.filter(c => c.categoria === categoria);
    }

    if (rubro) {
      resultados = resultados.filter(c => c.rubro === rubro);
    }

    if (busqueda) {
      resultados = resultados.filter(c =>
        c.nombreComercial.toLowerCase().includes(busqueda) ||
        c.razonSocial.toLowerCase().includes(busqueda)
      );
    }

    comercios = resultados;
    paginaActual = 1;
    renderizarTabla();
  }

  // Actualizar rubros cuando se selecciona categoría
  document.getElementById('filtro-categoria').addEventListener('change', function () {
    const categoria = this.value;
    const rubroSelect = document.getElementById('filtro-rubro');
    rubroSelect.innerHTML = '<option value="">Todos</option>';

    if (categoria) {
      // Obtener rubros para la categoría seleccionada
      const rubros = categoriasRubros[categoria] || [];

      rubros.forEach(rubro => {
        const option = document.createElement('option');
        option.value = rubro;
        option.textContent = rubro;
        rubroSelect.appendChild(option);
      });
    }
  });

  // Inicializar opciones de categoría
  const categoriaSelect = document.getElementById('filtro-categoria');
  Object.keys(categoriasRubros).forEach(categoria => {
    if (![...categoriaSelect.options].some(opt => opt.value === categoria)) {
      const option = document.createElement('option');
      option.value = categoria;
      option.textContent = categoria;
      categoriaSelect.appendChild(option);
    }
  });

  // Renderizar tabla inicial
  renderizarTabla();

});