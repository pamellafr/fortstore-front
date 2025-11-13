import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../services/api';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const isAuthenticated = computed(() => !!user.value);

  async function login(credentials) {
    try {
      const response = await api.post('/api/login', credentials);
      const token = response.data?.token;
      if (token) {
        localStorage.setItem('auth_token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      user.value = response.data?.user || response.data;
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 
                     error.response?.data?.errors?.email?.[0] ||
                     'Erro ao fazer login. Verifique suas credenciais.';
      return {
        success: false,
        message,
      };
    }
  }

  async function register(userData) {
    try {
      const response = await api.post('/api/register', userData);
      const token = response.data?.token;
      if (token) {
        localStorage.setItem('auth_token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      user.value = response.data?.user || response.data;
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 
                     error.response?.data?.errors?.email?.[0] ||
                     error.response?.data?.errors?.password?.[0] ||
                     'Erro ao registrar. Verifique os dados informados.';
      return {
        success: false,
        message,
      };
    }
  }

  async function fetchUser() {
    try {
      const response = await api.get('/api/user');
      user.value = response.data;
      return { success: true };
    } catch (error) {
      if (error.response?.status === 401) {
        user.value = null;
        return { success: false };
      }
      user.value = null;
      return { success: false };
    }
  }

  async function logout() {
    try {
      await api.post('/api/logout');
    } catch (error) {
      // Silent error handling
    } finally {
      user.value = null;
      localStorage.removeItem('auth_token');
      delete api.defaults.headers.common['Authorization'];
    }
  }

  return {
    user,
    isAuthenticated,
    login,
    register,
    fetchUser,
    logout,
  };
});

