<template>
  <TransitionGroup name="toast" tag="div" class="toast-container">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :class="['toast', `toast--${toast.type}`]"
    >
      <div class="toast__icon">
        <svg v-if="toast.type === 'success'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <svg v-else-if="toast.type === 'error'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      </div>
      <div class="toast__content">
        <p class="toast__message">{{ toast.message }}</p>
      </div>
      <button class="toast__close" @click="removeToast(toast.id)">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  </TransitionGroup>
</template>

<script>
import { ref } from 'vue';

const toasts = ref([]);
let toastId = 0;

export function useToast() {
  const showToast = (message, type = 'info', duration = 4000) => {
    const id = ++toastId;
    const toast = {
      id,
      message,
      type,
    };
    
    toasts.value.push(toast);
    
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    
    return id;
  };
  
  const removeToast = (id) => {
    const index = toasts.value.findIndex(t => t.id === id);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  };
  
  return {
    showToast,
    removeToast,
  };
}

export default {
  name: 'Toast',
  setup() {
    const removeToast = (id) => {
      const index = toasts.value.findIndex(t => t.id === id);
      if (index > -1) {
        toasts.value.splice(index, 1);
      }
    };
    
    return {
      toasts,
      removeToast,
    };
  },
};
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 80px;
  right: 24px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 320px;
  max-width: 420px;
  padding: 16px 20px;
  background: rgba(35, 35, 43, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  pointer-events: all;
  animation: slideIn 0.3s ease-out;
}

.toast--success {
  border-left: 4px solid #10b981;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(35, 35, 43, 0.95) 100%);
}

.toast--error {
  border-left: 4px solid #ef4444;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(35, 35, 43, 0.95) 100%);
}

.toast--info {
  border-left: 4px solid #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(35, 35, 43, 0.95) 100%);
}

.toast__icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
}

.toast--success .toast__icon {
  color: #10b981;
  background: rgba(16, 185, 129, 0.15);
}

.toast--error .toast__icon {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.15);
}

.toast--info .toast__icon {
  color: #667eea;
  background: rgba(102, 126, 234, 0.15);
}

.toast__content {
  flex: 1;
}

.toast__message {
  margin: 0;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 500;
  line-height: 1.5;
}

.toast__close {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
  padding: 0;
}

.toast__close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.toast-enter-active {
  animation: slideIn 0.3s ease-out;
}

.toast-leave-active {
  animation: slideOut 0.3s ease-in;
}

.toast-enter-from,
.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

@media (max-width: 768px) {
  .toast-container {
    right: 16px;
    left: 16px;
    top: 70px;
  }
  
  .toast {
    min-width: auto;
    max-width: 100%;
  }
}
</style>

