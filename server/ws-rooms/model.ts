import {WebSocket} from 'ws';
import {randomUUID} from 'crypto';

class RoomModel {
    private readonly rooms: Map<string, Set<WebSocket>>;

    constructor() {
        this.rooms = new Map<string, Set<WebSocket>>();
    }

    getRooms() {
        return this.rooms;
    }

    createRoom(): string {
        const roomID: string = randomUUID();
        this.rooms.set(roomID, new Set<WebSocket>());
        return roomID;
    }

    joinRoom(roomID: string, ws: WebSocket): boolean {
        if (!this.rooms.has(roomID) || this.rooms.get(roomID).size >= 2) {
            return false;
        }

        this.rooms.get(roomID)!.add(ws); // Используем !, так как мы уверены, что комната существует
        return true;
    }

    leaveRoom(roomID: string, ws: WebSocket): boolean {
        const room = this.rooms.get(roomID);
        if (room && room.has(ws)) {
            room.delete(ws);
            if (room.size === 0) {
                this.rooms.delete(roomID);
            }
            return true;
        }
        return false;
    }

    getRoomClients(roomID: string): Set<WebSocket> {
        return this.rooms.get(roomID) || new Set<WebSocket>();
    }
}

export default RoomModel;