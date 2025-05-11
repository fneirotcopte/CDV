document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMensaje = document.getElementById('errorMensaje');
  
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault(); // Evitar que se recargue la página
  
      const email = document.getElementById('email').value;
      const contrasena = document.getElementById('contrasena').value;
  
      try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, contrasena })
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          // Si hay error, mostrar mensaje
          errorMensaje.textContent = data.error || 'Error al iniciar sesión';
        } else {
          // Si el login es exitoso
          errorMensaje.style.color = 'green';
          errorMensaje.textContent = 'Inicio de sesión exitoso. Redirigiendo...';
  
          // Guardar token si quieres (opcional)
          localStorage.setItem('token', data.token);
  
          // Redirigir a otra página luego de un segundo
          setTimeout(() => {
            window.location.href = 'perfil.html'; // o donde quieras dirigirlo
          }, 1500);
        }
      } catch (error) {
        console.error('Error al conectar:', error);
        errorMensaje.textContent = 'No se pudo conectar con el servidor';
      }
    });
  });
  