

<template>
  <div class="container-fluid p-0">
    <Nav />
    <div class="auth-wrapper">
      <div
        class="auth-inner position-absolute top-50 start-50 translate-middle"
      >
        <router-view />
      </div>
    </div>

    <!-- Display authUser information -->
  </div>
</template>

<script setup>
import Nav from "@/components/Nav.vue";
import { onMounted } from "vue";
import { useTodosStore } from "./stores/todos";

const store = useTodosStore();

onMounted(() => {
  //add user vertification.
})

</script>

<style scoped>
.auth-wrapper {
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: left;
}

.auth-inner {
  width: 550px;
  margin: auto;
  background: #ffffff;
  box-shadow: 0px 14px 80px rgba(34, 35, 57, 0.2);
  padding: 40px 15px 45px;
  border-radius: 15px;
  transition: all 0.3s;
}
</style>
