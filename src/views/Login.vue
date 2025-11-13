<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="login-card__header">
          <h1 class="login-card__title">Entrar</h1>
          <p class="login-card__subtitle">Acesse sua conta FortStore</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div v-if="errorMessage" class="alert alert--error">
            {{ errorMessage }}
          </div>

          <div class="form-group">
            <label for="email" class="form-label">E-mail</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="form-input"
              placeholder="seu@email.com"
              required
              autocomplete="email"
            />
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Senha</label>
            <div class="form-input-wrapper">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                placeholder="••••••••"
                required
                autocomplete="current-password"
              />
              <button
                type="button"
                class="password-toggle"
                @click="showPassword = !showPassword"
                tabindex="-1"
              >
                <svg v-if="showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
            </div>
          </div>

          <button
            type="submit"
            class="btn btn--primary btn--full"
            :disabled="loading"
          >
            <span v-if="loading">Entrando...</span>
            <span v-else>Entrar</span>
          </button>
        </form>

        <div class="login-card__footer">
          <p>
            Não tem uma conta?
            <router-link to="/register" class="link">Registre-se</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';

export default {
  name: 'Login',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const authStore = useAuthStore();

    const form = ref({
      email: '',
      password: '',
    });

    const loading = ref(false);
    const errorMessage = ref('');
    const showPassword = ref(false);

    const handleLogin = async () => {
      loading.value = true;
      errorMessage.value = '';

      const result = await authStore.login(form.value);

      if (result.success) {
        const redirect = route.query.redirect || '/';
        router.push(redirect);
      } else {
        errorMessage.value = result.message;
      }

      loading.value = false;
    };

    return {
      form,
      loading,
      errorMessage,
      showPassword,
      handleLogin,
    };
  },
};
</script>

<style scoped>
.login-page {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 32px;
}

.login-container {
  width: 100%;
  max-width: 420px;
}

.login-card {
  background: rgba(30, 30, 36, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.login-card__header {
  text-align: center;
  margin-bottom: 32px;
}

.login-card__title {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-card__subtitle {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.95rem;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}

.form-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.form-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px 48px 12px 16px;
  color: #fff;
  font-size: 1rem;
  transition: all 0.2s ease;
  width: 100%;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.password-toggle {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.password-toggle:hover {
  color: rgba(255, 255, 255, 0.8);
}

.password-toggle:focus {
  outline: none;
  color: #667eea;
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.btn--primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.btn--primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.btn--primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn--full {
  width: 100%;
}

.alert {
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
}

.alert--error {
  background: rgba(231, 76, 60, 0.1);
  border: 1px solid rgba(231, 76, 60, 0.3);
  color: #e74c3c;
}

.login-card__footer {
  margin-top: 24px;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
}

.link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.link:hover {
  text-decoration: underline;
}
</style>

