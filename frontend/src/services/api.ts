const API_BASE = 'http://localhost:8000';

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export const apiService = {
  getToken(): string | null {
    return localStorage.getItem('admin_token');
  },

  setToken(token: string) {
    localStorage.setItem('admin_token', token);
  },

  clearToken() {
    localStorage.removeItem('admin_token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers = new Headers(options.headers || {});
    
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const config = {
      ...options,
      headers,
    };

    const response = await fetch(`${API_BASE}${endpoint}`, config);

    if (response.status === 401) {
      this.clearToken();
      if (!endpoint.includes('/auth/login')) {
        window.dispatchEvent(new Event('auth-expired'));
      }
    }

    if (!response.ok) {
      let errorMessage = 'Something went wrong';
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorMessage;
      } catch (e) {
        // Fallback if not JSON
      }
      throw new Error(errorMessage);
    }

    // If status 204 or delete response, might be empty
    if (response.status === 204) {
      return {} as T;
    }

    return response.json() as Promise<T>;
  },

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  },

  async post<T>(endpoint: string, body: any): Promise<T> {
    const isFormData = body instanceof FormData;
    const headers: Record<string, string> = {};
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    return this.request<T>(endpoint, {
      method: 'POST',
      headers,
      body: isFormData ? body : JSON.stringify(body),
    });
  },

  async put<T>(endpoint: string, body: any): Promise<T> {
    const isFormData = body instanceof FormData;
    const headers: Record<string, string> = {};
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    return this.request<T>(endpoint, {
      method: 'PUT',
      headers,
      body: isFormData ? body : JSON.stringify(body),
    });
  },

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
};
