export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
  return data;
}

export const signupUser = (body) =>
  request('/auth/signup', { method: 'POST', body: JSON.stringify(body) });

export const getHealth = () => request('/health');
export const getUsers = () => request('/users');
export const createUser = (body) =>
  request('/users', { method: 'POST', body: JSON.stringify(body) });
