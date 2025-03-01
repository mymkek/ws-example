export type WsRequestType = 'create' | 'join' | 'leave' | 'message';

// Интерфейс для входящих сообщений от клиента
export interface ClientMessage {
    type: WsRequestType;
    room?: string;
    data?: string;
}

// Интерфейс для исходящих сообщений (ответов клиенту)
export interface ResponseMessage {
    type: 'success' | 'error' | 'broadcast';
    room?: string;
    roomID?: string;
    message: string;
}