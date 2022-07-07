<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import LoginForm from '@/components/LoginForm.vue';
import RegisterForm from '@/components/RegisterForm.vue';

const authStore = useAuthStore();
const { authModalShow } = storeToRefs(authStore);
const { toggleAuthModal } = authStore;

const authType = ref('login');
</script>

<template>
  <div
    id="modal"
    class="fixed z-10 inset-0 overflow-y-auto"
    :class="{ hidden: !authModalShow }"
  >
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center
      sm:block sm:p-0"
    >
      <div
        class="fixed inset-0 transition-opacity"
        @click.prevent="toggleAuthModal"
      >
        <div class="absolute inset-0 bg-gray-800 opacity-75" />
      </div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden
        shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <div class="py-4 text-left px-6">
          <div class="flex justify-between items-center pb-4">
            <p class="text-2xl font-bold">
              Your Account
            </p>
            <div
              class="modal-close cursor-pointer z-50"
              @click.prevent="toggleAuthModal"
            >
              <i class="fas fa-times" />
            </div>
          </div>

          <ul class="flex flex-wrap mb-4">
            <li class="flex-auto text-center">
              <a
                class="block rounded py-3 px-4 transition"
                :class="{
                  'hover:text-white text-white bg-blue-600': authType === 'login',
                  'hover:text-blue-600': authType !== 'login'
                }"
                href="#"
                @click.prevent="authType = 'login'"
              >Login</a>
            </li>
            <li class="flex-auto text-center">
              <a
                class="block rounded py-3 px-4 transition"
                :class="{
                  'hover:text-white text-white bg-blue-600': authType === 'register',
                  'hover:text-blue-600': authType !== 'register'
                }"
                href="#"
                @click.prevent="authType = 'register'"
              >Register</a>
            </li>
          </ul>

          <LoginForm v-if="authType === 'login'" />

          <RegisterForm v-else />
        </div>
      </div>
    </div>
  </div>
</template>
