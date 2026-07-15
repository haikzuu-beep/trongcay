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

drawGarden();
