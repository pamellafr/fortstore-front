<template>
  <div class="user-profile-page">
    <div v-if="loading" class="loading">
      <div class="loading__spinner"></div>
    </div>

    <div v-else-if="user" class="user-profile-page__container">
      <button @click="$router.back()" class="user-profile-page__back">
        ← Voltar
      </button>

      <div class="user-profile-card">
        <div class="user-profile-card__header">
          <div class="user-profile-card__avatar">
            <span>{{ userInitials }}</span>
          </div>
          <div class="user-profile-card__info">
            <h1 class="user-profile-card__name">{{ user.name }}</h1>
            <p class="user-profile-card__email">{{ user.email }}</p>
          </div>
        </div>

        <div class="user-profile-card__stats">
          <div class="stat-item">
            <span class="stat-label">Cosméticos</span>
            <span class="stat-value">{{ userCosmetics.length }}</span>
          </div>
        </div>
      </div>

      <div class="user-cosmetics-section">
        <h2 class="section-title">Cosméticos Possuídos</h2>
        <div v-if="userCosmetics.length > 0" class="cosmetics-grid">
          <CosmeticCard
            v-for="cosmetic in userCosmetics"
            :key="cosmetic.id"
            :cosmetic="cosmetic"
          />
        </div>
        <div v-else class="empty-state">
          <p>Este usuário ainda não possui cosméticos.</p>
        </div>
      </div>
    </div>

    <div v-else class="error-state">
      <p>Usuário não encontrado</p>
      <router-link to="/users" class="btn btn--primary">
        Voltar para Usuários
      </router-link>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../services/api';
import CosmeticCard from '../components/CosmeticCard.vue';

export default {
  name: 'UserProfile',
  components: {
    CosmeticCard,
  },
  setup() {
    const route = useRoute();
    const user = ref(null);
    const userCosmetics = ref([]);
    const loading = ref(true);

    const userInitials = computed(() => {
      if (!user.value?.name) return 'U';
      const names = user.value.name.split(' ');
      if (names.length >= 2) {
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
      }
      return user.value.name[0].toUpperCase();
    });

    const loadUserProfile = async () => {
      loading.value = true;
      try {
        const userId = route.params.id;
        const [userResponse, cosmeticsResponse] = await Promise.all([
          api.get(`/api/users/${userId}`),
          api.get(`/api/users/${userId}/cosmetics`),
        ]);
        user.value = userResponse.data;
        userCosmetics.value = cosmeticsResponse.data || [];
      } catch (error) {
        user.value = null;
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      loadUserProfile();
    });

    return {
      user,
      userCosmetics,
      loading,
      userInitials,
    };
  },
};
</script>

<style scoped>
.user-profile-page {
  min-height: calc(100vh - 64px);
  padding: 32px;
}

.user-profile-page__container {
  max-width: 1400px;
  margin: 0 auto;
}

.user-profile-page__back {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 24px;
  transition: all 0.2s ease;
}

.user-profile-page__back:hover {
  border-color: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.user-profile-card {
  background: rgba(35, 35, 43, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 40px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 32px;
}

.user-profile-card__header {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
  padding-bottom: 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.user-profile-card__avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
}

.user-profile-card__info {
  flex: 1;
}

.user-profile-card__name {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px 0;
}

.user-profile-card__email {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.user-profile-card__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.stat-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
}

.user-cosmetics-section {
  margin-top: 32px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 24px 0;
  padding-bottom: 16px;
  border-bottom: 2px solid rgba(102, 126, 234, 0.3);
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
  min-height: 400px;
}

.loading__spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(102, 126, 234, 0.2);
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

.error-state {
  text-align: center;
  padding: 60px;
  color: rgba(255, 255, 255, 0.6);
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
  margin-top: 16px;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}
</style>

