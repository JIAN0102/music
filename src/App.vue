<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import AppHeader from '@/components/AppHeader.vue';
import SongPlayer from '@/components/SongPlayer.vue';
import AuthModal from '@/components/AuthModal.vue';

const authStore = useAuthStore();
const { initLogin } = authStore;

onMounted(() => {
  initLogin();
});
</script>

<template>
  <AppHeader />

  <router-view v-slot="{ Component }">
    <transition
      name="fade"
      mode="out-in"
    >
      <component :is="Component" />
    </transition>
  </router-view>

  <SongPlayer />

  <AuthModal />
</template>

<style scoped>
.fade-enter-from {
  opacity: 0;
}

.fade-enter-active {
  transition: opacity 0.5s ease;
}

.fade-leave-to {
  opacity: 0;
  transition: opacity 0.5s ease;
}
</style>
