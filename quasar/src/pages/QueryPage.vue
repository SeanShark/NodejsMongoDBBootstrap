<template>
  <q-page class="column q-pa-sm bg-grey-3">
    <div class="text-center text-h5 q-pa-md">信息查询</div>
    <div class="row justify-end">
      <q-toggle v-model="visible" label="显示搜索框" class="q-mb-md" />
    </div>
    <q-slide-transition>
      <div v-show="visible">
        <div class="row">
          <div class="col-12 col-sm-6 col-md-3 q-pa-xs">
            <q-select
              v-model="searchData.place"
              label="地点"
              transition-show="jump-up"
              transition-hide="jump-up"
              outlined
              :options="places"
            >
              <template #prepend>
                <q-icon 
                  name="place" 
                  color="accent"
                  @click.stop.prevent 
                />
              </template>
            </q-select>
          </div>

          <div class="col-12 col-sm-6 col-md-3 q-pa-xs">
            <q-select
              v-model="searchData.type"
              label="类型"
              transition-show="jump-up"
              transition-hide="jump-up"
              outlined
              :options="typeOptions"
            >
              <template #prepend>
                <q-icon
                  name="find_in_page"
                  color="primary"
                  @click.stop.prevent
                />
              </template>
            </q-select>
          </div>

          <div class="col-12 col-sm-6 col-md-3 q-pa-xs">
            <q-select
              v-model="searchData.field"
              label="字段"
              transition-show="jump-up"
              transition-hide="jump-up"
              outlined
              :options="field"
              :disable="fieldstate"
            >
              <template #prepend>
                <q-icon name="add_card" color="primary" @click.stop.prevent  />
              </template>
            </q-select>
          </div>
          <div class="col-12 col-sm-6 col-md-3 q-pa-xs">
            <q-input v-model="searchData.keyword"  outlined label="关键字">
              <template #prepend>
                <q-icon name="key" @click.stop.prevent />
              </template>
            </q-input>
          </div>
        </div>
        <div class="row justify-end q-pa-xs">
          <q-btn
            color="primary"
            label="提 交"
            class="glossy col-12 col-sm-3 q-mt-xs on-right"
            icon-right="send"
            @click="handleSeach"
          />
        </div>
      </div>
    </q-slide-transition>
    <q-table
        class="q-table-responsive"
        virtual-scroll
        flat
        bordered
        title="Treats"
        :rows="rows"
        :columns="columns"
        row-key="name"
        binary-state-sort
      >
        <template #body="props">
          <q-tr :props="props">
            <q-td key="name" :props="props">
              {{ props.row.name }}
              <q-popup-edit v-model="props.row.name" v-slot="scope">
                <q-input
                  v-model="scope.value"
                  dense
                  autofocus
                  counter
                  @keyup.enter="scope.set"
                />
              </q-popup-edit>
            </q-td>
            <q-td key="calories" :props="props">
              {{ props.row.calories }}
              <q-popup-edit
                v-model="props.row.calories"
                title="Update calories"
                buttons
                v-slot="scope"
              >
                <q-input type="number" v-model="scope.value" dense autofocus />
              </q-popup-edit>
            </q-td>
            <q-td key="fat" :props="props">
              <div class="text-pre-wrap">{{ props.row.fat }}</div>
              <q-popup-edit v-model="props.row.fat" v-slot="scope">
                <q-input
                  type="textarea"
                  v-model="scope.value"
                  dense
                  autofocus
                />
              </q-popup-edit>
            </q-td>
            <q-td key="carbs" :props="props">
              {{ props.row.carbs }}
              <q-popup-edit
                v-model="props.row.carbs"
                title="Update carbs"
                buttons
                persistent
                v-slot="scope"
              >
                <q-input
                  type="number"
                  v-model="scope.value"
                  dense
                  autofocus
                  hint="Use buttons to close"
                />
              </q-popup-edit>
            </q-td>
            <q-td key="protein" :props="props">{{ props.row.protein }}</q-td>
            <q-td key="sodium" :props="props">{{ props.row.sodium }}</q-td>
            <q-td key="calcium" :props="props">{{ props.row.calcium }}</q-td>
            <q-td key="iron" :props="props">{{ props.row.iron }}</q-td>
          </q-tr>
        </template>
      </q-table>
  </q-page>
</template>

<script setup>
import { ref, reactive, watch, computed } from "vue";
import { useQuasar } from "quasar";

const $q = useQuasar();
const fieldstate = ref(true);
const visible = ref(true);

const searchData = reactive({
  place: "-请选择-",
  type: "-请选择-",
  field: "-请选择-",
  keyword: "",
});

const places = ["禾花", "鹅公岭", "新南", "白坭坑", "慧明"];

const typeOptions = ["终端", "耗材", "电话", "机房", "监控"];

let field = [];

watch(
  () => searchData.type,
  (newValue) => {
    if (newValue === "-请选择-") {
      fieldstate.value = true;
    } else if (newValue === "终端") {
      fieldstate.value = false;
      field = ["全部", "姓名", "IP", "MAC", "办公室", "备注"];
      searchData.field = "全部";
    } else if (newValue === "耗材") {
      fieldstate.value = false;
      field = ["机器型号", "硒鼓型号", "办公室", "备注"];
      searchData.field = "机器型号";
    } else if (newValue === "电话") {
      fieldstate.value = false;
      field = ["号码", "面板号", "楼层线路", "办公室", "备注"];
      searchData.field = "号码";
    } else if (newValue === "机房") {
      fieldstate.value = false;
      field = ["全部", "IP", "类型", "备注"];
      searchData.field = "全部";
    } else if (newValue === "监控") {
      fieldstate.value = false;
      field = ["全部", "主机", "摄像头", "备注"];
      searchData.field = "全部";
    }
  }
);

const handleSeach = () => {
  if (searchData.place === "-请选择-" || searchData.type === "-请选择-") {
    return failureTip("请选择必要搜索项");
  }

  if (searchData.type === "终端") {
    if (searchData.field === "全部") {
      if (searchData.keyword) {
        console.log("终端", searchData.keyword);
      } else {
        console.log("终端");
      }
      return;
    } else if (searchData.keyword === "") {
      return failureTip(`请输入搜索${searchData.field}的关键字`);
    } else {
      console.log("终端", "所属", searchData.field, searchData.keyword);
      return;
    }
  }

  if (searchData.type === "耗材") {
    if (searchData.keyword === "") {
      return failureTip(`请输入搜索${searchData.field}的关键字`);
    }
    console.log("耗材", "所属", searchData.field, searchData.keyword);
    return;
  }

  if (searchData.type === "电话") {
    if (searchData.keyword === "") {
      return failureTip(`请输入搜索${searchData.field}的关键字`);
    }
    console.log("电话", "所属", searchData.field, searchData.keyword);
    return;
  }

  if (searchData.type === "机房") {
    if (searchData.field === "全部") {
      if (searchData.keyword) {
        console.log("机房", searchData.keyword);
      } else {
        console.log("机房");
      }
      return;
    } else if (searchData.keyword === "") {
      return failureTip(`请输入搜索${searchData.field}的关键字`);
    } else {
      console.log("机房", "所属", searchData.field, searchData.keyword);
      return;
    }
  }

  if (searchData.type === "监控") {
    if (searchData.field === "全部") {
      if (searchData.keyword) {
        console.log("监控", searchData.keyword);
      } else {
        console.log("监控");
      }
      return;
    } else if (searchData.keyword === "") {
      return failureTip(`请输入搜索${searchData.field}的关键字`);
    } else {
      console.log("监控", "所属", searchData.field, searchData.keyword);
      return;
    }
  }
};

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

const columns = [
  {
    name: "name",
    required: true,
    label: "Dessert (100g serving)",
    align: "left",
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "calories",
    align: "center",
    label: "Calories",
    field: "calories",
    sortable: true,
  },
  {
    name: "fat",
    label: "Fat (g)",
    field: "fat",
    sortable: true,
    style: "width: 10px",
  },
  { name: "carbs", label: "Carbs (g)", field: "carbs" },
  { name: "protein", label: "Protein (g)", field: "protein" },
  { name: "sodium", label: "Sodium (mg)", field: "sodium" },
  {
    name: "calcium",
    label: "Calcium (%)",
    field: "calcium",
    sortable: true,
    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
  },
  {
    name: "iron",
    label: "Iron (%)",
    field: "iron",
    sortable: true,
    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
  },
];

const rows = ref([
  {
    name: "Frozen Yogurt",
    calories: 159,
    fat: 6.0,
    carbs: 24,
    protein: 4.0,
    sodium: 87,
    calcium: "14%",
    iron: "1%",
  },
  {
    name: "Ice cream sandwich",
    calories: 237,
    fat: 9.0,
    carbs: 37,
    protein: 4.3,
    sodium: 129,
    calcium: "8%",
    iron: "1%",
  },
  {
    name: "Eclair",
    calories: 262,
    fat: 16.0,
    carbs: 23,
    protein: 6.0,
    sodium: 337,
    calcium: "6%",
    iron: "7%",
  },
  {
    name: "Cupcake",
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    sodium: 413,
    calcium: "3%",
    iron: "8%",
  },
  {
    name: "Gingerbread",
    calories: 356,
    fat: 16.0,
    carbs: 49,
    protein: 3.9,
    sodium: 327,
    calcium: "7%",
    iron: "16%",
  },
  {
    name: "Jelly bean",
    calories: 375,
    fat: 0.0,
    carbs: 94,
    protein: 0.0,
    sodium: 50,
    calcium: "0%",
    iron: "0%",
  },
  {
    name: "Lollipop",
    calories: 392,
    fat: 0.2,
    carbs: 98,
    protein: 0,
    sodium: 38,
    calcium: "0%",
    iron: "2%",
  },
  {
    name: "Honeycomb",
    calories: 408,
    fat: 3.2,
    carbs: 87,
    protein: 6.5,
    sodium: 562,
    calcium: "0%",
    iron: "45%",
  },
  {
    name: "Donut",
    calories: 452,
    fat: 25.0,
    carbs: 51,
    protein: 4.9,
    sodium: 326,
    calcium: "2%",
    iron: "22%",
  },
  {
    name: "KitKat",
    calories: 518,
    fat: 26.0,
    carbs: 65,
    protein: 7,
    sodium: 54,
    calcium: "12%",
    iron: "6%",
  },
]);
</script>

<style scoped>
.no-tasks {
  opacity: 0.2;
}

.q-table-responsive {
  width: 100%;
  overflow-x: auto;
}
</style>
