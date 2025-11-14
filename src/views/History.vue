<template>
  <div class="history-page">
    <div class="history-page__container">
      <div class="history-page__header">
        <h1 class="history-page__title">Histórico de Transações</h1>
        <p class="history-page__subtitle">Todas as suas compras e devoluções</p>
      </div>

      <div v-if="loading" class="loading">
        <div class="loading__spinner"></div>
      </div>

      <div v-else-if="transactions.length > 0" class="transactions-list">
        <div
          v-for="transaction in transactions"
          :key="transaction.id"
          class="transaction-card"
          :class="{
            'transaction-card--purchase': transaction.type === 'purchase',
            'transaction-card--return': transaction.type === 'return',
          }"
        >
          <div class="transaction-card__icon">
            <span v-if="transaction.type === 'purchase'">🛒</span>
            <span v-else>↩️</span>
          </div>
          <div class="transaction-card__content">
            <h3 class="transaction-card__cosmetic">
              {{ transaction.cosmetic_name }}
            </h3>
            <p class="transaction-card__date">
              {{ formatDate(transaction.created_at) }}
            </p>
          </div>
          <div class="transaction-card__amount">
            <span
              v-if="transaction.type === 'purchase'"
              class="amount amount--negative"
            >
              -{{ formatPrice(transaction.amount) }} 💎
            </span>
            <span v-else class="amount amount--positive">
              +{{ formatPrice(transaction.amount) }} 💎
            </span>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <p>Nenhuma transação encontrada.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import api from '../services/api';

export default {
  name: 'History',
  setup() {
    const transactions = ref([]);
    const loading = ref(true);

    const loadTransactions = async () => {
      loading.value = true;
      try {
        const response = await api.get('/api/users/purchase-history');
        const cosmetics = response.data.data || response.data || [];
        
        const transactionList = [];
        cosmetics.forEach(cosmetic => {
          if (cosmetic.purchased_at) {
            transactionList.push({
              id: `purchase-${cosmetic.id}`,
              type: 'purchase',
              cosmetic_name: cosmetic.name,
              amount: cosmetic.purchase_price || cosmetic.price || 0,
              created_at: cosmetic.purchased_at,
            });
          }
        });
        
        transactionList.sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        });
        
        transactions.value = transactionList;
      } catch (error) {
        transactions.value = [];
      } finally {
        loading.value = false;
      }
    };

    const formatDate = (date) => {
      if (!date) return '';
      const d = new Date(date);
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    const formatPrice = (price) => {
      if (!price) return '0';
      return new Intl.NumberFormat('pt-BR').format(price);
    };

    onMounted(() => {
      loadTransactions();
    });

    return {
      transactions,
      loading,
      formatDate,
      formatPrice,
    };
  },
};
</script>

<style scoped>
.history-page {
  min-height: calc(100vh - 64px);
  padding: 32px;
}

.history-page__container {
  max-width: 1000px;
  margin: 0 auto;
}

.history-page__header {
  margin-bottom: 32px;
}

.history-page__title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.history-page__subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px;
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

.transactions-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.transaction-card {
  background: rgba(35, 35, 43, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.2s ease;
}

.transaction-card:hover {
  border-color: rgba(255, 255, 255, 0.1);
  transform: translateX(4px);
}

.transaction-card--purchase {
  border-left: 3px solid #667eea;
}

.transaction-card--return {
  border-left: 3px solid #764ba2;
}

.transaction-card__icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
}

.transaction-card__content {
  flex: 1;
}

.transaction-card__cosmetic {
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 4px 0;
}

.transaction-card__date {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.transaction-card__amount {
  font-size: 1.2rem;
  font-weight: 700;
}

.amount--negative {
  color: #667eea;
}

.amount--positive {
  color: #8b9aff;
}

.empty-state {
  text-align: center;
  padding: 60px;
  color: rgba(255, 255, 255, 0.6);
}

.empty-state p {
  font-size: 1.1rem;
}
</style>

