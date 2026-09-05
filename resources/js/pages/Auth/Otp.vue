<template>
  <div class="max-w-md mx-auto mt-12 p-4 border rounded bg-white">
    <h2 class="text-2xl font-bold mb-4">Enter OTP</h2>
    <form @submit.prevent="submit">
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700" for="otp">OTP Code</label>
        <input v-model="form.otp" type="text" id="otp" name="otp" maxlength="6" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
      </div>
      <button type="submit" class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">Verify</button>
    </form>
    <div v-if="error" class="mt-4 text-red-600">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useForm } from '@inertiajs/vue3';

const form = useForm({ otp: '' });
const error = ref('');

function submit() {
  form.post(route('otp.verify'))
    .then(() => {
      // success handled by server redirect
    })
    .catch((e) => {
      if (e.response && e.response.data && e.response.data.errors) {
        error.value = Object.values(e.response.data.errors).join(' ');
      } else {
        error.value = 'An unexpected error occurred.';
      }
    });
}
</script>

<style scoped>
/* Optional styling */
</style>

