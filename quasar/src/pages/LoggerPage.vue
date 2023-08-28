<template>
  <q-page  class="q-pa-sm column" >
    <h5 class="q-mt-none q-mb-md text-center">日 志</h5>
    <div class="row q-pa-xs">
      <div class="col-12">
        <div class="column items-center">
          <q-date
            v-model="selectedDate"
            class="item-center"
            :landscape="store.$q.screen.gt.md"
            :events="events"
            years-in-month-view
            today-btn
          >
          </q-date>
        </div>
      </div>
      <div class="col-12">

        <q-input
          v-model="loggerData.logger"
          outlined
          type="textarea"
          autogrow
          class="q-py-md"
          placeholder="记录点事情吧..."
          @focus="inputLight = 'orange'"
          @blur="inputLight = 'grey'"
        >
          <template #prepend>
            <q-icon name="tips_and_updates" :color="inputLight" />
          </template>
          <template #append>
            <q-btn
              round
              dense
              flat
              icon="send"
              color="primary"
              @click="addLogger"
            />
          </template>
        </q-input>
        <div v-if="!isEmtpy" class="no-tasks text-center" style="height: 100%;">
          <q-icon name="psychology_alt" size="150px" color="primary" />
        </div>
        <q-tab-panels
          v-model="selectedDate"
          animated
          transition-prev="jump-up"
          transition-next="jump-up"
        >
          <q-tab-panel
            v-for="(list, index) in loggerLists"
            :key="list._id"
            :item="list"
            :index="index"
            :name="list.date"
            class="q-pa-none"
          >
            <form
              autocorrect="off"
              autocapitalize="off"
              autocomplete="off"
              spellcheck="false"
            >
              <div class="row justify-end q-pa-md q-gutter-x-sm">
                <div class="text-h5">{{ list.date }}</div>
                <q-space />
                <q-btn
                  v-if="visible"
                  label="修 改"
                  class="q-px-md"
                  color="primary"
                  :disable="isDisable"
                  @click="editLogger(list._id, list.logger, index)"
                ></q-btn>
                <q-btn
                  v-if="visible"
                  label="取 消"
                  class="q-px-md"
                  color="grey"
                  @click="onCancel(index)"
                ></q-btn>
              </div>

              <q-editor
                v-model="list.logger"
                :dense="$q.screen.lt.md"
                :toolbar="[
                  ['fullscreen'],
                  ['viewsource'],
                  [
                    {
                      label: '功能',
                      size: 'lg',
                      icon: 'filter_2',
                      fixedLabel: true,
                      list: 'only-icons',
                      options: [
                        'bold',
                        'italic',
                        'strike',
                        'underline',
                        'unordered',
                        'ordered',
                        'print',
                        'hr',
                        'link',
                      ],
                    },
                  ],
                  [
                    {
                      label: '字体大小',
                      icon: $q.iconSet.editor.fontSize,
                      fixedLabel: true,
                      size: 'md',
                      fixedIcon: true,
                      list: 'no-icons',
                      options: [
                        'size-1',
                        'size-2',
                        'size-3',
                        'size-4',
                        'size-5',
                        'size-6',
                        'size-7',
                      ],
                    },
                    'removeFormat',
                  ],
                ]"
                :fonts="{
                  arial: 'Arial',
                  arial_black: 'Arial Black',
                  comic_sans: 'Comic Sans MS',
                  courier_new: 'Courier New',
                  impact: 'Impact',
                  lucida_grande: 'Lucida Grande',
                  times_new_roman: 'Times New Roman',
                  verdana: 'Verdana',
                }"
                @input="onEditorInput(index)"
              >
              </q-editor>
            </form>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, reactive, computed, watch } from "vue";
import { useUserStore } from "../stores/store";

const store = useUserStore();

const inputLight = ref("grey");
const selectedDate = ref(store.todayDate);
const loggerLists = ref([]);
const events = ref([]);
const visible = ref(false);
const isEmtpy = ref(false);
const initialLoggerContent = ref([]);
const isDisable = ref(false);
const loggerData = reactive({
        _id: "",
        date: "",
        user: "",
        logger: "",
      });

watch(() => selectedDate.value, (newValue) => {
  for (const date of events.value) {
    if (newValue === date) {
      isEmtpy.value = true;
      break;
    } else {
      isEmtpy.value = false;
    }
  }
})


const getLoggerList = async () => {
  await store.axios
    .get("/query/logger", {
      params: {
        user: store.user.email,
        date: store.todayDate,
      },
    })
    .then((res) => {
      loggerLists.value = res.data;
      initialLoggerContent.value = loggerLists.value.map((list) => list.logger);
      // console.log(res.data);
      events.value = loggerLists.value.map((item) => item.date);
    })
    .catch((err) => {
      console.log(err.response.data);
    });
};

const onEditorInput = (index) => {
  const currentLoggerContent = loggerLists.value[index].logger;
  const initialContent = initialLoggerContent.value[index];
  if (currentLoggerContent !== initialContent) {
    visible.value = true;
  } else {
    visible.value = false;
  }
};

const onCancel = (index) => {
  loggerLists.value[index].logger = initialLoggerContent.value[index];
  visible.value = false;
};

const addLogger = async () => {
  if (loggerData.logger.length > 0) {
    loggerData.date = selectedDate.value;
    loggerData.user = store.user.email;

    await store.axios
      .post("/query/addlogger", loggerData)
      .then((res) => {
        loggerData._id = res.data.id;
        loggerData.logger = res.data.logger ? res.data.logger + "<ul><li>" + loggerData.logger + "</li></ul>" : "<ul><li>" + loggerData.logger + "</li></ul>"
        loggerLists.value.unshift(JSON.parse(JSON.stringify(loggerData)));
        initialLoggerContent.value = loggerLists.value.map((list) => list.logger);
        // console.log(res.data);
        events.value = loggerLists.value.map((item) => item.date);
        store.successTip(res.data.msg);
        isEmtpy.value = true;
      })
      .catch((err) => {
        console.log(err.response.data);
      })
      .finally(() => {
        loggerData.date = "";
        loggerData.logger = "";
        loggerData._id = "";
      });
  } 
};

const editLogger = async (id, log, index) => {
  if (log === '<br><ul><li>' || log === '<div><br></div>' || log.length === 0) {
    confirmDel(id, index);
  }
  else {
    loggerData.id = id,
    loggerData.user = store.user.email,
    loggerData.logger = log,
    
    await store.axios
      .post("/query/editlogger", loggerData)
      .then((res) => {
        loggerLists.value[index].logger = log;
        initialLoggerContent.value[index] = log;
        store.successTip(res.data.msg);
      })
      .catch((err) => {
        store.failureTip(err.response.data.msg);
      })
      .finally(() => {
        loggerData.date = "";
        loggerData.logger = "";
        loggerData._id = "";
        visible.value = false;
      });
  }
};


const confirmDel = (id, index) => {
  store.$q.dialog({
    title: "确定",
    message: `确定要删除记录?`,
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
      await store.axios.delete("/query/deletelogger", {
          params: { 
            id: id,
            user: store.user.email,
          },
        })
        .then((res) => {
          loggerLists.value.splice(index, 1);
          initialLoggerContent.value = loggerLists.value.map((list) => list.logger);
          events.value = loggerLists.value.map((item) => item.date);
          store.successTip(res.data.msg);
          visible.value = false;
          isEmtpy.value = false;
        })
        .catch((err) => {
          store.failureTip(err.response.data.msg);
        });
    })
    .onCancel(() => {

    });
};

onMounted(async () => {
  let token = localStorage.getItem("token");

  if (token !== null) {
    try {
      await store
        .verifyUser()
        .then(() => {
          getLoggerList();
        })
        .catch(() => {
          router.push("/index");
        });
    } catch (err) {
      router.push("/index");
    }
  } else {
    router.push("/index");
  }
  isEmtpy.value = true;
});
</script>

<style lang="scss">

.no-tasks {
  opacity: 0.3;
}
</style>

