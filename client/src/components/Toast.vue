<template>
  <div>
  <Teleport to="body">
    <div
      class="toast-container position-fixed bottom-0 start-50 translate-middle-x p-3"
    >
      <div
        id="liveToast"
        class="toast text-bg-info"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        ref="toastEle"
        data-bs-delay="1000"
      >
        <div class="d-flex">
          <div class="toast-body">{{ store.toastMessage }}</div>
          <button
            type="button"
            class="btn-close btn-close-white me-2 m-auto"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
      </div>
    </div>
  </Teleport>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Toast } from "bootstrap";
import { useTodosStore } from "../stores/todos";
const store = useTodosStore();

let toastEle = ref();
let thisToastObj = "";

const _showToast = () => {
  thisToastObj.show();
};

onMounted(async () => {
  thisToastObj = new Toast(toastEle.value);
});
defineExpose({ show: _showToast });

</script>

<style></style>;
