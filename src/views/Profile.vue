<template>
  <div class="profile-page">
    <div class="profile-page__container">
      <div class="profile-card">
        <div class="profile-card__header">
          <div class="profile-card__avatar">
            <span>{{ userInitials }}</span>
          </div>
          <div class="profile-card__info">
            <h1 class="profile-card__name">{{ authStore.user?.name }}</h1>
            <p class="profile-card__email">{{ authStore.user?.email }}</p>
            <p class="profile-card__joined">
              Membro desde {{ formatDate(authStore.user?.created_at) }}
            </p>
          </div>
        </div>

        <div class="profile-card__credits">
          <span class="credits-label">V-Bucks</span>
          <span class="credits-value">
            {{ formatVBucks(authStore.user?.credits || authStore.user?.credit?.amount || 0) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useAuthStore } from '../stores/auth';

export default {
  name: 'Profile',
  setup() {
    const authStore = useAuthStore();

    const userInitials = computed(() => {
      if (!authStore.user?.name) return 'U';
      const names = authStore.user.name.split(' ');
      if (names.length >= 2) {
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
      }
      return authStore.user.name[0].toUpperCase();
    });

    const formatVBucks = (amount) => {
      return new Intl.NumberFormat('pt-BR').format(amount);
    };

    const formatDate = (date) => {
      if (!date) return '';
      try {
        return new Date(date).toLocaleDateString('pt-BR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      } catch {
        return date;
      }
    };

    return {
      authStore,
      userInitials,
      formatVBucks,
      formatDate,
    };
  },
};
</script>

<style scoped>
.profile-page {
  min-height: calc(100vh - 64px);
  padding: 32px;
  background: #0a0a0f;
}

.profile-page__container {
  max-width: 1200px;
  margin: 0 auto;
}

.profile-card {
  background: rgba(35, 35, 43, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.profile-card__header {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
  padding-bottom: 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.profile-card__avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: #fff;
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.4);
  flex-shrink: 0;
}

.profile-card__info {
  flex: 1;
}

.profile-card__name {
  font-size: 2.5rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 8px 0;
}

.profile-card__email {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 4px 0;
}

.profile-card__joined {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

.profile-card__credits {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 24px;
}

.credits-label {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.credits-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
}

@media (max-width: 768px) {
  .profile-page {
    padding: 16px;
  }

  .profile-card {
    padding: 24px;
  }

  .profile-card__header {
    flex-direction: column;
    text-align: center;
  }

  .profile-card__name {
    font-size: 2rem;
  }

}
</style>
