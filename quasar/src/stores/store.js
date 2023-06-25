import { defineStore } from "pinia";
import axios from "axios";
import { store } from "quasar/wrappers";

export const useUserStore = defineStore("userinfo", {
  state: () => ({
    authUser: null,
    isDisabled: false,
    postStatus: false,
    counter: 100,
    todolistsDone: [],
    todolistsNotyet: [],
    systemMsg: "",
  }),
  getters: {
    user: (state) => state.authUser,
  },
  actions: {
    async getToken(data) {
      await axios
        .post("/user/login", data)
        .then((res) => {
          if (res.data.status === "success") {
            localStorage.setItem("token", res.data.token);
          }
        })
        .catch((err) => {

          //console.log(err.response.data.msg);
        });
    },
    async verifyUser() {
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("token");
        axios
          .get("/user/verifyuser", {
            headers: { token: token },
          })
          .then((res) => {
            this.authUser = res.data.user;
            resolve(); // Resolve the promise when user verification is complete
          })
          .catch((err) => {
            this.authUser = null;
            reject(err); // Reject the promise if an error occurs
          });
      });
    },
    logout () {
      localStorage.clear();
      store.authUser = null;
    },
    getTodolistsNotyet () {
      return new Promise(async (resolve, reject) => {
        await axios.post("/todo/gettodolistsnotyet", {
          owner: this.user.email
        })
        .then((res) => {
          this.todolistsNotyet = res.data
          resolve();
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        })
      })
    },
    getTodolistsDone () {
      return new Promise(async (resolve, reject) => {
        await axios.post("/todo/gettodolistsdone", {
          owner: this.user.email
        })
        .then((res) => {
          this.todolistsDone = res.data
          resolve();
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        })
      })
    },
    async createTodo (todoData) {
      return new Promise(async (resolve, reject) => {
        await axios.post("/todo/addtodo/", todoData)
        .then((res) => {
          this.systemMsg = res.data.msg;
          this.getTodolistsNotyet();
          resolve();
        })
        .catch((err) => {
          this.systemMsg = err.response.data.msg;
          reject(err);
        })
      })
    },
    editTodo (field, id, value) {
      return new Promise(async (resolve, reject) => {
        await axios.put("/todo/", {
          id: id,
          field: field,
          value: value,
        })
        .then((res) => {
          this.systemMsg = res.data.msg;
          this.getTodolistsNotyet();
          this.getTodolistsDone();
          resolve();
        })
        .catch((err) => {
          this.systemMsg = err.response.data.msg;
          console.log(err);
          reject(err);
        })
      })
    },
    deleteTodo (id) {
      return new Promise(async (resolve, reject) => {
        await axios.delete(`/todo/${id}`)
        .then((res) => {
          this.systemMsg = res.data.msg;
          this.getTodolistsDone();
          this.getTodolistsNotyet();
          resolve();
        })
        .catch((err) => {
          this.systemMsg = err.response.data.msg;
          reject(err);
        })
      })
    },
  },
});
