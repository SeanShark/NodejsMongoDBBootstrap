import { createRouter, createWebHistory } from 'vue-router'
import PostComponent from './components/PostComponent.vue'
import Login from '@/components/Login.vue'
import Forgot from '@/components/Forgot.vue'
import Register from '@/components/Register.vue'
import RegisterVee from '@/components/RegisterVee.vue'
import Modal from '@/components/ModalView.vue'
//import Home from '@/components/Home.vue'



const routes = [
  // { path: '/', name: 'Home', component: Home },
  { path: '/', name: 'PostComponent', component: PostComponent },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/registervee', name: 'RegisterVee', component: RegisterVee },
  { path: '/forgot', name: 'Forgot', component: Forgot },
  { path: '/modal', name: 'Modal', component: Modal}
]

// if createWebHashHistory will have a # in url.
const router = createRouter( {
  history: createWebHistory(),
  routes
})

export default router;