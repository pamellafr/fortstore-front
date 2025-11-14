<template>
  <div 
    class="cosmetic-card" 
    @click="goToDetail"
    :class="{ 
      'cosmetic-card--owned': isOwned,
      'cosmetic-card--new': isNew
    }"
  >
    <div class="cosmetic-card__badges">
      <span v-if="isNew" class="cosmetic-card__badge cosmetic-card__badge--new">NOVO</span>
      <span v-if="isPromoted" class="cosmetic-card__badge cosmetic-card__badge--promoted">EM PROMOÇÃO</span>
      <span v-else-if="isOnSale" class="cosmetic-card__badge cosmetic-card__badge--sale">À VENDA</span>
      <span v-if="isOwned" class="cosmetic-card__badge cosmetic-card__badge--owned">ADQUIRIDO</span>
    </div>
    
    <div class="cosmetic-card__image-wrapper">
      <img
        v-if="iconImage"
        :src="iconImage"
        :alt="cosmetic.name"
        class="cosmetic-card__image"
        @error="handleImageError"
        @load="handleImageLoad"
      />
      <div 
        v-show="!iconImage || imageError" 
        class="cosmetic-card__placeholder"
      >
        <span>{{ cosmetic.name ? cosmetic.name.charAt(0).toUpperCase() : '?' }}</span>
      </div>
      <div class="cosmetic-card__overlay">
        <div class="cosmetic-card__overlay-content">
          <span class="cosmetic-card__type">{{ cosmetic.type_name }}</span>
        </div>
      </div>
    </div>
    
    <div class="cosmetic-card__content">
      <h3 class="cosmetic-card__name">{{ cosmetic.name }}</h3>
      <p v-if="cosmetic.description" class="cosmetic-card__description">
        {{ truncateDescription(cosmetic.description) }}
      </p>
      <div class="cosmetic-card__footer">
        <span 
          class="cosmetic-card__rarity"
          :style="{ color: rarityColor }"
        >
          {{ cosmetic.rarity_name }}
        </span>
        <span v-if="!isOwned" class="cosmetic-card__price">
          {{ formatPrice(cosmetic.price) }} <span class="cosmetic-card__v-bucks">💎</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useCosmetic } from '../composables/useCosmetic';
import { useRouter } from 'vue-router';

export default {
  name: 'CosmeticCard',
  props: {
    cosmetic: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();
    const { iconImage, isNew, isOnSale, isPromoted, isOwned, rarityColor } = useCosmetic(props.cosmetic);
    const imageError = ref(false);

    const goToDetail = () => {
      const cosmeticId = props.cosmetic?.id;
      if (!cosmeticId) return;
      router.push({ name: 'CosmeticDetail', params: { id: String(cosmeticId) } });
    };

    const truncateDescription = (text) => {
      if (!text) return '';
      return text.length > 80 ? text.substring(0, 80) + '...' : text;
    };

    const formatPrice = (price) => {
      if (!price) return '0';
      return new Intl.NumberFormat('pt-BR').format(price);
    };

    const handleImageError = (event) => {
      imageError.value = true;
      if (event.target) {
        event.target.style.display = 'none';
      }
    };

    const handleImageLoad = () => {
      imageError.value = false;
    };

    return {
      iconImage,
      isNew,
      isOnSale,
      isPromoted,
      isOwned,
      rarityColor,
      imageError,
      goToDetail,
      truncateDescription,
      formatPrice,
      handleImageError,
      handleImageLoad,
    };
  },
};
</script>

<style scoped>
.cosmetic-card {
  background: linear-gradient(180deg, #23232b 0%, #1e1e24 100%);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.cosmetic-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
  border-color: rgba(102, 126, 234, 0.3);
}

.cosmetic-card--owned {
  border-color: rgba(46, 204, 113, 0.3);
}

.cosmetic-card--owned::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #2ecc71 0%, #27ae60 100%);
  z-index: 1;
}

.cosmetic-card--new {
  border-color: rgba(46, 204, 113, 0.3);
}

.cosmetic-card--new::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #2ecc71 0%, #27ae60 100%);
  z-index: 1;
}

.cosmetic-card--owned.cosmetic-card--new::before {
  background: linear-gradient(90deg, #3498db 0%, #2980b9 100%);
  border-color: rgba(52, 152, 219, 0.3);
}

.cosmetic-card__badges {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 2;
}

.cosmetic-card__badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  backdrop-filter: blur(10px);
}

.cosmetic-card__badge--new {
  background: rgba(46, 204, 113, 0.9);
  color: #fff;
  box-shadow: 0 2px 8px rgba(46, 204, 113, 0.3);
}

.cosmetic-card__badge--sale {
  background: rgba(231, 76, 60, 0.9);
  color: #fff;
  box-shadow: 0 2px 8px rgba(231, 76, 60, 0.3);
}

.cosmetic-card__badge--promoted {
  background: rgba(241, 196, 15, 0.9);
  color: #1a1a1a;
  box-shadow: 0 2px 8px rgba(241, 196, 15, 0.3);
  font-weight: 800;
}

.cosmetic-card__badge--owned {
  background: rgba(52, 152, 219, 0.9);
  color: #fff;
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
}

.cosmetic-card__image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 100%;
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  overflow: hidden;
}

.cosmetic-card__image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 20px;
  transition: transform 0.3s ease;
  z-index: 1;
  pointer-events: none;
}

.cosmetic-card:hover .cosmetic-card__image {
  transform: scale(1.1);
}

.cosmetic-card__placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.cosmetic-card__overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
  padding: 16px;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 2;
}

.cosmetic-card:hover .cosmetic-card__overlay {
  opacity: 1;
}

.cosmetic-card__overlay-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cosmetic-card__type {
  font-size: 0.75rem;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

.cosmetic-card__content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 8px;
}

.cosmetic-card__name {
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.cosmetic-card__description {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.cosmetic-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.cosmetic-card__rarity {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.cosmetic-card__price {
  font-size: 0.9rem;
  font-weight: 700;
  color: #667eea;
  display: flex;
  align-items: center;
  gap: 4px;
}

.cosmetic-card__v-bucks {
  font-size: 1rem;
}
</style>

