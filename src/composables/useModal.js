import { ref } from 'vue';

const isOpen = ref(false);
const title = ref('');
const message = ref('');
const confirmText = ref('Confirmar');
const loading = ref(false);
const closeOnOverlay = ref(true);
let resolvePromise = null;
let shouldKeepOpen = false;

export function useModal() {
  const showModal = (options = {}) => {
    return new Promise((resolve) => {
      title.value = options.title || 'Confirmar';
      message.value = options.message || '';
      confirmText.value = options.confirmText || 'Confirmar';
      loading.value = false;
      closeOnOverlay.value = options.closeOnOverlay !== false;
      shouldKeepOpen = options.keepOpenOnConfirm === true;
      resolvePromise = resolve;
      isOpen.value = true;
    });
  };

  const closeModal = (confirmed = false, force = false) => {
    if (shouldKeepOpen && confirmed && !force) {
      if (resolvePromise) {
        resolvePromise(confirmed);
        resolvePromise = null;
      }
      return;
    }
    
    isOpen.value = false;
    if (resolvePromise) {
      resolvePromise(confirmed);
      resolvePromise = null;
    }
    
    setTimeout(() => {
      title.value = '';
      message.value = '';
      confirmText.value = 'Confirmar';
      loading.value = false;
      shouldKeepOpen = false;
    }, 300);
  };

  const setLoading = (value) => {
    loading.value = value;
  };

  return {
    isOpen,
    title,
    message,
    confirmText,
    loading,
    closeOnOverlay,
    showModal,
    closeModal,
    setLoading,
  };
}

