// ==========================================
// 1. CẤU HÌNH FIREBASE CHÍNH THỨC
// ==========================================
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

// Khởi tạo Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// ==========================================
// 2. BIẾN TOÀN CỤC & DỮ LIỆU CHÍNH
// ==========================================
let currentUser = {
    name: localStorage.getItem('playerName') || '',
    money: parseInt(localStorage.getItem('userMoney')) || 200,
    diamond: parseInt(localStorage.getItem('userDiamond')) || 0,
    level: parseInt(localStorage.getItem('userLevel')) || 1,
    exp: parseInt(localStorage.getItem('userExp')) || 0,
    merit: parseInt(localStorage.getItem('userMerit')) || 0,
    luck: parseInt(localStorage.getItem('userLuck')) || 0,
    selectedSeed: null,
    wateringCanLevel: parseInt(localStorage.getItem('canLevel')) || 1,
    seeds: JSON.parse(localStorage.getItem('userSeeds')) || {
        lua: 0, carot: 0, cachua: 0, bap: 0, huongduong: 0,
        dautay: 0, xoai: 0, dua: 0, nho: 0, duahau: 0,
        chuoi: 0, tao: 0, anhdao: 0, hoahong: 0, thong: 0,
        xuongrong: 0, sentuyet: 0, rarePlant: 0
    },
    specialItems: JSON.parse(localStorage.getItem('userSpecialItems')) || {
        box: 0, gem: 0
    },
    monkLevel: parseInt(localStorage.getItem('monkLevel')) || 0
};

// Danh sách tên Bình tưới & Giá nâng cấp
const canNames = ["Bình Nhựa Cùn", "Bình Đồng", "Bình Bạc", "Bình Vàng", "Bình Tiên Chi"];
const canPrices = [0, 500, 2000, 10000, 50000];

// ==========================================
// 3. KHỞI TẠO GAME VÀ LẮNG NGHE FIREBASE
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    updateUI();
    initGarden();
    
    // Nếu đã đăng nhập trước đó thì ẩn form và kích hoạt nghe Firebase
    if (currentUser.name) {
        let authBox = document.getElementById('authStatus');
        if (authBox) authBox.style.display = 'none';
        listenOnlineData();
    }
    
    // Vòng lặp sư thầy tự động gõ mõ mỗi giây
    setInterval(autoMonkGong, 1000);
});

// Cập nhật giao diện toàn hệ thống
function updateUI() {
    // Tiền tệ
    setElemText("money", currentUser.money);
    setElemText("diamondCount", currentUser.diamond);
    setElemText("diamondCountShop", currentUser.diamond);
    setElemText("diamondCountBag", currentUser.diamond);
    
    // Chỉ số nhân vật
    setElemText("level", currentUser.level);
    setElemText("expText", `${currentUser.exp} / ${currentUser.level * 100}`);
    let expPercent = Math.min(100, (currentUser.exp / (currentUser.level * 100)) * 100);
    let expFill = document.getElementById("expFill");
    if (expFill) expFill.style.width = expPercent + "%";

    // Công đức & Vận may
    setElemText("merit", currentUser.merit);
    setElemText("luck", currentUser.luck);
    setElemText("luckPercent", (currentUser.luck * 0.5).toFixed(1) + "%");

    // Trang bị
    setElemText("myCan", canNames[currentUser.wateringCanLevel - 1] || "Bình Nhựa Cùn");
    setElemText("canName", canNames[currentUser.wateringCanLevel] || "Đã Tối Đa");
    setElemText("canPrice", canPrices[currentUser.wateringCanLevel] || "MAX");

    // Túi hạt giống
    for (let seed in currentUser.seeds) {
        setElemText(`${seed}Count`, currentUser.seeds[seed]);
    }
    setElemText("rareSeedCount", currentUser.seeds.rarePlant);
    setElemText("rareSeed", currentUser.seeds.rarePlant);

    // Vật phẩm đặc biệt
    setElemText("boxCount", currentUser.specialItems.box);
    setElemText("gift", currentUser.specialItems.box);
    setElemText("gemCount", currentUser.specialItems.gem);

    // Lưu vào LocalStorage
    saveLocalData();
    
    // Đồng bộ lên Firebase Realtime Database nếu đã vào game
    if (currentUser.name) {
        syncToFirebase();
    }
}

function setElemText(id, val) {
    let el = document.getElementById(id);
    if (el) el.innerText = val;
}

function saveLocalData() {
    localStorage.setItem('userMoney', currentUser.money);
    localStorage.setItem('userDiamond', currentUser.diamond);
    localStorage.setItem('userLevel', currentUser.level);
    localStorage.setItem('userExp', currentUser.exp);
    localStorage.setItem('userMerit', currentUser.merit);
    localStorage.setItem('userLuck', currentUser.luck);
    localStorage.setItem('canLevel', currentUser.wateringCanLevel);
    localStorage.setItem('userSeeds', JSON.stringify(currentUser.seeds));
    localStorage.setItem('userSpecialItems', JSON.stringify(currentUser.specialItems));
    localStorage.setItem('monkLevel', currentUser.monkLevel);
}

// ==========================================
// 4. ĐĂNG NHẬP, CHAT & BẢNG XẾP HẠNG
// ==========================================
function loginGame() {
    let input = document.getElementById('playerNameInput');
    let name = input ? input.value.trim() : '';
    if (!name) {
        alert("Vui lòng nhập tên nhân vật!");
        return;
    }
    currentUser.name = name;
    localStorage.setItem('playerName', name);
    
    let authBox = document.getElementById('authStatus');
    if (authBox) authBox.style.display = 'none';
    
    listenOnlineData();
    syncToFirebase();
    alert(`Chào mừng ${name} đến với Tu Tiên Nông Trại!`);
}

function listenOnlineData() {
    // 1. Chat thế giới (20 tin nhắn gần nhất)
    db.ref('chats').limitToLast(20).on('value', snapshot => {
        let list = document.getElementById('messageList');
        if (!list) return;
        list.innerHTML = '';
        let data = snapshot.val();
        if (data) {
            Object.values(data).forEach(msg => {
                let div = document.createElement('div');
                div.style.marginBottom = "4px";
                div.innerHTML = `<strong style="color:#d4af37;">${msg.sender}:</strong> ${msg.text}`;
                list.appendChild(div);
            });
            list.scrollTop = list.scrollHeight;
        }
    });

    // 2. Bảng xếp hạng Top Xu (10 người cao nhất)
    db.ref('users').orderByChild('money').limitToLast(10).on('value', snapshot => {
        let list = document.getElementById('leaderboardList');
        if (!list) return;
        list.innerHTML = '';
        let users = [];
        snapshot.forEach(child => {
            users.push(child.val());
        });
        users.reverse(); // Đưa người nhiều xu nhất lên top 1
        users.forEach((u, index) => {
            let li = document.createElement('li');
            li.innerHTML = `<b>#${index + 1} ${u.name || 'Vô danh'}</b>: ${u.money || 0} Xu`;
            list.appendChild(li);
        });
    });
}

function sendChatMessage() {
    if (!currentUser.name) {
        alert("Bạn cần vào game trước khi chat!");
        return;
    }
    let input = document.getElementById('chatMessageInput');
    let text = input ? input.value.trim() : '';
    if (!text) return;

    db.ref('chats').push({
        sender: currentUser.name,
        text: text,
        timestamp: Date.now()
    });
    input.value = '';
}

function handleChatKeyPress(e) {
    if (e.key === 'Enter') sendChatMessage();
}

function syncToFirebase() {
    if (!currentUser.name) return;
    db.ref('users/' + currentUser.name).set({
        name: currentUser.name,
        money: currentUser.money,
        level: currentUser.level,
        merit: currentUser.merit,
        lastOnline: Date.now()
    });
}

// ==========================================
// 5. VƯỜN CÂY & TRỒNG TRỌT
// ==========================================
function initGarden() {
    let plots = document.querySelectorAll('.plot');
    plots.forEach((plot, index) => {
        plot.onclick = () => handlePlotClick(plot, index);
    });
}

function selectSeed(seedType) {
    if (currentUser.seeds[seedType] > 0) {
        currentUser.selectedSeed = seedType;
        let nameMap = { 
            lua: "Lúa", carot: "Cà Rốt", cachua: "Cà Chua", bap: "Bắp", 
            huongduong: "Hướng Dương", dautay: "Dâu Tây", xoai: "Xoài", 
            dua: "Dứa", nho: "Nho", duahau: "Dưa Hấu", chuoi: "Chuối", 
            tao: "Táo", anhdao: "Anh Đào", hoahong: "Hoa Hồng", 
            thong: "Cây Thông", xuongrong: "Xương Rồng", sentuyet: "Sen Tuyết",
            rarePlant: "Hạt Hiếm" 
        };
        setElemText("selected", nameMap[seedType] || seedType);
    } else {
        alert("Bạn đã hết loại hạt giống này!");
    }
}

function handlePlotClick(plot, index) {
    if (!plot.dataset.planted) {
        // Trồng cây
        if (!currentUser.selectedSeed) {
            alert("Vui lòng chọn hạt giống trong Túi Đồ trước!");
            return;
        }
        if (currentUser.seeds[currentUser.selectedSeed] <= 0) {
            alert("Đã hết hạt giống loại này!");
            return;
        }
        
        currentUser.seeds[currentUser.selectedSeed]--;
        plot.dataset.planted = "true";
        plot.dataset.type = currentUser.selectedSeed;
        plot.innerText = "🌱";
        
        // Cây lớn sau 5 giây
        setTimeout(() => {
            plot.innerText = "🌳";
            plot.dataset.ready = "true";
        }, 5000);

        updateUI();
    } else if (plot.dataset.ready === "true") {
        // Thu hoạch
        let earned = 50;
        let expGained = 20;
        currentUser.money += earned;
        addExp(expGained);
        
        plot.innerText = "";
        delete plot.dataset.planted;
        delete plot.dataset.ready;
        delete plot.dataset.type;

        updateUI();
    }
}

function addExp(amount) {
    currentUser.exp += amount;
    let nextExp = currentUser.level * 100;
    if (currentUser.exp >= nextExp) {
        currentUser.level++;
        currentUser.exp -= nextExp;
        alert(`🎉 Chúc mừng bạn đã thăng lên Cấp ${currentUser.level}!`);
    }
}

// ==========================================
// 6. GÕ MÕ, SƯ THẦY & CÔNG ĐỨC
// ==========================================
function gong() {
    currentUser.merit += 1;
    let gongBox = document.getElementById('gong');
    if (gongBox) {
        gongBox.style.transform = 'scale(1.2)';
        setTimeout(() => gongBox.style.transform = 'scale(1)', 100);
    }
    updateUI();
}

function prayLuck() {
    if (currentUser.merit >= 100) {
        currentUser.merit -= 100;
        currentUser.luck += 1;
        updateUI();
    } else {
        alert("Bạn không đủ Công đức (Cần 100)!");
    }
}

function prayLuckAdvanced() {
    if (currentUser.merit >= 1000) {
        currentUser.merit -= 1000;
        currentUser.luck += 12;
        updateUI();
    } else {
        alert("Bạn không đủ Công đức (Cần 1.000)!");
    }
}

function hireMonk(type) {
    let prices = [0, 1000, 5000, 10000, 50000];
    if (currentUser.money >= prices[type]) {
        currentUser.money -= prices[type];
        currentUser.monkLevel = type;
        
        let names = ["", "Sư thầy (+1/s)", "Đại sư (+5/s)", "Trụ trì (+10/s)", "Tổ sư (+60/s)"];
        setElemText("monkStatus", `Đã thuê: ${names[type]}`);
        updateUI();
    } else {
        alert("Bạn không đủ Xu để thuê!");
    }
}

function autoMonkGong() {
    let rates = [0, 1, 5, 10, 60];
    if (currentUser.monkLevel > 0) {
        currentUser.merit += rates[currentUser.monkLevel];
        updateUI();
    }
}

// ==========================================
// 7. CỬA HÀNG & MUA SẮM
// ==========================================
function buySeed(seedType, price) {
    if (currentUser.money >= price) {
        currentUser.money -= price;
        currentUser.seeds[seedType] = (currentUser.seeds[seedType] || 0) + 1;
        updateUI();
    } else {
        alert("Bạn không đủ Xu!");
    }
}

function buyWateringCan() {
    let lvl = currentUser.wateringCanLevel;
    if (lvl >= canPrices.length - 1) {
        alert("Bình tưới của bạn đã đạt cấp tối đa!");
        return;
    }
    let price = canPrices[lvl];
    if (currentUser.money >= price) {
        currentUser.money -= price;
        currentUser.wateringCanLevel++;
        updateUI();
        alert("Nâng cấp bình tưới thành công!");
    } else {
        alert("Bạn không đủ Xu!");
    }
}

function upgradeFarm() {
    alert("Chức năng mở rộng ô đất nông trại đã ở trạng thái tốt nhất!");
}

function buyGem() {
    if (currentUser.money >= 50000) {
        currentUser.money -= 50000;
        currentUser.specialItems.gem++;
        updateUI();
    } else {
        alert("Không đủ 50.000 Xu!");
    }
}

function breakGem() {
    if (currentUser.specialItems.gem > 0) {
        currentUser.specialItems.gem--;
        let reward = Math.floor(Math.random() * 20) + 5;
        currentUser.diamond += reward;
        alert(`Bạn đập đá quý và nhận được ${reward} Kim Cương (💎)!`);
        updateUI();
    } else {
        alert("Bạn không có Đá Quý Thô trong túi!");
    }
}

function exchangeDiamond() {
    if (currentUser.diamond >= 1) {
        currentUser.diamond -= 1;
        currentUser.money += 1000;
        updateUI();
    } else {
        alert("Bạn không đủ Kim Cương!");
    }
}

function spinLuckyWheel() {
    if (currentUser.diamond >= 5) {
        currentUser.diamond -= 5;
        let rewards = [
            { text: "💎 10 KC", run: () => currentUser.diamond += 10 },
            { text: "💰 500 Xu", run: () => currentUser.money += 500 },
            { text: "🎁 Hộp quà", run: () => currentUser.specialItems.box++ },
            { text: "🌱 Hạt hiếm", run: () => currentUser.seeds.rarePlant++ },
            { text: "💰 1000 Xu", run: () => currentUser.money += 1000 },
            { text: "💎 5 KC", run: () => currentUser.diamond += 5 }
        ];
        let rand = Math.floor(Math.random() * rewards.length);
        rewards[rand].run();
        setElemText("wheelResult", `Bạn trúng: ${rewards[rand].text}`);
        updateUI();
    } else {
        alert("Cần 5 Kim Cương cho mỗi lượt quay!");
    }
}

function openGift() {
    if (currentUser.specialItems.box > 0) {
        currentUser.specialItems.box--;
        let bonus = Math.floor(Math.random() * 2000) + 500;
        currentUser.money += bonus;
        alert(`Mở hộp quà nhận được ${bonus} Xu!`);
        updateUI();
    } else {
        alert("Bạn không có Hộp Quà nào!");
    }
}

function buyAnimal(type, price) {
    if (currentUser.money >= price) {
        currentUser.money -= price;
        let list = document.getElementById("animalList");
        if (list) {
            let names = { chicken: "🐔 Gà Mái", cow: "🐄 Bò Tiên", pig: "🐖 Heo Kim Giáp" };
            let div = document.createElement("div");
            div.className = "shopItem";
            div.innerHTML = `<h3>${names[type]}</h3><p>Đang cho thu hoạch...</p>`;
            if (list.innerHTML.includes("Chưa có con vật")) list.innerHTML = "";
            list.appendChild(div);
        }
        updateUI();
        alert("Mua thú nuôi thành công!");
    } else {
        alert("Bạn không đủ Xu!");
    }
}
// ==========================================
// 8. XỬ LÝ CHUYỂN TAB GIAO DIỆN
// ==========================================
function openTab(evt, tabName) {
    // Ẩn tất cả các nội dung tab
    let tabcontents = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontents.length; i++) {
        tabcontents[i].style.display = "none";
    }

    // Bỏ class 'active' khỏi tất cả các nút tab
    let tablinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Hiển thị tab được chọn và thêm class 'active' cho nút vừa bấm
    let targetTab = document.getElementById(tabName);
    if (targetTab) {
        targetTab.style.display = "block";
    }
    
    if (evt && evt.currentTarget) {
        evt.currentTarget.className += " active";
    }
}
