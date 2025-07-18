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
                <td>${usuario.activo ? 'Activo' : 'Inactivo'}</td>
                <td>
                    <a href="form-registro-usuario.html?id=${usuario.id_empleado}" class="btn-action btn-edit">
                        <i class="fas fa-edit"></i> Editar
                    </a>
                    ${
                        usuario.activo
                        ? `<button class="btn-action btn-delete" data-id="${usuario.id_empleado}"><i class="fas fa-trash-alt"></i> Dar de baja</button>`
                        : `<button class="btn-action btn-activate" data-id="${usuario.id_empleado}"><i class="fas fa-user-check"></i> Reactivar</button>`
                    }
                </td>
            `;
            if (!usuario.activo) {
               tr.classList.add('fila-inactiva');
            }

            tbody.appendChild(tr);
        });

        // Agregar event listeners para los botones de eliminar
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => desactivarUsuario(btn.dataset.id));
        });
   
        document.querySelectorAll('.btn-activate').forEach(btn => {
            btn.addEventListener('click', () => activarUsuario(btn.dataset.id));
        });
    }
    // Función para eliminar usuario
async function desactivarUsuario(id) {
    if (!confirm('¿Está seguro que desea dar de baja este usuario?')) return;

    try {
        const response = await fetch(`/api/auth/desactivar/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al dar de baja al usuario');
        }

        alert('Usuario dado de baja con éxito');
        cargarUsuarios(); // o refrescar tabla
    } catch (error) {
        console.error('Error:', error);
        alert('Error al dar de baja al usuario: ' + error.message);
    }
}

// dar de alta
async function activarUsuario(id) {
    try {
        const response = await fetch(`/api/auth/activar/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al dar de alta al usuario.');
        }

        alert('Usuario dado de alta con éxito');
        cargarUsuarios(); // o refrescar tabla
    } catch (error) {
        console.error('Error:', error);
        alert('Error al dar de alta al usuario: ' + error.message);
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