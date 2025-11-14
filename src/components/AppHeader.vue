<template>
  <header class="header">
    <div class="header__container">
      <div class="header__left">
        <router-link to="/" class="header__logo-link">
          <img src="/logo.svg" alt="Logo" class="header__logo" />
          <span class="header__brand">FORTSTORE</span>
        </router-link>
      </div>
      
      <nav class="header__nav">
        <router-link to="/" class="header__link">Descobrir</router-link>
        <router-link to="/cosmetics" class="header__link">Navegar</router-link>
        <router-link to="/users" class="header__link">Usuários</router-link>
      </nav>
      
      <div class="header__right">
        <div v-if="authStore.isAuthenticated" class="header__user">
          <div class="header__v-bucks">
            <span class="header__v-bucks-icon">💎</span>
            <span class="header__v-bucks-amount">{{ formatVBucks(authStore.user?.credits || authStore.user?.credit?.amount || 0) }}</span>
          </div>
          <router-link to="/library" class="header__link">Biblioteca</router-link>
          <router-link to="/history" class="header__link">Histórico</router-link>
          <router-link to="/profile" class="header__link">Perfil</router-link>
          <button @click="handleLogout" class="header__btn header__btn--logout">Sair</button>
        </div>
        <div v-else class="header__guest">
          <router-link to="/login" class="header__btn header__btn--login">Entrar</router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

export default {
  name: 'AppHeader',
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const formatVBucks = (amount) => {
      return new Intl.NumberFormat('pt-BR').format(amount);
    };

    const handleLogout = async () => {
      await authStore.logout();
      router.push('/');
    };

    return {
      authStore,
      formatVBucks,
      handleLogout,
    };
  },
};
</script>

<style scoped>
.header {
  background: linear-gradient(180deg, #1a1a1f 0%, #18181c 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(20px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.header__container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  height: 64px;
}

.header__left {
  display: flex;
  align-items: center;
}

.header__logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s ease;
}

.header__logo-link:hover {
  transform: scale(1.05);
}

.header__logo {
  height: 36px;
  margin-right: 12px;
  filter: drop-shadow(0 2px 8px rgba(102, 126, 234, 0.3));
}

.header__brand {
  font-weight: 700;
  font-size: 1.3rem;
  letter-spacing: 2px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header__nav {
  display: flex;
  gap: 24px;
  flex: 1;
  justify-content: center;
}

.header__link {
  color: #fff;
  text-decoration: none;
  font-size: 0.95rem;
  opacity: 0.85;
  transition: all 0.2s ease;
  position: relative;
  padding: 8px 12px;
  border-radius: 6px;
}

.header__link:hover {
  opacity: 1;
  color: #8b9aff;
  background: rgba(102, 126, 234, 0.08);
}

.header__link.router-link-active {
  opacity: 1;
  color: #8b9aff;
}

.header__link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 12px;
  right: 12px;
  height: 2px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px 2px 0 0;
}

.header__right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header__user {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header__v-bucks {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(102, 126, 234, 0.1);
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid rgba(102, 126, 234, 0.3);
}

.header__v-bucks-icon {
  font-size: 1.1rem;
  filter: drop-shadow(0 2px 4px rgba(102, 126, 234, 0.4));
}

.header__v-bucks-amount {
  font-weight: 600;
  color: #667eea;
  font-size: 0.9rem;
}

.header__btn {
  background: #23232b;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  text-decoration: none;
}

.header__btn:hover {
  background: #2d2d37;
  transform: translateY(-1px);
}

.header__btn--login {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  text-decoration: none;
}

.header__btn--login.router-link-active {
  text-decoration: none;
}

.header__btn--login:hover {
  background: linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.header__btn--logout {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border: 1px solid rgba(102, 126, 234, 0.3);
}

.header__btn--logout:hover {
  background: rgba(102, 126, 234, 0.2);
  border-color: rgba(102, 126, 234, 0.5);
}

@media (max-width: 768px) {
  .header__nav {
    display: none;
  }
  
  .header__container {
    padding: 0 16px;
  }
}
</style>
