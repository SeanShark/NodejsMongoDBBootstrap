<template>
  <div class="row">
    <q-card
      class="shadow-13 fixed-center q-pa-lg col-xs-12 col-md-6"
      style="max-width: 550px"
    >
      <div class="q-gutter-y-sm">
        <q-tab-panels v-model="tab" animated class="q-pa-none q-ma-none">
          <q-tab-panel name="email" class="q-pa-none q-ma-none">
            <div class="text-h5 text-center q-py-lg">忘记密码</div>
            <q-separator />
            <p class="text-subtitle1 q-py-md text-left">请输入邮箱地址：</p>
            <q-input
              filled
              v-model="email"
              type="email"
              label="邮箱地址"
              class="q-py-lg q-ma-none"
            >
              <template v-slot:before>
                <q-icon color="teal" name="mail" />
              </template>
            </q-input>
          </q-tab-panel>

          <q-tab-panel name="code" class="q-pa-none q-ma-none">

            <div class="text-h5 text-center q-py-lg">输入重置码</div>
            <q-separator />
            <p class="text-subtitle1 q-py-md text-left">
              请检查邮箱新邮件，并输入6位重置码：
            </p>
            <q-input
              filled
              v-model="forgotCode"
              type="text"
              label="重置码"
              class="q-pt-sm"
            >
              <template v-slot:before>
                <q-icon color="red" name="key" />
              </template>
            </q-input>
          </q-tab-panel>

          <q-tab-panel name="reset">
            <div class="text-h5 text-center q-py-lg">重设密码</div>
            <q-separator />
            <p class="text-subtitle1 q-py-md text-left">
              请设置新密码：
            </p>
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
        <div class="q-my-md row justify-end">
          <q-btn flat color="primary" label="返回登录页" to="/index" />
        </div>
        <div class="row justify-end q-pb-md q-ma-none">
          <q-btn
            color="indigo-7"
            icon-right="send"
            label="提 交"
            @click="nextTab"
            class="full-width"
          />
        </div>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from "vue";

const email = ref("");
const tab = ref("email");
const forgotCode = ref("");
const password = ref("");
const isPwd = ref(true);

const repeat_password = ref("");

const nextTab = () => {
  if (tab.value === "email") {
    tab.value = "code";
  } else {
    tab.value = "reset";
  }
};
</script>

<style lang="sass" scoped>
</style>