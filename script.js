// ===============================
// DỮ LIỆU GAME
// ===============================

// Tiền
let money = localStorage.getItem("money") !== null
    ? Number(localStorage.getItem("money"))
    : 136;

// Cấp
let level = localStorage.getItem("level") !== null
    ? Number(localStorage.getItem("level"))
    : 1;

// Kinh nghiệm
let exp = localStorage.getItem("exp") !== null
    ? Number(localStorage.getItem("exp"))
    : 0;

// Kim cương
let diamonds = localStorage.getItem("diamonds") !== null
    ? Number(localStorage.getItem("diamonds"))
    : 30;

// Hộp bí ẩn
let gifts = localStorage.getItem("gifts") !== null
    ? Number(localStorage.getItem("gifts"))
    : 10;

// Hạt giống hiếm
let rareSeeds = localStorage.getItem("rareSeeds") !== null
    ? Number(localStorage.getItem("rareSeeds"))
    : 5;

// Đá quý
let gems = localStorage.getItem("gems") !== null
    ? Number(localStorage.getItem("gems"))
    : 0;

// Cấp độ nông trại
let farmLevel = localStorage.getItem("farmLevel") !== null
    ? Number(localStorage.getItem("farmLevel"))
    : 1;

// Công đức & May mắn
let merit = localStorage.getItem("merit") !== null
    ? Number(localStorage.getItem("merit"))
    : 0;

let luckRate = localStorage.getItem("luckRate") !== null
    ? Number(localStorage.getItem("luckRate"))
    : 0;

let monkWorking = false;
let monkTimer = null;
let selectedSeed = "";

// ===============================
// HỆ THỐNG TRANG TRẠI THÚ NUÔI (MỚI)
// ===============================

// Dữ liệu cấu hình các loại vật nuôi
const animalData = {
    chicken: {
        name: "Gà Mái Tinh Nghịch",
        icon: "🐔",
        productIcon: "🥚",
        productName: "Trứng gà",
        feedCost: 20, // Tốn 20 Xu mỗi lần cho ăn
        produceTime: 30, // 30 giây đẻ 1 trứng
        reward: 80 // Bán trứng được 80 Xu
    },
    cow: {
        name: "Bò biết bay",
        icon: "🐄",
        productIcon: "🥛",
        productName: "Sữa bò",
        feedCost: 50,
        produceTime: 60, // 60 giây ra 1 bình sữa
        reward: 220
    },
    pig: {
        name: "Heo ủn ỉn",
        icon: "🐖",
        productIcon: "🪙",
        productName: "Vàng thỏi",
        feedCost: 100,
        produceTime: 120, // 120 giây ra 1 vàng thỏi
        reward: 500
    }
};

// Mảng chứa danh sách vật nuôi đang sở hữu
let myAnimals = JSON.parse(localStorage.getItem("myAnimals")) || [];

// 1. Mua vật nuôi
function buyAnimal(type, price) {
    if (money < price) {
        alert("❌ Xu đâu mà đòi mua thú nuôi hả cưng, XU ĐÂUUU!");
        return;
    }

    money -= price;
    myAnimals.push({
        id: Date.now() + Math.random(), // ID định danh duy nhất
        type: type,
        hungry: true, // Mới mua về sẽ bị đói
        lastFedTime: 0
    });

    saveGame();
    updateUI();
    renderAnimals();
    alert("🎉 Bạn đã mua thành công " + animalData[type].name + "!");
}

// 2. Cho thú ăn
function feedAnimal(index) {
    let animal = myAnimals[index];
    if (!animal) return;

    let config = animalData[animal.type];

    if (!animal.hungry) {
        alert("💤 " + config.name + " đang no và đang tạo sản phẩm, không cần ăn thêm!");
        return;
    }

    if (money < config.feedCost) {
        alert("❌ Không đủ " + config.feedCost + " Xu để mua thức ăn!");
        return;
    }

    money -= config.feedCost;
    animal.hungry = false;
    animal.lastFedTime = Date.now();

    saveGame();
    updateUI();
    renderAnimals();
    alert("🌾 Đã cho " + config.name + " ăn! Hãy đợi thu hoạch sản phẩm.");
}

// 3. Thu hoạch sản phẩm từ thú
function harvestAnimal(index) {
    let animal = myAnimals[index];
    if (!animal) return;

    let config = animalData[animal.type];

    if (animal.hungry) {
        alert("🌾 Con vật này đang đói, hãy cho ăn trước!");
        return;
    }

    let elapsed = (Date.now() - animal.lastFedTime) / 1000;
    if (elapsed < config.produceTime) {
        let timeLeft = Math.ceil(config.produceTime - elapsed);
        alert("⏳ " + config.name + " chưa tạo xong " + config.productName + "!\nCòn " + timeLeft + " giây nữa.");
        return;
    }

    // Thu hoạch thành công
    money += config.reward;
    addExp(15);

    // Chuyển lại trạng thái đói để đợi lượt ăn tiếp theo
    animal.hungry = true;
    animal.lastFedTime = 0;

    saveGame();
    updateUI();
    renderAnimals();
    alert("🎉 Thu hoạch thành công " + config.productName + "!\n+" + config.reward + " Xu\n+15 EXP");
}

// 4. Render giao diện danh sách thú nuôi
function renderAnimals() {
    let container = document.getElementById("animalList");
    if (!container) return;

    if (myAnimals.length === 0) {
        container.innerHTML = "<p>Chưa có con vật nào trong trang trại.</p>";
        return;
    }

    let html = "";
    myAnimals.forEach((animal, index) => {
        let config = animalData[animal.type];
        let statusText = "";
        let buttonHTML = "";

        if (animal.hungry) {
            statusText = "<span style='color: #ff5252;'>🔴 Đang đói</span>";
            buttonHTML = `<button onclick="feedAnimal(${index})">🌾 Cho ăn (${config.feedCost} Xu)</button>`;
        } else {
            let elapsed = (Date.now() - animal.lastFedTime) / 1000;
            let percent = Math.min(100, Math.floor((elapsed / config.produceTime) * 100));

            if (percent >= 100) {
                statusText = "<span style='color: #4caf50;'>🟢 Đã có sản phẩm!</span>";
                buttonHTML = `<button onclick="harvestAnimal(${index})">${config.productIcon} Thu hoạch (${config.reward} Xu)</button>`;
            } else {
                let timeLeft = Math.ceil(config.produceTime - elapsed);
                statusText = `🟡 Đang sản xuất (${percent}%) - còn ${timeLeft}s`;
                buttonHTML = `<button onclick="harvestAnimal(${index})">⏳ Đợi tạo xong...</button>`;
            }
        }

        html += `
            <div class="shopItem" style="border: 1px solid rgba(255,255,255,0.2); padding: 10px; border-radius: 8px;">
                <h3>${config.icon} ${config.name}</h3>
                <p>Trạng thái: <strong>${statusText}</strong></p>
                <p>Sản phẩm: ${config.productIcon} ${config.productName}</p>
                ${buttonHTML}
            </div>
        `;
    });

    container.innerHTML = html;
}

// Chạy vòng lặp cập nhật đếm ngược thời gian sản xuất của thú
setInterval(() => {
    let animalTab = document.getElementById("animals");
    if (animalTab && animalTab.style.display !== "none") {
        renderAnimals();
    }
}, 1000);

// ===============================
// QUẢN LÝ Ô ĐẤT NÔNG TRẠI
// ===============================

function getMaxPlots() {
    return 12 + (farmLevel * 4);
}

let garden = JSON.parse(localStorage.getItem("garden")) || [];

function syncGardenPlots() {
    let currentMax = getMaxPlots();
    while (garden.length < currentMax) {
        garden.push({
            seed: "",
            stage: 0,
            time: 0
        });
    }

    // Convert dữ liệu cũ nếu lưu dạng chuỗi
    for (let i = 0; i < garden.length; i++) {
        if (typeof garden[i] === "string") {
            if (garden[i] !== "") {
                garden[i] = {
                    seed: garden[i],
                    stage: 1,
                    time: Date.now()
                };
            } else {
                garden[i] = {
                    seed: "",
                    stage: 0,
                    time: 0
                };
            }
        }
    }
}

syncGardenPlots();

// ===============================
// QUẢN LÝ TÚI ĐỒ & BÌNH TƯỚI
// ===============================

let bag = JSON.parse(localStorage.getItem("bag")) || {};

const defaultBagKeys = [
    "lua", "carot", "cachua", "bap", "huongduong", "dautay", 
    "xoai", "dua", "nho", "duahau", "chuoi", "tao", 
    "anhdao", "hoahong", "thong", "xuongrong", "rarePlant"
];

defaultBagKeys.forEach(key => {
    bag[key] ??= 0;
});

let wateringCan = JSON.parse(localStorage.getItem("wateringCan")) || null;

const wateringData = {
    basic: { name: "⭐ Bình tưới Sơ cấp", reduceTime: 5000, durability: 10, price: 1500 },
    normal: { name: "⭐⭐ Bình tưới Thường", reduceTime: 10000, durability: 10, price: 10000 },
    advanced: { name: "⭐⭐⭐ Bình tưới Cao cấp", reduceTime: 20000, durability: 20, price: 20000 },
    vip: { name: "⭐⭐⭐⭐ Bình tưới VIP", reduceTime: 35000, durability: 30, price: 35000 },
    legendary: { name: "⭐⭐⭐⭐⭐ Bình tưới Huyền thoại", reduceTime: 60000, durability: 50, price: 60000 }
};

function randomWateringCan() {
    let r = Math.random() * 100;
    let basic = 50 - luckRate * 0.2;
    let normal = 25 - luckRate * 0.1;
    let advanced = 15 + luckRate * 0.15;
    let vip = 8 + luckRate * 0.1;

    if (r < basic) return "basic";
    if (r < basic + normal) return "normal";
    if (r < basic + normal + advanced) return "advanced";
    if (r < basic + normal + advanced + vip) return "vip";
    return "legendary";
}

let todayCan = randomWateringCan();

// ===============================
// HỆ THỐNG CÂY TRỒNG
// ===============================

const plantData = {
    lua: { icon: ["🌱", "🌿", "🌾"], time: 7, reward: 30 },
    carot: { icon: ["🌱", "🌿", "🥕"], time: 14, reward: 60 },
    cachua: { icon: ["🌱", "🪴", "🍅"], time: 24, reward: 90 },
    bap: { icon: ["🌱", "🪴", "🌽"], time: 34, reward: 150 },
    huongduong: { icon: ["🌱", "🪴", "🌻"], time: 44, reward: 250 },
    dautay: { icon: ["🌱", "🪴", "🍓"], time: 44, reward: 200 },
    xoai: { icon: ["🌱", "🌳", "🥭"], time: 54, reward: 360 },
    dua: { icon: ["🌱", "🪴", "🍍"], time: 50, reward: 310 },
    nho: { icon: ["🌱", "🌿", "🍇"], time: 60, reward: 670 },
    duahau: { icon: ["🌱", "🌿", "🍉"], time: 70, reward: 400 },
    chuoi: { icon: ["🌱", "🌴", "🍌"], time: 80, reward: 500 },
    tao: { icon: ["🌱", "🌳", "🍎"], time: 90, reward: 600 },
    anhdao: { icon: ["🌱", "🌸", "🍒"], time: 100, reward: 1000 },
    hoahong: { icon: ["🌱", "🌹", "🌹"], time: 40, reward: 1367 },
    thong: { icon: ["🌱", "🌲", "🌲"], time: 120, reward: 1000 },
    xuongrong: { icon: ["🌱", "🌵", "🌵"], time: 110, reward: 1500 },
    rarePlant: { icon: ["🌱", "🌳", "🌈"], time: 3600, reward: 2500 }
};

function expNeed() {
    return Math.floor(100 * Math.pow(1.5, level - 1));
}

// ===============================
// CẬP NHẬT GIAO DIỆN (UI)
// ===============================

function updateUI() {
    if (document.getElementById("money")) document.getElementById("money").innerText = money.toLocaleString("vi-VN");
    if (document.getElementById("level")) document.getElementById("level").innerText = level;

    if (document.getElementById("expText")) document.getElementById("expText").innerText = exp + " / " + expNeed();
    if (document.getElementById("expFill")) document.getElementById("expFill").style.width = Math.min(100, (exp / expNeed() * 100)) + "%";

    // Cập nhật số lượng vật phẩm túi đồ
    defaultBagKeys.forEach(key => {
        let elem = document.getElementById(key + "Count");
        if (elem) elem.innerText = bag[key];
    });

    const seedName = {
        lua: "🌾 Hạt lúa", carot: "🥕 Hạt cà rốt", cachua: "🍅 Hạt cà chua", bap: "🌽 Hạt bắp",
        huongduong: "🌻 Hạt hướng dương", dautay: "🍓 Hạt dâu tây", xoai: "🥭 Hạt xoài",
        dua: "🍍 Hạt dứa", nho: "🍇 Hạt nho", duahau: "🍉 Hạt dưa hấu", chuoi: "🍌 Hạt chuối",
        tao: "🍎 Hạt táo", anhdao: "🍒 Hạt anh đào", hoahong: "🌹 Hạt hoa hồng",
        thong: "🌲 Hạt cây thông", xuongrong: "🌵 Hạt Xương rồng", rarePlant: "🌈 Cây hiếm"
    };

    if (document.getElementById("selected")) {
        document.getElementById("selected").innerText = selectedSeed === "" ? "Chưa chọn" : (seedName[selectedSeed] || "Chưa chọn");
    }

    if (document.getElementById("myCan")) {
        if (wateringCan) {
            document.getElementById("myCan").innerText =
                wateringData[wateringCan.type].name + " | Độ bền: " + wateringCan.durability + "/" + wateringData[wateringCan.type].durability;
        } else {
            document.getElementById("myCan").innerText = "Chưa có bình tưới";
        }
    }

    if (document.getElementById("merit")) document.getElementById("merit").innerText = merit;
    if (document.getElementById("luck")) document.getElementById("luck").innerText = luckRate + "%";
    if (document.getElementById("luckPercent")) document.getElementById("luckPercent").innerText = luckRate + "%";

    if (document.getElementById("canName") && todayCan) {
        document.getElementById("canName").innerText = wateringData[todayCan].name;
        document.getElementById("canPrice").innerText = wateringData[todayCan].price.toLocaleString("vi-VN");
    }

    if (document.getElementById("gemCount")) document.getElementById("gemCount").innerText = gems;
    if (document.getElementById("diamondCount")) document.getElementById("diamondCount").innerText = diamonds;
    if (document.getElementById("diamondCountShop")) document.getElementById("diamondCountShop").innerText = diamonds;
    if (document.getElementById("diamondCountBag")) document.getElementById("diamondCountBag").innerText = diamonds;
    if (document.getElementById("gift")) document.getElementById("gift").innerText = gifts;
    if (document.getElementById("boxCount")) document.getElementById("boxCount").innerText = gifts;
    if (document.getElementById("rareSeed")) document.getElementById("rareSeed").innerText = rareSeeds;
    if (document.getElementById("rareSeedCount")) document.getElementById("rareSeedCount").innerText = rareSeeds;
    if (document.getElementById("farmLevel")) document.getElementById("farmLevel").innerText = farmLevel;
}

// ===============================
// LƯU GAME & TIẾN TRÌNH
// ===============================

function saveGame() {
    localStorage.setItem("money", money);
    localStorage.setItem("level", level);
    localStorage.setItem("exp", exp);
    localStorage.setItem("merit", merit);
    localStorage.setItem("luckRate", luckRate);
    localStorage.setItem("bag", JSON.stringify(bag));
    localStorage.setItem("garden", JSON.stringify(garden));
    localStorage.setItem("wateringCan", JSON.stringify(wateringCan));
    localStorage.setItem("diamonds", diamonds);
    localStorage.setItem("gifts", gifts);
    localStorage.setItem("rareSeeds", rareSeeds);
    localStorage.setItem("farmLevel", farmLevel);
    localStorage.setItem("gems", gems);
    localStorage.setItem("myAnimals", JSON.stringify(myAnimals)); // Lưu thú nuôi

    // 🏆 TỰ ĐỘNG CẬP NHẬT BẢNG XẾP HẠNG MỖI KHI LƯU GAME
    if (typeof updateLeaderboardData === "function") {
        updateLeaderboardData();
    }
}

function addExp(amount) {
    exp += amount;
    while (exp >= expNeed()) {
        exp -= expNeed();
        level++;
        alert("🎉 Chúc mừng! Bạn đã lên cấp " + level);
    }
    saveGame();
    updateUI();
}

function openTab(name) {
    let tabs = document.getElementsByClassName("tab");
    for (let t of tabs) {
        t.style.display = "none";
    }
    let target = document.getElementById(name);
    if (target) target.style.display = "block";

    // Nếu mở tab animals thì render lại danh sách thú nuôi
    if (name === "animals") {
        renderAnimals();
    }

    // Cập nhật lại màu các nút tab
    let navBtns = document.querySelectorAll(".nav-btn");
    navBtns.forEach(btn => btn.classList.remove("active"));
    if (event && event.target && event.target.classList.contains("nav-btn")) {
        event.target.classList.add("active");
    }
}

function buySeed(type, price) {
    if (money < price) {
        alert("❌ Xu đâu mà đòi mua hả cưng, XU ĐÂUUU");
        return;
    }
    money -= price;
    bag[type]++;
    saveGame();
    updateUI();
    alert("✅ Mua thành công rồi đó!");
}

function selectSeed(type) {
    if (type === "rarePlant") {
        if (rareSeeds <= 0) {
            alert("❌ Bạn không còn Hạt giống hiếm!");
            return;
        }
    } else {
        if (bag[type] <= 0) {
            alert("❌ Hết hạt giống!");
            return;
        }
    }
    selectedSeed = type;
    updateUI();
}

function plant(index) {
    if (garden[index].seed !== "") {
        alert("🌳 Ô này bạn đã trồng cây rồi!");
        return;
    }
    if (selectedSeed === "") {
        alert("🌱 Hãy chọn hạt giống trước!");
        return;
    }
    if (selectedSeed === "rarePlant") {
        if (rareSeeds <= 0) {
            alert("❌ Bạn đã hết Hạt giống hiếm!");
            return;
        }
        rareSeeds--;
    } else {
        if (bag[selectedSeed] <= 0) {
            alert("❌ Bạn đã hết hạt giống này!");
            return;
        }
        bag[selectedSeed]--;
    }

    garden[index] = {
        seed: selectedSeed,
        stage: 0,
        time: Date.now()
    };

    saveGame();
    updateUI();
    drawGarden();
}

document.addEventListener("click", function (e) {
    let plot = e.target.closest(".plot");
    if (!plot) return;

    let plots = document.getElementsByClassName("plot");
    let index = Array.from(plots).indexOf(plot);
    if (index === -1 || index >= garden.length) return;

    let cell = garden[index];

    if (cell.seed === "") {
        plant(index);
        return;
    }

    let plantInfo = plantData[cell.seed];
    let grow = (Date.now() - cell.time) / 1000;

    if (grow < plantInfo.time) {
        alert("🌱 Cây chưa lớn!\nCòn " + Math.ceil(plantInfo.time - grow) + " giây");
        return;
    }

    money += plantInfo.reward;
    addExp(20);

    if (cell.seed === "rarePlant") {
        let randomDiamond = Math.floor(Math.random() * 20) + 1;
        diamonds += randomDiamond;
        alert("🌈 Thu hoạch cây hiếm!\n\n+" + plantInfo.reward + " xu\n+" + randomDiamond + " Kim cương 💎");
    } else {
        dropRareItem();
    }

    garden[index] = {
        seed: "",
        stage: 0,
        time: 0
    };

    saveGame();
    updateUI();
    drawGarden();
});

function drawGarden() {
    let plots = document.getElementsByClassName("plot");
    let currentMax = getMaxPlots();

    for (let i = 0; i < plots.length; i++) {
        if (i >= currentMax) {
            plots[i].style.display = "none";
            continue;
        }

        plots[i].style.display = "flex";
        let cell = garden[i];

        if (!cell || cell.seed === "") {
            plots[i].innerHTML = "";
        } else {
            let plant = plantData[cell.seed];
            let growTime = (Date.now() - cell.time) / 1000;
            let percent = Math.floor((growTime / plant.time) * 100);
            if (percent > 100) percent = 100;

            if (percent >= 100) cell.stage = 2;
            else if (percent >= 50) cell.stage = 1;
            else cell.stage = 0;

            let barLength = 10;
            let filled = Math.floor(percent / 10);
            let bar = "⬛".repeat(filled) + "⬜".repeat(barLength - filled);

            plots[i].innerHTML = `
                <div class="plant">
                    <div class="plantIcon">${plant.icon[cell.stage]}</div>
                    <button onclick="event.stopPropagation(); waterPlant(${i})">💧 Tưới</button>
                    <div class="progress">${bar}</div>
                    <small>${percent}%</small>
                </div>
            `;
        }
    }
}

setInterval(() => {
    drawGarden();
}, 1000);

function waterPlant(index) {
    if (!wateringCan) {
        alert("❌ Bạn chưa có bình tưới!");
        return;
    }
    let cell = garden[index];
    if (cell.seed === "") {
        alert("❌ Ô này chưa có cây!");
        return;
    }
    if (wateringCan.durability <= 0) {
        alert("💥 Bình tưới đã hỏng!");
        return;
    }

    let can = wateringData[wateringCan.type];
    cell.time -= can.reduceTime;
    alert("💧 Tưới thành công!\nGiảm " + (can.reduceTime / 1000) + " giây.");
    wateringCan.durability--;

    if (wateringCan.durability <= 0) {
        alert("💥 Bình tưới đã hỏng hoàn toàn!");
        wateringCan = null;
    }

    saveGame();
    updateUI();
    drawGarden();
}

function buyWateringCan() {
    let can = wateringData[todayCan];
    if (money < can.price) {
        alert("❌ Bạn không đủ tiền mua bình tưới!");
        return;
    }
    money -= can.price;
    wateringCan = {
        type: todayCan,
        durability: can.durability
    };
    todayCan = randomWateringCan();
    saveGame();
    updateUI();
    alert("🎉 Đã mua thành công " + can.name);
}

// ===============================
// CHÙA CÔNG ĐỨC & MÕ
// ===============================

function gong() {
    merit++;
    let gongElem = document.getElementById("gong");
    if (gongElem) {
        gongElem.classList.add("gongShake", "gongLight");
        setTimeout(() => {
            gongElem.classList.remove("gongShake", "gongLight");
        }, 300);
    }

    let text = document.createElement("div");
    text.innerText = "+1 Công đức";
    text.className = "meritText";

    let gongBox = document.getElementById("gongBox");
    if (gongBox) gongBox.appendChild(text);

    setTimeout(() => {
        text.remove();
    }, 1000);

    saveGame();
    updateUI();
}

function prayLuck() {
    if (luckRate >= 100) {
        alert("🍀 Vận may đã đạt tối đa! (100%)");
        return;
    }
    if (merit < 100) {
        alert("🙏 Bạn cần 100 Công đức!");
        return;
    }

    merit -= 100;
    luckRate += 2;

    saveGame();
    updateUI();
    alert("🍀 Phật độ rồi!\n+2 Vận may\n\nHiện tại: " + luckRate + "% may mắn");
}

function hireMonk(type) {
    if (monkWorking) {
        alert("🧘 Đã có sư thầy đang làm việc!");
        return;
    }

    let price = 0;
    let meritPerSecond = 0;
    let name = "";

    switch (type) {
        case 1:
            name = "🧘 Sư thầy";
            price = 1000;
            meritPerSecond = 1;
            break;
        case 2:
            name = "🧘‍♂️ Đại sư";
            price = 5000;
            meritPerSecond = 5;
            break;
        case 3:
            name = "👼 Trụ trì";
            price = 10000;
            meritPerSecond = 10;
            break;
    }

    if (money < price) {
        alert("❌ Không đủ xu!");
        return;
    }

    money -= price;
    monkWorking = true;
    saveGame();
    updateUI();
    alert(name + " bắt đầu gõ mõ!");

    let second = 60;
    monkTimer = setInterval(function () {
        merit += meritPerSecond;
        second--;
        updateUI();
        saveGame();

        if (second <= 0) {
            clearInterval(monkTimer);
            monkWorking = false;
            alert(name + " đã hết giờ tụng kinh.");
        }
    }, 1000);
}

function dropRareItem() {
    let diamondChance = 1 + luckRate * 0.05;
    let giftChance = 2 + luckRate * 0.05;
    let rareSeedChance = 3 + luckRate * 0.08;
    let gemChance = 2 + luckRate * 0.05;

    let chance = Math.random() * 100;
    let received = false;

    if (chance < diamondChance) {
        diamonds++;
        alert("💎 Bạn nhận được Kim cương!");
        received = true;
    } else if (chance < diamondChance + giftChance) {
        gifts++;
        alert("🎁 Bạn nhận được Hộp quà bí ẩn!");
        received = true;
    } else if (chance < diamondChance + giftChance + rareSeedChance) {
        rareSeeds++;
        alert("🌟 Bạn nhận được Hạt giống hiếm!");
        received = true;
    } else if (chance < diamondChance + giftChance + rareSeedChance + gemChance) {
        gems++;
        alert("💎 Bạn nhặt được 1 viên đá quý thô!");
        received = true;
    }

    if (received && luckRate > 0) {
        luckRate = Math.max(0, luckRate - 5);
        alert("🍀 Tỷ lệ may mắn giảm 5%!\nHiện tại: " + luckRate + "%");
    }

    saveGame();
    updateUI();
}

// ===============================
// VÒNG QUAY & HOẠT ĐỘNG KHÁC
// ===============================

function exchangeDiamond() {
    if (diamonds < 1) {
        alert("❌ Bạn không đủ Kim cương!");
        return;
    }
    diamonds--;
    money += 1000;
    saveGame();
    updateUI();
    alert("💎 Đổi thành công!\n-1 Kim cương\n+1000 Xu");
}

let spinning = false;
function spinLuckyWheel() {
    if (spinning) return;
    if (diamonds < 5) {
        alert("❌ Không đủ kim cương!");
        return;
    }

    diamonds -= 5;
    spinning = true;

    let wheel = document.getElementById("wheel");
    let random = Math.floor(Math.random() * 360);

    if (wheel) wheel.style.transform = `rotate(${random + 1800}deg)`;

    setTimeout(() => {
        let reward = Math.floor(Math.random() * 6);
        let result = "";

        switch (reward) {
            case 0: result = "💎 Nhận 10 kim cương"; diamonds += 10; break;
            case 1: result = "💰 Nhận 500 xu"; money += 500; break;
            case 2: result = "🎁 Nhận 1 hộp quà"; gifts++; break;
            case 3: result = "🌱 Nhận hạt giống hiếm"; rareSeeds++; break;
            case 4: result = "💰 Nhận 1000 xu"; money += 1000; break;
            case 5: result = "💎 Nhận 5 kim cương"; diamonds += 5; break;
        }

        if (document.getElementById("wheelResult")) {
            document.getElementById("wheelResult").innerText = result;
        }

        saveGame();
        updateUI();
        spinning = false;
    }, 4000);
}

function openGift() {
    if (gifts <= 0) {
        alert("❌ Bạn không còn Hộp bí ẩn!");
        return;
    }

    gifts--;
    let r = Math.random() * 100;

    if (r < 45) {
        let gold = Math.floor(Math.random() * 4901) + 100;
        money += gold;
        alert("💰 Bạn nhận được " + gold + " Xu!");
    } else if (r < 60) {
        let rd = Math.random() * 100;
        let diamond = rd < 60 ? Math.floor(Math.random() * 5) + 1 : Math.floor(Math.random() * 10) + 6;
        diamonds += diamond;
        alert("💎 Bạn nhận được " + diamond + " Kim cương!");
    } else if (r < 70) {
        rareSeeds++;
        alert("🌟 Bạn nhận được 1 Hạt giống hiếm!");
    } else {
        let list = ["lua", "carot", "cachua", "bap", "huongduong", "dautay", "xoai", "dua", "nho", "duahau", "chuoi", "tao", "anhdao", "hoahong", "thong", "xuongrong"];
        let seed = list[Math.floor(Math.random() * list.length)];
        let amount = Math.floor(Math.random() * 5) + 1;
        bag[seed] += amount;
        alert("🌱 Bạn nhận được " + amount + " hạt giống mới!");
    }

    saveGame();
    updateUI();
}

function upgradeFarm() {
    let price = farmLevel * 20000;
    if (money < price) {
        alert("❌ Không đủ xu!");
        return;
    }

    money -= price;
    farmLevel++;
    syncGardenPlots();

    saveGame();
    updateUI();
    drawGarden();

    alert("🎉 Nông trại lên cấp " + farmLevel + "!\nĐã mở rộng thêm ô đất.");
}

function buyGem() {
    let price = 50000;
    if (money < price) {
        alert("❌ Không đủ xu để mua đá quý thô!");
        return;
    }
    money -= price;
    gems++;
    saveGame();
    updateUI();
    alert("💎 Mua thành công 1 viên Đá quý thô với giá 50.000 Xu!");
}

function breakGem() {
    if (gems <= 0) {
        alert("❌ Bạn không có đá quý!");
        return;
    }
    if (money < 50000) {
        alert("❌ Cần 50.000 Xu để đập đá quý!");
        return;
    }

    gems--;
    money -= 50000;
    let r = Math.random() * 100;

    if (r < 60) {
        let gold = Math.floor(Math.random() * 150000) + 50000;
        money += gold;
        alert("💰 Bạn nhận được " + gold.toLocaleString("vi-VN") + " Xu!");
    } else if (r < 80) {
        let diamond = Math.floor(Math.random() * 10) + 5;
        diamonds += diamond;
        alert("💎 Bạn nhận được " + diamond + " Kim cương!");
    } else {
        rareSeeds += 2;
        alert("🌟 Bạn nhận được 2 Hạt giống hiếm!");
    }

    saveGame();
    updateUI();
}

function buySkin(skinType) {
    alert("🎨 Tính năng trang trí (" + skinType + ") sẽ sớm ra mắt!");
}

// KHỞI CHẠY LẦN ĐẦU KHI TẢI TRANG
window.addEventListener("DOMContentLoaded", () => {
    updateUI();
    drawGarden();
    renderAnimals();
});

// ===============================
// HỆ THỐNG CHAT THẾ GIỚI (FIREBASE)
// ===============================

// Hàm gửi tin nhắn khi bấm nút "Gửi"
function sendChatMessage() {
    const input = document.getElementById("chatMessageInput");
    if (!input) return;

    const messageText = input.value.trim();

    // Kiểm tra tin nhắn trống
    if (messageText === "") return;

    // Kiểm tra xem Firebase đã kết nối thành công chưa
    if (typeof firebase === "undefined" || !firebase.apps.length) {
        alert("❌ Chưa kết nối được tới Firebase database!");
        return;
    }

    // Tên người chơi lấy theo cấp độ hoặc mặc định
    const playerName = "Nông dân Cấp " + level;

    // Đẩy dữ liệu lên Firebase Realtime Database node 'chats'
    firebase.database().ref("chats").push({
        sender: playerName,
        text: messageText,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    }).then(() => {
        input.value = ""; // Xóa trắng ô nhập liệu sau khi gửi thành công
    }).catch((error) => {
        console.error("Lỗi gửi tin nhắn:", error);
        alert("❌ Gửi tin nhắn thất bại! Lỗi: " + error.message);
    });
}

// Hàm hỗ trợ nhấn phím Enter để gửi tin nhắn
function handleChatKeyPress(event) {
    if (event.key === "Enter") {
        sendChatMessage();
    }
}

// Lắng nghe tin nhắn mới từ Firebase và hiển thị ra giao diện
function listenForChatMessages() {
    if (typeof firebase === "undefined" || !firebase.apps.length) return;

    const chatContainer = document.querySelector('[ident="danh sach tin nhan"]') 
                        || document.querySelector('.chat-messages') 
                        || document.getElementById("chatBox");

    // Chỉ lấy 50 tin nhắn mới nhất
    firebase.database().ref("chats").limitToLast(50).on("child_added", (snapshot) => {
        const data = snapshot.val();
        if (!data || !chatContainer) return;

        const msgDiv = document.createElement("div");
        msgDiv.className = "chat-item";
        msgDiv.style.marginBottom = "6px";
        msgDiv.style.color = "#ffffff"; // Đảm bảo chữ màu trắng trên nền tối
        msgDiv.innerHTML = `<strong style="color: #ffca28;">${data.sender}:</strong> <span>${data.text}</span>`;

        chatContainer.appendChild(msgDiv);
        
        // Tự động cuộn xuống tin nhắn mới nhất
        chatContainer.scrollTop = chatContainer.scrollHeight;
    });
}

// Kích hoạt lắng nghe chat khi trang tải xong
window.addEventListener("DOMContentLoaded", () => {
    // Đợi 1 chút để online.js kịp initialize Firebase
    setTimeout(listenForChatMessages, 1000);
});
