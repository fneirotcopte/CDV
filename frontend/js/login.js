document.addEventListener('DOMContentLoaded', function() {
  // Elementos del DOM
  const viewContainer = document.getElementById('viewContainer');
  const loginView = document.getElementById('loginView');
  const errorView = document.getElementById('errorView');
  const recoveryView = document.getElementById('recoveryView');

  // Botones y enlaces
  const loginBtn = document.getElementById('loginBtn');
  const tryAgainLink = document.getElementById('tryAgainLink');
  const forgotPasswordLink = document.getElementById('forgotPasswordLink');
  const forgotPasswordLink2 = document.getElementById('forgotPasswordLink2');
  const backToLoginLink = document.getElementById('backToLoginLink');
  const sendRecoveryBtn = document.getElementById('sendRecoveryBtn');

  // Campos de entrada
  const usuarioInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const recoveryEmailInput = document.getElementById('recoveryEmail');

  // Mostrar vista
  function showView(view) {
    loginView.classList.add('hidden');
    errorView.classList.add('hidden');
    recoveryView.classList.add('hidden');
    view.classList.remove('hidden');
  }

  // Evento para el botón de login
  loginBtn.addEventListener('click', function () {
    const correo = usuarioInput.value;
    const pass = passwordInput.value;

    fetch(window.location.origin + '/api/auth/login', { // PARA INICIAR SESION DESDE EL LINK SIN ROMPER NADA ---
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // importante si usás sesiones basadas en cookie
      body: JSON.stringify({
        correo_electronico: correo,
        contraseña: pass
      })
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => {
          if (err.error && err.error.includes('inactivo')) {
            alert('Usuario inactivo. Contacte al administrador del sistema.');
          } else {
            showView(errorView);
          }
          throw err;
        });
      }
      return response.json();
    })
    .then(data => {
      if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "/pages/panel-principal.html";
      }
    })
    .catch(error => {
      console.error('Error al intentar loguear:', error);
    });
  });

  // Resto de eventos
  tryAgainLink.addEventListener('click', function(e) {
    e.preventDefault();
    showView(loginView);
    usuarioInput.value = '';
    passwordInput.value = '';
  });

  forgotPasswordLink.addEventListener('click', function(e) {
    e.preventDefault();
    showView(recoveryView);
  });

  forgotPasswordLink2.addEventListener('click', function(e) {
    e.preventDefault();
    showView(recoveryView);
  });

  backToLoginLink.addEventListener('click', function(e) {
    e.preventDefault();
    showView(loginView);
  });

  sendRecoveryBtn.addEventListener('click', function() {
    const email = recoveryEmailInput.value;

    if (email && email.includes('@')) {
      alert(`Se ha enviado un correo de recuperación a ${email}`);
      showView(loginView);
      recoveryEmailInput.value = '';
    } else {
      alert('Por favor ingrese un correo electrónico válido');
    }
  });

  passwordInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      loginBtn.click();
    }
  });

  recoveryEmailInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sendRecoveryBtn.click();
    }
  });
});
