type SocketMessage = {
    type: "create" | "join" | "leave"
    room: string
}