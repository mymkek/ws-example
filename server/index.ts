import WebSocketController from "./ws-rooms/controller";
import RoomModel from "./ws-rooms/model";

const express = require('express');
const cors = require('cors');
const fs = require("fs");
const app = express();
const expressWs = require('express-ws')(app);
const port = 5000;
const wsrouter = express.Router();

app.use(cors());

app.use(express.json());


app.get('/', (req, res) => {
    let socket = new WebSocket("ws://javascript.info");
    console.log(socket)
    res.send('Hello, World! Welcome to my Node.js server!');
});


let counter = 0;

const roomModel = new RoomModel();


// app.get('/rooms', (req, res) => {
//     res.send(Array.from(rooms.values()));
// })



wsrouter.ws('/rooms', (ws) => {
    new WebSocketController(ws, roomModel);
})

wsrouter.ws('/echo', function (ws, req) {


    const fileName = 'counter.txt';
    const isFileExist = fs.existsSync(fileName);

    if (!isFileExist) {
        fs.writeFileSync(fileName, JSON.stringify(ws, null, 2), (err) => {
            if (err) {
                console.error('Ошибка при создании файла:', err);
            } else {
                console.log('Файл успешно создан');
            }
        });
    }

    ws.send("hi loh");

    ws.on('message', function (msg) {
        if (msg === "text") {
            ws.send("ws can send some text");
        }

        if (msg === "blob") {
            counter++;
            fs.writeFileSync(fileName, counter.toString(), (err) => {
            })
            const fileBuffer = fs.readFileSync(fileName, 'utf8');

            ws.send(fileBuffer);
        }

        if (msg === "buffer") {
            const buffer = new ArrayBuffer(10);
            const uint8View = new Uint8Array(buffer);

            uint8View.set([65, 66, 67, 68, 69, 111, 222]);

            ws.send(uint8View);
            ws.close(1000);
        }

    });

    ws.on('close', function () {
        console.log('im close')
    })


    ws.on('error', function (err) {
        console.log('im error', err)
    })
});


app.use("/ws-stuff", wsrouter);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});