<template>
  <div class="filters">
    <div class="filters__header">
      <h3 class="filters__title">Filtros</h3>
      <button @click="resetFilters" class="filters__reset">Limpar</button>
    </div>

    <div class="filters__content">
      <div class="filter-group">
        <label class="filter-label">Buscar</label>
        <input
          v-model="localFilters.search"
          type="text"
          class="filter-input"
          placeholder="Nome do cosmético..."
          @input="updateSearch"
        />
      </div>

      <div class="filter-group">
        <label class="filter-label">Tipo</label>
        <div class="custom-select" :class="{ 'is-open': openType }">
          <div class="select-trigger" @click="openType = !openType">
            <span>{{ getTypeLabel(localFilters.type) }}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :class="{ 'rotated': openType }">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
          <div class="select-options" v-show="openType">
            <div
              class="select-option"
              :class="{ 'is-selected': localFilters.type === '' }"
              @click="selectType('')"
            >
              Todos
            </div>
            <div
              class="select-option"
              :class="{ 'is-selected': localFilters.type === 'outfit' }"
              @click="selectType('outfit')"
            >
              Outfit
            </div>
            <div
              class="select-option"
              :class="{ 'is-selected': localFilters.type === 'backpack' }"
              @click="selectType('backpack')"
            >
              Backpack
            </div>
            <div
              class="select-option"
              :class="{ 'is-selected': localFilters.type === 'pickaxe' }"
              @click="selectType('pickaxe')"
            >
              Pickaxe
            </div>
            <div
              class="select-option"
              :class="{ 'is-selected': localFilters.type === 'glider' }"
              @click="selectType('glider')"
            >
              Glider
            </div>
            <div
              class="select-option"
              :class="{ 'is-selected': localFilters.type === 'emote' }"
              @click="selectType('emote')"
            >
              Emote
            </div>
            <div
              class="select-option"
              :class="{ 'is-selected': localFilters.type === 'wrap' }"
              @click="selectType('wrap')"
            >
              Wrap
            </div>
            <div
              class="select-option"
              :class="{ 'is-selected': localFilters.type === 'music' }"
              @click="selectType('music')"
            >
              Music
            </div>
          </div>
        </div>
      </div>

      <div class="filter-group">
        <label class="filter-label">Raridade</label>
        <div class="custom-select" :class="{ 'is-open': openRarity }">
          <div class="select-trigger" @click="openRarity = !openRarity">
            <span>{{ getRarityLabel(localFilters.rarity) }}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :class="{ 'rotated': openRarity }">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
          <div class="select-options" v-show="openRarity">
            <div
              class="select-option"
              :class="{ 'is-selected': localFilters.rarity === '' }"
              @click="selectRarity('')"
            >
              Todas
            </div>
            <div
              class="select-option"
              :class="{ 'is-selected': localFilters.rarity === 'COMMON' }"
              @click="selectRarity('COMMON')"
            >
              Common
            </div>
            <div
              class="select-option"
              :class="{ 'is-selected': localFilters.rarity === 'UNCOMMON' }"
              @click="selectRarity('UNCOMMON')"
            >
              Uncommon
            </div>
            <div
              class="select-option"
              :class="{ 'is-selected': localFilters.rarity === 'RARE' }"
              @click="selectRarity('RARE')"
            >
              Rare
            </div>
            <div
              class="select-option"
              :class="{ 'is-selected': localFilters.rarity === 'EPIC' }"
              @click="selectRarity('EPIC')"
            >
              Epic
            </div>
            <div
              class="select-option"
              :class="{ 'is-selected': localFilters.rarity === 'LEGENDARY' }"
              @click="selectRarity('LEGENDARY')"
            >
              Legendary
            </div>
            <div
              class="select-option"
              :class="{ 'is-selected': localFilters.rarity === 'MYTHIC' }"
              @click="selectRarity('MYTHIC')"
            >
              Mythic
            </div>
          </div>
        </div>
      </div>

      <div class="filter-group">
        <label class="filter-checkbox">
          <input
            v-model="localFilters.onlyNew"
            type="checkbox"
            @change="updateFilters(true)"
          />
          <span>Apenas novos</span>
        </label>
      </div>

      <div class="filter-group">
        <label class="filter-checkbox">
          <input
            v-model="localFilters.onlyOnSale"
            type="checkbox"
            @change="updateFilters(true)"
          />
          <span>Apenas à venda</span>
        </label>
      </div>

      <div class="filter-group">
        <label class="filter-checkbox">
          <input
            v-model="localFilters.onlyPromoted"
            type="checkbox"
            @change="updateFilters(true)"
          />
          <span>Apenas em promoção</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';

export default {
  name: 'CosmeticFilters',
  props: {
    filters: {
      type: Object,
      required: true,
    },
  },
  emits: ['update:filters'],
  setup(props, { emit }) {
    const localFilters = ref({ ...props.filters });
    const openType = ref(false);
    const openRarity = ref(false);
    let searchTimeout = null;

    watch(
      () => props.filters,
      (newFilters) => {
        localFilters.value = { ...newFilters };
      },
      { deep: true }
    );

    const updateFilters = (immediate = false) => {
      if (immediate) {
        emit('update:filters', { ...localFilters.value });
      } else {
        if (searchTimeout) {
          clearTimeout(searchTimeout);
        }
        searchTimeout = setTimeout(() => {
          emit('update:filters', { ...localFilters.value });
        }, 500);
      }
    };

    const updateSearch = () => {
      updateFilters(false);
    };

    const resetFilters = () => {
      localFilters.value = {
        search: '',
        type: '',
        rarity: '',
        onlyNew: false,
        onlyOnSale: false,
        onlyPromoted: false,
      };
      openType.value = false;
      openRarity.value = false;
      updateFilters(true);
    };

    const getTypeLabel = (value) => {
      const labels = {
        '': 'Todos',
        'outfit': 'Outfit',
        'backpack': 'Backpack',
        'pickaxe': 'Pickaxe',
        'glider': 'Glider',
        'emote': 'Emote',
        'wrap': 'Wrap',
        'music': 'Music',
      };
      return labels[value] || 'Todos';
    };

    const getRarityLabel = (value) => {
      const labels = {
        '': 'Todas',
        'COMMON': 'Common',
        'UNCOMMON': 'Uncommon',
        'RARE': 'Rare',
        'EPIC': 'Epic',
        'LEGENDARY': 'Legendary',
        'MYTHIC': 'Mythic',
      };
      return labels[value] || 'Todas';
    };

    const selectType = (value) => {
      localFilters.value.type = value;
      openType.value = false;
      updateFilters(true);
    };

    const selectRarity = (value) => {
      localFilters.value.rarity = value;
      openRarity.value = false;
      updateFilters(true);
    };

    const handleClickOutside = (event) => {
      if (!event.target.closest('.custom-select')) {
        openType.value = false;
        openRarity.value = false;
      }
    };

    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
    });

    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClickOutside);
    });

    return {
      localFilters,
      openType,
      openRarity,
      updateFilters,
      updateSearch,
      resetFilters,
      getTypeLabel,
      getRarityLabel,
      selectType,
      selectRarity,
    };
  },
};
</script>

<style scoped>
.filters {
  background: rgba(35, 35, 43, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  height: fit-content;
  position: sticky;
  top: 80px;
}

.filters__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.filters__title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.filters__reset {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filters__reset:hover {
  border-color: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.filters__content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}

.filter-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 10px 12px;
  color: #fff;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.filter-input:focus {
  outline: none;
  border-color: #667eea;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.filter-input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.custom-select {
  position: relative;
}

.select-trigger {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 10px 12px;
  color: #fff;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
}

.select-trigger:hover {
  border-color: rgba(102, 126, 234, 0.5);
  background: rgba(255, 255, 255, 0.08);
}

.custom-select.is-open .select-trigger {
  border-color: #667eea;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.select-trigger svg {
  transition: transform 0.2s ease;
  opacity: 0.7;
}

.select-trigger svg.rotated {
  transform: rotate(180deg);
}

.select-options {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: rgba(35, 35, 43, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 8px;
  padding: 4px;
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.select-options::-webkit-scrollbar {
  width: 6px;
}

.select-options::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.select-options::-webkit-scrollbar-thumb {
  background: rgba(102, 126, 234, 0.5);
  border-radius: 3px;
}

.select-options::-webkit-scrollbar-thumb:hover {
  background: rgba(102, 126, 234, 0.7);
}

.select-option {
  padding: 10px 12px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.15s ease;
}

.select-option:hover {
  background: rgba(102, 126, 234, 0.2);
  color: #fff;
}

.select-option.is-selected {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%);
  color: #fff;
  font-weight: 500;
}

.filter-checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
}

.filter-checkbox input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #667eea;
}

@media (max-width: 768px) {
  .filters {
    position: relative;
    top: 0;
  }
}
</style>

