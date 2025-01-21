const socket = io("https://web-development-project-7-extension.onrender.com");
const messagesContainer = document.getElementById("messages");
const messageInput = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const roomInput = document.getElementById("room-input");
const joinRoomBtn = document.getElementById("join-room-btn");
const createRoomBtn = document.getElementById("create-room-btn");

let currentRoom = null;

socket.on("connect", () => {
    console.log("Connected to WebSocket server.");
});

socket.on("message", (message) => {
    const messageElement = document.createElement("div");
    messageElement.textContent = message.content;
    messageElement.classList.add("message", "received");
    messagesContainer.appendChild(messageElement);
});

sendBtn.addEventListener("click", () => {
    const message = messageInput.value;
    if (message && currentRoom) {
        const messageElement = document.createElement("div");
        messageElement.textContent = message;
        messageElement.classList.add("message", "sent"); 
        messagesContainer.appendChild(messageElement);
        
        socket.emit("sendMessage", { room: currentRoom, content: message });
        messageInput.value = "";
    }
});

messageInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        sendBtn.click();
    }
});

joinRoomBtn.addEventListener("click", () => {
    const room = roomInput.value;
    if (room) {
        currentRoom = room;
        socket.emit("joinRoom", room);
        startChat();
    }
});

createRoomBtn.addEventListener("click", () => {
    const room = roomInput.value;
    if (room) {
        currentRoom = room;
        socket.emit("createRoom", room);
        startChat();
    }
});

function startChat() {
    document.getElementById("room-selection").style.display = "none";
    messagesContainer.style.display = "flex";
    messageInput.style.display = "block";
    sendBtn.style.display = "block";
}

socket.on("roomMessage", (message) => {
    const messageElement = document.createElement("div");
    messageElement.textContent = message.content;
    messageElement.classList.add("message", "received");
    messagesContainer.appendChild(messageElement);
});