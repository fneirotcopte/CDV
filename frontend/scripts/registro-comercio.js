/**
 * Maneja el toggle de las secciones del formulario
 * @param {HTMLElement} header - El elemento del encabezado de la sección
 */
function toggleSection(header) {
  const isExpanded = header.getAttribute('aria-expanded') === 'true';
  const contentId = header.getAttribute('aria-controls');
  const content = document.getElementById(contentId);
  const icon = header.querySelector('.section-icon');
  
  // Actualiza estado ARIA
  header.setAttribute('aria-expanded', !isExpanded);
  
  // Toggle visual
  content.classList.toggle('active');
  
  // Enfoca el primer elemento si se expande
  if (!isExpanded) {
    setTimeout(() => {
      const firstInput = content.querySelector('input, select, textarea');
      if (firstInput) firstInput.focus();
    }, 100);
  }
}

/**
 * Valida el formulario antes de enviar
 */
function validateForm() {
  const form = document.getElementById('comercioForm');
  if (!form) return;
  
  form.addEventListener('submit', function(e) {
    let isValid = true;
    
    // Validar campos requeridos
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        field.classList.add('error');
        isValid = false;
      } else {
        field.classList.remove('error');
      }
    });
    
    // Validar archivos seleccionados
    const fileInputs = form.querySelectorAll('input[type="file"][required]');
    fileInputs.forEach(input => {
      if (input.files.length === 0) {
        input.classList.add('error');
        isValid = false;
      } else {
        input.classList.remove('error');
      }
    });
    
    if (!isValid) {
      e.preventDefault();
      alert('Por favor complete todos los campos requeridos');
      const firstError = form.querySelector('.error');
      if (firstError) firstError.focus();
    }
  });
}

/**
 * Inicializa eventos de teclado para accesibilidad
 */
function initKeyboardAccessibility() {
  const sectionHeaders = document.querySelectorAll('.section-header');
  
  sectionHeaders.forEach(header => {
    header.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleSection(header);
      }
    });
  });
}

/**
 * Cancela la edición y reinicia el formulario
 */
function cancelarEdicion() {
  document.getElementById('comercioForm').reset();
}

/**
 * Inicializa el formulario
 */
document.addEventListener('DOMContentLoaded', function() {
  // Inicializar funcionalidades
  validateForm();
  initKeyboardAccessibility();
  
  // Mostrar la primera sección expandida por defecto
  const firstSection = document.querySelector('.section-header');
  if (firstSection) {
    firstSection.setAttribute('aria-expanded', 'true');
    document.getElementById(firstSection.getAttribute('aria-controls')).classList.add('active');
  }
  
  console.log('Formulario de registro de comercio inicializado correctamente');
});