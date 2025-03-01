import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router.ts";

const app = createApp(App)

let socket = new WebSocket("ws://127.0.0.1:5000/ws-stuff/rooms");

socket.onopen =  () => {
    console.log("im open")
}



app.config.globalProperties.$socket = socket;

app.use(router).mount('#app')


