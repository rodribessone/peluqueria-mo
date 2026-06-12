// Todas las llamadas al backend pasan por acá — un solo lugar para cambiar la URL

export const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ── Auth helpers ──────────────────────────────────────────────────────────────

export function getToken() {
    return localStorage.getItem('mo_admin_token');
}

export function setToken(token) {
    localStorage.setItem('mo_admin_token', token);
}

export function removeToken() {
    localStorage.removeItem('mo_admin_token');
}

export function isLoggedIn() {
    return !!getToken();
}

// Headers con token para rutas protegidas
export function authHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
    };
}

// Fetch con auth — redirige al login si el token expiró
export async function apiFetch(path, options = {}) {
    const res = await fetch(`${API}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
            'Authorization': `Bearer ${getToken()}`,
        },
    });
    if (res.status === 401 || res.status === 403) {
        removeToken();
        window.location.href = '/login';
    }
    return res;
}