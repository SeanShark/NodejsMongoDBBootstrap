<template>
  <div class="row">
    <q-card
      class="shadow-13 fixed-center q-pa-sm col-xs-12 col-md-6"
      style="max-width: 550px"
    >
      <q-tabs v-model="tab" align="justify" narrow-indicator class="q-mb-lg">
        <q-tab class="text-primary text-bold" name="login" label=" 登 录 " />
        <q-tab class="text-orange text-bold" name="register" label=" 注 册 " />
      </q-tabs>

      <!-- Login Page -->

      <div class="q-gutter-y-sm">
        <q-tab-panels
          v-model="tab"
          animated
          transition-prev="scale"
          transition-next="scale"
          class="text-center q-ma-none q-pa-none"
        >
          <q-tab-panel class="q-gutter-sm" name="login">
            <div class="text-h6 q-pb-md">登 录 页</div>

            <q-avatar size="120px" class="shadow-3">
              <img src="/icons/img_avatar.png" />
            </q-avatar>
            <q-input
              filled
              v-model="email"
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
              v-model="password"
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
              <q-toggle v-model="remember" class="left" label="记住我" />
              <q-btn flat color="primary" label="忘记密码" to="/forgot" />
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
            <div class="text-h6 q-pb-md">注 册 页</div>
            <q-input filled v-model="email" type="email" label="邮箱地址">
              <template v-slot:before>
                <q-icon color="teal" name="mail" />
              </template>
            </q-input>

            <q-input
              filled
              v-model="registerCode"
              type="text"
              label="注册码"
              class="q-pt-sm"
            >
              <template v-slot:before>
                <q-icon color="red" name="key" />
              </template>
            </q-input>

            <q-input
              filled
              :type="isPwd ? 'password' : 'text'"
              v-model="password"
              label="密码"
            >
              <template v-slot:before>
                <q-icon name="password" />
              </template>
            </q-input>

            <q-input
              filled
              :type="isPwd ? 'password' : 'text'"
              v-model="repeat_password"
              label="重复密码"
              class="q-mb-md"
            >
              <template v-slot:before>
                <q-icon name="password" />
              </template>
            </q-input>

            <div class="q-py-md">
              <q-btn
                color="orange-6"
                class="full-width"
                label="注 册"
                icon-right="done"
              />
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from "vue";

const tab = ref("login");
const email = ref("");
const registerCode = ref("");
const password = ref("");
const isPwd = ref(true);
const remember = ref(false);
const repeat_password = ref("");
</script>

<style lang="sass" scoped>
</style>