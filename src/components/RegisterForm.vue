<script setup>
import { ref, reactive } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const { register } = authStore;

const schema = reactive({
  name: 'required|min:3|max:100|alpha_spaces',
  email: 'required|min:3|max:100|email',
  age: 'required|min_value:18|max_value:100',
  password: 'required|min:6|max:32',
  confirmPassword: 'password_mismatch:@password',
  country: 'required|country_excluded:Antarctica',
  tos: 'tos',
});
const userData = reactive({
  country: 'USA',
});
const registerSubmission = ref(false);
const registerShowAlert = ref(false);
const registerAlertVarient = ref('bg-blue-500');
const registerAlertMessage = ref('請稍等！正在為您註冊帳號');

const registerUser = async (values) => {
  registerSubmission.value = true;
  registerShowAlert.value = true;
  registerAlertVarient.value = 'bg-blue-500';
  registerAlertMessage.value = '請稍等！正在為您建立帳號';

  try {
    await register(values);
    registerAlertVarient.value = 'bg-green-500';
    registerAlertMessage.value = '註冊帳號成功';
    window.location.reload();
  } catch (error) {
    console.log(error);
    registerSubmission.value = false;
    registerAlertVarient.value = 'bg-red-500';
    registerAlertMessage.value = '註冊帳號失敗';
  }
};
</script>

<template>
  <div
    v-if="registerShowAlert"
    class="text-white text-center font-bold p-4 mb-4"
    :class="registerAlertVarient"
  >
    {{ registerAlertMessage }}
  </div>
  <VForm
    :validation-schema="schema"
    :initial-values="userData"
    @submit="registerUser"
  >
    <div class="mb-3">
      <label
        class="inline-block mb-2"
        for="registerName"
      >姓名</label>
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
      <ErrorMessage
        class="text-red-600"
        name="age"
      />
    </div>
    <div class="mb-3">
      <label
        class="inline-block mb-2"
        for="registerPassword"
      >Password</label>
      <VField
        v-slot="{ field, errors }"
        name="password"
        :bails="false"
      >
        <input
          id="registerPassword"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          type="password"
          placeholder="Password"
          v-bind="field"
        >
        <div
          v-for="error in errors"
          :key="error"
          class="text-red-600"
        >
          {{ error }}
        </div>
      </VField>
    </div>
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
      <ErrorMessage
        class="text-red-600"
        name="confirmPassword"
      />
    </div>
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
        <option value="Antarctica">
          Antarctica
        </option>
      </VField>
      <ErrorMessage
        class="text-red-600"
        name="country"
      />
    </div>
    <div class="mb-3 pl-6">
      <VField
        id="tos"
        class="w-4 h-4 float-left -ml-6 mt-1 rounded"
        type="checkbox"
        name="tos"
        value="1"
      />
      <label
        class="inline-block"
        for="tos"
      >Accept terms of service</label>
      <ErrorMessage
        class="block text-red-600"
        name="tos"
      />
    </div>
    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
      :disabled="registerSubmission"
    >
      Submit
    </button>
  </VForm>
</template>
