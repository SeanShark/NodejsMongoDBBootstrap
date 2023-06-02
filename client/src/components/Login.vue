<template>
  <form @submit.prevent="handleLogin(loginData)">
    <h3 class="text-center p-3">登 录 页</h3>

    <div class="form-floating mb-3">
      <input
        v-model="loginData.email"
        type="email"
        class="form-control"
        id="floatingInput"
        placeholder="name@example.com"
        required
      />
      <label for="floatingInput">邮箱地址</label>
    </div>
    <div class="form-floating pb-3">
      <input
        v-model="loginData.password"
        type="password"
        class="form-control"
        id="floatingPassword"
        placeholder="Password"
        required
      />
      <label for="floatingPassword">密码</label>
    </div>

    <Message />

    <div class="d-flex justify-content-between">
      <div class="form-check form-switch">
        <input
          class="form-check-input"
          type="checkbox"
          role="switch"
          id="flexSwitchCheckChecked"
          v-model="loginData.rememberMe"
        />
        <label class="form-check-label" for="flexSwitchCheckChecked"
          >保持登录</label
        >
      </div>
      <router-link to="/forgot">Forgot Password?</router-link>
    </div>
    <div class="d-grid gap-2 d-md-flex justify-content-md-end pt-5">
      <button
        class="btn btn-primary me-md-2"
        type="submit"
        :disabled="store.isDisabled"
      >
        登 录
      </button>
    </div>
  </form>
</template>

<script setup>
import { useRouter } from "vue-router";
import { reactive } from "vue";
import Message from "./Message.vue";
import { useTodosStore } from "../stores/todos";

const store = useTodosStore();

const router = useRouter();

const loginData = reactive({
  email: "",
  password: "",
  rememberMe: false
});

const handleLogin = async (data) => {
  store.resetAlert();
  await store.getToken(data);
  let token = localStorage.getItem("token");
  if (token !== null) {
    await store.verifyUser().then(() => {
      if(store.tokenOK) {
        store.isDisabled = true;
        store.alertMessage.exist = true;
        store.alertMessage.color = "alert-success";
        store.alertMessage.content = "登录成功，3秒后自动跳转";
        setTimeout(() => {
          store.resetAlert();
          store.isDisabled = false;
          router.push("/");
        }, 3000);
      }
    })
    .catch(err => console.log(err))
      
    
  }
};
</script>