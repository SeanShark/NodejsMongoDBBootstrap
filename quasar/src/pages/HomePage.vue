<template>
  <q-page class="bg-grey-3">
    <p class="text-h6 text-center q-pa-md">备忘录</p>
    <div class="column q-pa-sm q-ma-none">
      <q-input
        bg-color="white"
        class="col q-pa-none"
        bottom-slots
        v-model="todoData.todo"
        outlined
        standout
        placeholder="请输入您的内容"
        @keyup.enter="createTodo"
      >
        <template v-slot:append>
          <q-btn round dense flat icon="add" @click.stop="createTodo" />
        </template>
      </q-input>
      <div class="col q-pa-sm">
        <div class="q-gutter-sm row justify-center">
          <q-radio
            v-for="(color, index) in colorPanel"
            v-bind:item="color"
            v-bind:index="index"
            v-bind:key="index"
            keep-color
            v-model="todoData.color"
            :val="color.value"
            :color="color.color"
            :label="color.label"
          />
        </div>
      </div>
    </div>
    <div class="q-gutter-y-md q-pa-sm">
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
          <q-tab name="todo" label="任务" />
          <q-tab name="done" label="已完成" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="todo" style="min-height: 150px">
            <q-list separator bordered>
              <q-item
                v-for="(list, index) in store.todolistsNotyet"
                v-bind:item="list"
                v-bind:index="index"
                v-bind:key="list._id"
                @dblclick="editTask(list)"
                v-ripple
                clickable
              >
                <q-item-section avatar>
                  <q-checkbox
                    v-model="list.isDone"
                    name="isDone"
                    color="primary"
                    @click.stop="handleClick('isDone', list._id, list.isDone)"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    <div :class="list.color" class="text-subtitle1">
                      {{ list.todo }}
                    </div>
                    <div class="text-subtitle2 text-italic">
                      {{ list.createdAt }}
                    </div>
                  </q-item-label>
                </q-item-section>

                <q-btn-dropdown
                  @click.stop
                  color="primary"
                  dropdown-icon="fa-solid fa-bars"
                  size="xs"
                  no-icon-animation
                >
                  <q-list>
                    <q-item clickable v-close-popup @click="editTask(list)">
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
                      @click="confirmDel(list._id)"
                    >
                      <q-item-section avatar>
                        <q-icon name="delete" color="red" size="sm" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>删除</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-separator />

                    <q-item clickable v-close-popup @click="colorDialog(list)">
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
            <div
              v-if="!store.todolistsNotyet.length"
              class="no-tasks absolute-center"
            >
              <q-icon name="check" size="50px" color="primary" />
              <div class="text-h5 text-primary text-center">无任务</div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="done" style="min-height: 150px">
            <q-list separator bordered>
              <q-item
                v-for="(list, index) in store.todolistsDone"
                v-bind:item="list"
                v-bind:index="index"
                v-bind:key="list._id"
                @dblclick="editTask(list)"
                v-ripple
                clickable
              >
                <q-item-section avatar>
                  <q-checkbox
                    v-model="list.isDone"
                    color="primary"
                    @click.stop="handleClick('isDone', list._id, list.isDone)"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    <div :class="list.color">{{ list.todo }}</div>
                  </q-item-label>
                </q-item-section>

                <q-btn-dropdown
                  @click.stop
                  color="primary"
                  dropdown-icon="fa-solid fa-bars"
                  size="xs"
                  no-icon-animation
                >
                  <q-list>
                    <q-item clickable v-close-popup @click="editTask(list)">
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
                      @click="confirmDel(list._id)"
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
                      @click="colorDialog(list)"
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
            <div
              v-if="!store.todolistsDone.length"
              class="no-tasks absolute-center"
            >
              <q-icon name="check" size="50px" color="primary" />
              <div class="text-h5 text-primary text-center">无任务</div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref, reactive } from "vue";
import { useUserStore } from "../stores/store";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { date } from "quasar";

const router = useRouter();
const store = useUserStore();

onMounted(async () => {
  let token = localStorage.getItem("token");

  if (token !== null) {
    try {
      await store.verifyUser();
      if (!store.user) {
        router.push("/index");
      } else {
        store.getTodolistsNotyet();
        store.getTodolistsDone();
      }
    } catch (err) {
      router.push("/index");
    }
  } else {
    router.push("/index");
  }
});

const tab = ref("todo");
const todoData = reactive({
  owner: "",
  todo: "",
  color: "text-black",
  createdAt: "",
});

const createTodo = () => {
  if (todoData.todo === "") {
    return failureTip("内容不能为空");
  }
  todoData.owner = store.user.email;
  todoData.createdAt = date.formatDate(Date.now(), "YYYY-MM-DD-HH:mm:ss");
  store
    .createTodo(todoData)
    .then(() => {
      todoData.todo = "";
      todoData.color = "text-black";
      successTip(store.systemMsg);
    })
    .catch(() => {
      failureTip(store.systemMsg);
    });
};

const handleClick = (field, id, value) => {
  setTimeout(() => {
    store
      .editTodo(field, id, value)
      .then(() => {
        successTip(store.systemMsg);
        store.getTodolistsNotyet();
        store.getTodolistsDone();
      })
      .catch(() => {
        failureTip(store.systemMsg);
      });
  }, 300);
};

const colorPanel = [
        { label: "黑色", value: "text-black", color: "black" },
        { label: "蓝色", value: "text-primary", color: "primary" },
        { label: "紫色", value: "text-accent", color: "accent" },
        { label: "红色", value: "text-negative", color: "negative" },
        { label: "绿色", value: "text-positive", color: "positive" },
        { label: "黄色", value: "text-warning", color: "warning" },
        { label: "靛蓝色", value: "text-indigo", color: "indigo" },
      ];

const $q = useQuasar();

const successTip = (msg) => {
  $q.notify({
    type: "positive",
    progress: true,
    message: `${msg}`,
  });
};

const failureTip = (msg) => {
  $q.notify({
    type: "negative",
    progress: true,
    message: `${msg}`,
  });
};

const confirmDel = (id) => {
  $q.dialog({
    title: "确定",
    message: `确定要删除记录?`,
    cancel: true,
    persistent: true,
    ok: {
      push: true,
      label: "确定",
      color: "blue-7",
    },
    cancel: {
      push: true,
      color: "grey-5",
      label: "取消",
    },
  })
    .onOk(async () => {
      await store
        .deleteTodo(id)
        .then(() => {
          successTip(store.systemMsg);
        })
        .catch((err) => {
          failureTip(store.systemMsg);
        });
    })
    .onCancel(() => {});
};

const editTask = (list) => {
  $q.dialog({
    title: "编辑内容",
    message: "请输入需要编辑的内容",
    prompt: {
      model: `${list.todo}`,
      type: "text", // optional
    },
    cancel: true,
    persistent: true,
    ok: {
      push: true,
      label: "确定",
      color: "blue-7",
    },
    cancel: {
      push: true,
      color: "grey-5",
      label: "取消",
    },
  })
    .onOk((data) => {
      store
        .editTodo("todo", list._id, data)
        .then(() => {
          successTip(store.systemMsg);
        })
        .catch(() => {
          failureTip(store.systemMsg);
        });
    })
    .onCancel(() => {});
};

const colorDialog = (list) => {
  $q.dialog({
    title: "选择颜色",
    message: "选择你需要改变的颜色",
    options: {
      type: "radio",
      model: `${list.color}`,
      // isValid: (val) => val === "primary",
      inline: true,
      items: colorPanel,
    },
    cancel: true,
    persistent: true,
    ok: {
      push: true,
      label: "确定",
      color: "blue-7",
      
    },
    cancel: {
      push: true,
      color: "grey-5",
      label: "取消",
    },
  }).onOk((color) => {
    store.editTodo('color', list._id, color)
      .then(() => {
        successTip(store.systemMsg);
      })
      .catch((err) => {
        failureTip(store.systemMsg);
      })
  });
};
</script>

<style lang="scss">
.no-tasks {
  opacity: 0.5;
}
</style>
