<template>
  <div>
  <div class="container" v-if="store.user">
    <Teleport to="body">
      <div class="toast-container position-fixed bottom-0 start-50 translate-middle-x p-3 ">
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
            <div class="toast-body">Hello, world! This is a toast message.</div>
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

    <h1 class="text-center pb-3">Latest Posts</h1>


    <div class="create-post">
      <div
        class="input-group mb-3"
        aria-label="Please enter..."
        aria-describedby="button-addon2"
      >
        <input
          type="text"
          v-model="store.postText"
          class="form-control"
          @keyup.enter="handleClick()"
          id="create-post"
          placeholder="Create New Post here..."
        />
        <button
          v-on:click="handleClick()"
          class="btn btn-outline-secondary"
          type="button"
          id="button-addon2"
        >
          Post!
        </button>
      </div>
    </div>
    <hr />

    <Message />
    <div
      class="bd-callout row align-items-middle"
      v-for="(post, index) in store.posts"
      v-bind:item="post"
      v-bind:index="index"
      v-bind:key="post._id"
    >
      <div v-on:dblclick="showModal(post)" class="text col-10">
        <p class="fs-5 px-3">{{ post.post }}</p>
        <p class="fst-italic px-3">
          {{
            `${new Date(post.createdAt).getFullYear()} -
            ${new Date(post.createdAt).getMonth() + 1} -
            ${new Date(post.createdAt).getDate()}   
            ${new Date(post.createdAt).getHours()}:
            ${new Date(post.createdAt).getMinutes()}:
            ${new Date(post.createdAt).getSeconds()}`
          }}
        </p>
      </div>
      <div class="delBtn col-2">
        <button
          type="button"
          class="btn-close position-relative top-50 start-50 translate-middle"
          @dblclick="handleDelete(post._id)"
        ></button>
      </div>
    </div>
    <Modal title="编辑内容" ref="thisModal" :data="postData">
      <template #body></template>
      <template #footer></template>
    </Modal>
    <Toast ref="thisToast"/>
  </div>
  <div v-else>
    Please login first.
  </div>
</div>
</template>

<script setup>
import { onMounted, ref, reactive } from "vue";
import Toast from "./Toast.vue";
import { useTodosStore } from "../stores/todos";
import Message from "./Message.vue";
import Modal from "./ModalView.vue";


const postData = reactive({
  _id: "",
  post: "",
});

const store = useTodosStore();

/*
  Modal
*/
let thisModal = ref();
const showModal = (post) => {
  postData._id = post._id;
  postData.post = post.post;
  thisModal.value.show();
};

/*
  Toast
*/

let thisToast = ref();
const showToast = () => {
  thisToast.value.show();
}

onMounted(async () => {
  let token = localStorage.getItem('token');
  if (token !== null) {
    await store.verifyUser();
  }
  
  await store.fetchPosts();
});

const handleClick = async () => {
  store.resetAlert();

  await store.createPost();
  if (store.postStatus) {
    store.resetAlert();
    showToast();
    store.postStatus = false;
  }
};

const handleDelete = async (id) => {
  await store.deletePost(id);
  if(store.postStatus) {
    showToast();
    store.postStatus = false;
  }
};
</script>

<style scoped>
.bd-callout {
  --bs-link-color-rgb: var(--bd-callout-link);
  --bs-code-color: var(--bd-callout-code-color);
  padding: 0.25rem;
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
  color: var(--bd-callout-color, inherit);
  background-color: var(--bd-callout-bg, var(--bs-gray-100));
  border-left: 0.25rem solid var(--bd-callout-border, var(--bs-gray-300));
}

.bd-callout-info {
  --bd-callout-color: var(--bs-info-text-emphasis);
  --bd-callout-bg: var(--bs-info-bg-subtle);
  --bd-callout-border: var(--bs-info-border-subtle);
}

.bd-callout-warning {
  --bd-callout-color: var(--bs-warning-text-emphasis);
  --bd-callout-bg: var(--bs-warning-bg-subtle);
  --bd-callout-border: var(--bs-warning-border-subtle);
}

.bd-callout-danger {
  --bd-callout-color: var(--bs-danger-text-emphasis);
  --bd-callout-bg: var(--bs-danger-bg-subtle);
  --bd-callout-border: var(--bs-danger-border-subtle);
}
</style>
