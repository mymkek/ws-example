<script setup lang="ts">
import { ref, onMounted } from 'vue'

const rooms = ref([]) // Состояние для хранения списка комнат
const loading = ref(true) // Флаг загрузки
const error = ref(null) // Ошибка запроса

// Функция для загрузки данных
const fetchRooms = async () => {
  try {
    const response = await fetch('http://localhost:5000/rooms')
    if (!response.ok) throw new Error('Ошибка загрузки данных')
    rooms.value = await response.json()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
onMounted(fetchRooms)
defineProps<{ }>()
</script>

<template>
  <h1>Rooms list</h1>
  <nav>
    <ul>
      <li v-for="room in rooms" :key="room[0]">

        <router-link :to="`/room/${room[0]}`">{{ room[0] }}</router-link>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
ul {
  list-style-type: none;
}
li {
  text-align: left;
}
</style>
