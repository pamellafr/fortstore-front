<template>
  <div class="library-page">
    <div class="library-page__container">
      <div class="library-page__header">
        <h1 class="library-page__title">Minha Biblioteca</h1>
        <p class="library-page__subtitle">
          {{ ownedCosmetics.length }} cosméticos adquiridos
        </p>
      </div>

      <div v-if="loading" class="loading">
        <div class="loading__spinner"></div>
      </div>

      <div v-else-if="ownedCosmetics.length > 0" class="cosmetics-grid">
        <CosmeticCard
          v-for="cosmetic in ownedCosmetics"
          :key="cosmetic.id"
          :cosmetic="cosmetic"
        />
      </div>

      <div v-else class="empty-state">
        <p>Você ainda não possui nenhum cosmético.</p>
        <router-link to="/cosmetics" class="btn btn--primary">
          Explorar Cosméticos
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import CosmeticCard from '../components/CosmeticCard.vue';
import api from '../services/api';

export default {
  name: 'Library',
  components: {
    CosmeticCard,
  },
  setup() {
    const route = useRoute();
    const ownedCosmetics = ref([]);
    const loading = ref(true);

    const loadOwnedCosmetics = async () => {
      loading.value = true;
      try {
        const response = await api.get('/api/cosmetics/owned');
        if (Array.isArray(response.data)) {
          ownedCosmetics.value = response.data;
        } else {
          ownedCosmetics.value = [];
        }
      } catch (error) {
        ownedCosmetics.value = [];
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      loadOwnedCosmetics();
    });

    watch(
      () => route.path,
      () => {
        if (route.path === '/library') {
          loadOwnedCosmetics();
        }
      }
    );

    return {
      ownedCosmetics,
      loading,
    };
  },
};
</script>

<style scoped>
.library-page {
  min-height: calc(100vh - 64px);
  padding: 32px;
}

.library-page__container {
  max-width: 1400px;
  margin: 0 auto;
}

.library-page__header {
  margin-bottom: 32px;
}

.library-page__title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.library-page__subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.cosmetics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 24px;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}
</style>

