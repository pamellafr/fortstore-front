<template>
  <div class="cosmetic-detail">
    <div v-if="loading" class="loading">
      <div class="loading__spinner"></div>
      <p>Carregando...</p>
    </div>

    <div v-else-if="cosmetic" class="cosmetic-detail__container">
      <button @click="$router.back()" class="cosmetic-detail__back">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Voltar
      </button>

      <div class="cosmetic-detail__hero">
        <div class="cosmetic-detail__image-section">
          <div class="cosmetic-detail__badges">
            <span v-if="isNew" class="badge badge--new">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              NOVO
            </span>
            <span v-if="isOnSale" class="badge badge--sale">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              À VENDA
            </span>
            <span v-if="isOwned" class="badge badge--owned">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              ADQUIRIDO
            </span>
          </div>
          
          <div class="cosmetic-detail__image-wrapper">
            <img
              v-if="cosmetic && displayImage && !imageError"
              :key="`${cosmetic.id}-${displayImage}-${currentImageIndex}`"
              :src="displayImage"
              :alt="cosmetic?.name || 'Cosmético'"
              class="cosmetic-detail__image"
              @error="handleImageError"
              @load="handleImageLoad"
              loading="eager"
            />
            <div 
              v-else-if="cosmetic"
              class="cosmetic-detail__placeholder"
            >
              <div class="placeholder__content">
                <span class="placeholder__letter">{{ cosmetic.name ? cosmetic.name.charAt(0).toUpperCase() : '?' }}</span>
                <div class="placeholder__glow"></div>
              </div>
            </div>
            <div class="cosmetic-detail__image-overlay"></div>
          </div>
        </div>

        <div class="cosmetic-detail__info">
          <div class="cosmetic-detail__header">
            <h1 class="cosmetic-detail__name">{{ cosmetic.name }}</h1>
            <div class="cosmetic-detail__rarity-badge" :style="{ borderColor: rarityColor }">
              <span :style="{ color: rarityColor }">{{ cosmetic.rarity_name }}</span>
            </div>
          </div>
          
          <p
            v-if="cosmetic.description"
            class="cosmetic-detail__description"
          >
            {{ cosmetic.description }}
          </p>

          <div class="cosmetic-detail__meta">
            <div class="meta-item">
              <div class="meta-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
              </div>
              <div class="meta-content">
                <span class="meta-label">Tipo</span>
                <span class="meta-value">{{ cosmetic.type_name || 'N/A' }}</span>
              </div>
            </div>
            
            <div class="meta-item">
              <div class="meta-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div class="meta-content">
                <span class="meta-label">Raridade</span>
                <span class="meta-value" :style="{ color: rarityColor }">
                  {{ cosmetic.rarity_name || 'N/A' }}
                </span>
              </div>
            </div>
            
            <div v-if="cosmetic.set && typeof cosmetic.set === 'object' && cosmetic.set.name" class="meta-item">
              <div class="meta-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div class="meta-content">
                <span class="meta-label">Set</span>
                <span class="meta-value">{{ cosmetic.set.name }}</span>
              </div>
            </div>
            
            <div v-if="cosmetic.added_date" class="meta-item">
              <div class="meta-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div class="meta-content">
                <span class="meta-label">Data de Inclusão</span>
                <span class="meta-value">{{ formatDate(cosmetic.added_date) }}</span>
              </div>
            </div>
          </div>

          <div class="cosmetic-detail__actions">
            <div v-if="!isOwned && cosmetic.price" class="cosmetic-detail__price">
              <span class="price-amount">{{ formatPrice(cosmetic.price) }}</span>
              <span class="price-icon">💎</span>
            </div>
            
            <button
              v-if="!isOwned && authStore.isAuthenticated && cosmetic.price"
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
              <span v-else class="btn__content">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                Adicionar Cosmético
              </span>
            </button>
            
            <button
              v-if="isOwned && authStore.isAuthenticated"
              @click="handleReturn"
              :disabled="returning"
              class="btn btn--secondary btn--large"
            >
              <span v-if="returning" class="btn__loading">
                <svg class="spinner" width="20" height="20" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" stroke-dasharray="32" stroke-dashoffset="32">
                    <animate attributeName="stroke-dasharray" dur="2s" values="0 32;16 16;0 32;0 32" repeatCount="indefinite"/>
                    <animate attributeName="stroke-dashoffset" dur="2s" values="0;-16;-32;-32" repeatCount="indefinite"/>
                  </circle>
                </svg>
                Devolvendo...
              </span>
              <span v-else class="btn__content">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Devolver
              </span>
            </button>
            
            <div v-if="!isOwned && !authStore.isAuthenticated" class="auth-prompt">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <p>Faça login para comprar este cosmético</p>
              <router-link to="/login" class="btn btn--primary">
                Entrar
              </router-link>
            </div>
            
            <div v-if="!isOwned && !canAfford && authStore.isAuthenticated" class="insufficient-funds">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p>Créditos insuficientes</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="error-state">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <p>Cosmético não encontrado</p>
      <router-link to="/cosmetics" class="btn btn--primary">
        Voltar para Cosméticos
      </router-link>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useCosmetic } from '../composables/useCosmetic';
import { useAuthStore } from '../stores/auth';
import { useCosmeticsStore } from '../stores/cosmetics';
import { useToast } from '../composables/useToast';
import { useModal } from '../composables/useModal';
import api from '../services/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default {
  name: 'CosmeticDetail',
  setup() {
    const route = useRoute();
    const authStore = useAuthStore();
    const cosmeticsStore = useCosmeticsStore();
    const toast = useToast();
    const modal = useModal();

    const cosmetic = ref(null);
    const loading = ref(true);
    const purchasing = ref(false);
    const returning = ref(false);
    const imageError = ref(false);

    const cosmeticComposable = computed(() => {
      if (!cosmetic.value) return null;
      return useCosmetic(cosmetic.value);
    });

    const getAllImages = computed(() => {
      try {
        if (!cosmetic.value || !cosmetic.value.images || !Array.isArray(cosmetic.value.images)) {
          return [];
        }
        
        return cosmetic.value.images.filter(img => {
          try {
            if (!img || typeof img !== 'object') return false;
            if (!img.url) return false;
            
            const url = String(img.url).trim();
            if (!url || url.length === 0) return false;
            if (url === 'null' || url === 'undefined') return false;
            if (url.toLowerCase().includes('undefined')) return false;
            if (url.toLowerCase().startsWith('data:image/svg+xml;base64,phn2z')) return false;
            if (url.length < 10) return false;
            
            return true;
          } catch (error) {
            return false;
          }
        });
      } catch (error) {
        return [];
      }
    });
    
    const displayImage = computed(() => {
      try {
        if (!cosmetic.value) {
          return null;
        }
        
        const images = getAllImages.value;
        
        if (!images || images.length === 0) {
          return null;
        }
        
        if (currentImageIndex.value >= images.length) {
          currentImageIndex.value = 0;
        }
        
        const imageTypes = [
          'featured',
          'background', 
          'full_background',
          'icon_background',
          'largeIcon',
          'smallIcon',
          'icon',
          'juno_icon',
          'beans_icon'
        ];
        
        for (const type of imageTypes) {
          const img = images.find(img => img && img.type === type);
          if (img && img.url) {
            const url = String(img.url).trim();
            if (url && url.length > 10 && url !== 'null' && url !== 'undefined' && !url.toLowerCase().includes('undefined')) {
              return url;
            }
          }
        }
        
        if (images.length > 0 && currentImageIndex.value < images.length) {
          const img = images[currentImageIndex.value];
          if (img && img.url) {
            const url = String(img.url).trim();
            if (url && url.length > 10 && url !== 'null' && url !== 'undefined' && !url.toLowerCase().includes('undefined')) {
              return url;
            }
          }
        }
        
        if (images.length > 0) {
          const firstImg = images[0];
          if (firstImg && firstImg.url) {
            const url = String(firstImg.url).trim();
            if (url && url.length > 10 && url !== 'null' && url !== 'undefined' && !url.toLowerCase().includes('undefined')) {
              return url;
            }
          }
        }
        
        return null;
      } catch (error) {
        return null;
      }
    });
    
    const isNew = computed(() => cosmeticComposable.value?.isNew || false);
    const isOnSale = computed(() => cosmeticComposable.value?.isOnSale || false);
    const isOwned = computed(() => {
      if (!authStore.isAuthenticated || !cosmetic.value) return false;
      return Boolean(cosmetic.value.is_owned);
    });
    const rarityColor = computed(() => cosmeticComposable.value?.rarityColor || '#B4B4B4');

    const canAfford = computed(() => {
      if (!authStore.isAuthenticated || !cosmetic.value) return false;
      const userCredits = authStore.user?.credits || authStore.user?.credit?.amount || 0;
      return userCredits >= (cosmetic.value.price || 0);
    });

    const formatPrice = (price) => {
      if (!price) return '0';
      return new Intl.NumberFormat('pt-BR').format(price);
    };

    const formatDate = (date) => {
      if (!date) return '';
      try {
        return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
      } catch {
        return date;
      }
    };

    const currentImageIndex = ref(0);
    
    const handleImageError = (event) => {
      try {
        if (!event) {
          imageError.value = true;
          return;
        }
        
        const target = event.target;
        if (!target || !(target instanceof HTMLImageElement)) {
          imageError.value = true;
          return;
        }
        
        const images = getAllImages.value;
        
        if (!images || images.length === 0) {
          imageError.value = true;
          if (target) {
            target.style.display = 'none';
          }
          return;
        }
        
        const failedUrl = target.src || '';
        let nextIndex = (currentImageIndex.value + 1) % images.length;
        let attempts = 0;
        const maxAttempts = Math.min(images.length, 10);
        
        while (attempts < maxAttempts) {
          const nextImage = images[nextIndex];
          if (nextImage && nextImage.url) {
            const url = String(nextImage.url).trim();
            if (url && url.length > 0 && url !== 'null' && url !== 'undefined' && !url.includes('undefined') && url !== failedUrl) {
              currentImageIndex.value = nextIndex;
              imageError.value = false;
              
              if (target && target instanceof HTMLImageElement) {
                target.src = url;
                target.style.display = '';
              }
              return;
            }
          }
          nextIndex = (nextIndex + 1) % images.length;
          attempts++;
        }
        
        imageError.value = true;
        if (target && target instanceof HTMLImageElement) {
          target.style.display = 'none';
        }
      } catch (error) {
        imageError.value = true;
      }
    };

    const handleImageLoad = () => {
      imageError.value = false;
    };

    const handlePurchase = async () => {
      if (!cosmetic.value || !canAfford.value) return;

      purchasing.value = true;
      try {
        const response = await api.post(`/api/cosmetics/${cosmetic.value.id}/purchase`);
        if (response.data.success) {
          await authStore.fetchUser();
          const result = await cosmeticsStore.fetchCosmeticById(cosmetic.value.id);
          if (result.success) {
            cosmetic.value = result.data;
          }
          toast.showToast('Compra realizada com sucesso!', 'success');
        }
      } catch (error) {
        toast.showToast(error.response?.data?.message || 'Erro ao comprar cosmético', 'error');
      } finally {
        purchasing.value = false;
      }
    };

    const handleReturn = async () => {
      if (!cosmetic.value) return;

      const purchasePrice = cosmetic.value.price || 0;
      const refundAmount = new Intl.NumberFormat('pt-BR').format(purchasePrice);
      
      const confirmed = await modal.showModal({
        title: 'Devolver Cosmético',
        message: `Tem certeza que deseja devolver este cosmético?\n\nVocê receberá ${refundAmount} créditos de volta.`,
        confirmText: 'Devolver',
        closeOnOverlay: false,
        keepOpenOnConfirm: true,
      });

      if (!confirmed) {
        return;
      }

      returning.value = true;
      modal.setLoading(true);
      
      try {
        const response = await api.post(`/api/cosmetics/${cosmetic.value.id}/return`);
        if (response.data.success) {
          await authStore.fetchUser();
          const result = await cosmeticsStore.fetchCosmeticById(cosmetic.value.id);
          if (result.success) {
            cosmetic.value = result.data;
          }
          const actualRefundAmount = response.data.refund_amount || purchasePrice;
          toast.showToast(`Cosmético devolvido com sucesso! Você recebeu ${new Intl.NumberFormat('pt-BR').format(actualRefundAmount)} créditos.`, 'success');
        }
      } catch (error) {
        toast.showToast(error.response?.data?.message || 'Erro ao devolver cosmético', 'error');
      } finally {
        returning.value = false;
        modal.setLoading(false);
        setTimeout(() => {
          modal.closeModal(false, true);
        }, 500);
      }
    };

    watch(() => cosmetic.value, (newCosmetic) => {
      if (newCosmetic) {
        imageError.value = false;
        currentImageIndex.value = 0;
      }
    }, { immediate: true });

    onMounted(async () => {
      try {
        const id = route.params.id;
        if (!id) {
          loading.value = false;
          return;
        }
        
        currentImageIndex.value = 0;
        imageError.value = false;
        
        const result = await cosmeticsStore.fetchCosmeticById(id);
        if (result.success && result.data) {
          cosmetic.value = result.data;
        }
      } catch (error) {
        // Silent error handling
      } finally {
        loading.value = false;
      }
    });

    return {
      cosmetic,
      loading,
      purchasing,
      returning,
      imageError,
      currentImageIndex,
      authStore,
      displayImage,
      getAllImages,
      isNew,
      isOnSale,
      isOwned,
      rarityColor,
      canAfford,
      formatPrice,
      formatDate,
      handleImageError,
      handleImageLoad,
      handlePurchase,
      handleReturn,
    };
  },
};
</script>

<style scoped>
.cosmetic-detail {
  min-height: calc(100vh - 64px);
  padding: 32px;
  background: linear-gradient(180deg, #0a0a0f 0%, #1a1a1f 100%);
}

.cosmetic-detail__container {
  max-width: 1400px;
  margin: 0 auto;
  animation: fadeIn 0.4s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.cosmetic-detail__back {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 24px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
}

.cosmetic-detail__back:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: #fff;
  transform: translateX(-4px);
}

.cosmetic-detail__hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  background: rgba(35, 35, 43, 0.4);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 40px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.cosmetic-detail__image-section {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  aspect-ratio: 1;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}

.cosmetic-detail__image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.cosmetic-detail__image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 40px;
  animation: imageFadeIn 0.6s ease;
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.5));
}

@keyframes imageFadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.cosmetic-detail__image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.3) 100%);
  pointer-events: none;
}

.cosmetic-detail__placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder__content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder__letter {
  font-size: 8rem;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.2);
  text-shadow: 0 0 40px rgba(102, 126, 234, 0.3);
  position: relative;
  z-index: 1;
}

.placeholder__glow {
  position: absolute;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.2) 0%, transparent 70%);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
}

.cosmetic-detail__badges {
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 10;
}

.badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  animation: badgeSlideIn 0.5s ease;
}

@keyframes badgeSlideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.badge--new {
  background: rgba(46, 204, 113, 0.95);
  color: #fff;
}

.badge--sale {
  background: rgba(231, 76, 60, 0.95);
  color: #fff;
}

.badge--owned {
  background: rgba(52, 152, 219, 0.95);
  color: #fff;
}

.cosmetic-detail__info {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.cosmetic-detail__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}

.cosmetic-detail__name {
  font-size: 3rem;
  font-weight: 800;
  color: #fff;
  margin: 0;
  line-height: 1.2;
  background: linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.8) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  flex: 1;
  min-width: 200px;
}

.cosmetic-detail__rarity-badge {
  padding: 8px 20px;
  border-radius: 20px;
  border: 2px solid;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  font-weight: 700;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.cosmetic-detail__description {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.8;
  margin: 0;
}

.cosmetic-detail__meta {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.meta-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(102, 126, 234, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
  flex-shrink: 0;
}

.meta-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.meta-label {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.meta-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
}

.cosmetic-detail__actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: auto;
}

.cosmetic-detail__price {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 2.5rem;
  font-weight: 800;
  color: #667eea;
  margin-bottom: 8px;
}

.price-icon {
  font-size: 2.5rem;
  filter: drop-shadow(0 2px 8px rgba(102, 126, 234, 0.4));
}

.btn {
  padding: 16px 32px;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.btn__content,
.btn__loading {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn--primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
}

.btn--primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.6);
}

.btn--primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn--primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn--secondary {
  background: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
  border: 2px solid rgba(231, 76, 60, 0.3);
}

.btn--secondary:hover:not(:disabled) {
  background: rgba(231, 76, 60, 0.2);
  border-color: rgba(231, 76, 60, 0.5);
}

.btn--large {
  padding: 18px 40px;
  font-size: 1.2rem;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.auth-prompt,
.insufficient-funds {
  padding: 24px;
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: 12px;
  text-align: center;
  color: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.auth-prompt svg,
.insufficient-funds svg {
  color: rgba(255, 193, 7, 0.8);
}

.insufficient-funds {
  background: rgba(231, 76, 60, 0.1);
  border-color: rgba(231, 76, 60, 0.3);
  color: #e74c3c;
}

.insufficient-funds svg {
  color: #e74c3c;
}

.loading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  gap: 20px;
  color: rgba(255, 255, 255, 0.6);
}

.loading__spinner {
  width: 60px;
  height: 60px;
  border: 5px solid rgba(102, 126, 234, 0.2);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.error-state {
  text-align: center;
  padding: 60px;
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.error-state svg {
  color: rgba(255, 255, 255, 0.3);
}

@media (max-width: 1024px) {
  .cosmetic-detail__hero {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  
  .cosmetic-detail__name {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .cosmetic-detail {
    padding: 16px;
  }
  
  .cosmetic-detail__hero {
    padding: 24px;
  }
  
  .cosmetic-detail__name {
    font-size: 1.75rem;
  }
  
  .cosmetic-detail__price {
    font-size: 2rem;
  }
}
</style>
