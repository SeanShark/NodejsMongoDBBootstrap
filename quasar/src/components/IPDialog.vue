<template>
  <q-dialog
    :model-value="modelValue"
    persistent
    :maximized="store.isMobile"
    v-bind="$attrs"
  >
    <q-card>
      <q-toolbar
        class="text-white"
        :class="store.isAdd ? 'bg-light-green' : 'bg-light-blue'"
      >
        <q-icon :name="store.isAdd ? 'add' : 'edit'" />
        <q-toolbar-title>{{
          store.isAdd ? "增加记录" : "编辑内容"
        }}</q-toolbar-title>
        <q-btn
          v-close-popup
          flat
          round
          dense
          icon="close"
          @click.stop="store.isAdd ? $emit('canceladd') : $emit('canceledit')"
        />
      </q-toolbar>
      <q-separator />

      <q-card-section>
        <div
          :class="store.isMobile ? 'q-gutter-sm' : 'q-gutter-md'"
          :style="store.isMobile ? 'width: 100%' : 'min-width: 500px;'"
        >
          <div class="row">
            <q-input
              v-model="store.searchData.type"
              class="col-6"
              flat
              lazy-rules="ondemand"
              hide-bottom-space
              readonly
            >
              <template #prepend>
                <q-icon name="title" />
              </template>
            </q-input>
            <q-input
              v-model="store.searchData.place"
              class="col-6"
              lazy-rules="ondemand"
              readonly
            >
              <template #prepend>
                <q-icon name="location_on" />
              </template>
            </q-input>
          </div>

          <q-input
            v-model="store.IPData.姓名"
            filled
            label="姓名："
            lazy-rules="ondemand"
            hide-bottom-space
            :error="store.ipFormState.nameError"
          >
            <template #prepend>
              <q-icon name="person" />
            </template>
            <template #error>
              {{ store.ipFormState.errorMsg }}
            </template>
          </q-input>

          <q-input
            v-model="store.IPData.IP"
            filled
            hide-bottom-space
            lazy-rules="ondemand"
            label="IP"
            :error="store.ipFormState.IPError"
          >
            <template #prepend>
              <q-icon name="lan" />
            </template>
            <template #error>
              {{ store.ipFormState.errorMsg }}
            </template>
          </q-input>

          <q-input
            v-model="store.IPData.MAC"
            filled
            label="MAC"
            lazy-rules="ondemand"
            hide-bottom-space
            :error="store.ipFormState.MACError"
          >
            <template #prepend>
              <q-icon name="drive_file_rename_outline" />
            </template>
            <template #error>
              {{ store.ipFormState.errorMsg }}
            </template>
          </q-input>

          <q-input
            v-model="store.IPData.办公室"
            filled
            label="办公室："
            hide-bottom-space
          >
            <template #prepend>
              <q-icon name="meeting_room" />
            </template>
          </q-input>
          <q-input
            v-model="store.IPData.备注"
            filled
            label="备注："
            hide-bottom-space
          >
            <template #prepend>
              <q-icon name="comment" />
            </template>
          </q-input>

          <div class="row q-gutter-sm justify-end q-mt-lg">
            <q-btn
              color="primary"
              icon="add"
              :class="store.isMobile ? 'col-12' : 'col-3'"
              :label="store.isAdd ? '增 加' : '编 辑'"
              :loading="store.addBtnLoading"
              @click="store.isAdd ? $emit('add') : $emit('edit')"
            />
            <q-btn
              v-close-popup
              icon="block"
              color="grey"
              label="取 消"
              :class="store.isMobile ? 'col-12' : 'col-3'"
              @click.stop="
                store.isAdd ? $emit('canceladd') : $emit('canceledit')
              "
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useUserStore } from "../stores/store";
const store = useUserStore();

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(["canceladd", "canceledit", "add", "edit"]);

</script>
