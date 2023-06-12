<template>
  <div class="row">
    <q-card
      class="shadow-13 fixed-center q-pa-lg col-xs-12 col-md-6"
      style="max-width: 550px"
    >
      <div class="q-gutter-y-sm">
        <div class="text-h6 q-pb-md text-center">忘 记 密 码</div>
        <q-separator />
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
          v-model="forgotCode"
          type="text"
          label="重置码"
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
        <div class="q-my-md row justify-end">

          <q-btn flat color="primary" label="返回登录页" to="/index" />
        </div>

        <div class="q-py-md">
          <q-btn color="indigo-7" class="full-width" label="提 交" icon-right="search" />
        </div>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from "vue";

const email = ref("");
const forgotCode = ref("");
const password = ref("");
const isPwd = ref(true);

const repeat_password = ref("");
</script>

<style lang="sass" scoped>
</style>