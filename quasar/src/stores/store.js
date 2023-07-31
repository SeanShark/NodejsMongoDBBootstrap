import { defineStore } from "pinia";
import axios from "axios";
import { store } from "quasar/wrappers";

export const useUserStore = defineStore("userinfo", {
  state: () => ({
    authUser: null,
    isDisabled: false,
    postStatus: false,
    todolists: [],
    doingLists: [],
    doneLists: [],
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
    getTodolists () {
      return new Promise(async (resolve, reject) => {
        await axios.post("/todo/gettodolists", {
          owner: this.user.email
        })
        .then((res) => {
          this.todolists = res.data;
          this.doingLists = this.todolists.filter(lists => {
            return lists.isDone === false;
          })
          this.doneLists = this.todolists.filter(lists => {
            return lists.isDone === true;
          })

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
          this.getTodolists();
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
          this.getTodolists();
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
          this.getTodolists();
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
