import ConnectionForm from '../components/ConnectionForm.vue'

<template>
  <div>
    <RoomsList />
    <ConnectionForm :create-room="createRoom" />

  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { getCurrentInstance } from 'vue'
import ConnectionForm from "../components/ConnectionForm.vue";
import RoomsList from "../components/RoomsList.vue";


export default {
  name: 'RoomPage',
  components: { RoomsList, ConnectionForm },
  setup() {
    const router = useRouter();
    const socket = getCurrentInstance().appContext.config.globalProperties.$socket



    const createRoom = (roomData) => {
      socket.send(JSON.stringify({
        type: 'create',
        data: roomData
      }));
    };

    return {
      createRoom
    };
  },
  mounted() {
    const socket = this.$socket;
    const router = useRouter();

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "success") {
        router.push(`/room/${message.roomID}`);
      }
    };
  },
  beforeUnmount() {
    const socket = this.$socket;
    socket.onmessage = null;
  }
};
</script>

<style scoped>
/* Стили для пустой страницы */
</style>