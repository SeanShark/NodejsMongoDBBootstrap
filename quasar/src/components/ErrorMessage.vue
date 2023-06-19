<template>
  <div
    class="q-pl-md text-subtitle2 text-red text-left"
  >
    {{ props.error.$message }}
  </div>
</template>

<script setup>
const props = defineProps({
  error: {
    type: Object,
  },
});
</script>

<style>
</style>