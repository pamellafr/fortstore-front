<template>
  <div class="cosmetics-page">
    <div class="cosmetics-page__container">
      <div class="cosmetics-page__header">
        <h1 class="cosmetics-page__title">Cosméticos</h1>
        <p class="cosmetics-page__subtitle">
          {{ pagination.total }} cosméticos disponíveis
        </p>
      </div>

      <div class="cosmetics-page__content">
        <aside class="cosmetics-page__sidebar">
          <CosmeticFilters
            :filters="filters"
            @update:filters="handleFiltersUpdate"
          />
        </aside>

        <main class="cosmetics-page__main">
          <div v-if="loading" class="loading">
            <div class="loading__spinner"></div>
            <p>Carregando cosméticos...</p>
          </div>

          <div v-else-if="paginatedCosmetics.length > 0" class="cosmetics-grid">
            <CosmeticCard
              v-for="cosmetic in paginatedCosmetics"
              :key="cosmetic.id"
              :cosmetic="cosmetic"
            />
          </div>

          <div v-else class="empty-state">
            <p v-if="pagination.total === 0">
              Nenhum cosmético encontrado com os filtros selecionados.
            </p>
            <button v-if="pagination.total === 0" @click="resetFilters" class="btn btn--primary">
              Limpar Filtros
            </button>
          </div>

          <div v-if="!loading && paginatedCosmetics.length > 0" class="pagination">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              class="pagination__btn"
            >
              Anterior
            </button>
            <span class="pagination__info">
              Página {{ currentPage }} de {{ totalPages }}
            </span>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="pagination__btn"
            >
              Próxima
            </button>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useCosmeticsStore } from '../stores/cosmetics';
import CosmeticCard from '../components/CosmeticCard.vue';
import CosmeticFilters from '../components/CosmeticFilters.vue';

export default {
  name: 'Cosmetics',
  components: {
    CosmeticCard,
    CosmeticFilters,
  },
  setup() {
    const route = useRoute();
    const cosmeticsStore = useCosmeticsStore();
    const currentPage = ref(1);

    const loading = computed(() => cosmeticsStore.loading);
    const filters = computed(() => cosmeticsStore.filters);
    const filteredCosmetics = computed(() => cosmeticsStore.filteredCosmetics);
    const pagination = computed(() => cosmeticsStore.pagination);
    const allCosmetics = computed(() => cosmeticsStore.cosmetics);

    watch(
      () => pagination.value.current_page,
      (newPage) => {
        if (newPage && newPage !== currentPage.value) {
          currentPage.value = newPage;
        }
      }
    );

    const totalPages = computed(() => {
      return pagination.value.last_page || 1;
    });

    const paginatedCosmetics = computed(() => {
      return filteredCosmetics.value;
    });

    const handleFiltersUpdate = async (newFilters) => {
      cosmeticsStore.setFilters(newFilters);
      currentPage.value = 1;
      await cosmeticsStore.applyFilters(1);
    };

    const resetFilters = async () => {
      cosmeticsStore.resetFilters();
      currentPage.value = 1;
      await cosmeticsStore.applyFilters(1);
    };

    const nextPage = async () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
        await cosmeticsStore.fetchCosmetics(currentPage.value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    const previousPage = async () => {
      if (currentPage.value > 1) {
        currentPage.value--;
        await cosmeticsStore.fetchCosmetics(currentPage.value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };


    const applyFiltersFromQuery = () => {
      const query = route.query;
      const newFilters = {
        search: '',
        type: '',
        rarity: '',
        onlyNew: false,
        onlyOnSale: false,
        onlyPromoted: false,
      };
      
      if (query.onlyNew === 'true') {
        newFilters.onlyNew = true;
      }
      if (query.onlyOnSale === 'true') {
        newFilters.onlyOnSale = true;
      }
      if (query.onlyPromoted === 'true') {
        newFilters.onlyPromoted = true;
      }
      if (query.type) {
        newFilters.type = String(query.type);
      }
      if (query.rarity) {
        newFilters.rarity = String(query.rarity);
      }
      if (query.search) {
        newFilters.search = String(query.search);
      }
      
      cosmeticsStore.setFilters(newFilters);
    };

    watch(
      () => route.query,
      () => {
        applyFiltersFromQuery();
        cosmeticsStore.applyFilters(1);
      },
      { immediate: true }
    );

    onMounted(async () => {
      applyFiltersFromQuery();
      await cosmeticsStore.applyFilters(1);
    });

    return {
      loading,
      filters,
      filteredCosmetics,
      pagination,
      allCosmetics,
      currentPage,
      totalPages,
      paginatedCosmetics,
      handleFiltersUpdate,
      resetFilters,
      nextPage,
      previousPage,
    };
  },
};
</script>

<style scoped>
.cosmetics-page {
  min-height: calc(100vh - 64px);
  padding: 32px;
}

.cosmetics-page__container {
  max-width: 1400px;
  margin: 0 auto;
}

.cosmetics-page__header {
  margin-bottom: 32px;
}

.cosmetics-page__title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.cosmetics-page__subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.cosmetics-page__content {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 32px;
}

.cosmetics-page__sidebar {
  position: sticky;
  top: 80px;
  height: fit-content;
}

.cosmetics-page__main {
  min-height: 400px;
}

.cosmetics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  gap: 20px;
  color: rgba(255, 255, 255, 0.6);
}

.loading__spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(102, 126, 234, 0.2);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-state {
  text-align: center;
  padding: 60px;
  color: rgba(255, 255, 255, 0.6);
}

.empty-state p {
  margin-bottom: 24px;
  font-size: 1.1rem;
}

.btn {
  display: inline-block;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn--primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.btn--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  padding: 32px 0;
}

.pagination__btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination__btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.pagination__btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination__info {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
}

@media (max-width: 1024px) {
  .cosmetics-page__content {
    grid-template-columns: 1fr;
  }

  .cosmetics-page__sidebar {
    position: relative;
    top: 0;
  }
}

@media (max-width: 768px) {
  .cosmetics-page {
    padding: 16px;
  }

  .cosmetics-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
  }
}
</style>

