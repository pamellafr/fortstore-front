<template>
  <div class="cosmetics-list">
    <h2>Cosméticos Disponíveis</h2>
    <div class="cosmetics-grid">
      <div v-for="cosmetic in cosmetics" :key="cosmetic.id" class="cosmetic-card">
        <img
          v-if="getImage(cosmetic, 'icon')"
          :src="getImage(cosmetic, 'icon')"
          :alt="cosmetic.name"
          class="cosmetic-img"
        />
        <div class="cosmetic-info">
          <h3>{{ cosmetic.name }}</h3>
          <p>{{ cosmetic.description }}</p>
          <span class="rarity">{{ cosmetic.rarity_name }}</span>
          <span class="price">{{ cosmetic.price }} v-bucks</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CosmeticsList',
  data() {
    return {
      cosmetics: [],
    };
  },
  methods: {
    getImage(cosmetic, type) {
      const img = cosmetic.images.find(img => img.type === type);
      return img ? img.url : '';
    },
  },
  mounted() {
    axios.get('http://localhost:8000/api/cosmetics-with-images')
      .then(res => {
        this.cosmetics = res.data;
      });
  },
};
</script>

<style scoped>
.cosmetics-list {
  padding: 32px;
}
.cosmetics-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}
.cosmetic-card {
  background: #23232b;
  color: #fff;
  border-radius: 8px;
  width: 220px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
}
.cosmetic-img {
  width: 120px;
  height: 120px;
  object-fit: contain;
  margin-bottom: 12px;
}
.cosmetic-info {
  text-align: center;
}
.rarity {
  display: block;
  font-size: 0.9rem;
  color: #ffd700;
  margin-top: 4px;
}
.price {
  display: block;
  font-size: 1rem;
  color: #1a73e8;
  margin-top: 4px;
}
</style>
