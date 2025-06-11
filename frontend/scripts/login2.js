// Función de login
async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    showError("Por favor, complete ambos campos");
    return;
  }

  showLoading();
  hideError();

  try {
    const response = await fetch('http://localhost:3036/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        correo_electronico: email,
        contraseña: password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Credenciales inválidas');
    }

    // Guardar el token en localStorage
    localStorage.setItem('token', data.token);
    
    // Redirigir al dashboard
    window.location.href = "/perfil.html";
  } catch (error) {
    showError(error.message);
  } finally {
    hideLoading();
  }
}

// Mostrar formulario de recuperación
function showRecoveryForm() {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("recovery-form").style.display = "block";
  document.getElementById("recovery-email").focus();
}

// Ocultar formulario de recuperación
function hideRecoveryForm() {
  document.getElementById("login-form").style.display = "block";
  document.getElementById("recovery-form").style.display = "none";
  document.getElementById("email").focus();
}

// Función para recuperar contraseña
function recoverPassword() {
  const email = document.getElementById("recovery-email").value.trim();

  if (!email) {
    showError("Por favor, ingrese su correo electrónico");
    return;
  }

  // Aquí iría la lógica para recuperar contraseña con el backend
  alert(`Se enviarán instrucciones a ${email} si existe una cuenta asociada`);
  hideRecoveryForm();
}

// Mostrar mensaje de carga
function showLoading() {
  document.getElementById("loading-message").style.display = "block";
}

// Ocultar mensaje de carga
function hideLoading() {
  document.getElementById("loading-message").style.display = "none";
}

// Mostrar mensaje de error
function showError(message) {
  const errorElement = document.getElementById("error-message");
  errorElement.textContent = message;
  errorElement.style.display = "block";
}

// Ocultar mensaje de error
function hideError() {
  document.getElementById("error-message").style.display = "none";
}

// Verificar si hay un token al cargar la página
function checkAuth() {
  const token = localStorage.getItem('token');
  if (token) {
    window.location.href = "/perfil.html";
  }
}

// Manejar el evento de tecla Enter en los campos de entrada
function setupEnterKeyHandler() {
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (this.id === 'email' || this.id === 'recovery-email') {
          this.nextElementSibling?.querySelector('input')?.focus();
        } else if (this.id === 'password') {
          login();
        }
      }
    });
  });
}

// Inicialización cuando el DOM está cargado
document.addEventListener('DOMContentLoaded', function() {
  // Verificar autenticación
  checkAuth();
  
  // Configurar el manejo de la tecla Enter
  setupEnterKeyHandler();
  
  // Mostrar opción de registro solo si no es administrador
  // (esto podría mejorarse con una verificación de roles desde el backend)
  const registerLink = document.getElementById('register-link');
  registerLink.style.display = 'block';

  // Enfocar el campo de email al cargar la página
  const emailField = document.getElementById('email');
  if (emailField) {
    emailField.focus();
  }
});