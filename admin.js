// =========================================================
// 1. CẤU HÌNH BẢO MẬT ADMIN
// =========================================================
// 🔑 BẠN ĐỔI MẬT KHẨU ADMIN TẠI ĐÂY (Mặc định hiện tại: admin123)
const ADMIN_PASSWORD = "admin123"; 

// Kiểm tra xem Admin đã đăng nhập trước đó chưa (Lưu trong Session)
function checkAuth() {
    const isAuth = sessionStorage.getItem("adminAuthenticated");
    if (isAuth === "true") {
        document.getElementById("loginBox").style.display = "none";
        document.getElementById("adminContent").style.display = "block";
        loadAllPlayers();
    } else {
        document.getElementById("loginBox").style.display = "block";
        document.getElementById("adminContent").style.display = "none";
    }
}

// Xử lý kiểm tra mật khẩu
window.checkAdminPassword = function() {
    const inputPass = document.getElementById("adminPasswordInput").value;
    if (inputPass === ADMIN_PASSWORD) {
        sessionStorage.setItem("adminAuthenticated", "true");
        checkAuth();
    } else {
        alert("❌ Sai mật khẩu Admin! Bạn không có quyền truy cập.");
        document.getElementById("adminPasswordInput").value = "";
    }
};

window.handleAdminLoginKeyPress = function(e) {
    if (e.key === "Enter") {
        checkAdminPassword();
    }
};

window.logoutAdmin = function() {
    sessionStorage.removeItem("adminAuthenticated");
    location.reload();
};

// =========================================================
// 2. CẤU HÌNH FIREBASE REALTIME DATABASE
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

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();

// =========================================================
// 3. TẢI TẤT CẢ NGƯỜI CHƠI TỪ FIREBASE
// =========================================================
window.loadAllPlayers = function() {
    // Chỉ tải dữ liệu nếu đã đăng nhập thành công
    if (sessionStorage.getItem("adminAuthenticated") !== "true") return;

    const tableBody = document.getElementById("playerListTable");
    tableBody.innerHTML = "<tr><td colspan='5'>Đang tải dữ liệu...</td></tr>";

    database.ref("users").once("value", (snapshot) => {
        tableBody.innerHTML = "";
        
        if (!snapshot.exists()) {
            tableBody.innerHTML = "<tr><td colspan='5'>Chưa có người chơi nào!</td></tr>";
            return;
        }

        snapshot.forEach((childSnapshot) => {
            const uid = childSnapshot.key;
            const player = childSnapshot.val();

            const lastUpdated = player.lastUpdated 
                ? new Date(player.lastUpdated).toLocaleString("vi-VN") 
                : "Chưa rõ";

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><small>${uid}</small></td>
                <td><strong style="color:#ffca28;">${escapeHTML(player.name || "Nông dân")}</strong></td>
                <td>
                    <input type="number" id="money_${uid}" value="${player.money || 0}"> 💰
                </td>
                <td><small>${lastUpdated}</small></td>
                <td>
                    <button class="btn btn-save" onclick="updatePlayer('${uid}')">💾 Lưu</button>
                    <button class="btn btn-delete" onclick="deletePlayer('${uid}')">🗑️ Xóa</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    });
};

// =========================================================
// 4. HÀM CHỈNH SỬA & XÓA NGƯỜI CHƠI
// =========================================================
window.updatePlayer = function(uid) {
    const newMoney = Number(document.getElementById(`money_${uid}`).value);

    if (isNaN(newMoney) || newMoney < 0) {
        alert("❌ Số xu không hợp lệ!");
        return;
    }

    database.ref("users/" + uid).update({
        money: newMoney,
        lastUpdated: firebase.database.ServerValue.TIMESTAMP
    }).then(() => {
        alert("✅ Đã cập nhật thành công!");
    }).catch((error) => {
        alert("❌ Lỗi: " + error.message);
    });
};

window.deletePlayer = function(uid) {
    if (confirm("⚠️ Bạn có chắc chắn muốn XÓA người chơi này khỏi hệ thống?")) {
        database.ref("users/" + uid).remove().then(() => {
            alert("🗑️ Đã xóa người chơi!");
            loadAllPlayers();
        }).catch((error) => {
            alert("❌ Lỗi: " + error.message);
        });
    }
};

function escapeHTML(str) {
    return String(str).replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

// Chạy kiểm tra đăng nhập khi mở trang
window.addEventListener("DOMContentLoaded", () => {
    checkAuth();
});
