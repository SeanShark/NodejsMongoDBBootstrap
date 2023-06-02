<template>
  <div
    v-if="store.alertMessage.exist"
    class="alert alert-dismissible fade show"
    :class="[store.alertMessage.color]"
    role="alert"
  >
    {{ store.alertMessage.content }}.
    <button
      type="button"
      class="btn-close"
      data-bs-dismiss="alert"
      aria-label="Close"
      @click="dismissAlert"
    ></button>
  </div>
</template>

<script setup>
import { useTodosStore } from "../stores/todos";

const store = useTodosStore();

const dismissAlert = () => {
  store.resetAlert();
};


</script>

<style>
</style>