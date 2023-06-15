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
            </div>
          </q-tab-panel>
        </q-tab-panels>
        <div class="q-my-md row justify-end">
          <q-btn flat color="primary" label="返回登录页" to="/index" />
        </div>
        <div class="row justify-end q-pb-md q-ma-none">
          <q-btn
            v-if="!lastStep"
            color="indigo-7"
            icon-right="send"
            label="提 交"
            @click="nextTab"
            class="full-width"
          />
          <q-btn
            v-if="lastStep"
            color="indigo-7"
            icon-right="send"
            label="提 交"
            @click="reset"
            class="full-width"
          />
        </div>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import useVuelidate from "@vuelidate/core";
import {
  email,
  required,
  sameAs,
  minLength,
  helpers,
  between,
} from "@vuelidate/validators";

const tab = ref("email");

const isPwd = ref(true);
const lastStep = ref(false);

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

const v_mail$ = useVuelidate(emailRule, userInfo);
const v_code$ = useVuelidate(codeRule, userInfo);
const v_pwd$ = useVuelidate(passwordRules, userInfo);

const nextTab = async () => {
  const mailResult = await v_mail$.value.$validate();
  if (mailResult) {
    tab.value = "code";
    const codeResult = await v_code$.value.$validate();
    if (codeResult) {
      tab.value = "reset";
      lastStep.value = true;
    }
  }
};

const reset = async () => {
  const pwdResult = await v_pwd$.value.$validate();
  if (pwdResult) {
    console.log("submit");
  }
};
</script>

<style lang="sass" scoped></style>
