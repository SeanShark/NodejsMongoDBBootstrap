import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore("userinfo", {
  state: () => ({
    authUser: null,
    isDisabled: false,
    postStatus: false,
    systemMSG: "",
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
      this.resetAlert();
      const token = localStorage.getItem("token");

      if (token === null) {
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
          this.systemMSG = null;
          this.authUser = null;
          // console.log(err.response.data.msg)
        });
    },
  },
});
