<template>
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
      <q-toggle v-model="loginInfo.remember" class="left" label="记住我" />
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
</template>

<script setup>
import { ref, reactive } from "vue";

const isPwd = ref(true);

const loginInfo = reactive({
  email: "",
  password: "",
  remember: false,
});

</script>

<style>
</style>