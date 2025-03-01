import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import {LessonPage} from "./pages/lesson-room";


const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/room/:id',
        name: 'room',
        component: LessonPage,
    },
]

const router = createRouter({
    history: createWebHistory(), // Используем HTML5 History Mode
    routes,
})

export default router