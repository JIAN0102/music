<script setup>
import { ref, reactive } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const { login } = authStore;

const schema = reactive({
  email: 'required|email',
  password: 'required|min:6|max:32',
});
const loginSubmission = ref(false);
const loginShowAlert = ref(false);
const loginAlertVarient = ref('bg-blue-500');
const loginAlertMessage = ref('登入中，請稍後');

const loginUser = async (values) => {
  loginSubmission.value = true;
  loginShowAlert.value = true;
  loginAlertVarient.value = 'bg-blue-500';
  loginAlertMessage.value = '登入中，請稍後';

  try {
    await login(values);
    loginAlertVarient.value = 'bg-green-500';
    loginAlertMessage.value = '登入成功';
    window.location.reload();
  } catch (error) {
    console.log(error);
    loginSubmission.value = false;
    loginAlertVarient.value = 'bg-red-500';
    loginAlertMessage.value = '登入失敗';
  }
};
</script>

<template>
  <div
    v-if="loginShowAlert"
    class="text-white text-center font-bold p-4 mb-4"
    :class="loginAlertVarient"
  >
    {{ loginAlertMessage }}
  </div>
  <VForm
    :validation-schema="schema"
    @submit="loginUser"
  >
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
      <ErrorMessage
        class="text-red-600"
        name="email"
      />
    </div>
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
      <ErrorMessage
        class="text-red-600"
        name="password"
      />
    </div>
    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
      :disabled="loginSubmission"
    >
      Submit
    </button>
  </VForm>
</template>
