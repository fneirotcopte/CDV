/**
 * Maneja el toggle de las secciones del formulario
 */

function toggleSection(header) {
  const isExpanded = header.getAttribute('aria-expanded') === 'true';
  const contentId = header.getAttribute('aria-controls');
  const content = document.getElementById(contentId);
  const icon = header.querySelector('.section-icon');

  header.setAttribute('aria-expanded', !isExpanded);
  content.classList.toggle('active');

  if (!isExpanded) {
    setTimeout(() => {
      const firstInput = content.querySelector('input, select');
      if (firstInput) firstInput.focus();
    }, 100);
  }
}

/**
 * Valida la fortaleza de la contraseña
 */
function checkPasswordStrength(password) {
  const strengthBars = document.querySelectorAll('.strength-bar');
  const strengthText = document.querySelector('.strength-text');

  strengthBars.forEach(bar => bar.style.backgroundColor = '#ddd');
  if (strengthText) strengthText.textContent = '';

  if (!password) return;

  let strength = 0;
  let messages = [];

  if (password.length >= 8) strength++;
  else messages.push('Mínimo 8 caracteres');

  if (/\d/.test(password)) strength++;
  else messages.push('Incluir números');

  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  else messages.push('Incluir mayúsculas y minúsculas');

  if (/[^a-zA-Z0-9]/.test(password)) strength++;
  else messages.push('Incluir caracteres especiales');

  for (let i = 0; i < strength && i < strengthBars.length; i++) {
  let color;
  if (strength === 1) color = '#ff6b6b';
  else if (strength === 2) color = '#feca57';
  else if (strength === 3) color = '#48dbfb';
  else color = '#1dd1a1';

  strengthBars[i].style.backgroundColor = color;
}
  if (strengthText) {
    strengthText.textContent = messages.length > 0 ? messages.join(', ') : 'Contraseña segura';
  }
}


/**
 * Valida que las contraseñas coincidan
 */
function validatePasswordMatch() {
  const password = document.getElementById('contraseña');
  const confirmPassword = document.getElementById('confirm-contraseña');
  const errorMessage = confirmPassword.nextElementSibling;

  if (password.value !== confirmPassword.value) {
    confirmPassword.setCustomValidity('Las contraseñas no coinciden');
    errorMessage.textContent = 'Las contraseñas no coinciden';
    errorMessage.style.display = 'block';
    return false;
  } else {
    confirmPassword.setCustomValidity('');
    errorMessage.style.display = 'none';
    return true;
  }
}

/**
 * Envía el formulario al servidor
 */
async function submitForm(formData) {
  try {
    const token = localStorage.getItem('token'); // Obtener el token si existe
    const headers = {
      'Content-Type': 'application/json'
    };

    // Solo agregar el header de Authorization si hay token
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('/api/auth/registrar', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(formData)
    });

    // Verificar si la respuesta tiene contenido antes de parsear JSON
    const text = await response.text();
    let data = {};
    
    try {
      data = text ? JSON.parse(text) : {};
    } catch (e) {
      console.error('Error parsing JSON:', e);
      throw new Error('Respuesta inválida del servidor');
    }

    if (!response.ok) {
      throw new Error(data.error || `Error en el registro: ${response.status}`);
    }

    alert('Empleado registrado exitosamente');
    document.getElementById('register-form').reset();
    
  } catch (error) {
    console.error('Error:', error);
    alert(`Error: ${error.message}`);
  }
}

/**
 * Configura la validación del formulario
 */
function setupFormValidation() {
  const form = document.getElementById('register-form');
  if (!form) return;

  const passwordInput = document.getElementById('contraseña');
  passwordInput.addEventListener('input', (e) => {
    checkPasswordStrength(e.target.value);
  });

  const confirmPassword = document.getElementById('confirm-contraseña');
  confirmPassword.addEventListener('input', validatePasswordMatch);

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        field.classList.add('error');
        isValid = false;
      } else {
        field.classList.remove('error');
      }
    });

    if (!validatePasswordMatch()) {
      isValid = false;
    }

    if (isValid) {
      const formData = {
        nombre: form.nombre.value,
        apellido: form.apellido.value,
        dni: form.dni.value,
        domicilio: form.domicilio.value,
        telefono: form.telefono.value,
        area: form.area.value,
        contraseña: form.contraseña.value,
        correo_electronico: form.correo_electronico.value,
        rol: form.rol.value
      };

      await submitForm(formData);
    } else {
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
    header.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleSection(header);
      }
    });
  });
}

/**
 * Inicializa el formulario
 */
document.addEventListener('DOMContentLoaded', function () {
  setupFormValidation();
  initKeyboardAccessibility();

  const firstSection = document.querySelector('.section-header');
  if (firstSection) {
    firstSection.setAttribute('aria-expanded', 'true');
    document.getElementById(firstSection.getAttribute('aria-controls')).classList.add('active');
  }
});