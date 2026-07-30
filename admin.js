// =========================================================
// 3. TẢI TẤT CẢ NGƯỜI CHƠI TỪ FIREBASE (ĐÃ TỐI ƯU REALTIME)
// =========================================================
window.loadAllPlayers = function() {
    // Chỉ tải dữ liệu nếu đã đăng nhập thành công
    if (sessionStorage.getItem("adminAuthenticated") !== "true") return;

    const tableBody = document.getElementById("playerListTable");
    if (!tableBody) {
        console.error("❌ Không tìm thấy thẻ <tbody id='playerListTable'> trong admin.html!");
        return;
    }

    tableBody.innerHTML = "<tr><td colspan='5'>⏳ Đang tải dữ liệu từ Firebase...</td></tr>";

    // Lắng nghe trực tiếp Realtime từ node "users"
    database.ref("users").on("value", (snapshot) => {
        tableBody.innerHTML = "";
        
        if (!snapshot.exists()) {
            tableBody.innerHTML = "<tr><td colspan='5'>⚠️ Chưa có người chơi nào trong cơ sở dữ liệu! <br><small>(Hãy vào trang index.html và bấm 'Vào Game (Online)' để tạo dữ liệu)</small></td></tr>";
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
    }, (error) => {
        console.error("Lỗi Firebase:", error);
        tableBody.innerHTML = `<tr><td colspan='5' style='color:red;'>❌ Bị từ chối truy cập! Kiểm tra cấu hình Rules trên Firebase Console.<br>Lỗi: ${error.message}</td></tr>`;
    });
};
