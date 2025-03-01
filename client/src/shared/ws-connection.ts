import { defineStore } from 'pinia';

// Тип для состояния хранилища WebSocket
interface WebSocketState {
    socket: WebSocket | null; // WebSocket или null, если соединение не установлено
    isConnected: boolean;
}

export const useWebSocketStore = defineStore('websocket', {
    state: (): WebSocketState => ({
        socket: null,
        isConnected: false,
    }),
    actions: {
        connect() {
            // Проверяем, если уже есть активное соединение, не создаём новое
            if (this.socket) {
                console.warn("WebSocket is already connected.");
                return;
            }

            // Создаём новое соединение WebSocket
            this.socket = new WebSocket("ws://127.0.0.1:5000/ws-stuff/rooms");

            // Устанавливаем обработчики событий
            this.socket.onopen = () => {
                this.isConnected = true;
                console.log("WebSocket is open.");
            };

            this.socket.onclose = () => {
                console.log("WebSocket is closed.");
                this.isConnected = false;
                this.socket = null; // Обнуляем ссылку на сокет после закрытия соединения
            };

            this.socket.onerror = (error: Event) => {
                console.error("WebSocket error:", error);
            };

            this.socket.onmessage = (event: MessageEvent) => {
                console.log("Received message:", event.data);
                // Здесь можно добавить обработку входящих сообщений
            };
        },

        leave() {
            if (this.socket) {
                this.socket.close(); // Закрытие соединения
                this.socket = null; // Обнуляем ссылку на сокет
                console.log("WebSocket connection closed.");
            } else {
                console.warn("No WebSocket connection to leave.");
            }
        },

        sendMessage(message: string) {
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(message);
                console.log("Sent message:", message);
            } else {
                console.warn("WebSocket is not open. Cannot send message.");
            }
        },
    },
});
