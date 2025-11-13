import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../services/api';

export const useCosmeticsStore = defineStore('cosmetics', () => {
  const cosmetics = ref([]);
  const loading = ref(false);
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 50,
    total: 0,
  });
  const filters = ref({
    search: '',
    type: '',
    rarity: '',
    onlyNew: false,
    onlyOnSale: false,
    onlyPromoted: false,
  });

  const filteredCosmetics = computed(() => {
    return cosmetics.value || [];
  });

  async function fetchCosmetics(page = 1) {
    if (loading.value) return { success: false };
    
    loading.value = true;
    try {
      const params = {
        page,
        per_page: 50,
      };
      
      if (filters.value.search && filters.value.search.trim()) {
        params.search = filters.value.search.trim();
      }
      
      if (filters.value.type && filters.value.type.trim()) {
        params.type = filters.value.type.trim();
      }
      
      if (filters.value.rarity && filters.value.rarity.trim()) {
        params.rarity = filters.value.rarity.trim();
      }
      
      if (filters.value.onlyNew) {
        params.onlyNew = true;
      }
      
      if (filters.value.onlyOnSale) {
        params.onlyOnSale = true;
      }
      
      if (filters.value.onlyPromoted) {
        params.onlyPromoted = true;
      }
      
      const response = await api.get('/api/cosmetics', { params });
      
      let cosmeticsData = [];
      if (Array.isArray(response.data)) {
        cosmeticsData = response.data;
        pagination.value = {
          current_page: page,
          last_page: 1,
          per_page: pagination.value.per_page,
          total: response.data.length,
        };
      } else if (response.data.data) {
        cosmeticsData = response.data.data;
        pagination.value = {
          current_page: response.data.current_page || page,
          last_page: response.data.last_page || 1,
          per_page: response.data.per_page || 20,
          total: response.data.total || 0,
        };
      } else {
        cosmeticsData = [];
        pagination.value = {
          current_page: 1,
          last_page: 1,
          per_page: 50,
          total: 0,
        };
      }
      
      cosmetics.value = cosmeticsData;
      
      return { success: true };
    } catch (error) {
      cosmetics.value = [];
      pagination.value = {
        current_page: 1,
        last_page: 1,
        per_page: 20,
        total: 0,
      };
      return { success: false, message: error.message };
    } finally {
      loading.value = false;
    }
  }

  async function fetchCosmeticById(id) {
    try {
      const response = await api.get(`/api/cosmetics/${id}`);
      const cosmetic = response.data;
      
      return { success: true, data: cosmetic };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async function fetchNewCosmetics() {
    try {
      const response = await api.get('/api/cosmetics/new');
      const data = Array.isArray(response.data) ? response.data : [];
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.message, data: [] };
    }
  }

  async function fetchShopCosmetics() {
    try {
      const response = await api.get('/api/shop');
      const data = Array.isArray(response.data) ? response.data : [];
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.message, data: [] };
    }
  }

  function setFilters(newFilters) {
    filters.value = { ...filters.value, ...newFilters };
  }

  async function applyFilters(page = 1) {
    return await fetchCosmetics(page);
  }

  function resetFilters() {
    filters.value = {
      search: '',
      type: '',
      rarity: '',
      onlyNew: false,
      onlyOnSale: false,
      onlyPromoted: false,
    };
  }

  return {
    cosmetics,
    loading,
    pagination,
    filters,
    filteredCosmetics,
    fetchCosmetics,
    fetchCosmeticById,
    fetchNewCosmetics,
    fetchShopCosmetics,
    setFilters,
    resetFilters,
    applyFilters,
  };
});

