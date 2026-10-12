import { clearSession, getToken } from './auth';

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Full URL for a file the backend stored, e.g. "/uploads/abc.jpg".
export const fileUrl = (path) => (path ? `${BASE_URL}${path}` : '');

async function request(path, options = {}) {
  const token = getToken();
  // For FormData the browser sets Content-Type itself (with the boundary).
  const isForm = options.body instanceof FormData;

  const res = await fetch(`${BASE_URL}/api${path}`, {
    ...options,
    headers: {
      ...(!isForm && { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => ({}));

  // Token expired or invalid: log the user out.
  if (token && (res.status === 401 || res.status === 403)) {
    clearSession();
    window.location.assign('/login');
  }

  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
  return data;
}

export const signupUser = (body) =>
  request('/auth/signup', { method: 'POST', body: JSON.stringify(body) });

export const loginUser = (body) =>
  request('/auth/login', { method: 'POST', body: JSON.stringify(body) });

export const verifyOtp = (body) =>
  request('/auth/verify-otp', { method: 'POST', body: JSON.stringify(body) });

export const getStudios = () => request('/studio');
export const getStudio = (id) => request(`/studio/${id}`);
export const createStudio = (formData) =>
  request('/studio', { method: 'POST', body: formData });
export const updateStudio = (id, formData) =>
  request(`/studio/${id}`, { method: 'PUT', body: formData });

export const getHealth = () => request('/health');
export const getUsers = () => request('/users');
export const createUser = (body) =>
  request('/users', { method: 'POST', body: JSON.stringify(body) });
