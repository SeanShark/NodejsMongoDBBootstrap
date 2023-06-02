import { defineStore } from "pinia";

import axios from "axios";
const url = "http://10.168.3.3:5000/api/posts/";

export const useTodosStore = defineStore({
  id: "todolists",
  state: () => ({
    authUser: null,
    posts: [],
    postText: "",
    isDisabled: false,
    postStatus: false,
    tokenOK: false,
    alertMessage: {
      exist: false,
      content: "",
      color: "alert-warning",
    },
    toastMessage: "",
  }),
  actions: {
    async fetchPosts() {
      const res = await axios.get(url);
      // console.log(this.authUser.email);
      this.posts = res.data;
    },
    async createPost() {
      if (this.postText.trim() === "") {
        this.alertMessage.exist = true;
        this.alertMessage.content = "Please enter some text.";
        return;
      }
      try {
        const text = this.postText
        let res = await axios.post(url, { text });
        if (res.status === 201) {
          //console.log(res.data.msg, res.data.status);
          this.postText = "";
          this.postStatus = true;
          this.toastMessage = "Post added successfully."
          await this.fetchPosts(); // fetch updated posts list
        }
      } catch (error) {
        console.log(error);
      }
    },
    async deletePost(id) {
      try {
        const res = await axios.delete(`${url}${id}`);
        if (res.status === 201) {
          this.posts = this.posts.filter((post) => post._id !== id);
          this.postStatus = true;
          this.toastMessage = "Post deleted successfully."
        }
      } catch (err) {
        this.alertMessage.exist = true;
        this.alertMessage.content = "Error deleting post.";
      }
    },
    async updatePost(post) {
      try {
        const res = await axios.put(url, { post });
        if (res.status === 201) {
          this.toastMessage = "Post edited successfully."
          await this.fetchPosts(); // fetch updated posts list
        }
      } catch (error) {
        console.log(error);
      }
    },

    async getToken(data) {
      await axios.post('/user/login', data)
      .then(res =>  {
        if (res.data.status === "success") {
          localStorage.setItem('token', res.data.token);
        }
      })
      .catch(err => {
        this.alertMessage.exist = true;
        this.alertMessage.color = "alert-warning";
        this.alertMessage.content = err.response.data.msg;
        //console.log(err.response.data.msg);
      })
    },
    async verifyUser() {
      this.resetAlert();
      const token = localStorage.getItem("token");

      if( token === null ) {
        this.alertMessage.exist = true;
        this.alertMessage.content = "Login please.";
        return;
      }

      axios.get("/user/verifyuser", {
          headers: { token: token },
        })
        .then((res) => {
          this.tokenOK = true;
          this.authUser = res.data.user;
          // console.log('user info:', res.data.user, 'this.authUser:', this.authUser);
        })
        .catch(err => {
          this.authUser = null;
          // console.log(err);
          this.alertMessage.exist = true;
          this.alertMessage.content = err.response.data.msg;
          // console.log(err.response.data.msg)
        })
    },

    logout() {
      localStorage.clear();
      this.authUser = null;
      this.resetAlert();
    },
    resetAlert () {
      this.alertMessage.exist = false;
      this.alertMessage.color = "alert-warning";
      this.alertMessage.content = "";
    },
  },
  getters: {
    user: (state) => state.authUser,
  },
});
