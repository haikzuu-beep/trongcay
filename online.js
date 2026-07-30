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
// ĐĂNG NHẬP & XỬ LÝ TÊN NGƯỜI CHƠI
// =========================================================
window.loginGame = function() {
    // 1. Tìm ô nhập tên người chơi (hoặc ô nhập chat)
    const inputElem = document.getElementById("playerNameInput") 
                   || document.getElementById("chatMessageInput");
                   
    if (!inputElem) return;

    const inputName = inputElem.value.trim();
    if (!inputName) {
        alert("⚠️ Vui lòng nhập tên nhân vật!");
        return;
    }
    
    // 2. Lưu tên vừa nhập vào LocalStorage
    localStorage.setItem("playerName", inputName);
    
    alert("✅ Đã đặt tên nhân vật thành công: " + inputName);

    // 3. Ẩn nút đăng nhập / hiển thị khung chat (nếu có)
    const authStatus = document.getElementById("authStatus");
    if (authStatus) authStatus.style.display = "none";
};
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
// 2. GỬI TIN NHẮN LÊN FIREBASE
// =========================================================
window.sendChatMessage = function() {
    if (!chatRef) {
        alert("❌ Chưa kết nối được với máy chủ Firebase!");
        return;
    }

    // Sửa ID ở đây cho khớp với index.html (chatMessageInput)
    const input = document.getElementById("chatMessageInput");
    if (!input) return;

    const text = input.value.trim();
   let user = localStorage.getItem("playerName");

// Nếu chưa đặt tên riêng trong LocalStorage thì mới dùng Level hoặc tên mặc định
if (!user) {
    const currentLevel = (typeof level !== "undefined") ? level : 1;
    user = "Nông dân Cấp " + currentLevel;
}
    
    if (text === "") return;
    
    // Đẩy dữ liệu tin nhắn lên Realtime Database
    chatRef.push({
        user: user,
        text: text,
        timestamp: Date.now()
    }).then(() => {
        input.value = ""; // Gửi xong xóa trắng ô nhập
    }).catch((error) => {
        console.error("Lỗi gửi chat:", error);
        alert("❌ Gửi tin nhắn thất bại: " + error.message);
    });
};

// Đăng ký hàm handleKeypress nếu HTML gọi
window.handleChatKeyPress = function(event) {
    if (event.key === "Enter") {
        window.sendChatMessage();
    }
};

// =========================================================
// 3. TẢI & LẮNG NGHE TIN NHẮN REALTIME
// =========================================================
function loadChatMessages() {
    if (!chatRef) return;

    // Tìm khung chứa tin nhắn (hỗ trợ tìm theo id hoặc thuộc tính tiếng Việt ở index.html)
    let messageList = document.getElementById("messageList") 
                   || document.querySelector('[ident="danh sach tin nhan"]')
                   || document.querySelector('.chat-messages');

    if (!messageList) return;

    // Xóa listener cũ chống lặp tin nhắn
    chatRef.off();

    // Lắng nghe 50 tin nhắn mới nhất
    chatRef.limitToLast(50).on("child_added", (snapshot) => {
        const data = snapshot.val();
        if (!data) return;

        const safeUser = escapeHTML(data.user || "Nông dân");
        const safeText = escapeHTML(data.text || "");

        const msgDiv = document.createElement("div");
        msgDiv.className = "chat-item";
        msgDiv.style.marginBottom = "4px";
        msgDiv.style.color = "#ffffff";
        msgDiv.innerHTML = `<strong style="color: #ffca28;">[${safeUser}]:</strong> <span>${safeText}</span>`;
        
        messageList.appendChild(msgDiv);
        
        // Tự động cuộn xuống dưới cùng
        messageList.scrollTop = messageList.scrollHeight;
    });
}

// KHỞI CHẠY LẮNG NGHE CHAT KHI TẢI TRANG
window.addEventListener("DOMContentLoaded", () => {
    // Đảm bảo ô nhập liệu hiển thị
    const chatInputBox = document.getElementById("chatInputBox");
    if (chatInputBox) chatInputBox.style.display = "flex";

    loadChatMessages();
});
