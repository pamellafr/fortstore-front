import { computed } from 'vue';
import { useAuthStore } from '../stores/auth';

export function useCosmetic(cosmetic) {
  const authStore = useAuthStore();

  const iconImage = computed(() => {
    if (!cosmetic?.images || !Array.isArray(cosmetic.images) || cosmetic.images.length === 0) {
      return '';
    }
    
    const validImages = cosmetic.images.filter(img => {
      if (!img || !img.url) return false;
      const url = String(img.url).trim();
      return url !== '' && 
             url !== 'null' && 
             url !== 'undefined' && 
             !url.toLowerCase().includes('undefined') &&
             url.length > 10;
    });
    
    if (validImages.length === 0) return '';
    
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
    
    return '';
  });

  const backgroundImage = computed(() => {
    if (!cosmetic?.images || !Array.isArray(cosmetic.images) || cosmetic.images.length === 0) {
      return '';
    }
    
    const validImages = cosmetic.images.filter(img => {
      if (!img || !img.url) return false;
      const url = String(img.url).trim();
      return url !== '' && 
             url !== 'null' && 
             url !== 'undefined' && 
             !url.toLowerCase().includes('undefined') &&
             url.length > 10;
    });
    
    if (validImages.length === 0) return '';
    
    const imageTypes = ['featured', 'background', 'full_background', 'icon_background', 'largeIcon', 'smallIcon', 'icon'];
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
    
    return '';
  });

  const isNew = computed(() => {
    return cosmetic?.is_new || false;
  });

  const isOnSale = computed(() => {
    return cosmetic?.is_on_sale || false;
  });

  const isOwned = computed(() => {
    if (!authStore.isAuthenticated) return false;
    return cosmetic?.is_owned === true;
  });

  const rarityColor = computed(() => {
    const rarityMap = {
      COMMON: '#B4B4B4',
      UNCOMMON: '#73C373',
      RARE: '#5B9BD5',
      EPIC: '#9B59B6',
      LEGENDARY: '#E67E22',
      MYTHIC: '#E74C3C',
    };
    return rarityMap[cosmetic?.rarity_name] || '#B4B4B4';
  });

  return {
    iconImage,
    backgroundImage,
    isNew,
    isOnSale,
    isOwned,
    rarityColor,
  };
}

