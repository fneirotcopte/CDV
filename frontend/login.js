import { getToken } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const errorMensaje = document.getElementById('errorMensaje');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const contrasena = document.getElementById('contrasena').value;

    try {
      const response = await fetch('http://localhost:3036/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, contrasena })
      });

      const data = await response.json();

      if (!response.ok) {
        errorMensaje.textContent = data.error || 'Error al iniciar sesión';
        errorMensaje.style.color = 'red';
      } else {
        localStorage.setItem('token', data.token);
        errorMensaje.textContent = 'Inicio de sesión exitoso. Redirigiendo...';
        errorMensaje.style.color = 'green';
        setTimeout(() => {
          window.location.href = 'perfil.html';
        }, 500);
      }
    } catch (error) {
      console.error('Error al conectar:', error);
      errorMensaje.textContent = 'No se pudo conectar con el servidor';
      errorMensaje.style.color = 'red';
    }
  });
});
