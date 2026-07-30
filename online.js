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

// Biến lưu trữ thông tin người chơi hiện tại
let currentUser = null;

// =========================================================
// 2. XỬ LÝ ĐĂNG NHẬP / TÊN NGƯỜI CHƠI
// =========================================================
window.loginGame = function() {
    const nameInput = document.getElementById("playerNameInput");
    let playerName = "";

    if (nameInput && nameInput.value.trim() !== "") {
        playerName = nameInput.value.trim();
        localStorage.setItem("playerName", playerName);
        alert("✅ Đã lưu tên nhân vật: " + playerName);
    } else {
        // Nếu không nhập tên, tự lấy tên mặc định hoặc trong LocalStorage
        const currentLevel = (typeof level !== "undefined") ? level : 1;
        playerName = localStorage.getItem("playerName") || ("Nông dân Cấp " + currentLevel);
        localStorage.setItem("playerName", playerName);
    }

    // Lấy hoặc tạo UID cố định cho thiết bị/trình duyệt này
    let playerUid = localStorage.getItem("playerUid");
    if (!playerUid) {
        playerUid = "user_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
        localStorage.setItem("playerUid", playerUid);
    }

    // Cập nhật thông tin currentUser
    currentUser = {
        uid: playerUid,
        name: playerName
    };

    const authStatus = document.getElementById("authStatus");
    if (authStatus) authStatus.style.display = "none";

    // 🏆 ĐẨY DỮ LIỆU LÊN BẢNG XẾP HẠNG NGAY KHI ĐĂNG NHẬP
    window.updateLeaderboardData();
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

// =========================================================
// 5. BẢNG XẾP HẠNG REALTIME
// =========================================================

// Hàm cập nhật Xu của người chơi hiện tại lên Firebase
window.updateLeaderboardData = function() {
    if (!database) return;

    // Nếu chưa có currentUser, tự phục hồi từ LocalStorage
    if (!currentUser) {
        const savedUid = localStorage.getItem("playerUid");
        const savedName = localStorage.getItem("playerName");
        if (savedUid && savedName) {
            currentUser = { uid: savedUid, name: savedName };
        } else {
            return; // Nếu chưa từng đăng nhập thì bỏ qua
        }
    }

    // Lấy số xu hiện tại từ biến global 'money' trong script.js
    let currentMoney = typeof money !== 'undefined' ? money : 0;

    // Lưu/Cập nhật thông tin vào node "users" trên Firebase Realtime Database
    database.ref("users/" + currentUser.uid).set({
        name: currentUser.name,
        money: currentMoney,
        lastUpdated: firebase.database.ServerValue.TIMESTAMP
    });
};

// Lắng nghe thay đổi Bảng Xếp Hạng (Top 5 người chơi nhiều Xu nhất)
function listenToLeaderboard() {
    if (!database) return;

    let leaderboardRef = database.ref("users").orderByChild("money").limitToLast(5);

    leaderboardRef.on("value", (snapshot) => {
        let leaderboardList = document.getElementById("leaderboardList");
        if (!leaderboardList) return;

        leaderboardList.innerHTML = ""; // Xóa danh sách cũ

        let players = [];
        snapshot.forEach((childSnapshot) => {
            players.push(childSnapshot.val());
        });

        // Vì Firebase sắp xếp tăng dần nên đảo ngược để người nhiều Xu nhất lên Top 1
        players.reverse();

        if (players.length === 0) {
            leaderboardList.innerHTML = "<li>Chưa có dữ liệu</li>";
            return;
        }

        players.forEach((player, index) => {
            let li = document.createElement("li");
            let rankIcon = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}.`;
            
            li.innerHTML = `
                <span>${rankIcon} <strong>${escapeHTML(player.name)}</strong></span>
                <span class="rank-money">💰 ${(player.money || 0).toLocaleString()}</span>
            `;
            leaderboardList.appendChild(li);
        });
    });
}

// Khởi chạy khi trang load xong
window.addEventListener("DOMContentLoaded", () => {
    loadChatMessages();
    listenToLeaderboard();
});
