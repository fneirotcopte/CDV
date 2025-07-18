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
        const res = await fetch('http://localhost:3036/api/comercios/registro', {
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

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formularioComercio');
  
  // Validar archivos antes de enviar
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const filesValid = validateFiles(formData);
    
    if (!filesValid) {
      alert('Suba todos los documentos requeridos');
      return;
    }

    try {
      const response = await fetch('/api/comercios/registrar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      
      if (response.ok) {
        alert('Comercio registrado con documentos adjuntos');
        form.reset();
      } else {
        throw new Error(await response.text());
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al registrar: ' + error.message);
    }
  });
});

// Validar archivos requeridos
function validateFiles(formData) {
  const requiredFiles = ['dni_titular', 'certificado_residencia'];
  return requiredFiles.every(field => formData.get(field).size > 0);
}