// import { invoke } from "@tauri-apps/api/tauri"
// invoke("startnode");
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import 'bootstrap-icons/font/bootstrap-icons.min.css'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'

setTimeout(()=>{
    const app = createApp(App)
    app.use(router)
    app.use(createPinia().use(piniaPluginPersistedstate))
    app.use(ElementPlus)
    app.mount("#app");
},500);




 

