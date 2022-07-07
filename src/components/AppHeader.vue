<script setup>
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';

const route = useRoute();
const router = useRouter();

const authStore = useAuthStore();
const { isLoggedIn } = storeToRefs(authStore);
const { toggleAuthModal, logout } = authStore;

const logoutUser = async () => {
  await logout();

  if (route.meta.requiresAuth) {
    router.push({
      name: 'home',
    });
  }
};
</script>

<template>
  <header
    id="header"
    class="bg-gray-700"
  >
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <router-link
        class="text-white font-bold uppercase text-2xl mr-4"
        :to="{ name: 'home' }"
        exact-active-class="no-active"
      >
        Music
      </router-link>

      <div class="flex flex-grow items-center">
        <ul class="flex flex-row mt-1">
          <li v-if="!isLoggedIn">
            <a
              class="px-2 text-white"
              href="#"
              @click.prevent="toggleAuthModal"
            >
              Login / Register
            </a>
          </li>
          <template v-else>
            <li>
              <router-link
                class="px-2 text-white"
                :to="{ name: 'manage' }"
              >
                Manage
              </router-link>
            </li>
            <li>
              <a
                class="px-2 text-white"
                href="#"
                @click.prevent="logoutUser"
              >Logout</a>
            </li>
          </template>
        </ul>
      </div>
    </nav>
  </header>
</template>
