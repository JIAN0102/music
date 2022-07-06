<script setup>
import { ref, reactive } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const { authModalShow } = storeToRefs(authStore);
const { toggleAuthModal } = authStore;

const authType = ref('login');
const schema = reactive({
  name: 'required|min:3|max:100|alpha_spaces',
  email: 'required|min:3|max:100|email',
  age: '',
  password: '',
  confirmPassword: '',
  country: '',
  tos: '',
});
</script>

<template>
  <!-- Auth Modal -->
  <div
    id="modal"
    class="fixed z-10 inset-0 overflow-y-auto"
    :class="{ hidden: !authModalShow }"
  >
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center
      sm:block sm:p-0"
    >
      <div class="fixed inset-0 transition-opacity">
        <div class="absolute inset-0 bg-gray-800 opacity-75" />
      </div>

      <!-- This element is to trick the browser into centering the modal contents. -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden
        shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <!-- Add margin if you want to see some of the overlay behind the modal-->
        <div class="py-4 text-left px-6">
          <!--Title-->
          <div class="flex justify-between items-center pb-4">
            <p class="text-2xl font-bold">
              Your Account
            </p>
            <!-- Modal Close Button -->
            <div
              class="modal-close cursor-pointer z-50"
              @click.prevent="toggleAuthModal"
            >
              <i class="fas fa-times" />
            </div>
          </div>

          <!-- Tabs -->
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

          <!-- Login Form -->
          <VForm v-if="authType === 'login'">
            <!-- Email -->
            <div class="mb-3">
              <label
                class="inline-block mb-2"
                for="loginEmail"
              >Email</label>
              <VField
                id="loginEmail"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                type="email"
                placeholder="Enter Email"
                name="email"
              />
            </div>
            <!-- Password -->
            <div class="mb-3">
              <label
                class="inline-block mb-2"
                for="loginPassword"
              >Password</label>
              <VField
                id="loginPassword"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition first-line:duration-500 focus:outline-none focus:border-black rounded"
                type="password"
                placeholder="Password"
                name="password"
              />
            </div>
            <button
              type="submit"
              class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition
                hover:bg-purple-700"
            >
              Submit
            </button>
          </VForm>

          <!-- Registration Form -->
          <VForm
            :validation-schema="schema"
          >
            <!-- Name -->
            <div class="mb-3">
              <label
                class="inline-block mb-2"
                for="registerName"
              >Name</label>
              <VField
                id="registerName"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                type="text"
                placeholder="Enter Name"
                name="name"
              />
              <ErrorMessage
                class="text-red-600"
                name="name"
              />
            </div>
            <!-- Email -->
            <div class="mb-3">
              <label
                class="inline-block mb-2"
                for="registerEmail"
              >Email</label>
              <VField
                id="registerEmail"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                type="email"
                placeholder="Enter Email"
                name="email"
              />
              <ErrorMessage
                class="text-red-600"
                name="email"
              />
            </div>
            <!-- Age -->
            <div class="mb-3">
              <label
                class="inline-block mb-2"
                for="registerAge"
              >Age</label>
              <VField
                id="registerAge"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                type="number"
                name="age"
              />
            </div>
            <!-- Password -->
            <div class="mb-3">
              <label
                class="inline-block mb-2"
                for="registerPassword"
              >Password</label>
              <VField
                id="registerPassword"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                type="password"
                placeholder="Password"
                name="password"
              />
            </div>
            <!-- Confirm Password -->
            <div class="mb-3">
              <label
                class="inline-block mb-2"
                for="registerConfirmPassword"
              >Confirm Password</label>
              <VField
                id="registerConfirmPassword"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
              />
            </div>
            <!-- Country -->
            <div class="mb-3">
              <label
                id="registerCountry"
                class="inline-block mb-2"
              >Country</label>
              <VField
                id="registerCountry"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                as="select"
                name="country"
              >
                <option value="USA">
                  USA
                </option>
                <option value="Mexico">
                  Mexico
                </option>
                <option value="Germany">
                  Germany
                </option>
              </VField>
            </div>
            <!-- TOS -->
            <div class="mb-3 pl-6">
              <VField
                id="tos"
                class="w-4 h-4 float-left -ml-6 mt-1 rounded"
                type="checkbox"
                name="tos"
              />
              <label
                class="inline-block"
                for="tos"
              >Accept terms of service</label>
            </div>
            <button
              type="submit"
              class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition
                hover:bg-purple-700"
            >
              Submit
            </button>
          </VForm>
        </div>
      </div>
    </div>
  </div>
</template>
