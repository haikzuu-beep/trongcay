// 1. Cấu hình Firebase của bạn
const firebaseConfig = {
  apiKey: "AIzaSyAAQDD5JVHWF80LjmxCmeUj-eOPh8U20CQ",
  authDomain: "your-farm-c05ae.firebaseapp.com",
  databaseURL: "https://your-farm-c05ae-default-rtdb.firebaseio.com",
  projectId: "your-farm-c05ae",
  storageBucket: "your-farm-c05ae.firebasestorage.app",
  messagingSenderId: "234932348162",
  appId: "1:234932348162:web:7e20fe4c5a6333bb188e1b",
  measurementId: "G-GNRRP4HS1L"
};

// 2. Khởi tạo Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();
const chatRef = database.ref("global_chat");

// 3. Xử lý Đăng nhập & Chat
window.loginGame = function() {
    const inputName = document.getElementById("playerNameInput").value.trim();
    if (!inputName) {
        alert("Vui lòng nhập tên nhân vật!");
        return;
    }
    
    // Lưu tên vào LocalStorage
    localStorage.setItem("playerName", inputName);
    
    // Ẩn ô nhập tên, hiện ô chat
    document.getElementById("authStatus").style.display = "none";
    document.getElementById("chatBox").style.display = "block";
    
    // Tải danh sách chat
    loadChatMessages();
};

function loadChatMessages() {
    const messageList = document.getElementById("messageList");
    
    // Tạo khung nhập tin nhắn nếu chưa có
    let chatInputArea = document.querySelector(".chat-input-area");
    if (!chatInputArea) {
        const chatCard = document.querySelector(".chat-card");
        chatInputArea = document.createElement("div");
        chatInputArea.className = "chat-input-area";
        chatInputArea.innerHTML = `
            <input type="text" id="chatInput" placeholder="Nhập tin nhắn..." />
            <button id="sendChatBtn">Gửi</button>
        `;
        chatCard.appendChild(chatInputArea);
        
        // Bắt sự kiện bấm nút Gửi hoặc Enter
        document.getElementById("sendChatBtn").onclick = sendChatMessage;
        document.getElementById("chatInput").addEventListener("keypress", (e) => {
            if (e.key === "Enter") sendChatMessage();
        });
    }

    // Lắng nghe tin nhắn mới từ Firebase
    chatRef.limitToLast(50).on("child_added", (snapshot) => {
        const data = snapshot.val();
        const msgDiv = document.createElement("div");
        msgDiv.className = "chat-item";
        msgDiv.innerHTML = `<span class="chat-user">[${data.user}]:</span> <span class="chat-text">${data.text}</span>`;
        messageList.appendChild(msgDiv);
        
        // Cuộn xuống tin nhắn mới nhất
        const chatBox = document.getElementById("chatBox");
        chatBox.scrollTop = chatBox.scrollHeight;
    });
}

function sendChatMessage() {
    const input = document.getElementById("chatInput");
    const text = input.value.trim();
    const user = localStorage.getItem("playerName") || "Nông dân";
    
    if (text === "") return;
    
    // Đẩy tin nhắn lên Firebase
    chatRef.push({
        user: user,
        text: text,
        timestamp: Date.now()
    });
    
    input.value = "";
}
