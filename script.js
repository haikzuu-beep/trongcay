// ===============================
// DỮ LIỆU GAME
// ===============================

let money = Number(localStorage.getItem("money")) || 200;

let selectedSeed = "";

let bag = JSON.parse(localStorage.getItem("bag")) || {
    lua:0,
    carot:0,
    cachua:0,
    bap:0,
    huongduong:0
};

let garden = JSON.parse(localStorage.getItem("garden")) || new Array(16).fill("");


// ===============================
// HIỂN THỊ
// ===============================

function updateUI(){

    document.getElementById("money").innerText = money;

    document.getElementById("luaCount").innerText = bag.lua;

    document.getElementById("carotCount").innerText = bag.carot;

    document.getElementById("cachuaCount").innerText = bag.cachua;

    document.getElementById("bapCount").innerText = bag.bap;

    document.getElementById("huongduongCount").innerText = bag.huongduong;

    document.getElementById("selected").innerText =
    selectedSeed=="" ? "Chưa chọn" : selectedSeed;

}

updateUI();


// ===============================
// LƯU GAME
// ===============================

function saveGame(){

    localStorage.setItem("money",money);

    localStorage.setItem("bag",JSON.stringify(bag));

    localStorage.setItem("garden",JSON.stringify(garden));

}


// ===============================
// CHUYỂN MENU
// ===============================

function openTab(name){

    let tabs=document.getElementsByClassName("tab");

    for(let t of tabs){

        t.style.display="none";

    }

    document.getElementById(name).style.display="block";

}
// ===============================
// MUA HẠT GIỐNG
// ===============================

function buySeed(type, price){

    if(money < price){
        alert("❌ Bạn không đủ xu!");
        return;
    }

    money -= price;
    bag[type]++;

    saveGame();
    updateUI();

    alert("✅ Đã mua thành công!");
}


// ===============================
// CHỌN HẠT GIỐNG
// ===============================

function selectSeed(type){

    if(bag[type] <= 0){
        alert("❌ Bạn không có hạt giống này!");
        return;
    }

    selectedSeed = type;

    let name = "";

    switch(type){

        case "lua":
            name = "🌾 Hạt lúa";
            break;

        case "carot":
            name = "🥕 Hạt cà rốt";
            break;

        case "cachua":
            name = "🍅 Hạt cà chua";
            break;

        case "bap":
            name = "🌽 Hạt bắp";
            break;

        case "huongduong":
            name = "🌻 Hạt hướng dương";
            break;

    }

    document.getElementById("selected").innerText = name;

}


// ===============================
// HIỂN THỊ KHU VƯỜN
// ===============================

function drawGarden(){

    let plots = document.getElementsByClassName("plot");

    for(let i=0;i<plots.length;i++){

        if(garden[i] == ""){
            plots[i].innerHTML = "";
        }

        if(garden[i] == "lua"){
            plots[i].innerHTML = "🌾";
        }

        if(garden[i] == "carot"){
            plots[i].innerHTML = "🥕";
        }

        if(garden[i] == "cachua"){
            plots[i].innerHTML = "🍅";
        }

        if(garden[i] == "bap"){
            plots[i].innerHTML = "🌽";
        }

        if(garden[i] == "huongduong"){
            plots[i].innerHTML = "🌻";
        }

    }

}

drawGarden();// ===============================
// TRỒNG CÂY
// ===============================

function plant(index){

    // Ô đã có cây
    if(garden[index] != ""){
        alert("🌳 Ô này đã có cây rồi!");
        return;
    }

    // Chưa chọn hạt
    if(selectedSeed == ""){
        alert("🌱 Hãy vào Túi đồ và chọn hạt giống trước!");
        return;
    }

    // Hết hạt
    if(bag[selectedSeed] <= 0){
        alert("❌ Bạn đã hết hạt giống này!");
        return;
    }

    // Trồng
    bag[selectedSeed]--;
    garden[index] = selectedSeed;

    saveGame();
    updateUI();
    drawGarden();

}


// ===============================
// THU HOẠCH
// (tạm thời bằng nút chuột phải)
// ===============================

document.addEventListener("contextmenu", function(e){

    if(!e.target.classList.contains("plot")) return;

    e.preventDefault();

    let plots = document.getElementsByClassName("plot");

    let index = Array.from(plots).indexOf(e.target);

    if(index == -1) return;

    if(garden[index] == ""){
        alert("🌱 Ô này chưa có cây!");
        return;
    }

    let reward = 0;

    switch(garden[index]){

        case "lua":
            reward = 30;
            break;

        case "carot":
            reward = 60;
            break;

        case "cachua":
            reward = 90;
            break;

        case "bap":
            reward = 150;
            break;

        case "huongduong":
            reward = 250;
            break;

    }

    money += reward;

    garden[index] = "";

    saveGame();
    updateUI();
    drawGarden();

    alert("🎉 Thu hoạch thành công! +" + reward + " xu");

});


// ===============================
// KHỞI ĐỘNG GAME
// ===============================

updateUI();
drawGarden();
