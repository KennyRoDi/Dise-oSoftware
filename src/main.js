import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css' 
import './themes.css' // <-- Agrega esta línea

const app = createApp(App)
app.use(router)
app.mount('#app')