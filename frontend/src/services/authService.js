import api from './api';

const authService = {
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      const { data } = response;
      
      if (data.data && data.data.token) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        return { user: data.data.user, token: data.data.token };
      }
      throw new Error('No se recibió el token de autenticación');
    } catch (error) {
      console.error('Error de login:', error);
      if (error.response) {
        throw new Error(error.response.data.message || 'Error al iniciar sesión');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  async getCurrentUser() {
    try {
      const { data } = await api.get('/auth/me');
      return data.user;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error.response?.data || error;
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  getStoredUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export default authService;
