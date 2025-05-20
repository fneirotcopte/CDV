import { requireAuth, fetchWithAuth, logout } from './auth.js';

document.addEventListener('DOMContentLoaded', async () => {
  if (!requireAuth()) return;

  const perfilInfo = document.getElementById('perfilInfo');

  try {
    const data = await fetchWithAuth('http://localhost:3036/perfil');

    perfilInfo.innerHTML = `
      <p><strong>${data.mensaje}</strong></p>
      <p><strong>Rol:</strong> ${data.rol}</p>
    `;
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    alert('Sesión expirada o error de conexión. Redirigiendo...');
    logout('login.html');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const logoutLink = document.getElementById('logoutLink');
  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }
});
