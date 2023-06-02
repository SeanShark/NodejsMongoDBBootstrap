<template>
  <nav class="navbar navbar-expand navbar-light bg-body-tertiary">
  <div class="container">
    <router-link class="navbar-brand" to="/">
      <img
        src="@/assets/vue.svg"
        alt="Logo"
        width="30"
        height="24"
        class="d-inline-block align-text-top"
      />
      信息系统
    </router-link>



    <ul class="navbar-nav justify-content-end flex-grow-1 pe-3" v-if="store.user">
      <li class="nav-item" >
        <!-- Nothing happen when clicked -->
        <a class="nav-link active" href="javascript:void(0)" @click="handleClick">Log out</a> 
      </li>
    </ul>

    <ul class="navbar-nav justify-content-end flex-grow-1 pe-3" v-else>
      <li class="nav-item" >
        <router-link class="nav-link active" aria-current="page" to="/login">Login</router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" to="/register">Sign in</router-link>
      </li>
    </ul>

  </div>
</nav>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
import { useTodosStore } from "../stores/todos";

const store = useTodosStore();

const handleClick = async () => {
  localStorage.clear();
  store.authUser = null;
  router.push("/login");
}
</script>

<style>

</style>