import {WebSocket} from 'ws'; // Тип WebSocket из библиотеки ws
import RoomModel from './model';
import {ClientMessage, ResponseMessage} from "./types"; // Импортируем модель (предполагается, что она в отдельном файле)



class WebSocketController {
    private readonly ws: WebSocket; // Приватное свойство для WebSocket
    private roomModel: RoomModel; // Приватное свойство для модели

    constructor(ws: WebSocket, roomModel: RoomModel) {
        this.ws = ws;
        this.roomModel = roomModel;

        this.ws.on('message', this.handleMessage.bind(this));
        this.ws.on('close', this.handleClose.bind(this));
    }

    private handleMessage(msg: Buffer): void {
        try {
            const {type, room, data} = JSON.parse(msg.toString()) as ClientMessage;

            switch (type) {
                case 'create':
                    const roomID = this.roomModel.createRoom();
                    this.sendResponse({
                        type: 'success',
                        roomID,
                        message: `Room ${roomID} created`,
                    });
                    break;

                case 'join':
                    if (!room) {
                        this.sendError('Room is not provided');
                    }
                    const joined = this.roomModel.joinRoom(room, this.ws);
                    if (joined) {
                        this.sendResponse({
                            type: 'success',
                            room,
                            message: `Joined room ${room}`,
                        });
                        this.broadcast(room, `${(this.ws as any).id || 'User'} joined the room`);
                    } else {
                        this.sendError('Failed to join room');
                    }
                    break;

                case 'leave':
                    if (!room) throw new Error('Room ID is required for leave');
                    const left = this.roomModel.leaveRoom(room, this.ws);
                    if (left) {
                        this.sendResponse({
                            type: 'success',
                            room,
                            message: `Left room ${room}`,
                        });
                        this.broadcast(room, `${(this.ws as any).id || 'User'} left the room`);
                    } else {
                        this.sendError('Failed to leave room');
                    }
                    break;

                case "message":
                    this.broadcast(room, data);
                    break;
                default:
                    this.sendError('Unknown message type');
            }
        } catch (err) {
            console.error('Error parsing message:', err);
            this.ws.close(1003, 'Invalid JSON format');
        }
    }

    // Обработка закрытия соединения
    private handleClose(): void {
        for (const [roomID, clients] of this.roomModel.getRooms()) {
            if (clients.has(this.ws)) {
                this.roomModel.leaveRoom(roomID, this.ws);
                this.broadcast(roomID, `${(this.ws as any).id || 'User'} disconnected`);
            }
        }
        console.log('Client disconnected');
    }

    // Отправка ответа клиенту
    private sendResponse(data: ResponseMessage): void {
        this.ws.send(JSON.stringify(data));
    }

    // Отправка ошибки
    private sendError(message: string): void {
        this.sendResponse({
            type: 'error',
            message,
        });
    }

    // Рассылка сообщения всем участникам комнаты
    private broadcast(roomID: string, message: string): void {
        const clients = this.roomModel.getRoomClients(roomID);
        for (const client of clients) {
            if (client !== this.ws && client.readyState === client.OPEN) {

                client.send(JSON.stringify({
                    type: 'broadcast',
                    room: roomID,
                    message,
                }));
            }
        }
    }
}

export default WebSocketController;