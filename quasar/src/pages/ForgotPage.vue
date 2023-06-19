<template>
  <div class="row">
    <q-card
      class="shadow-13 fixed-center q-pa-lg col-xs-12 col-md-6"
      style="max-width: 550px"
    >
      <div class="q-gutter-y-sm">
        <div class="text-h5 q-py-md text-center">重置密码</div>
        <q-separator />

        <q-tab-panels v-model="tab" animated class="q-pa-none">
          <q-tab-panel name="email" class="q-pa-none">
            <div class="q-py-md">
              <p class="text-subtitle1 text-left">请输入邮箱地址：</p>
              <q-input
                filled
                v-model="userInfo.email"
                type="email"
                label="邮箱地址"
                class="q-pt-md"
                @keyup.enter="submitOne"
                :disable="captcha.state"
              >
                <template v-slot:before>
                  <q-icon color="teal" name="mail" />
                </template>
              </q-input>
              <div
                v-for="error in v_mail$.email.$errors"
                :key="error.$uid"
                class="q-pl-md text-subtitle2 text-red"
              >
                {{ error.$message }}
              </div>
              <div
                v-if="errorMsg"
                class="q-pl-md text-subtitle2 text-red text-left"
              >
                {{ errorMsg }}
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="code" class="q-pa-none">
            <div class="q-py-md">
              <p class="text-subtitle1 text-left">
                请查收邮箱新邮件，并输入6位重置码：
              </p>
              <q-input
                filled
                v-model="userInfo.code"
                type="text"
                label="重置码"
                class="q-pt-md"
              >
                <template v-slot:before>
                  <q-icon color="red" name="key" />
                </template>
              </q-input>
              <div
                v-for="error in v_code$.code.$errors"
                :key="error.$uid"
                class="q-pl-md text-subtitle2 text-red"
              >
                {{ error.$message }}
              </div>
              <div
                v-if="errorMsg"
                class="q-pl-md text-subtitle2 text-red text-left"
              >
                {{ errorMsg }}
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="reset" class="q-pa-none">
            <div class="q-pt-md">
              <p class="text-subtitle1 text-left">请设置新密码：</p>
              <q-input
                filled
                :type="isPwd ? 'password' : 'text'"
                v-model="userInfo.password"
                label="密码"
                class="q-pt-md"
              >
                <template v-slot:before>
                  <q-icon name="password" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
              <div
                v-for="error in v_pwd$.password.$errors"
                :key="error.$uid"
                class="q-pl-md text-subtitle2 text-red"
              >
                {{ error.$message }}
              </div>
            </div>

            <div class="q-pb-md">
              <q-input
                filled
                :type="isPwd ? 'password' : 'text'"
                v-model="userInfo.repeat_password"
                label="重复密码"
                class="q-mt-md"
              >
                <template v-slot:before>
                  <q-icon name="password" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
              <span
                v-for="error in v_pwd$.repeat_password.$errors"
                :key="error.$uid"
                class="q-pl-md text-subtitle2 text-red"
              >
                {{ error.$message }}
              </span>
              <div
                v-if="errorMsg"
                class="q-pl-md text-subtitle2 text-red text-left"
              >
                {{ errorMsg }}
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
        <div v-if="captcha.state" class="row justify-center items-center">
          <div class="col-3 self-center text-h8">非机器验证：</div>
          <div class="col-5 self-start">
            <div @click="getcapcha" v-html="captcha.Url"></div>
          </div>
          <div class="col-4 self-start">
            <q-input
              dense
              filled
              v-model="captcha.Data"
              :rules="[(val) => val.length <= 4 || '验证码为四位字符']"
            >
            </q-input>
          </div>
        </div>

        <div class="q-my-md row justify-end">
          <q-btn flat color="primary" label="返回登录页" to="/index" />
        </div>

        <div class="row justify-end q-pb-md q-ma-none">
          <q-btn
            v-if="stepOne"
            color="blue-grey-7"
            :disable="loadingState"
            icon-right="send"
            label="提 交"
            @click="submitOne"
            class="full-width"
            ><slot v-if="loadingState"><q-spinner-ios color="white" /></slot
          ></q-btn>

          <q-btn
            v-if="stepTwo"
            color="blue-grey-7"
            icon-right="send"
            label="提 交"
            @click="submitTwo"
            class="full-width"
            :disable="loadingState"
            ><slot v-if="loadingState"><q-spinner-ios color="white" /></slot
          ></q-btn>
          <q-btn
            v-if="stepThree"
            color="blue-grey-7"
            icon-right="send"
            label="提 交"
            @click="submitThree"
            class="full-width"
            :disable="isDone"
            ><slot v-if="loadingState"><q-spinner-ios color="white" /></slot
          ></q-btn>
        </div>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from "vue";
import useVuelidate from "@vuelidate/core";
import axios from "axios";
import {
  email,
  required,
  sameAs,
  minLength,
  helpers,
  between,
} from "@vuelidate/validators";
import { useQuasar } from "quasar";

const tab = ref("email");

const isPwd = ref(true);
const errorMsg = ref();
const stepOne = ref(true);
const stepTwo = ref(false);
const stepThree = ref(false);
const loadingState = ref(false);
const isDone = ref(false);

const captcha = reactive({
  Url: "",
  Data: "",
  text: "",
  state: true,
});

onMounted(() => {
  getcapcha();
});

const getcapcha = () => {
  captcha.state = true;
  axios.get(`/user/captcha?${Math.random()}`).then((res) => {
    captcha.Url = res.data.data;
    captcha.text = res.headers["captcha"].toLowerCase();
  });
};

watch(
  () => captcha.Data,
  (newValue) => {
    if (newValue.toLowerCase() === captcha.text) {
      captcha.state = false;
      errorMsg.value = null;
      successTip("验证通过,请输入您的邮箱地址");
    } else {
      captcha.state = true;
    }
  }
);

const userInfo = reactive({
  email: "",
  code: "",
  password: "",
  repeat_password: "",
});

const emailRule = computed(() => {
  return {
    email: {
      required: helpers.withMessage("邮箱地址不能为空", required),
      email: helpers.withMessage("请输入合法邮箱地址", email),
    },
  };
});

const codeRule = computed(() => {
  return {
    code: {
      required: helpers.withMessage("请输入六位验证码", required),
      betweenValue: helpers.withMessage(
        "验证码为6位的数字",
        between(100000, 999999)
      ),
    },
  };
});

const passwordRules = computed(() => {
  return {
    password: {
      required: helpers.withMessage("密码不能为空", required),
      minLength: helpers.withMessage("密码至少需要6位数", minLength(6)),
    },
    repeat_password: {
      required: helpers.withMessage("重复密码不能为空", required),
      sameAs: helpers.withMessage(
        "与第一次输入的密码不一致",
        sameAs(userInfo.password)
      ),
    },
  };
});

watch(
  () => userInfo.email,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      errorMsg.value = null;
    }
  }
);

watch(
  () => userInfo.code,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      errorMsg.value = null;
    }
  }
);

watch(
  () => userInfo.password,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      errorMsg.value = null;
    }
  }
);

const v_mail$ = useVuelidate(emailRule, userInfo);
const v_code$ = useVuelidate(codeRule, userInfo);
const v_pwd$ = useVuelidate(passwordRules, userInfo);

const submitOne = async () => {
  if(captcha.state) {
    return errorMsg.value = "请先通过非机器验证"
  }
  errorMsg.value = null;
  const mailResult = await v_mail$.value.$validate();
  if (mailResult) {
    loadingState.value = true;
    await axios
      .post("/user/forgot", {
        email: userInfo.email,
      })
      .then(async (res) => {
        if (res.data.status === "success") {
          successTip(res.data.msg);
          loadingState.value = false;
          stepOne.value = false;
          stepTwo.value = true;
          tab.value = "code";
        }
      })
      .catch((err) => {
        loadingState.value = false;
        errorMsg.value = err.response.data.msg;
      });
  }
};

const submitTwo = async () => {
  errorMsg.value = null;
  const codeResult = await v_code$.value.$validate();
  if (codeResult) {
    loadingState.value = true;
    await axios
      .post("/user/verifyforgotcode", {
        email: userInfo.email,
        code: userInfo.code,
      })
      .then(async (res) => {
        if (res.data.status === "success") {
          successTip(res.data.msg);
          loadingState.value = false;
          stepTwo.value = false;
          stepThree.value = true;
          tab.value = "reset";
        }
      })
      .catch((err) => {
        loadingState.value = false;
        errorMsg.value = err.response.data.msg;
      });
  }
};

const submitThree = async () => {
  const pwdResult = await v_pwd$.value.$validate();
  if (pwdResult) {
    loadingState.value = true;
    await axios
      .post("/user/resetpassword", {
        email: userInfo.email,
        code: userInfo.code,
        password: userInfo.password,
      })
      .then(async (res) => {
        if (res.data.status === "success") {
          successTip(res.data.msg);
          loadingState.value = false;
          isDone.value = true;
        }
      })
      .catch((err) => {
        console.log(err);
        loadingState.value = false;
        errorMsg.value = err.response.data.msg;
      });
  }
};

const $q = useQuasar();

const successTip = (msg) => {
  $q.notify({
    type: "positive",
    progress: true,
    message: `${msg}`,
  });
};
</script>

<style lang="sass" scoped></style>
