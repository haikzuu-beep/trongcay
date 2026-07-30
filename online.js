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

const database = typeof firebase !== "undefined" ? firebase.database() : null;
const chatRef = database ? database.ref("global_chat") : null;

// =========================================================
// 2. XỬ LÝ ĐĂNG NHẬP / TÊN NGƯỜI CHƠI
// =========================================================
window.loginGame = function() {
    const nameInput = document.getElementById("playerNameInput");
    
    if (nameInput && nameInput.value.trim() !== "") {
        const inputName = nameInput.value.trim();
        localStorage.setItem("playerName", inputName);
        alert("✅ Đã lưu tên nhân vật: " + inputName);
    } else {
        // Nếu không có ô nhập tên riêng, tự lưu tên dựa trên level hoặc mặc định
        const currentLevel = (typeof level !== "undefined") ? level : 1;
        const defaultName = localStorage.getItem("playerName") || ("Nông dân Cấp " + currentLevel);
        localStorage.setItem("playerName", defaultName);
    }

    const authStatus = document.getElementById("authStatus");
    if (authStatus) authStatus.style.display = "none";
};

// Hàm chống chèn mã độc (Anti-XSS)
function escapeHTML(str) {
    return String(str).replace(/[&<>'"]/g, 
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
// 3. GỬI TIN NHẮN LÊN FIREBASE
// =========================================================
window.sendChatMessage = function() {
    if (!chatRef) {
        alert("❌ Chưa kết nối được với máy chủ Firebase!");
        return;
    }

    const input = document.getElementById("chatMessageInput");
    if (!input) return;

    const text = input.value.trim();
    if (text === "") return;

    // Lấy tên người chơi từ LocalStorage hoặc theo Level
    let user = localStorage.getItem("playerName");
    if (!user) {
        const currentLevel = (typeof level !== "undefined") ? level : 1;
        user = "Nông dân Cấp " + currentLevel;
    }

    // Xóa trắng ô nhập ngay để tạo cảm giác phản hồi nhanh
    input.value = "";

    // Đẩy dữ liệu tin nhắn lên Realtime Database
    chatRef.push({
        user: user,
        text: text,
        timestamp: Date.now()
    }).catch((error) => {
        console.error("Lỗi gửi chat:", error);
        alert("❌ Gửi tin nhắn thất bại: " + error.message);
    });
};

// Bắt sự kiện phím Enter
window.handleChatKeyPress = function(event) {
    if (event.key === "Enter") {
        window.sendChatMessage();
    }
};

// =========================================================
// 4. TẢI & LẮNG NGHE TIN NHẮN REALTIME
// =========================================================
function loadChatMessages() {
    if (!chatRef) return;

    // Tìm khung chứa tin nhắn
    const messageList = document.getElementById("messageList") 
                     || document.querySelector('[ident="danh sach tin nhan"]')
                     || document.querySelector('.chat-messages');

    if (!messageList) return;

    // Xóa listener cũ chống lặp
    chatRef.off();

    // Lắng nghe tin nhắn từ Firebase
    chatRef.limitToLast(50).on("child_added", (snapshot) => {
        const data = snapshot.val();
        if (!data) return;

        const safeUser = escapeHTML(data.user || "Nông dân");
        const safeText = escapeHTML(data.text || "");

        const msgDiv = document.createElement("div");
        msgDiv.className = "chat-item";
        msgDiv.style.marginBottom = "6px";
        msgDiv.style.color = "#ffffff";
        msgDiv.style.wordBreak = "break-word";
        msgDiv.innerHTML = `<strong style="color: #ffca28;">${safeUser}:</strong> <span>${safeText}</span>`;
        
        messageList.appendChild(msgDiv);
        
        // Tự động cuộn mượt xuống dòng mới nhất
        messageList.scrollTop = messageList.scrollHeight;
    });
}

// Khởi chạy khi trang load xong
window.addEventListener("DOMContentLoaded", () => {
    loadChatMessages();
});
