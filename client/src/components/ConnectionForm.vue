<script setup lang="ts">


import {ref} from "vue";

const props = defineProps<{ createRoom: (roomId: string) => void; }>()

let name = ref("")


const handleCreateRoom = () => {
  props.createRoom(name.value)
}

</script>

<template>
  <div>
    <h2>создать комнату</h2>
    <input v-model="name" id="room-id" type="text">
    <button @click="handleCreateRoom">Create room</button>
  </div>

  <div class="container">
    <h2>подключиться к комнате</h2>
    <label for="room-id" >Room id</label>
    <div>
      <input v-model="name" id="room-id" type="text">
      <p v-if="!name">compelete field</p>
    </div>
    <button :disabled="!name">Connect</button>
  </div>
</template>

<style scoped>
input {
  padding: 10px;
}
.container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
