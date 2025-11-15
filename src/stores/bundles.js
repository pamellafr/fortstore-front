import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../services/api';

export const useBundlesStore = defineStore('bundles', () => {
  const bundles = ref([]);
  const loading = ref(false);
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  });

  async function fetchBundles(page = 1) {
    if (loading.value) return { success: false };
    
    loading.value = true;
    try {
      const response = await api.get('/api/bundles', {
        params: { page, per_page: 20 }
      });
      
      let bundlesData = [];
      if (response.data && response.data.data) {
        bundlesData = response.data.data;
        pagination.value = {
          current_page: response.data.current_page || page,
          last_page: response.data.last_page || 1,
          per_page: response.data.per_page || 20,
          total: response.data.total || 0,
        };
      } else if (Array.isArray(response.data)) {
        bundlesData = response.data;
      }
      
      bundles.value = bundlesData;
      return { success: true };
    } catch (error) {
      bundles.value = [];
      return { success: false, message: error.message };
    } finally {
      loading.value = false;
    }
  }

  async function fetchBundleById(id) {
    try {
      const response = await api.get(`/api/bundles/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async function purchaseBundle(id) {
    try {
      const response = await api.post(`/api/bundles/${id}/purchase`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || error.message 
      };
    }
  }

  return {
    bundles,
    loading,
    pagination,
    fetchBundles,
    fetchBundleById,
    purchaseBundle,
  };
});

