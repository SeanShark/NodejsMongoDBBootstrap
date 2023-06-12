<template>
  <q-page>
    <p class="text-h6 text-center q-pa-md">备忘录</p>
    <div class="q-gutter-y-md">
      <q-card>
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="mails" label="任务" />
          <q-tab name="alarms" label="已完成" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="mails">
            <div class="text-h6">To-Do</div>

            <q-list separator bordered>
              <q-item
                v-for="(task, index) in tasks"
                :key="index"
                @dblclick="editTask(task.id)"
                v-ripple
                clickable
              >
                <q-item-section avatar>
                  <q-checkbox
                    v-model="task.done"
                    color="primary"
                    @click.stop="handleClick(index)"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ task.title }}</q-item-label>
                </q-item-section>

                <q-btn-dropdown
                  @click.stop
                  color="primary"
                  dropdown-icon="fa-solid fa-bars"
                  size="xs"
                  no-icon-animation
                >
                  <q-list>
                    <q-item clickable v-close-popup @click="editTask(task)">
                      <q-item-section avatar>
                        <q-icon name="edit_note" color="primary" size="sm" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>编辑</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-separator />

                    <q-item
                      clickable
                      v-close-popup
                      @click="confirmDel(task.id)"
                    >
                      <q-item-section avatar>
                        <q-icon name="delete" color="red" size="sm" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>删除</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-separator />

                    <q-item
                      clickable
                      v-close-popup
                      @click="changeColor(task.id)"
                    >
                      <q-item-section avatar>
                        <q-icon name="color_lens" color="teal" size="sm" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>颜色</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
              </q-item>
            </q-list>
          </q-tab-panel>

          <q-tab-panel name="alarms">
            <div class="text-h6">Alarms</div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useUserStore } from "../stores/store"
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";


const router = useRouter()
const store = useUserStore();

onMounted(async () => {
  let token = localStorage.getItem('token');
  if (token !== null) {
    await store.verifyUser()
    .then(() => {
      if(!store.user) {
        router.push("/index");
      }
    })
  } else {
    router.push("/index");
  }
})

const tab = ref("mails");
const tasks = ref([
  {
    id: 1,
    title: "Task 1",
    done: false,
  },
  {
    id: 2,
    title: "Task 2",
    done: true,
  },
  {
    id: 3,
    title: "Task 3",
    done: false,
  },
]);

const handleClick = (index) => {
  console.log("task.done = true.");
};

const changeColor = (id) => {
  console.log("Color panel will open");
};

const $q = useQuasar();

const confirmDel = (id) => {
  $q.dialog({
    title: "Confirm",
    message: `Are you sure to delete ${id}?`,
    cancel: true,
    persistent: true,
  })
    .onOk(() => {
      console.log(">>>> OK");
    })
    .onCancel(() => {
      console.log(">>>> Cancel");
    });
};

const editTask = (task) => {
  $q.dialog({
    title: "编辑内容",
    message: "请输入需要编辑的内容",
    prompt: {
      model: `${task.title}`,
      type: "text", // optional
    },
    cancel: true,
    persistent: true,
  })
    .onOk((data) => {
      console.log(">>>> OK, received", data);
    })
    .onCancel(() => {
      console.log(">>>> Cancel");
    });
};
</script>

<style></style>
