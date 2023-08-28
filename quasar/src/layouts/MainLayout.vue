<template>
  <div >
    
      <q-layout view="hHh Lpr lFf">
        <q-header v-if="store.user">
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

            <q-btn round flat icon="logout" @click="confirmLogout" />
          </q-toolbar>
        </q-header>

        <q-header v-else>
          <q-toolbar>
            <q-btn flat round dense icon="home" class="q-mr-sm" to="/index" />

            <q-toolbar-title class="text-center">{{
              route.name
            }}</q-toolbar-title>
          </q-toolbar>
        </q-header>

        <q-drawer
          v-if="store.user"
          v-model="leftDrawerOpen"
          :width="store.isMobile? 250 : 320"
          show-if-above
          bordered
          class="shadow-3"
        >
          <q-icon
            class="q-pa-md"
            name="fa-sharp fa-solid fa-dove"
            size="md"
            color="primary"
          />
          <q-list>
            <q-item v-ripple to="/" clickable exact>
              <q-item-section avatar>
                <q-icon name="home" size="sm" color="primary" />
              </q-item-section>

              <q-item-section class="text-weight-bold">首页</q-item-section>
            </q-item>

            <q-item v-ripple clickable to="/query" exact>
              <q-item-section avatar>
                <q-icon name="fa-solid fa-search" size="xs" color="primary" />
              </q-item-section>

              <q-item-section class="text-weight-bold">查询</q-item-section>
            </q-item>
            <q-item v-ripple clickable to="/logger" exact>
              <q-item-section avatar>
                <q-icon name="edit_note" size="xs" color="primary" />
              </q-item-section>

              <q-item-section class="text-weight-bold">日志</q-item-section>
            </q-item>

            <q-item v-ripple to="/setting" clickable exact>
              <q-item-section avatar>
                <q-icon name="fa-solid fa-gear" size="xs" color="primary" />
              </q-item-section>

              <q-item-section class="text-weight-bold">设置</q-item-section>
            </q-item>
          </q-list>
        </q-drawer>

        <q-page-container style="overflow-y: auto">
          <router-view />
        </q-page-container>
      </q-layout>
    
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "../stores/store";

const store = useUserStore();

const route = useRoute();
const router = useRouter();

const confirmLogout = () => {
  store.$q.dialog({
    title: "确定",
    message: `确定要退出当前账号吗?`,
    cancel: true,
    persistent: true,
    ok: {
      push: true,
      label: "确定",
      color: "green",
    },
    cancel: {
      push: true,
      color: "blue-grey",
      label: "取消",
    },
  })
    .onOk(async () => {
      store.logout();
      router.push("/index");
      await store.verifyUser();
    })
    .onCancel(() => {});
};

onMounted(async () => {
  await store.verifyUser();
});

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
