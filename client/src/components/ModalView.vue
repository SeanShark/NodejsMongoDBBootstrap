<template>
  <Teleport to="body">
    <div
      class="modal fade"
      data-bs-backdrop="static"
      id="staticBackdrop"
      tabindex="-1"
      aria-labelledby=""
      aria-hidden="true"
      ref="modalEle"
    >
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">{{ title }}</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <slot name="body"></slot>

            <input
              type="text"
              class="form-control"
              id="ID"
              disabled
              readonly
              v-model="props.data._id"
              style="visibility: hidden"
            />

            <div class="mb-3 row">
              <label for="inputPassword" class="col-sm-2 col-form-label"
                >内容:
              </label>
              <div class="col-sm-10">
                <input
                  type="text"
                  class="form-control"
                  id="inputPassword"
                  v-model="props.data.post"
                />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <slot name="footer"></slot>
            <button class="btn btn-primary" @click="handleClick(props.data)" :disabled='store.isDisabled'>
              确定
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { Modal } from "bootstrap";
import { useTodosStore } from "../stores/todos";
const store = useTodosStore();

const props = defineProps({
  title: {
    type: String,
    default: "<<Title goes here>>",
  },
  data: {
    type: Object,
  },
});


const handleClick = (data) => {
  updatePost(data);
}

let modalEle = ref();
let thisModalObj = "";

onMounted(() => {
  thisModalObj = new Modal(modalEle.value);
});
const _show = () => {
  thisModalObj.show();
};

//console.log(props.data.post);

watch(() => props.data.post, (newValue, oldValue) => {
  if (newValue === '') {
    store.isDisabled = true
  } else {
    store.isDisabled = false
  }
})

const updatePost = async (data) => {
  await store
    .updatePost({
      _id: data._id,
      newpost: data.post,
    })
    .then((post) => {
      thisModalObj.hide();
    })
    .catch((err) => {
      console.log(err);
    });
};

defineExpose({ show: _show });
</script>
