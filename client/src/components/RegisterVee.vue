<template>
  <form @submit.prevent="handleSubmit(value)">
    <h3 class="text-center p-3">注 册 页</h3>

    <Field name="email" type="email" />
    <div class="form-floating mb-3">
      <input
        type="email"
        class="form-control"
        id="floatingInput"
        placeholder="name@example.com"
        v-model="newUser.email"
      />
      <label for="floatingInput">邮箱地址</label>
    </div>
    <div class="form-floating mb-3">
      <input
        type="text"
        class="form-control"
        id="floatingInput"
        placeholder="name@example.com"
        v-model="value"
      />
      <span>{{ errorMessage }}</span>
      <label for="floatingInput">姓名</label>
    </div>
    <div class="form-floating mb-3">
      <input
        type="password"
        class="form-control"
        id="floatingPassword"
        placeholder="Password"
        v-model="newUser.password"
      />
      <label for="floatingPassword">密码</label>

    </div>

    <div class="form-floating mb-3">
      <input
        type="password"
        class="form-control"
        id="floatingcomfirmPassword"
        placeholder="Password"
        v-model="newUser.repeat_password"
      />
      <label for="floatingcomfirmPassword">重复密码</label>

    </div>
    <Message />

    <div class="d-grid gap-2 d-md-flex justify-content-md-end pt-5">
      <button class="btn btn-primary me-md-2" type="submit">注 册</button>
    </div>
  </form>
</template>

<script setup>
import { reactive, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Message from "./Message.vue";
import { useField } from 'vee-validate';

function validateField(value) {
  if (!value) {
    return 'this field is required';
  }

  if (value.length < 8) {
    return 'this field must contain at least 8 characters';
  }

  return true;
}

const { value, errorMessage } = useField('fullName', validateField);



import { useTodosStore } from "../stores/todos";

const store = useTodosStore();
const router = useRouter();

const newUser = reactive({
  email: "",
  password: "",
  repeat_password: "",
});

const handleSubmit = async (value) => {
  console.log(value);
  // store.isDisabled = true;
  // await axios
  //   .post("/user/register", {
  //     email: newUser.email,
  //     password: newUser.password,
  //     repeat_password: newUser.repeat_password,
  //   })
  //   .then((res) => {
  //     if (res.data.status === "success") {
  //       store.alertMessage.exist = true;
  //       store.alertMessage.color = "alert-success";
  //       store.alertMessage.content = "注册成功，系统将在3秒后自动转入登录页";
  //       //console.log(res.data.msg);
  //       setTimeout(() => {
  //         store.isDisabled = false;
  //         store.resetAlert();
  //         router.push("/login");
  //       }, 3000);
  //     }
  //   })
  //   .catch((err) => {
  //     store.alertMessage.exist = true;
  //     store.isDisabled = false;
  //     store.alertMessage.content = err.response.data.msg;
  //   });
};
</script>

<style></style>
