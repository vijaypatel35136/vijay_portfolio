const API_BASE = '/api';

export const getAuthToken = () => localStorage.getItem('admin_token');
export const setAuthToken = (token: string) => localStorage.setItem('admin_token', token);
export const removeAuthToken = () => localStorage.removeItem('admin_token');

async function request(method: string, path: string, body?: any, isMultipart = false) {
  const token = getAuthToken();
  const headers: Record<string, string> = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!isMultipart && body) {
    headers['Content-Type'] = 'application/json';
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = isMultipart ? body : JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${path}`, config);

  if (response.status === 401) {
    removeAuthToken();
    if (!window.location.pathname.startsWith('/login') && window.location.pathname.includes('/admin')) {
      window.location.href = '/login';
    }
  }

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.detail || 'Request failed');
  }

  return response.status === 204 ? null : response.json();
}

export const api = {
  get: (path: string) => request('GET', path),
  post: (path: string, body?: any) => request('POST', path, body),
  put: (path: string, body?: any) => request('PUT', path, body),
  delete: (path: string) => request('DELETE', path),
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return request('POST', '/upload', formData, true);
  }
};
export default api;
