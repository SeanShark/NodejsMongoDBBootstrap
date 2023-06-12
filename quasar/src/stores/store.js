import { defineStore } from "pinia";
import axios from "axios";
const url = "http://10.168.3.3:5000/api/posts/";

export const useUserStore = defineStore("userinfo", {
  state: () => ({
    authUser: null,
    isDisabled: false,
    postStatus: false,
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
          this.alertMessage.exist = true;
          this.alertMessage.color = "alert-warning";
          this.alertMessage.content = err.response.data.msg;
          //console.log(err.response.data.msg);
        });
    },
    async verifyUser() {
      this.resetAlert();
      const token = localStorage.getItem("token");

      if (token === null) {
        this.alertMessage.exist = true;
        this.alertMessage.content = "Login please.";
        return;
      }

      axios
        .get("/user/verifyuser", {
          headers: { token: token },
        })
        .then((res) => {
          this.authUser = res.data.user;
          // console.log('user info:', res.data.user, 'this.authUser:', this.authUser);
        })
        .catch((err) => {
          this.authUser = null;
          // console.log(err);
          this.alertMessage.exist = true;
          this.alertMessage.content = err.response.data.msg;
          // console.log(err.response.data.msg)
        });
    },
  },
});
