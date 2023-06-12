<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated v-if="store.user">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          <span class="gt-sm"> {{ route.name }}</span>
          <q-icon
            class="q-pa-md lt-md icon-position"
            name="fas fa-dove"
            size="sm"
            color="white"
          />
        </q-toolbar-title>

        <div>{{ formattedString }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" :width="250" show-if-above bordered v-if="store.user">
      <q-icon
        class="q-pa-md"
        name="fa-sharp fa-solid fa-dove"
        size="md"
        color="primary"
      />
      <q-list>
        <q-item to="/" clickable v-ripple exact>
          <q-item-section avatar>
            <q-icon name="home" size="md" />
          </q-item-section>

          <q-item-section class="text-weight-bold">Home</q-item-section>
        </q-item>

        

        <q-item to="/setting" clickable v-ripple exact>
          <q-item-section avatar>
            <q-icon name="fa-solid fa-gear" size="md" />
          </q-item-section>

          <q-item-section class="text-weight-bold"
            >Setting</q-item-section
          >
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>


</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "../stores/store"

const route = useRoute();
const store = useUserStore();


import { date } from "quasar";

const timeStamp = Date.now();

const formattedString = ref("");
//formattedString.value = date.formatDate(timeStamp, 'YYYY-MM-DD-HH:mm:ss')
formattedString.value = date.formatDate(timeStamp, "YYYY-MM-DD");

const leftDrawerOpen = ref(false);
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
</script>

<style lang="sass" scoped>
.icon-position
  position: absolute
  bottom: 0
  left: 50%
  transform: translateX(-50%)
</style>
