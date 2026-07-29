// =========================================================
// 1. CẤU HÌNH FIREBASE REALTIME DATABASE
// =========================================================
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

// Khởi tạo ứng dụng Firebase
if (typeof firebase !== "undefined" && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const database = firebase ? firebase.database() : null;
const chatRef = database ? database.ref("global_chat") : null;

// Hàm chống chèn mã độc (Anti-XSS)
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

// =========================================================
// 2. ĐĂNG NHẬP & QUẢN LÝ TÊN NGƯỜI CHƠI
// =========================================================
window.loginGame = function() {
    const inputElem = document.getElementById("playerNameInput");
    if (!inputElem) return;

    const inputName = inputElem.value.trim();
    if (!inputName) {
        alert("⚠️ Vui lòng nhập tên nhân vật!");
        return;
    }
    
    // Lưu tên người chơi vào LocalStorage
    localStorage.setItem("playerName", inputName);
    
    // Chuyển đổi giao diện sang khung Chat
    showChatUI();
};

function showChatUI() {
    const authStatus = document.getElementById("authStatus");
    const chatBox = document.getElementById("chatBox");

    if (authStatus) authStatus.style.display = "none";
    if (chatBox) chatBox.style.display = "block";
    
    // Khởi tạo & tải danh sách tin nhắn
    loadChatMessages();
}

// =========================================================
// 3. GỬI TIN NHẮN LÊN FIREBASE
// =========================================================
window.sendChatMessage = function() {
    if (!chatRef) {
        alert("❌ Chưa kết nối được với máy chủ Firebase!");
        return;
    }

    const input = document.getElementById("chatInput");
    if (!input) return;

    const text = input.value.trim();
    const user = localStorage.getItem("playerName") || "Nông dân";
    
    if (text === "") return;
    
    // Đẩy dữ liệu tin nhắn lên Realtime Database
    chatRef.push({
        user: user,
        text: text,
        timestamp: Date.now()
    });
    
    input.value = "";
};

// =========================================================
// 4. TẢI & LẮNG NGHE TIN NHẮN REALTIME
// =========================================================
function loadChatMessages() {
    const messageList = document.getElementById("messageList");
    if (!messageList) return;

    // Kiểm tra và khởi tạo khung nhập tin nhắn nếu HTML chưa có
    let chatInputArea = document.querySelector(".chat-input-area");
    if (!chatInputArea) {
        const chatCard = document.querySelector(".chat-card");
        if (chatCard) {
            chatInputArea = document.createElement("div");
            chatInputArea.className = "chat-input-area";
            chatInputArea.innerHTML = `
                <input type="text" id="chatInput" placeholder="Nhập tin nhắn..." maxlength="150" />
                <button id="sendChatBtn" onclick="window.sendChatMessage()">Gửi</button>
            `;
            chatCard.appendChild(chatInputArea);
            
            // Bắt sự kiện nhấn phím Enter để gửi nhanh
            const chatInput = document.getElementById("chatInput");
            if (chatInput) {
                chatInput.addEventListener("keypress", (e) => {
                    if (e.key === "Enter") window.sendChatMessage();
                });
            }
        }
    }

    if (!chatRef) return;

    // Xóa listener cũ trước khi đăng ký listener mới (chống trùng dữ liệu)
    chatRef.off();

    // Lắng nghe 50 tin nhắn mới nhất
    chatRef.limitToLast(50).on("child_added", (snapshot) => {
        const data = snapshot.val();
        if (!data) return;

        const safeUser = escapeHTML(data.user || "Nông dân");
        const safeText = escapeHTML(data.text || "");

        const msgDiv = document.createElement("div");
        msgDiv.className = "chat-item";
        msgDiv.innerHTML = `<span class="chat-user">[${safeUser}]:</span> <span class="chat-text">${safeText}</span>`;
        messageList.appendChild(msgDiv);
        
        // Tự động cuộn xuống tin nhắn mới nhất
        messageList.scrollTop = messageList.scrollHeight;
    });
}

// =========================================================
// 5. TỰ ĐỘNG MỞ CHAT NẾU ĐÃ ĐĂNG NHẬP TRƯỚC ĐÓ
// =========================================================
window.addEventListener("DOMContentLoaded", () => {
    const savedName = localStorage.getItem("playerName");
    if (savedName) {
        showChatUI();
    }
});
