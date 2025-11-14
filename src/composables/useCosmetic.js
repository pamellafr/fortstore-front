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
    // Se o backend retornou true, confia nele
    if (cosmetic?.is_new === true) {
      return true;
    }
    
    // Sempre calcula baseado na data para garantir que funciona
    // Verifica added_date, created_at ou updated_at (últimos 30 dias)
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    
    try {
      // Prioridade 1: added_date
      if (cosmetic?.added_date) {
        const addedDate = new Date(cosmetic.added_date);
        if (addedDate >= thirtyDaysAgo) {
          return true;
        }
      }
      
      // Prioridade 2: created_at (se added_date não existe)
      if (!cosmetic?.added_date && cosmetic?.created_at) {
        const createdDate = new Date(cosmetic.created_at);
        if (createdDate >= thirtyDaysAgo) {
          return true;
        }
      }
      
      // Prioridade 3: updated_at
      if (cosmetic?.updated_at) {
        const updatedDate = new Date(cosmetic.updated_at);
        if (updatedDate >= thirtyDaysAgo) {
          return true;
        }
      }
      
      return false;
    } catch (e) {
      // Se o backend retornou true, confia nele mesmo com erro no cálculo
      return cosmetic?.is_new === true;
    }
  });

  const isOnSale = computed(() => {
    // Sempre calcula baseado no interest para garantir que funciona
    // À venda: interest >= 0.6 e < 0.75 (promoção é >= 0.75)
    if (cosmetic?.interest === null || cosmetic?.interest === undefined) {
      // Se o backend retornou true, confia nele mesmo sem interest
      return cosmetic?.is_on_sale === true;
    }
    
    const interest = parseFloat(cosmetic.interest);
    const isOnSaleItem = interest >= 0.6 && interest < 0.75;
    
    // Se o backend retornou true, confia nele
    if (cosmetic?.is_on_sale === true) {
      return true;
    }
    
    // Caso contrário, usa o cálculo local (mas não deve ser promovido)
    // Se for promovido (>= 0.75), não está à venda
    if (interest >= 0.75) {
      return false;
    }
    
    return isOnSaleItem;
  });
  
  const isPromoted = computed(() => {
    // Sempre calcula baseado no interest para garantir que funciona
    if (cosmetic?.interest === null || cosmetic?.interest === undefined) {
      // Se o backend retornou true, confia nele mesmo sem interest
      return cosmetic?.is_promoted === true;
    }
    
    const interest = parseFloat(cosmetic.interest);
    const isPromotedItem = interest >= 0.75;
    
    // Se o backend retornou true, confia nele
    if (cosmetic?.is_promoted === true) {
      return true;
    }
    
    // Caso contrário, usa o cálculo local
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
    isPromoted,
    isOwned,
    rarityColor,
  };
}

