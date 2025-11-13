<template>
  <div class="users-page">
    <div class="users-page__container">
      <div class="users-page__header">
        <h1 class="users-page__title">Usuários</h1>
        <p class="users-page__subtitle">
          {{ pagination.total }} usuários cadastrados
        </p>
      </div>

      <div class="users-page__search">
        <input
          v-model="searchQuery"
          type="text"
          class="search-input"
          placeholder="Buscar usuários..."
          @input="handleSearch"
        />
      </div>

      <div v-if="loading" class="loading">
        <div class="loading__spinner"></div>
      </div>

      <div v-else-if="users.length > 0" class="users-grid">
        <div
          v-for="user in paginatedUsers"
          :key="user.id"
          class="user-card"
          @click="goToUserProfile(user.id)"
        >
          <div class="user-card__avatar">
            <span>{{ getUserInitials(user.name) }}</span>
          </div>
          <div class="user-card__info">
            <h3 class="user-card__name">{{ user.name }}</h3>
            <p class="user-card__email">{{ user.email }}</p>
            <div class="user-card__stats">
              <span class="stat">
                {{ user.cosmetics_count || 0 }} cosméticos
              </span>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <p>Nenhum usuário encontrado.</p>
      </div>

      <div v-if="!loading && users.length > 0" class="pagination">
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
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

export default {
  name: 'Users',
  setup() {
    const router = useRouter();
    const users = ref([]);
    const loading = ref(true);
    const searchQuery = ref('');
    const currentPage = ref(1);
    const itemsPerPage = 20;
    const pagination = ref({
      total: 0,
    });

    const filteredUsers = computed(() => {
      if (!searchQuery.value) return users.value;
      const query = searchQuery.value.toLowerCase();
      return users.value.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      );
    });

    const totalPages = computed(() => {
      return Math.ceil(filteredUsers.value.length / itemsPerPage);
    });

    const paginatedUsers = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return filteredUsers.value.slice(start, end);
    });

    const loadUsers = async () => {
      loading.value = true;
      try {
        const response = await api.get('/api/users');
        users.value = response.data || [];
        pagination.value.total = users.value.length;
      } catch (error) {
        users.value = [];
      } finally {
        loading.value = false;
      }
    };

    const getUserInitials = (name) => {
      if (!name) return 'U';
      const names = name.split(' ');
      if (names.length >= 2) {
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
      }
      return name[0].toUpperCase();
    };

    const handleSearch = () => {
      currentPage.value = 1;
    };

    const goToUserProfile = (userId) => {
      router.push({ name: 'UserProfile', params: { id: userId } });
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    onMounted(() => {
      loadUsers();
    });

    return {
      users,
      loading,
      searchQuery,
      currentPage,
      pagination,
      filteredUsers,
      totalPages,
      paginatedUsers,
      getUserInitials,
      handleSearch,
      goToUserProfile,
      nextPage,
      previousPage,
    };
  },
};
</script>

<style scoped>
.users-page {
  min-height: calc(100vh - 64px);
  padding: 32px;
}

.users-page__container {
  max-width: 1400px;
  margin: 0 auto;
}

.users-page__header {
  margin-bottom: 32px;
}

.users-page__title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.users-page__subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.users-page__search {
  margin-bottom: 32px;
}

.search-input {
  width: 100%;
  max-width: 500px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px 16px;
  color: #fff;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.user-card {
  background: rgba(35, 35, 43, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-card:hover {
  transform: translateY(-4px);
  border-color: rgba(102, 126, 234, 0.3);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.user-card__avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}

.user-card__info {
  flex: 1;
  min-width: 0;
}

.user-card__name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 4px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-card__email {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 8px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-card__stats {
  display: flex;
  gap: 16px;
}

.stat {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
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
</style>

