<template>
  <div>
    <h3 class="text-center p-3" v-if="step1">忘记密码：</h3>
    <h3 class="text-center p-3" v-if="step2">输入重置码：</h3>
    <h3 class="text-center p-3" v-if="step3">重置密码：</h3>

    <div class="form-floating mb-3" v-if="step1">
      <input
        v-model="userEmail"
        type="email"
        class="form-control"
        id="emailInput"
        placeholder="name@example.com"
        required
      />
      <label for="floatingInput">邮箱地址</label>
    </div>
    <div class="form-floating mb-3" v-if="step2">
      
      <input
        v-model="forgotCode"
        type="email"
        class="form-control"
        id="forgotcodeInput"
        placeholder="请输入重置码"
        required
      />
      <label for="floatingInput">重置码</label>
    </div>

    <div class="form-floating mb-3" v-if="step3">
      <input
        type="password"
        class="form-control"
        id="floatingPassword"
        placeholder="Password"
        v-model="password"
        required
      />
      <label for="floatingPassword">密码</label>
    </div>

    <div class="form-floating mb-3" v-if="step3">
      <input
        type="password"
        class="form-control"
        id="floatingcomfirmPassword"
        placeholder="Password"
        v-model="repeat_password"
        required
      />
      <label for="floatingcomfirmPassword">重复密码</label>
    </div>

    <Message />

    <div class="d-grid gap-2 d-md-flex justify-content-md-end pt-5">
      <button
        v-if="step1"
        class="btn btn-primary me-md-2"
        type="button"
        :disabled="store.isDisabled"
        @click="stepOne()"
      >
        <span
          v-if="store.isDisabled"
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span>
        重 置
      </button>
      <button
        v-if="step2"
        class="btn btn-primary me-md-2"
        type="button"
        :disabled="store.isDisabled"
        @click="stepTwo()"
      >
        <span
          v-if="store.isDisabled"
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span>
        提 交
      </button>
      <button
        v-if="step3"
        class="btn btn-primary me-md-2"
        type="button"
        :disabled="store.isDisabled"
        @click="stepThree()"
      >
        <span
          v-if="store.isDisabled"
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span>
        确 定
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Message from "./Message.vue";
import { useTodosStore } from "../stores/todos";
import axios from "axios";

const store = useTodosStore();

const userEmail = ref();
const forgotCode = ref();
const password = ref();
const repeat_password = ref();

const step1 = ref(true);
const step2 = ref(false);
const step3 = ref(false);

const stepOne = async () => {
  store.isDisabled = true;
  try {
    await axios
      .post("/user/forgot", {
        email: userEmail.value,
      })
      .then((res) => {
        store.isDisabled = false;
        if (res.data.status === "success") {
          store.alertMessage.exist = true;
          store.alertMessage.color = "alert-success";
          store.alertMessage.content = "请查看邮箱内重置码并输入至对话框.";
          step2.value = true;
          step1.value = false;
        }
        else {
          store.alertMessage.exist = true;
          store.alertMessage.content = "错误，请重试。";
        }
      });
  } catch (err) {
    store.alertMessage.exist = true;
    store.alertMessage.content = err.response.data.msg;
    store.isDisabled = false;
  }
};

const stepTwo = async () => {
  store.resetAlert();

    let res = await axios.post("/user/verifycode", {
      email:  store.user.email,
      forgotCode: forgotCode
    });
    console.log(res);

};

const stepThree = async () => {
  console.log("click3");
};
</script>

<style>
</style>