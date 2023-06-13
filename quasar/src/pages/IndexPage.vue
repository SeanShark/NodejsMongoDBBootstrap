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
            <q-input
              filled
              v-model="loginInfo.email"
              type="email"
              label="邮箱地址"
              class="q-pt-sm"
            >
              <template v-slot:before>
                <q-icon color="teal" name="mail" />
              </template>
            </q-input>

            <q-input
              filled
              :type="isPwd ? 'password' : 'text'"
              v-model="loginInfo.password"
              label="密码"
              class="q-mb-md"
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
              />
            </div>
          </q-tab-panel>

          <!-- Register Page-->

          <q-tab-panel class="q-gutter-sm" name="register">
            <div class="text-h5 q-pb-md">注 册 页</div>
            <q-separator />
            <div class="q-gutter-y-sm q-pb-md">
              <q-tab-panels
                v-model="registerTab"
                animated
                class="q-pa-none q-ma-none"
              >
                <q-tab-panel name="email" class="q-pa-none">
                  <p class="text-subtitle1 q-py-md text-left">
                    请输入需注册的邮箱地址：
                  </p>
                  <q-input
                    filled
                    v-model="registerInfo.email"
                    type="email"
                    label="邮箱地址"
                    class="q-py-lg"
                  >
                    <template v-slot:before>
                      <q-icon color="teal" name="mail" />
                    </template>
                  </q-input>
                </q-tab-panel>

                <q-tab-panel name="code" class="q-pa-none">
                  <p class="text-subtitle1 q-py-md text-left">
                    请输入6位注册码（已发至您邮箱）：
                  </p>

                  <q-input
                    filled
                    v-model="registerInfo.registerCode"
                    type="text"
                    label="注册码"
                    class="q-py-lg"
                  >
                    <template v-slot:before>
                      <q-icon color="red" name="key" />
                    </template>
                  </q-input>
                </q-tab-panel>

                <q-tab-panel name="register" class="q-pa-none">
                  <p class="text-subtitle1 q-py-md text-left">
                    请设置您的密码：
                  </p>

                  <q-input
                    filled
                    :type="isPwd ? 'password' : 'text'"
                    v-model="registerInfo.password"
                    label="密码"
                    class="q-mb-md"
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

                  <q-input
                    filled
                    :type="isPwd ? 'password' : 'text'"
                    v-model="registerInfo.repeat_password"
                    label="重复密码"
                    class="q-mb-md"
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
                </q-tab-panel>
              </q-tab-panels>
              <div class="row justify-end q-py-md q-ma-none">
                <q-btn
                  color="orange-6"
                  icon-right="send"
                  label="提 交"
                  @click="nextTab"
                  class="full-width"
                />
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";

const loginInfo = reactive({
  email: "",
  password: "",
  remember: false,
});

const registerInfo = reactive({
  email: "",
  registerCode: "",
  password: "",
  repeat_password: "",
});

const mainTab = ref("login");
const registerTab = ref("email");

const isPwd = ref(true);

const nextTab = () => {
  if (registerTab.value === "email") {
    registerTab.value = "code";
  } else {
    registerTab.value = "register";
  }
};
</script>

<style lang="sass" scoped>
</style>