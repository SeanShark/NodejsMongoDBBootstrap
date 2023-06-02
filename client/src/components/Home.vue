<template>
  <div v-if="store.user">
    This is home Component. 
    User name is :
    {{ store.user.name }}
  </div>
  <div v-else>
    Please login first.
  </div>

</template>

<script setup>
import { useTodosStore } from "../stores/todos";

const store = useTodosStore();

</script>

<style>

</style>