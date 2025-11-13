<template>
  <Transition name="modal">
    <div v-if="isOpen" class="modal-overlay" @click.self="handleOverlayClick">
      <div class="modal">
        <div class="modal__header">
          <h2 class="modal__title">{{ title }}</h2>
          <button class="modal__close" @click="handleClose">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal__body">
          <p class="modal__message">{{ message }}</p>
        </div>
        <div class="modal__footer">
          <button class="btn btn--secondary" @click="handleClose">
            Cancelar
          </button>
          <button class="btn btn--primary" @click="handleConfirm" :disabled="loading">
            <span v-if="loading" class="btn__loading">
              <svg class="spinner" width="20" height="20" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" stroke-dasharray="32" stroke-dashoffset="32">
                  <animate attributeName="stroke-dasharray" dur="2s" values="0 32;16 16;0 32;0 32" repeatCount="indefinite"/>
                  <animate attributeName="stroke-dashoffset" dur="2s" values="0;-16;-32;-32" repeatCount="indefinite"/>
                </circle>
              </svg>
            </span>
            <span v-else>{{ confirmText }}</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  name: 'Modal',
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: 'Confirmar',
    },
    message: {
      type: String,
      default: '',
    },
    confirmText: {
      type: String,
      default: 'Confirmar',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    closeOnOverlay: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['close', 'confirm'],
  setup(props, { emit }) {
    const handleClose = () => {
      if (props.loading) return;
      emit('close');
    };

    const handleConfirm = () => {
      emit('confirm');
    };

    const handleOverlayClick = () => {
      if (props.closeOnOverlay && !props.loading) {
        emit('close');
      }
    };

    watch(() => props.isOpen, (newVal) => {
      if (newVal) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    return {
      handleClose,
      handleConfirm,
      handleOverlayClick,
    };
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  max-width: 500px;
  width: 100%;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal__title {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}

.modal__close {
  background: transparent;
  border: none;
  color: #ffffff;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.modal__close:hover {
  background: rgba(255, 255, 255, 0.1);
}

.modal__body {
  padding: 24px;
}

.modal__message {
  font-size: 16px;
  color: #b4b4b4;
  line-height: 1.6;
  margin: 0;
  white-space: pre-line;
}

.modal__footer {
  display: flex;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  justify-content: flex-end;
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 120px;
}

.btn--secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.btn--secondary:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
}

.btn--primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
}

.btn--primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #5568d3 0%, #6a3d8f 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn__loading {
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.modal-enter-active {
  transition: opacity 0.3s ease;
}

.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-leave-active .modal {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from .modal {
  transform: scale(0.9) translateY(-20px);
  opacity: 0;
}

.modal-leave-to .modal {
  transform: scale(0.9) translateY(-20px);
  opacity: 0;
}
</style>

