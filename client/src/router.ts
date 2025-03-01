import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import RoomPage from './pages/Room.vue'


const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/room/:id',
        name: 'room',
        component: RoomPage,
    },
]

const router = createRouter({
    history: createWebHistory(), // Используем HTML5 History Mode
    routes,  // Связь с роутами
})

export default router