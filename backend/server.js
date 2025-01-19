const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: "*",  // Allow all origins (or specify the exact URL of the frontend)
        methods: ["GET", "POST"]
    }
});

let messages = [];

app.use(express.json());
app.use(express.static('frontend'));

app.post('/api/messages', (req, res) => {
    const message = req.body;
    messages.push(message);
    io.emit('message', message);  // Emit to all connected clients
    res.status(200).send("Message sent");
});

io.on("connection", (socket) => {
    console.log("A user connected");
    
    // Send all previous messages when a new client connects
    socket.emit('message', messages);

    socket.on("sendMessage", (message) => {
        console.log("Message received:", message);  // Log the message
        messages.push({ content: message, timestamp: Date.now() });
        io.emit('message', { content: message, timestamp: Date.now() });
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});


server.listen(5000, () => {
    console.log("Server is running on port 5000");
});
