<template>
  <div class="bundles-page">
    <div class="bundles-page__container">
      <div class="bundles-page__header">
        <h1 class="bundles-page__title">Bundles</h1>
        <p class="bundles-page__subtitle">
          Pacotes com desconto contendo múltiplos itens
        </p>
      </div>

      <div v-if="loading" class="loading">
        <div class="loading__spinner"></div>
      </div>

      <div v-else-if="bundles.length > 0" class="bundles-grid">
        <BundleCard
          v-for="bundle in bundles"
          :key="bundle.id"
          :bundle="bundle"
        />
      </div>

      <div v-else class="empty-state">
        <p>Nenhum bundle disponível no momento.</p>
      </div>

      <div v-if="pagination.last_page > 1" class="pagination">
        <button
          @click="loadPage(pagination.current_page - 1)"
          :disabled="pagination.current_page === 1"
          class="pagination__btn"
        >
          Anterior
        </button>
        <span class="pagination__info">
          Página {{ pagination.current_page }} de {{ pagination.last_page }}
        </span>
        <button
          @click="loadPage(pagination.current_page + 1)"
          :disabled="pagination.current_page === pagination.last_page"
          class="pagination__btn"
        >
          Próxima
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import BundleCard from '../components/BundleCard.vue';
import { useBundlesStore } from '../stores/bundles';

export default {
  name: 'Bundles',
  components: {
    BundleCard,
  },
  setup() {
    const route = useRoute();
    const bundlesStore = useBundlesStore();
    const bundles = ref([]);
    const loading = ref(false);
    const pagination = ref({
      current_page: 1,
      last_page: 1,
      per_page: 20,
      total: 0,
    });

    const loadBundles = async (page = 1) => {
      loading.value = true;
      try {
        const result = await bundlesStore.fetchBundles(page);
        if (result.success) {
          bundles.value = bundlesStore.bundles;
          pagination.value = bundlesStore.pagination;
        }
      } catch (error) {
        bundles.value = [];
      } finally {
        loading.value = false;
      }
    };

    const loadPage = (page) => {
      if (page >= 1 && page <= pagination.value.last_page) {
        loadBundles(page);
      }
    };

    onMounted(() => {
      loadBundles();
    });

    watch(
      () => route.path,
      () => {
        if (route.path === '/bundles') {
          loadBundles();
        }
      }
    );

    return {
      bundles,
      loading,
      pagination,
      loadPage,
    };
  },
};
</script>

<style scoped>
.bundles-page {
  min-height: calc(100vh - 64px);
  padding: 32px;
}

.bundles-page__container {
  max-width: 1400px;
  margin: 0 auto;
}

.bundles-page__header {
  margin-bottom: 32px;
}

.bundles-page__title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.bundles-page__subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.bundles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px;
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
  font-size: 1.1rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  margin-top: 32px;
}

.pagination__btn {
  padding: 12px 24px;
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 8px;
  background: rgba(102, 126, 234, 0.1);
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination__btn:hover:not(:disabled) {
  background: rgba(102, 126, 234, 0.2);
  border-color: rgba(102, 126, 234, 0.5);
}

.pagination__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination__info {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
}

@media (max-width: 768px) {
  .bundles-grid {
    grid-template-columns: 1fr;
  }
}
</style>

