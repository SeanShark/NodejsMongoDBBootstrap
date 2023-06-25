<template>
  <div class="row">
    <q-card
      class="shadow-13 fixed-center q-pa-sm col-xs-12 col-md-6"
      style="max-width: 550px"
    >
      <q-tabs
        v-model="mainTab"
        align="justify"
        narrow-indicator
        class="q-mb-md"
      >
        <q-tab class="text-primary" name="login" label=" 登 录 " />
        <q-tab class="text-orange" name="register" label=" 注 册 " />
      </q-tabs>

      <div class="q-gutter-y-sm">
        <q-tab-panels
          v-model="mainTab"
          animated
          transition-prev="fade"
          transition-next="fade"
          class="text-center q-ma-none q-pa-none"
        >
          <!-- Login Page -->
          <q-tab-panel class="q-gutter-sm" name="login">
            <div class="text-h5 q-pb-md">登 录 页</div>

            <q-avatar size="120px" class="shadow-3">
              <img src="/icons/img_avatar.png" />
            </q-avatar>
            <div class="q-pt-sm">
              <q-input
                filled
                v-model="loginInfo.email"
                type="email"
                label="邮箱地址"
              >
                <template v-slot:before>
                  <q-icon color="teal" name="mail" />
                </template>
              </q-input>
              <div
                v-for="error in v_login$.email.$errors"
                :key="error.$uid"
                class="q-pl-md text-subtitle2 text-red text-left"
              >
                {{ error.$message }}
              </div>
            </div>

            <div class="q-mb-md">
              <q-input
                filled
                :type="isPwd ? 'password' : 'text'"
                v-model="loginInfo.password"
                label="密码"
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
                v-for="error in v_login$.password.$errors"
                :key="error.$uid"
                class="q-pl-md text-subtitle2 text-red text-left"
              >
                {{ error.$message }}
              </div>
            </div>

            <div class="q-my-md row justify-between">
              <q-toggle
                v-model="loginInfo.remember"
                class="left"
                label="记住我"
              />
              <q-btn
                flat
                color="indigo-7"
                label="忘记密码？"
                to="/forgot"
                class="text-italic"
              />
            </div>

            <div class="q-py-md">
              <q-btn
                color="primary"
                class="full-width"
                icon-right="login"
                label="登 录"
                @click="loginSubmit"
              />
            </div>
          </q-tab-panel>

          <!-- Register Page-->

          <q-tab-panel class="q-gutter-sm" name="register">
            <div class="text-h5 q-pb-md">注 册 页</div>
            <q-separator />

            <div class="q-gutter-y-sm q-pb-md">
              <q-tab-panels v-model="registerTab" animated class="q-py-md">
                <q-tab-panel name="email" class="q-pa-none">
                  <div class="q-py-lg">
                    <p class="text-subtitle1 text-left">
                      请输入需注册的邮箱地址：
                    </p>
                    <q-input
                      :filled="!captcha.state"
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
                      class="q-pl-md text-subtitle2 text-red text-left"
                    >
                      {{ error.$message }}
                    </div>

                  </div>
                </q-tab-panel>

                <q-tab-panel name="code" class="q-pa-none">
                  <div class="q-py-lg">
                    <p class="text-subtitle1 text-left">
                      请输入6位验证码（已发至您邮箱）：
                    </p>

                    <q-input
                      filled
                      v-model="userInfo.code"
                      type="text"
                      label="注册码"
                      class="q-pt-md"
                    >
                      <template v-slot:before>
                        <q-icon color="red" name="key" />
                      </template>
                    </q-input>
                    <div
                      v-for="error in v_code$.code.$errors"
                      :key="error.$uid"
                      class="q-pl-md text-subtitle2 text-red text-left"
                    >
                      {{ error.$message }}
                    </div>
                  </div>
                </q-tab-panel>

                <q-tab-panel name="register" class="q-pa-none">
                  <div class="q-pt-lg q-pb-md">
                    <p class="text-subtitle1 text-left">请设置您的密码：</p>

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
                      class="q-pl-md text-subtitle2 text-red text-left"
                    >
                      {{ error.$message }}
                    </div>
                  </div>

                  <div class="q-pb-lg">
                    <q-input
                      filled
                      :type="isPwd ? 'password' : 'text'"
                      v-model="userInfo.repeat_password"
                      label="重复密码"
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
                      v-for="error in v_pwd$.repeat_password.$errors"
                      :key="error.$uid"
                      class="q-pl-md text-subtitle2 text-red text-left"
                    >
                      {{ error.$message }}
                    </div>
                  </div>
                </q-tab-panel>
              </q-tab-panels>
              <div v-if="captcha.state" class="row justify-center items-center">
                <div class="col-3 self-center text-h8">非机器验证：</div>
                <div class="col-6 self-start">
                  <div @click="getcapcha" v-html="captcha.Url"></div>
                </div>
                <div class="col-3 self-start">
                  <q-input
                    dense
                    filled
                    v-model="captcha.Data"
                    :rules="[(val) => val.length <= 4 || '验证码为四位字符']"
                  >
                  </q-input>
                </div>
              </div>

              <div class="row justify-end q-py-md q-ma-none">
                <q-btn
                  v-if="stepOne"
                  color="orange-6"
                  :disable="loadingState"
                  icon-right="send"
                  label="提 交"
                  @click="submitOne"
                  @keyup.enter="submitOne"
                  class="full-width"
                  ><slot v-if="loadingState"
                    ><q-spinner-ios color="white" /></slot
                ></q-btn>

                <q-btn
                  v-if="stepTwo"
                  color="orange-6"
                  icon-right="send"
                  label="提 交"
                  @click="submitTwo"
                  @keyup.enter="submitTwo"
                  class="full-width"
                  :disable="loadingState"
                  ><slot v-if="loadingState"
                    ><q-spinner-ios color="white" /></slot
                ></q-btn>
                <q-btn
                  v-if="stepThree"
                  color="orange-6"
                  icon-right="send"
                  label="提 交"
                  @click="submitThree"
                  @keyup.enter="submitThree"
                  class="full-width"
                  :disable="isDone"
                  ><slot v-if="loadingState"
                    ><q-spinner-ios color="white" /></slot
                ></q-btn>
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from "vue";
import { useUserStore } from "src/stores/store";
import { useRouter } from "vue-router";
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

const $q = useQuasar();

const store = useUserStore();
const router = useRouter();

const mainTab = ref("login");
const registerTab = ref("email");
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

onMounted(async () => {
  getcapcha();

  let token = localStorage.getItem("token");

  if (token !== null) {
    await store.verifyUser();
    if (store.user) {
      router.push("/");
    }
  }
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

const loginInfo = reactive({
  email: "",
  password: "",
  remember: false,
});

const userInfo = reactive({
  email: "",
  code: "",
  password: "",
  repeat_password: "",
});

const loginRule = computed(() => {
  return {
    email: {
      required: helpers.withMessage("邮箱地址不能为空", required),
      email: helpers.withMessage("请输入合法邮箱地址", email),
    },
    password: {
      required: helpers.withMessage("密码不能为空", required),
      minLength: helpers.withMessage("密码至少需要6位数", minLength(6)),
    },
  };
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
  () => loginInfo.email,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      errorMsg.value = null;
    }
  }
);

watch(
  () => loginInfo.password,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      errorMsg.value = null;
    }
  }
);

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

const v_login$ = useVuelidate(loginRule, loginInfo);
const v_mail$ = useVuelidate(emailRule, userInfo);
const v_code$ = useVuelidate(codeRule, userInfo);
const v_pwd$ = useVuelidate(passwordRules, userInfo);

const loginSubmit = async () => {
  const mailResult = await v_login$.value.$validate();
  if (mailResult) {
    await axios
      .post("/user/login", loginInfo)
      .then(async (res) => {
        if (res.status === 200) {
          localStorage.setItem("token", res.data.token);
          try {
            await store.verifyUser();
            successTip("成功登录");
            router.push("/");
          } catch (err) {}
        }
      })
      .catch((err) => {
        failureTip(err.response.data.msg);
      });
  }
};

const submitOne = async () => {
  errorMsg.value = null;
  if (captcha.state) {
    return (errorMsg.value = "请先通过非机器验证");
  }
  const mailResult = await v_mail$.value.$validate();
  if (mailResult) {
    loadingState.value = true;
    await axios
      .post("/user/signup", {
        email: userInfo.email,
      })
      .then(async (res) => {
        if (res.data.status === "success") {
          successTip(res.data.msg);
          loadingState.value = false;
          stepOne.value = false;
          stepTwo.value = true;
          registerTab.value = "code";
        }
      })
      .catch((err) => {
        loadingState.value = false;
        failureTip(err.response.data.msg);
      });
  }
};

const submitTwo = async () => {
  errorMsg.value = null;
  const codeResult = await v_code$.value.$validate();
  if (codeResult) {
    loadingState.value = true;
    await axios
      .post("/user/verifysignup", {
        email: userInfo.email,
        code: userInfo.code,
      })
      .then(async (res) => {
        if (res.data.status === "success") {
          successTip(res.data.msg);
          loadingState.value = false;
          stepTwo.value = false;
          stepThree.value = true;
          registerTab.value = "register";
        }
      })
      .catch((err) => {
        loadingState.value = false;
        failureTip(err.response.data.msg);
      });
  }
};

const submitThree = async () => {
  const pwdResult = await v_pwd$.value.$validate();
  if (pwdResult) {
    loadingState.value = true;
    await axios
      .post("/user/setpassword", {
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
        loadingState.value = false;
        failureTip(err.response.data.msg);
      });
  }
};

const successTip = (msg) => {
  $q.notify({
    type: "positive",
    progress: true,
    message: `${msg}`,
  });
};

const failureTip = (msg) => {
  $q.notify({
    type: "negative",
    progress: true,
    message: `${msg}`,
  });
};

</script>

<style lang="sass" scoped></style>
