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
        <router-link to="/bundles" class="header__link">Bundles</router-link>
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

      <button 
        @click="toggleMobileMenu" 
        class="header__menu-toggle"
        :class="{ 'header__menu-toggle--active': isMobileMenuOpen }"
        :aria-expanded="isMobileMenuOpen"
        aria-label="Toggle menu"
        aria-controls="mobile-menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <transition name="mobile-menu-overlay">
      <div v-if="isMobileMenuOpen" class="header__mobile-overlay" @click="closeMobileMenu"></div>
    </transition>
    
    <transition name="mobile-menu">
      <div v-if="isMobileMenuOpen" id="mobile-menu" class="header__mobile-menu">
        <nav class="header__mobile-nav" role="navigation" aria-label="Menu principal">
          <router-link to="/" class="header__mobile-link" @click="closeMobileMenu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 6v6l4 2"></path>
            </svg>
            Descobrir
          </router-link>
          <router-link to="/cosmetics" class="header__mobile-link" @click="closeMobileMenu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2"></rect>
              <path d="M9 9h6v6H9z"></path>
            </svg>
            Navegar
          </router-link>
          <router-link to="/bundles" class="header__mobile-link" @click="closeMobileMenu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            </svg>
            Bundles
          </router-link>
          <router-link to="/users" class="header__mobile-link" @click="closeMobileMenu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            Usuários
          </router-link>

          <div v-if="authStore.isAuthenticated" class="header__mobile-user">
            <div class="header__mobile-v-bucks">
              <span class="header__mobile-v-bucks-icon">💎</span>
              <span class="header__mobile-v-bucks-amount">{{ formatVBucks(authStore.user?.credits || authStore.user?.credit?.amount || 0) }}</span>
            </div>
            <router-link to="/library" class="header__mobile-link" @click="closeMobileMenu">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              Biblioteca
            </router-link>
            <router-link to="/history" class="header__mobile-link" @click="closeMobileMenu">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
              Histórico
            </router-link>
            <router-link to="/profile" class="header__mobile-link" @click="closeMobileMenu">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Perfil
            </router-link>
            <button @click="handleMobileLogout" class="header__mobile-btn header__mobile-btn--logout">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Sair
            </button>
          </div>
          <div v-else class="header__mobile-guest">
            <router-link to="/login" class="header__mobile-btn header__mobile-btn--login" @click="closeMobileMenu">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                <polyline points="10 17 15 12 10 7"></polyline>
                <line x1="15" y1="12" x2="3" y2="12"></line>
              </svg>
              Entrar
            </router-link>
          </div>
        </nav>
      </div>
    </transition>
  </header>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

export default {
  name: 'AppHeader',
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const isMobileMenuOpen = ref(false);

    const formatVBucks = (amount) => {
      return new Intl.NumberFormat('pt-BR').format(amount);
    };

    const toggleMobileMenu = (event) => {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
      }
      isMobileMenuOpen.value = !isMobileMenuOpen.value;
    };

    const closeMobileMenu = () => {
      isMobileMenuOpen.value = false;
    };

    const handleLogout = async () => {
      await authStore.logout();
      closeMobileMenu();
      router.push('/');
    };

    const handleMobileLogout = async () => {
      await handleLogout();
    };

    const handleResize = () => {
      if (window.innerWidth > 768) {
        closeMobileMenu();
      }
    };

    const handleClickOutside = (event) => {
      if (!isMobileMenuOpen.value) return;
      
      const target = event.target;
      const isClickInsideMenu = target.closest('.header__mobile-menu') !== null;
      const isClickOnToggle = target.closest('.header__menu-toggle') !== null;
      
      if (!isClickInsideMenu && !isClickOnToggle) {
        closeMobileMenu();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isMobileMenuOpen.value) {
        closeMobileMenu();
      }
    };

    const lockBodyScroll = () => {
      if (isMobileMenuOpen.value) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    };

    watch(isMobileMenuOpen, () => {
      lockBodyScroll();
    });

    watch(() => router.currentRoute.value.path, () => {
      closeMobileMenu();
    });

    onMounted(() => {
      window.addEventListener('resize', handleResize);
      document.addEventListener('keydown', handleKeyDown);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    });

    watch(isMobileMenuOpen, (isOpen) => {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    return {
      authStore,
      formatVBucks,
      handleLogout,
      handleMobileLogout,
      isMobileMenuOpen,
      toggleMobileMenu,
      closeMobileMenu,
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

.header__menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 28px;
  height: 22px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 10000;
  position: relative;
}

.header__menu-toggle span {
  display: block;
  width: 100%;
  height: 3px;
  background: #fff;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.header__menu-toggle--active span:nth-child(1) {
  transform: translateY(9.5px) rotate(45deg);
}

.header__menu-toggle--active span:nth-child(2) {
  opacity: 0;
}

.header__menu-toggle--active span:nth-child(3) {
  transform: translateY(-9.5px) rotate(-45deg);
}

.header__mobile-menu {
  position: fixed;
  top: 64px;
  right: 0;
  bottom: 0;
  width: 50%;
  max-width: 400px;
  height: calc(100vh - 64px);
  z-index: 9999;
  overflow-y: auto;
}

.header__mobile-nav {
  background: linear-gradient(180deg, #1a1a1f 0%, #18181c 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
}

.header__mobile-link {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #fff;
  text-decoration: none;
  font-size: 1rem;
  padding: 14px 16px;
  border-radius: 8px;
  transition: all 0.2s ease;
  opacity: 0.9;
}

.header__mobile-link svg {
  opacity: 0.8;
}

.header__mobile-link:hover {
  background: rgba(102, 126, 234, 0.15);
  opacity: 1;
  color: #8b9aff;
}

.header__mobile-link.router-link-active {
  background: rgba(102, 126, 234, 0.2);
  color: #8b9aff;
  opacity: 1;
  border-left: 3px solid #667eea;
}

.header__mobile-user {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.header__mobile-v-bucks {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(102, 126, 234, 0.15);
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid rgba(102, 126, 234, 0.3);
  margin-bottom: 8px;
}

.header__mobile-v-bucks-icon {
  font-size: 1.2rem;
  filter: drop-shadow(0 2px 4px rgba(102, 126, 234, 0.4));
}

.header__mobile-v-bucks-amount {
  font-weight: 600;
  color: #667eea;
  font-size: 1rem;
}

.header__mobile-guest {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.header__mobile-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 14px 16px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.header__mobile-btn--login {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.header__mobile-btn--login:hover {
  background: linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
  transform: translateY(-2px);
}

.header__mobile-btn--logout {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border: 1px solid rgba(102, 126, 234, 0.3);
}

.header__mobile-btn--logout:hover {
  background: rgba(102, 126, 234, 0.2);
  border-color: rgba(102, 126, 234, 0.5);
}

.header__mobile-overlay {
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 9998;
}

.mobile-menu-overlay-enter-active,
.mobile-menu-overlay-leave-active {
  transition: opacity 0.3s ease;
}

.mobile-menu-overlay-enter-from,
.mobile-menu-overlay-leave-to {
  opacity: 0;
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: transform 0.3s ease;
}

.mobile-menu-enter-from {
  transform: translateX(100%);
}

.mobile-menu-leave-to {
  transform: translateX(100%);
}

@media (max-width: 768px) {
  .header__nav {
    display: none;
  }

  .header__right {
    display: none;
  }

  .header__menu-toggle {
    display: flex;
  }
  
  .header__container {
    padding: 0 16px;
  }
}

@media (min-width: 769px) {
  .header__mobile-menu {
    display: none;
  }
}
</style>
