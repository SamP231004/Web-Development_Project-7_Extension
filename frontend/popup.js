const socket = io("http://localhost:5000"); // Make sure this URL is correct
const messagesContainer = document.getElementById("messages");
const messageInput = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");

socket.on("connect", () => {
    console.log("Connected to WebSocket server.");
});

socket.on("message", (message) => {
    const messageElement = document.createElement("div");
    messageElement.textContent = message.content;
    messagesContainer.appendChild(messageElement);
});

sendBtn.addEventListener("click", () => {
    const message = messageInput.value;
    if (message) {
        socket.emit("sendMessage", message);
        messageInput.value = "";  // Clear the input after sending
    }
});

// Optionally, send message when hitting 'Enter' key
messageInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        sendBtn.click();
    }
});
