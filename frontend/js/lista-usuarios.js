import { checkAuth, infoUsuario } from '../auth.js';

document.addEventListener('DOMContentLoaded', async () => {
    const userData = checkAuth();
    if (!userData) return;

    infoUsuario(userData);

    // Función para cargar usuarios
    async function cargarUsuarios() {
        try {
            const response = await fetch('/api/auth/usuarios', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Error al cargar usuarios');
            }
            
            const usuarios = await response.json();
            mostrarUsuarios(usuarios);
        } catch (error) {
            console.error('Error:', error);
            alert('Error al cargar usuarios: ' + error.message);
        }
    }

    // Función para mostrar usuarios en la tabla
    function mostrarUsuarios(usuarios) {
        const tbody = document.querySelector('#usuariosTable tbody');
        tbody.innerHTML = '';

        usuarios.forEach(usuario => {
            const tr = document.createElement('tr');
            
            tr.innerHTML = `
                <td>${usuario.nombre || '-'}</td>
                <td>${usuario.apellido || '-'}</td>
                <td>${usuario.dni || '-'}</td>
                <td>${usuario.area || '-'}</td>
                <td>${usuario.rol || '-'}</td>
                <td>${usuario.correo_electronico || '-'}</td>
                <td>
                    <a href="form-registro-usuario.html?id=${usuario.id}" class="btn-action btn-edit">
                        <i class="fas fa-edit"></i> Editar
                    </a>
                    <button class="btn-action btn-delete" data-id="${usuario.id}">
                        <i class="fas fa-trash-alt"></i> Eliminar
                    </button>
                </td>
            `;
            
            tbody.appendChild(tr);
        });

        // Agregar event listeners para los botones de eliminar
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => eliminarUsuario(btn.dataset.id));
        });
    }

    // Función para eliminar usuario
    async function eliminarUsuario(id) {
        if (!confirm('¿Está seguro que desea eliminar este usuario?')) return;
        
        try {
            const response = await fetch(`/api/auth/usuarios/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Error al eliminar usuario');
            }
            
            alert('Usuario eliminado con éxito');
            cargarUsuarios();
        } catch (error) {
            console.error('Error:', error);
            alert('Error al eliminar usuario: ' + error.message);
        }
    }

    // Cargar usuarios al iniciar
    cargarUsuarios();

    // Manejar cierre de sesión
    document.querySelector('.logout-btn').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = "login.html";
    });
});