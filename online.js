// Nhập các thư viện Firebase SDK qua CDN Module
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, query, orderBy, limit, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ⚙️ CẤU HÌNH FIREBASE CỦA BẠN (Thay bằng thông tin Firebase Console của bạn sau này)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let currentUsername = "";

// 1. ĐĂNG NHẬP & TẢI DỮ LIỆU
window.loginGame = async function() {
    const nameInput = document.getElementById("playerNameInput").value.trim();
    if (!nameInput) {
        alert("Vui lòng nhập tên nhân vật!");
        return;
    }
    
    currentUsername = nameInput;
    
    // Kiểm tra xem đã có dữ liệu người chơi trên Cloud chưa
    const userRef = doc(db, "players", currentUsername);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
        // Tải dữ liệu từ Server về Game
        const cloudData = docSnap.data();
        loadGameDataFromCloud(cloudData);
        alert(`Chào mừng ${currentUsername} trở lại!`);
    } else {
        // Tạo mới tài khoản trên Cloud
        await saveGameToCloud();
        alert(`Tạo tài khoản ${currentUsername} thành công!`);
    }

    // Hiển thị khung Chat
    document.getElementById("authStatus").style.display = "none";
    document.getElementById("chatBox").style.display = "block";
    document.getElementById("chatInputBox").style.display = "flex";

    // Bắt đầu lắng nghe tin nhắn Chat Real-time
    listenToChatMessages();
    
    // Tự động lưu game lên Cloud mỗi 10 giây
    setInterval(saveGameToCloud, 10000);
}

// 2. TỰ ĐỘNG LƯU TRẠNG THÁI GAME LÊN CLOUD
window.saveGameToCloud = async function() {
    if (!currentUsername) return;

    // Gom toàn bộ biến/dữ liệu game hiện tại
    const gameData = {
        money: window.money || 0,
        level: window.level || 1,
        exp: window.exp || 0,
        merit: window.merit || 0,
        diamond: window.diamond || 0,
        lastUpdated: new Date()
    };

    try {
        await setDoc(doc(db, "players", currentUsername), gameData, { merge: true });
        console.log("Đã đồng bộ dữ liệu lên Cloud!");
    } catch (e) {
        console.error("Lỗi đồng bộ Cloud: ", e);
    }
}

// 3. TẢI DỮ LIỆU TỪ CLOUD VÀO GAME
function loadGameDataFromCloud(data) {
    if (data.money !== undefined) window.money = data.money;
    if (data.level !== undefined) window.level = data.level;
    if (data.exp !== undefined) window.exp = data.exp;
    if (data.merit !== undefined) window.merit = data.merit;
    if (data.diamond !== undefined) window.diamond = data.diamond;
    
    if (typeof updateUI === "function") {
        updateUI();
    }
}

// 4. GỬI TIN NHẮN CHAT
window.sendChatMessage = async function() {
    const input = document.getElementById("chatMessageInput");
    const text = input.value.trim();
    if (!text || !currentUsername) return;

    input.value = "";

    try {
        await addDoc(collection(db, "chats"), {
            user: currentUsername,
            text: text,
            createdAt: new Date()
        });
    } catch (e) {
        console.error("Lỗi gửi chat: ", e);
    }
}

window.handleChatKeyPress = function(e) {
    if (e.key === 'Enter') {
        sendChatMessage();
    }
}

// 5. LẮNG NGHE CHAT REAL-TIME
function listenToChatMessages() {
    const chatRef = collection(db, "chats");
    const q = query(chatRef, orderBy("createdAt", "desc"), limit(20));

    onSnapshot(q, (snapshot) => {
        const messageList = document.getElementById("messageList");
        messageList.innerHTML = "";
        
        let messages = [];
        snapshot.forEach((doc) => {
            messages.push(doc.data());
        });

        messages.reverse().forEach((msg) => {
            const div = document.createElement("div");
            div.className = "chat-item";
            div.innerHTML = `<span class="chat-user">${msg.user}:</span> ${msg.text}`;
            messageList.appendChild(div);
        });

        const chatBox = document.getElementById("chatBox");
        chatBox.scrollTop = chatBox.scrollHeight;
    });
}
