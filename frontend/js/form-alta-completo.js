import { checkAuth, infoUsuario } from '../auth.js';

document.addEventListener('DOMContentLoaded', () => {
  const userData = checkAuth();
  if (!userData) return;
  infoUsuario(userData);

  document.querySelector('.logout-btn').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  });


    document.getElementById('formularioComercio').addEventListener('submit', async function(e) {
      e.preventDefault();
      const form = e.target;
      const formData = new FormData(form);
      const token = localStorage.getItem('token');

      try {
        const res = await fetch('http://localhost:3036/registro', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + token
          },
          body: formData
        });

        const result = await res.json();
        if (res.ok) {
          alert('Registro exitoso');
          form.reset();
        } else {
          alert('Error en el registro: ' + (result.error || 'Desconocido'));
        }
      } catch (err) {
        console.error(err);
        alert('Error al conectar con el servidor');
      }
    });
});
