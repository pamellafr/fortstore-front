<template>
  <div class="bundle-detail">
    <div v-if="loading" class="loading">
      <div class="loading__spinner"></div>
      <p>Carregando...</p>
    </div>

    <div v-else-if="bundle" class="bundle-detail__container">
      <button @click="$router.back()" class="bundle-detail__back">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Voltar
      </button>

      <div class="bundle-detail__hero">
        <div class="bundle-detail__preview">
          <div class="bundle-detail__badges">
            <span v-if="bundle.savings > 0" class="badge badge--discount">
              {{ formatSavings(bundle.savings) }} DE DESCONTO
            </span>
            <span v-if="bundle.is_owned" class="badge badge--owned">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              ADQUIRIDO
            </span>
          </div>
          
          <div class="bundle-detail__items-grid">
            <div
              v-for="(item, index) in bundleItems"
              :key="item.id || index"
              class="bundle-item"
              :class="{ 'bundle-item--owned': item.is_owned }"
            >
              <img
                :src="getItemImage(item)"
                :alt="item.name"
                class="bundle-item__image"
                @error="handleImageError($event, item)"
              />
              <div class="bundle-item__info">
                <span class="bundle-item__name">{{ item.name }}</span>
                <span class="bundle-item__type">{{ item.type_name }}</span>
              </div>
              <span v-if="item.is_owned" class="bundle-item__owned-badge">✓</span>
            </div>
          </div>
        </div>

        <div class="bundle-detail__info">
          <div class="bundle-detail__header">
            <h1 class="bundle-detail__name">{{ bundle.name }}</h1>
            <div class="bundle-detail__rarity-badge" :style="{ borderColor: rarityColor }">
              <span :style="{ color: rarityColor }">{{ bundle.rarity_name }}</span>
            </div>
          </div>
          
          <p v-if="bundle.description" class="bundle-detail__description">
            {{ bundle.description }}
          </p>

          <div class="bundle-detail__stats">
            <div class="stat-item">
              <span class="stat-label">Itens no Bundle</span>
              <span class="stat-value">{{ bundle.total_items || bundleItems.length }}</span>
            </div>
            <div v-if="bundle.total_individual_price" class="stat-item">
              <span class="stat-label">Preço Individual</span>
              <span class="stat-value">{{ formatPrice(bundle.total_individual_price) }} 💎</span>
            </div>
            <div v-if="bundle.savings > 0" class="stat-item stat-item--highlight">
              <span class="stat-label">Economia</span>
              <span class="stat-value">{{ formatPrice(bundle.savings) }} 💎</span>
            </div>
          </div>

          <div class="bundle-detail__pricing">
            <div v-if="bundle.total_individual_price && bundle.total_individual_price > bundle.price" class="pricing-compare">
              <span class="pricing-original">{{ formatPrice(bundle.total_individual_price) }} 💎</span>
              <span class="pricing-current">{{ formatPrice(bundle.price) }} 💎</span>
            </div>
            <div v-else class="pricing-simple">
              <span class="pricing-current">{{ formatPrice(bundle.price) }} 💎</span>
            </div>
          </div>

          <div class="bundle-detail__actions">
            <button
              v-if="!bundle.is_owned && authStore.isAuthenticated"
              @click="handlePurchase"
              :disabled="purchasing || !canAfford"
              class="btn btn--primary btn--large"
            >
              <span v-if="purchasing" class="btn__loading">
                <svg class="spinner" width="20" height="20" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" stroke-dasharray="32" stroke-dashoffset="32">
                    <animate attributeName="stroke-dasharray" dur="2s" values="0 32;16 16;0 32;0 32" repeatCount="indefinite"/>
                    <animate attributeName="stroke-dashoffset" dur="2s" values="0;-16;-32;-32" repeatCount="indefinite"/>
                  </circle>
                </svg>
                Comprando...
              </span>
              <span v-else>
                Comprar Bundle
              </span>
            </button>
            
            <div v-if="!authStore.isAuthenticated" class="auth-prompt">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <path d="M20 8v6M23 11h-6"></path>
              </svg>
              <p>Faça login para comprar este bundle</p>
              <router-link to="/login" class="btn btn--secondary">
                Fazer Login
              </router-link>
            </div>

            <div v-if="authStore.isAuthenticated && !canAfford" class="insufficient-funds">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <p>Créditos insuficientes</p>
              <p class="funds-needed">
                Você precisa de {{ formatPrice(bundle.price - userCredits) }} 💎 a mais
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useBundlesStore } from '../stores/bundles';
import { useAuthStore } from '../stores/auth';
import { useToast } from '../composables/useToast';
import { useModal } from '../composables/useModal';

export default {
  name: 'BundleDetail',
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
  },
  setup(props) {
    const route = useRoute();
    const router = useRouter();
    const bundlesStore = useBundlesStore();
    const authStore = useAuthStore();
    const toast = useToast();
    const modal = useModal();
    const bundle = ref(null);
    const loading = ref(true);
    const purchasing = ref(false);
    const imageErrors = ref({});

    const bundleId = computed(() => {
      return props.id || route.params.id;
    });

    const bundleItems = computed(() => {
      if (!bundle.value || !bundle.value.bundleItems) return [];
      return bundle.value.bundleItems || [];
    });

    const rarityColor = computed(() => {
      if (!bundle.value) return '#8b9aff';
      const rarity = bundle.value.rarity_name?.toUpperCase();
      const colors = {
        COMMON: '#8b9aff',
        UNCOMMON: '#8b9aff',
        RARE: '#8b9aff',
        EPIC: '#764ba2',
        LEGENDARY: '#8b9aff',
        MYTHIC: '#764ba2',
      };
      return colors[rarity] || '#8b9aff';
    });

    const userCredits = computed(() => {
      if (!authStore.user || !authStore.user.credit) return 0;
      return authStore.user.credit.amount || authStore.user.credits || 0;
    });

    const canAfford = computed(() => {
      if (!bundle.value || !bundle.value.price) return false;
      return userCredits.value >= bundle.value.price;
    });

    const getItemImage = (item) => {
      if (!item.images || !Array.isArray(item.images)) return null;
      const iconImage = item.images.find(img => img.type === 'icon');
      if (iconImage && iconImage.url) return iconImage.url;
      const featuredImage = item.images.find(img => img.type === 'featured');
      if (featuredImage && featuredImage.url) return featuredImage.url;
      return item.images[0]?.url || null;
    };

    const handleImageError = (event, item) => {
      imageErrors.value[item.id] = true;
      if (event.target) {
        event.target.style.display = 'none';
      }
    };

    const formatPrice = (price) => {
      if (!price) return '0';
      return new Intl.NumberFormat('pt-BR').format(price);
    };

    const formatSavings = (savings) => {
      if (!savings || savings <= 0) return '';
      return new Intl.NumberFormat('pt-BR').format(savings);
    };

    const loadBundle = async () => {
      loading.value = true;
      try {
        const result = await bundlesStore.fetchBundleById(bundleId.value);
        if (result.success) {
          bundle.value = result.data;
        } else {
          router.push({ name: 'Bundles' });
        }
      } catch (error) {
        router.push({ name: 'Bundles' });
      } finally {
        loading.value = false;
      }
    };

    const handlePurchase = async () => {
      if (!authStore.isAuthenticated) {
        router.push({ name: 'Login', query: { redirect: `/bundle/${bundleId.value}` } });
        return;
      }

      if (!canAfford.value) {
        toast.showToast('Créditos insuficientes!', 'error');
        return;
      }

      const confirmed = await modal.showModal({
        title: 'Comprar Bundle',
        message: `Deseja comprar o bundle "${bundle.value.name}" por ${formatPrice(bundle.value.price)} 💎?\n\nTodos os ${bundle.value.total_items} itens serão adicionados à sua biblioteca.`,
        confirmText: 'Comprar',
        closeOnOverlay: false,
        keepOpenOnConfirm: true,
      });

      if (!confirmed) {
        return;
      }

      purchasing.value = true;
      modal.setLoading(true);
      
      try {
        const result = await bundlesStore.purchaseBundle(bundleId.value);
        if (result.success) {
          await authStore.fetchUser();
          modal.closeModal(false, true);
          toast.showToast('Bundle adquirido com sucesso! Todos os itens foram adicionados à sua biblioteca.', 'success');
          router.push({ name: 'Library' });
        } else {
          modal.setLoading(false);
          toast.showToast(result.message || 'Erro ao comprar bundle', 'error');
        }
      } catch (error) {
        modal.setLoading(false);
        toast.showToast('Erro ao comprar bundle: ' + (error.message || 'Erro desconhecido'), 'error');
      } finally {
        purchasing.value = false;
      }
    };

    onMounted(() => {
      loadBundle();
    });

    return {
      bundle,
      loading,
      purchasing,
      bundleItems,
      rarityColor,
      userCredits,
      canAfford,
      authStore,
      getItemImage,
      handleImageError,
      formatPrice,
      formatSavings,
      handlePurchase,
    };
  },
};
</script>

<style scoped>
.bundle-detail {
  min-height: calc(100vh - 64px);
  padding: 32px;
}

.bundle-detail__container {
  max-width: 1400px;
  margin: 0 auto;
}

.bundle-detail__back {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(102, 126, 234, 0.1);
  color: #fff;
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 24px;
}

.bundle-detail__back:hover {
  background: rgba(102, 126, 234, 0.2);
  border-color: rgba(102, 126, 234, 0.5);
}

.bundle-detail__hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  margin-bottom: 48px;
}

.bundle-detail__preview {
  position: relative;
}

.bundle-detail__badges {
  position: absolute;
  top: 16px;
  left: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 2;
}

.badge {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.badge--discount {
  background: rgba(118, 75, 162, 0.95);
  color: #fff;
}

.badge--owned {
  background: rgba(102, 126, 234, 0.95);
  color: #fff;
}

.bundle-detail__items-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  background: rgba(0, 0, 0, 0.3);
  padding: 24px;
  border-radius: 16px;
  border: 2px solid rgba(102, 126, 234, 0.2);
}

.bundle-item {
  position: relative;
  background: rgba(30, 30, 40, 0.6);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.bundle-item:hover {
  border-color: rgba(102, 126, 234, 0.4);
  transform: translateY(-2px);
}

.bundle-item--owned {
  border-color: rgba(102, 126, 234, 0.5);
  background: rgba(102, 126, 234, 0.1);
}

.bundle-item__image {
  width: 100%;
  height: 120px;
  object-fit: contain;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 8px;
}

.bundle-item__info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 100%;
}

.bundle-item__name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #fff;
  text-align: center;
}

.bundle-item__type {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
}

.bundle-item__owned-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  background: rgba(102, 126, 234, 0.9);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.8rem;
}

.bundle-detail__info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.bundle-detail__header {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bundle-detail__name {
  font-size: 2.5rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.bundle-detail__rarity-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 20px;
  border: 2px solid;
  width: fit-content;
}

.bundle-detail__description {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin: 0;
}

.bundle-detail__stats {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-item--highlight {
  padding-top: 16px;
  border-top: 1px solid rgba(102, 126, 234, 0.2);
}

.stat-label {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
}

.stat-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
}

.stat-item--highlight .stat-value {
  color: #764ba2;
  font-weight: 700;
}

.bundle-detail__pricing {
  padding: 24px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  border: 2px solid rgba(102, 126, 234, 0.3);
}

.pricing-compare {
  display: flex;
  align-items: center;
  gap: 16px;
}

.pricing-original {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.5);
  text-decoration: line-through;
}

.pricing-current {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
}

.pricing-simple {
  text-align: center;
}

.bundle-detail__actions {
  margin-top: 8px;
}

.btn {
  width: 100%;
  padding: 16px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn--primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.btn--primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.btn--primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn--large {
  padding: 18px 32px;
  font-size: 1.2rem;
}

.btn--secondary {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border: 2px solid rgba(102, 126, 234, 0.3);
  text-decoration: none;
}

.btn--secondary:hover {
  background: rgba(102, 126, 234, 0.2);
  border-color: rgba(102, 126, 234, 0.5);
}

.auth-prompt,
.insufficient-funds {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 32px;
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 12px;
  text-align: center;
}

.auth-prompt svg,
.insufficient-funds svg {
  color: rgba(102, 126, 234, 0.8);
}

.auth-prompt p,
.insufficient-funds p {
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
}

.insufficient-funds {
  background: rgba(118, 75, 162, 0.1);
  border-color: rgba(118, 75, 162, 0.3);
  color: #764ba2;
}

.insufficient-funds svg {
  color: #764ba2;
}

.funds-needed {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6) !important;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  gap: 16px;
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

.loading p {
  color: rgba(255, 255, 255, 0.6);
}

@media (max-width: 1024px) {
  .bundle-detail__hero {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .bundle-detail__items-grid {
    grid-template-columns: 1fr;
  }
}
</style>

