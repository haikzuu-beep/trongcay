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
