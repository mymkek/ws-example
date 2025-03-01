<template>
  <div v-if="!connected">
    Loading...
  </div>
  <div v-if="connected">
    <h1>Комната {{ roomId }}</h1>
    <ul>
      <li v-for="(message, index) in messages" :key="index">
        {{ message }}
      </li>
    </ul>
    <div class="send_message">
      <textarea v-model="message" placeholder="add multiple lines"></textarea>
      <button @click="sendMessage">Send</button>
    </div>

    <button @click="leaveRoom">Leave room</button>
  </div>
</template>

<script setup>
import {useRoute, useRouter} from "vue-router";
import {getCurrentInstance, ref} from "vue";
const messages = ref([]);
const message = ref("");
const connected = ref(false);
const router = useRouter();
const route = useRoute();
const roomId = route.params.id; // Получаем id комнаты
const socket = getCurrentInstance().appContext.config.globalProperties.$socket;

socket.onopen = () => {
  connected.value = true;
  socket.send(JSON.stringify({
    type: 'join',
    room: roomId,
  }))
}


socket.onmessage = (e) => {
  const message = JSON.parse(e.data);

  if (message.type === "broadcast") {
    messages.value.push(message.message);
  }
}

const leaveRoom = () => {
  socket.send(JSON.stringify({
    type: 'leave',
    room: roomId,
  }))
  router.push("/")
}

const sendMessage = () => {
  messages.value.push(message.value);
  socket.send(JSON.stringify({
    type: 'message',
    data: message.value,
    room: roomId,
  }))
}
</script>

<style scoped>

.send_message {
  display: flex;
}
</style>