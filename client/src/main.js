import { createApp } from 'vue'
import './scss/styles.scss'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import './axios'
import "bootstrap/dist/css/bootstrap-grid.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"
//import * as bootstrap from 'bootstrap'

const pinia = createPinia()
createApp(App).use(pinia).use(router).mount('#app')
