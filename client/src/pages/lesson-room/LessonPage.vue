<template>
  <RoomLayout v-if="socketStore.isConnected">
    <template #left>
      <CallWidget/>
    </template>
    <template #right>
      <ChatWidget/>
    </template>
  </RoomLayout>
  <div v-else>
    Loading...
  </div>
</template>

<script setup>

import CallWidget from "@/widgets/lesson-call/CallWidget.vue";
import ChatWidget from "@/widgets/lesson-chat/ChatWidget.vue";
import {useWebSocketStore} from "@/shared/ws-connection.js";
import {onMounted} from "vue";
import RoomLayout from "@/pages/lesson-room/ui/RoomLayout.vue";

const socketStore = useWebSocketStore();

onMounted(() => {
  socketStore.connect();
})
</script>

<style lang="scss" scoped>

</style>