const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

let rooms = {}; 
app.use(express.json());
app.use(express.static('frontend'));

app.get('/api/messages', (req, res) => {
    res.status(200).json(rooms);
});

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("joinRoom", (room) => {
        socket.join(room);
        console.log(`User  joined room: ${room}`);

        if (rooms[room]) {
            socket.emit('message', rooms[room]);
        }
    });

    socket.on("createRoom", (room) => {
        if (!rooms[room]) {
            rooms[room] = []; 
        }
        socket.join(room);
        console.log(`Room created: ${room}`);
    });


    socket.on("sendMessage", ({ room, content }) => {
        console.log("Message received:", content); 
        const message = { content, timestamp: Date.now() };

        if (!rooms[room]) {
            rooms[room] = []; 
        }
        rooms[room].push(message);

        io.to(room).emit('roomMessage', message);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

const PORT = process.env.PORT || 5000; 

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});