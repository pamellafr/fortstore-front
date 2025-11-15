<template>
  <div class="bundle-card" :class="{ 'bundle-card--owned': bundle.is_owned }">
    <div class="bundle-card__badges">
      <span v-if="bundle.savings > 0" class="bundle-card__badge bundle-card__badge--discount">
        {{ formatSavings(bundle.savings) }} DE DESCONTO
      </span>
      <span v-if="bundle.is_owned" class="bundle-card__badge bundle-card__badge--owned">
        ADQUIRIDO
      </span>
    </div>

    <div class="bundle-card__header" @click="goToDetail">
      <div class="bundle-card__preview">
        <img
          v-if="bundleImage"
          :src="bundleImage"
          :alt="bundle.name || 'Bundle'"
          class="bundle-card__preview-image"
          @error="handleBundleImageError"
          @load="handleBundleImageLoad"
        />
        <div 
          v-show="!bundleImage || bundleImageError" 
          class="bundle-card__preview-empty"
        >
          <p>{{ bundle.name ? bundle.name.charAt(0).toUpperCase() : '?' }}</p>
        </div>
      </div>
      
      <div class="bundle-card__info">
        <h3 class="bundle-card__name">{{ bundle.name }}</h3>
        <p v-if="bundle.description" class="bundle-card__description">
          {{ truncateDescription(bundle.description) }}
        </p>
        <div class="bundle-card__meta">
          <span class="bundle-card__item-count">
            {{ bundle.total_items || bundle.bundleItems?.length || 0 }} itens
          </span>
          <span class="bundle-card__rarity" :style="{ color: rarityColor }">
            {{ bundle.rarity_name }}
          </span>
        </div>
      </div>
    </div>

    <div class="bundle-card__pricing">
      <div v-if="bundle.total_individual_price && bundle.total_individual_price > bundle.price" class="bundle-card__prices">
        <span class="bundle-card__original-price">
          {{ formatPrice(bundle.total_individual_price) }}
        </span>
        <span class="bundle-card__price">
          {{ formatPrice(bundle.price) }} <span class="bundle-card__v-bucks">💎</span>
        </span>
      </div>
      <div v-else class="bundle-card__price">
        {{ formatPrice(bundle.price) }} <span class="bundle-card__v-bucks">💎</span>
      </div>
    </div>

    <div v-if="!bundle.is_owned" class="bundle-card__actions">
      <button 
        @click.stop="handlePurchase"
        :disabled="purchasing || !canPurchase"
        class="bundle-card__btn bundle-card__btn--purchase"
      >
        <span v-if="purchasing">Processando...</span>
        <span v-else>Comprar Bundle</span>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useBundlesStore } from '../stores/bundles';
import { useAuthStore } from '../stores/auth';
import { useToast } from '../composables/useToast';
import { useModal } from '../composables/useModal';
import api from '../services/api';

export default {
  name: 'BundleCard',
  props: {
    bundle: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();
    const bundlesStore = useBundlesStore();
    const authStore = useAuthStore();
    const toast = useToast();
    const modal = useModal();
    const purchasing = ref(false);
    const bundleImageError = ref(false);

    const getPrincipalItemName = (bundleName) => {
      if (!bundleName) return null;
      const bundleNameLower = bundleName.toLowerCase().trim();
      
      if (bundleNameLower.endsWith(' bundle')) {
        return bundleNameLower.replace(' bundle', '').trim();
      }
      
      return null;
    };

    const findPrincipalItem = (bundleItems, principalName) => {
      if (!principalName || !bundleItems || !Array.isArray(bundleItems)) return null;
      
      const principalNameLower = principalName.toLowerCase();
      
      for (const item of bundleItems) {
        if (!item || !item.name) continue;
        const itemNameLower = item.name.toLowerCase();
        
        if (itemNameLower === principalNameLower || 
            itemNameLower.includes(principalNameLower) ||
            principalNameLower.includes(itemNameLower)) {
          return item;
        }
      }
      
      return null;
    };

    const getItemImageUrl = (item) => {
      if (!item || !item.images || !Array.isArray(item.images) || item.images.length === 0) {
        return null;
      }
      
      const validImages = item.images.filter(img => {
        if (!img || !img.url) return false;
        const url = String(img.url).trim();
        return url !== '' && 
               url !== 'null' && 
               url !== 'undefined' && 
               !url.toLowerCase().includes('undefined') &&
               url.length > 10;
      });
      
      if (validImages.length === 0) return null;
      
      const iconImage = validImages.find(img => img.type === 'icon');
      if (iconImage && iconImage.url) {
        const url = String(iconImage.url).trim();
        if (url && url !== 'null' && url !== 'undefined') {
          return url;
        }
      }
      
      const featuredImage = validImages.find(img => img.type === 'featured');
      if (featuredImage && featuredImage.url) {
        const url = String(featuredImage.url).trim();
        if (url && url !== 'null' && url !== 'undefined') {
          return url;
        }
      }
      
      const firstImg = validImages[0];
      if (firstImg?.url) {
        const url = String(firstImg.url).trim();
        if (url && url !== 'null' && url !== 'undefined') {
          return url;
        }
      }
      
      return null;
    };

    const bundleImage = computed(() => {
      if (props.bundle?.images && Array.isArray(props.bundle.images) && props.bundle.images.length > 0) {
        const validImages = props.bundle.images.filter(img => {
          if (!img || !img.url) return false;
          const url = String(img.url).trim();
          return url !== '' && 
                 url !== 'null' && 
                 url !== 'undefined' && 
                 !url.toLowerCase().includes('undefined') &&
                 url.length > 10;
        });
        
        if (validImages.length > 0) {
      const imageTypes = ['icon', 'featured', 'icon_background', 'juno_icon', 'beans_icon', 'smallIcon', 'largeIcon', 'background', 'full_background'];
      for (const type of imageTypes) {
        const img = validImages.find((img) => img.type === type);
        if (img?.url) {
          const url = String(img.url).trim();
          if (url && url !== 'null' && url !== 'undefined') {
            return url;
          }
        }
      }
      
      const firstImg = validImages[0];
      if (firstImg?.url) {
        const url = String(firstImg.url).trim();
        if (url && url !== 'null' && url !== 'undefined') {
          return url;
            }
          }
        }
      }
      
      if (props.bundle?.bundleItems && Array.isArray(props.bundle.bundleItems) && props.bundle.bundleItems.length > 0) {
        const principalName = getPrincipalItemName(props.bundle.name);
        let targetItem = null;
        
        if (principalName) {
          targetItem = findPrincipalItem(props.bundle.bundleItems, principalName);
        }
        
        if (!targetItem) {
          targetItem = props.bundle.bundleItems[0];
        }
        
        if (targetItem) {
          const imageUrl = getItemImageUrl(targetItem);
          if (imageUrl) {
            return imageUrl;
          }
        }
      }
      
      return '';
    });

    const previewItems = computed(() => {
      if (!props.bundle.bundleItems || !Array.isArray(props.bundle.bundleItems)) {
        return [];
      }
      return props.bundle.bundleItems
        .filter(item => {
          if (!item.images || !Array.isArray(item.images)) return false;
          return item.images.length > 0 && item.images.some(img => img.url);
        })
        .slice(0, 4);
    });

    const canPurchase = computed(() => {
      if (!authStore.user || !authStore.user.credit) return false;
      const userCredits = authStore.user.credit.amount || 0;
      return userCredits >= (props.bundle.price || 0);
    });

    const rarityColor = computed(() => {
      const rarity = props.bundle.rarity_name?.toUpperCase();
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

    const getItemImage = (item) => {
      if (!item || !item.images || !Array.isArray(item.images) || item.images.length === 0) {
        return null;
      }
      
      const validImages = item.images.filter(img => img && img.url && img.url.trim() !== '');
      if (validImages.length === 0) return null;
      
      const iconImage = validImages.find(img => img.type === 'icon');
      if (iconImage && iconImage.url) return iconImage.url;
      
      const featuredImage = validImages.find(img => img.type === 'featured');
      if (featuredImage && featuredImage.url) return featuredImage.url;
      
      return validImages[0]?.url || null;
    };

    const formatPrice = (price) => {
      if (!price) return '0';
      return new Intl.NumberFormat('pt-BR').format(price);
    };

    const formatSavings = (savings) => {
      if (!savings || savings <= 0) return '';
      return new Intl.NumberFormat('pt-BR').format(savings);
    };

    const truncateDescription = (text) => {
      if (!text) return '';
      return text.length > 100 ? text.substring(0, 100) + '...' : text;
    };

    const goToDetail = () => {
      const bundleId = props.bundle?.id;
      if (!bundleId) return;
      router.push({ name: 'BundleDetail', params: { id: String(bundleId) } });
    };

    const handleImageError = (event) => {
      event.target.style.display = 'none';
    };

    const handleBundleImageError = (event) => {
      bundleImageError.value = true;
      if (event.target) {
        event.target.style.display = 'none';
      }
    };

    const handleBundleImageLoad = () => {
      bundleImageError.value = false;
    };

    const handlePurchase = async () => {
      if (!authStore.isAuthenticated) {
        router.push({ name: 'Login', query: { redirect: `/bundle/${props.bundle.id}` } });
        return;
      }

      if (!canPurchase.value) {
        toast.showToast('Créditos insuficientes!', 'error');
        return;
      }

      const confirmed = await modal.showModal({
        title: 'Comprar Bundle',
        message: `Deseja comprar o bundle "${props.bundle.name}" por ${formatPrice(props.bundle.price)} 💎?\n\nTodos os ${props.bundle.total_items || props.bundle.bundleItems?.length || 0} itens serão adicionados à sua biblioteca.`,
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
        const result = await bundlesStore.purchaseBundle(props.bundle.id);
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

    return {
      purchasing,
      canPurchase,
      rarityColor,
      bundleImage,
      previewItems,
      getItemImage,
      formatPrice,
      formatSavings,
      truncateDescription,
      goToDetail,
      handlePurchase,
      handleImageError,
      handleBundleImageError,
      handleBundleImageLoad,
      bundleImageError,
    };
  },
};
</script>

<style scoped>
.bundle-card {
  background: rgba(30, 30, 40, 0.8);
  border-radius: 16px;
  overflow: hidden;
  border: 2px solid rgba(102, 126, 234, 0.2);
  transition: all 0.3s ease;
  position: relative;
}

.bundle-card:hover {
  border-color: rgba(102, 126, 234, 0.5);
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.3);
}

.bundle-card--owned {
  border-color: rgba(102, 126, 234, 0.5);
}

.bundle-card--owned::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #667eea 0%, #8b9aff 100%);
  z-index: 1;
}

.bundle-card__badges {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 2;
}

.bundle-card__badge {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.bundle-card__badge--discount {
  background: rgba(118, 75, 162, 0.95);
  color: #fff;
}

.bundle-card__badge--owned {
  background: rgba(102, 126, 234, 0.95);
  color: #fff;
}

.bundle-card__header {
  padding: 24px;
  cursor: pointer;
}

.bundle-card__preview {
  margin-bottom: 16px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 16 / 9;
  position: relative;
}

.bundle-card__image-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
}

.bundle-card__preview-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 16px;
  display: block;
}

.bundle-card__preview-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 250px;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.9rem;
}

.bundle-card__info {
  margin-bottom: 16px;
}

.bundle-card__name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px 0;
}

.bundle-card__description {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 12px 0;
  line-height: 1.5;
}

.bundle-card__meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.bundle-card__item-count {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

.bundle-card__rarity {
  font-size: 0.85rem;
  font-weight: 600;
}

.bundle-card__pricing {
  padding: 0 24px 16px;
}

.bundle-card__prices {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bundle-card__original-price {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.5);
  text-decoration: line-through;
}

.bundle-card__price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
}

.bundle-card__v-bucks {
  font-size: 1.2rem;
}

.bundle-card__actions {
  padding: 0 24px 24px;
}

.bundle-card__btn {
  width: 100%;
  padding: 14px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.bundle-card__btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.bundle-card__btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>

