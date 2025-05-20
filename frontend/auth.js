export function getToken() {
  return localStorage.getItem('token');
}

export function isAuthenticated() {
  return !!getToken();
}

export function requireAuth(redirectURL = 'login.html') {
  const token = getToken();
  if (!token) {
    alert('No autenticado. Para continuar debe iniciar sesión.');
    window.location.href = redirectURL;
    return false;
  }
  return true;
}

export function logout(redirectURL = 'index.html') {
  localStorage.removeItem('token');
  window.location.href = redirectURL;
}

export async function fetchWithAuth(url, options = {}) {
  const token = getToken();
  if (!token) throw new Error('No token disponible');

  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error en la solicitud');
  }

  return data;
}
