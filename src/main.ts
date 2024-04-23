// import { invoke } from "@tauri-apps/api/tauri"
// invoke("startnode");
import { createApp } from "vue";
import App from "./App.vue";
const app = createApp(App)

import router from "./router";
app.use(router)

import { createPinia } from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
app.use(createPinia().use(piniaPluginPersistedstate))

import 'bootstrap-icons/font/bootstrap-icons.min.css'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
app.use(ElementPlus)

app.mount("#app");


 

