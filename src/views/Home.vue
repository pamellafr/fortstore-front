<template>
  <div class="home">
    <div class="home__hero">
      <div class="hero__content">
        <div class="hero__text">
          <h1 class="hero__title">
            <span class="hero__title-line">FORTSTORE</span>
            <span class="hero__title-sub">O melhor do Fortnite</span>
          </h1>
          <p class="hero__description">
            Explore milhares de cosméticos exclusivos e personalize seu estilo de jogo
          </p>
          <div class="hero__actions">
            <router-link to="/cosmetics" class="hero__btn hero__btn--primary">
              <span>Explorar Loja</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </router-link>
            <router-link to="/cosmetics?onlyNew=true" class="hero__btn hero__btn--secondary">
              <span>Novidades</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div class="home__sections">
      <section class="home__section">
        <div class="section__header">
          <div>
            <h2 class="section__title">Novos Cosméticos</h2>
            <p class="section__subtitle">Recém adicionados à loja</p>
          </div>
        </div>
        <div v-if="newCosmeticsLoading" class="loading">
          <div class="loading__spinner"></div>
        </div>
        <div v-else-if="newCosmetics.length > 0" class="cosmetics-grid">
          <CosmeticCard
            v-for="cosmetic in newCosmetics.slice(0, 8)"
            :key="cosmetic.id"
            :cosmetic="cosmetic"
          />
        </div>
        <div v-else class="empty-state">
          <p>Nenhum cosmético novo no momento.</p>
        </div>
      </section>

      <section class="home__section">
        <div class="section__header">
          <div>
            <h2 class="section__title">Em Promoção</h2>
            <p class="section__subtitle">Ofertas especiais para você</p>
          </div>
        </div>
        <div v-if="shopCosmeticsLoading" class="loading">
          <div class="loading__spinner"></div>
        </div>
        <div v-else-if="shopCosmetics.length > 0" class="cosmetics-grid">
          <CosmeticCard
            v-for="cosmetic in shopCosmetics.slice(0, 8)"
            :key="cosmetic.id"
            :cosmetic="cosmetic"
          />
        </div>
        <div v-else class="empty-state">
          <p>Nenhum cosmético à venda no momento.</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useCosmeticsStore } from '../stores/cosmetics';
import CosmeticCard from '../components/CosmeticCard.vue';

export default {
  name: 'Home',
  components: {
    CosmeticCard,
  },
  setup() {
    const cosmeticsStore = useCosmeticsStore();
    const newCosmetics = ref([]);
    const shopCosmetics = ref([]);
    const newCosmeticsLoading = ref(false);
    const shopCosmeticsLoading = ref(false);


    const loadNewCosmetics = async () => {
      newCosmeticsLoading.value = true;
      const result = await cosmeticsStore.fetchNewCosmetics();
      if (result.success) {
        newCosmetics.value = result.data || [];
      }
      newCosmeticsLoading.value = false;
    };

    const loadShopCosmetics = async () => {
      shopCosmeticsLoading.value = true;
      const result = await cosmeticsStore.fetchShopCosmetics();
      if (result.success) {
        shopCosmetics.value = result.data || [];
      }
      shopCosmeticsLoading.value = false;
    };

    onMounted(() => {
      loadNewCosmetics();
      loadShopCosmetics();
    });

    return {
      newCosmetics,
      shopCosmetics,
      newCosmeticsLoading,
      shopCosmeticsLoading,
    };
  },
};
</script>

<style scoped>
.home {
  min-height: calc(100vh - 64px);
  background: #0a0a0f;
}

.home__hero {
  position: relative;
  min-height: 50vh;
  background: linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%);
  display: flex;
  align-items: center;
  padding: 80px 32px;
}

.hero__content {
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

.hero__text {
  animation: fadeInUp 0.6s ease;
  text-align: center;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero__title {
  margin: 0 0 16px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hero__title-line {
  font-size: 4.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #8b9aff 0%, #667eea 50%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 4px;
}

.hero__title-sub {
  font-size: 1.5rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 2px;
}

.hero__description {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 32px 0;
  line-height: 1.6;
}

.hero__actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.hero__btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.hero__btn--primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
}

.hero__btn--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.6);
}

.hero__btn--secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.hero__btn--secondary:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}


.home__sections {
  max-width: 1400px;
  margin: 0 auto;
  padding: 80px 32px;
}

.home__section {
  margin-bottom: 80px;
}

.section__header {
  margin-bottom: 32px;
}

.section__title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 4px 0;
  background: linear-gradient(135deg, #8b9aff 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section__subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.cosmetics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 24px;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px;
}

.loading__spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(102, 126, 234, 0.2);
  border-top-color: #8b9aff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-state {
  text-align: center;
  padding: 60px;
  color: rgba(255, 255, 255, 0.6);
}

@media (max-width: 1200px) {
  .hero__title-line {
    font-size: 3.5rem;
  }
}

@media (max-width: 768px) {
  .home__hero {
    min-height: auto;
    padding: 40px 16px;
  }
  
  .hero__title-line {
    font-size: 2.5rem;
  }
  
  .hero__title-sub {
    font-size: 1.2rem;
  }
  
  .hero__description {
    font-size: 1rem;
  }
  
  .cosmetics-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
  }
}
</style>
