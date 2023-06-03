<template>
  <div>
    <h3 class="text-center p-3" v-if="step1">忘记密码：</h3>
    <h3 class="text-center p-3" v-if="step2">输入重置码：</h3>
    <h3 class="text-center p-3" v-if="step3">重置密码：</h3>

    <div class="form-floating mb-3" v-if="step1">
      <input
        v-model="userInfo.email"
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
        v-model="userInfo.forgotCode"
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
        v-model="userInfo.password"
      />
      <label for="floatingPassword">密码</label>
      <span v-for="error in v$.password.$errors" :key="error.$uid">
        {{ error.$message }}
      </span>
    </div>

    <div class="form-floating mb-3" v-if="step3">
      <input
        type="password"
        class="form-control"
        id="floatingcomfirmPassword"
        placeholder="Password"
        v-model="userInfo.repeat_password"
      />
      <label for="floatingcomfirmPassword">重复密码</label>
      <span v-for="error in v$.repeat_password.$errors" :key="error.$uid">
        {{ error.$message }}
      </span>
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
import { ref, computed,reactive } from "vue";
import Message from "./Message.vue";
import { useTodosStore } from "../stores/todos";
import axios from "axios";
import useVuelidate from "@vuelidate/core";
import {
  required,
  sameAs,
  minLength,
  helpers,
} from "@vuelidate/validators";


const store = useTodosStore();

const userInfo = reactive({
  email: "",
  forgotCode: "",
  password: "",
  repeat_password: "",
});

const step1 = ref(true);
const step2 = ref(false);
const step3 = ref(false);

const stepOne = async () => {
  store.isDisabled = true;
  try {
    await axios
      .post("/user/forgot", {
        email: userInfo.email,
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
  store.isDisabled = true;
  //verify forgot code
  await axios.post("/user/verifycode", {
    email: userInfo.email,
    forgotCode: userInfo.forgotCode
  })
  .then((res) => {
    if(res.status === 200) {
      store.alertMessage.exist = true;
      store.alertMessage.color = "alert-success";
      store.alertMessage.content = res.data.msg;
      step2.value = false;
      step3.value = true;
      store.isDisabled = false;
    }
  })
  .catch((err) => {
    store.alertMessage.exist = true;
    store.alertMessage.content = err.response.data.msg;
    store.isDisabled = false;
  })
};


const rules = computed(() => {
  return {
    password: {
      required: helpers.withMessage("密码不能为空", required),
      minLength: helpers.withMessage("密码至少需要6位数", minLength(6)),
    },
    repeat_password: { 
      required: helpers.withMessage("重复密码不能为空", required),
      sameAs: helpers.withMessage("与第一次输入的密码不一致", sameAs(userInfo.password))
    },
  };
});

const v$ = useVuelidate(rules, userInfo);

const stepThree = async () => {
  store.resetAlert();
  const result = await v$.value.$validate();
  if (result) {
    await axios.post("/user/resetpassword", {
      email: userInfo.email,
      forgotCode: userInfo.forgotCode,
      password: userInfo.password
    })
    .then((res) => {
      if(res.status === 201) {
        store.alertMessage.exist = true;
        store.alertMessage.color = "alert-success";
        store.alertMessage.content = res.data.msg;
      }
    })
    .catch((err) => {
      store.alertMessage.exist = true;
      store.alertMessage.color = "alert-warning";
      store.alertMessage.content = err.response.data.msg;
      store.isDisabled = false;
    })
  }
};
</script>

<style>
</style>