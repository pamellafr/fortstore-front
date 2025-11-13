<template>
  <div id="app">
    <AppHeader />
    <main class="app-main">
      <router-view />
    </main>
    <Toast />
    <Modal
      :isOpen="modal.isOpen.value"
      :title="modal.title.value"
      :message="modal.message.value"
      :confirmText="modal.confirmText.value"
      :loading="modal.loading.value"
      :closeOnOverlay="modal.closeOnOverlay.value"
      @close="handleModalClose"
      @confirm="handleModalConfirm"
    />
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue';
import Toast from './components/Toast.vue';
import Modal from './components/Modal.vue';
import { useModal } from './composables/useModal';

export default {
  name: 'App',
  components: {
    AppHeader,
    Toast,
    Modal,
  },
  setup() {
    const modal = useModal();
    
    const handleModalClose = () => {
      if (!modal.loading.value) {
        modal.closeModal(false);
      }
    };
    
    const handleModalConfirm = () => {
      if (modal.loading.value) {
        return;
      }
      modal.closeModal(true);
    };
    
    return {
      modal,
      handleModalClose,
      handleModalConfirm,
    };
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #18181c;
  min-height: 100vh;
  color: #fff;
}

.app-main {
  min-height: calc(100vh - 64px);
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: #1a1a1f;
}

::-webkit-scrollbar-thumb {
  background: rgba(102, 126, 234, 0.5);
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(102, 126, 234, 0.7);
}
</style>
