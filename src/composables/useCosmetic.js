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
    if (cosmetic?.is_new !== undefined && cosmetic?.is_new !== null) {
      return Boolean(cosmetic.is_new);
    }
    
    if (!cosmetic?.added_date) {
      return false;
    }
    
    try {
      const now = new Date();
      const addedDate = new Date(cosmetic.added_date);
      
      if (isNaN(addedDate.getTime())) {
        return false;
      }
      
      const diffTime = now - addedDate;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      
      return diffDays >= 0 && diffDays <= 30;
    } catch (e) {
      return false;
    }
  });

  const isOnSale = computed(() => {
    if (cosmetic?.interest === null || cosmetic?.interest === undefined) {
      return cosmetic?.is_on_sale === true;
    }
    
    const interest = parseFloat(cosmetic.interest);
    const isOnSaleItem = interest >= 0.6 && interest < 0.75;
    
    if (cosmetic?.is_on_sale === true) {
      return true;
    }
    
    if (interest >= 0.75) {
      return false;
    }
    
    return isOnSaleItem;
  });
  
  const isPromoted = computed(() => {
    if (cosmetic?.interest === null || cosmetic?.interest === undefined) {
      return cosmetic?.is_promoted === true;
    }
    
    const interest = parseFloat(cosmetic.interest);
    const isPromotedItem = interest >= 0.75;
    
    if (cosmetic?.is_promoted === true) {
      return true;
    }
    
    return isPromotedItem;
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
      LEGENDARY: '#8b9aff',
      MYTHIC: '#764ba2',
    };
    return rarityMap[cosmetic?.rarity_name] || '#B4B4B4';
  });

  return {
    iconImage,
    backgroundImage,
    isNew,
    isOnSale,
    isPromoted,
    isOwned,
    rarityColor,
  };
}

