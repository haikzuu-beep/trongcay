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
if(garden.length===0){

    for(let i=0;i<16;i++){

        garden.push({
            seed:"",
            stage:0,
            progress:0
        });

    }

}

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
// ===============================
// HỆ THỐNG SINH TRƯỞNG CÂY
// ===============================

const plantData = {

    lua:{
        icon:["🌱","🌿","🌾"],
        time:30,
        reward:30
    },

    carot:{
        icon:["🌱","🌿","🥕"],
        time:45,
        reward:60
    },

    cachua:{
        icon:["🌱","🌿","🍅"],
        time:60,
        reward:90
    },

    bap:{
        icon:["🌱","🌿","🌽"],
        time:90,
        reward:150
    },

    huongduong:{
        icon:["🌱","🌿","🌻"],
        time:120,
        reward:250
    }

};


// sửa dữ liệu khu vườn cũ
for(let i=0;i<16;i++){

    if(typeof garden[i] === "string"){

        if(garden[i]!=""){

            garden[i]={
                seed:garden[i],
                stage:1,
                time:Date.now()
            };

        }
        else{

            garden[i]={
                seed:"",
                stage:0,
                time:0
            };

        }

    }

}


// ===============================
// VẼ LẠI VƯỜN MỚI
// ===============================

function drawGarden(){

    let plots=document.getElementsByClassName("plot");


    for(let i=0;i<plots.length;i++){

        let cell=garden[i];


        if(cell.seed==""){

            plots[i].innerHTML="";

            continue;

        }


        let plant=plantData[cell.seed];


        let passed=(Date.now()-cell.time)/1000;


        if(passed >= plant.time){

            cell.stage=2;

        }
        else if(passed >= plant.time/2){

            cell.stage=1;

        }
        else{

            cell.stage=0;

        }


        plots[i].innerHTML=
        plant.icon[cell.stage];


    }


    saveGame();

}


drawGarden();


// ===============================
// TỰ LỚN THEO THỜI GIAN
// ===============================

setInterval(()=>{

    drawGarden();

},1000);




// ===============================
// TRỒNG CÂY
// ===============================

function plant(index){


    // kiểm tra ô đất
    if(garden[index].seed !== ""){

        alert("🌳 Ô này đã có cây!");

        return;

    }


    // chưa chọn hạt
    if(selectedSeed === ""){

        alert("🌱 Hãy chọn hạt giống trước!");

        return;

    }


    // hết hạt
    if(bag[selectedSeed] <= 0){

        alert("❌ Bạn đã hết hạt giống!");

        return;

    }



    // trừ hạt
    bag[selectedSeed]--;



    // tạo cây mới
    garden[index] = {

        seed: selectedSeed,

        stage: 0,

        time: Date.now()

    };



    saveGame();

    updateUI();

    drawGarden();


}



// ===============================
// CLICK ĐỂ THU HOẠCH
// ===============================

document.addEventListener("click",function(e){


    if(!e.target.classList.contains("plot"))
        return;



    let plots=document.getElementsByClassName("plot");

    let index=Array.from(plots)
    .indexOf(e.target);



    let cell=garden[index];


    if(cell.seed=="")
        return;



    let plant=plantData[cell.seed];


    let grow=(Date.now()-cell.time)/1000;



    if(grow < plant.time){

        alert(
        "🌱 Cây chưa lớn!\nCòn "
        +
        Math.ceil(plant.time-grow)
        +
        " giây"
        );

        return;

    }



    money += plant.reward;



    alert(
    "🎉 Thu hoạch "
    +
    cell.seed
    +
    " +" 
    +
    plant.reward
    +
    " xu"
    );



    garden[index]={

        seed:"",

        stage:0,

        time:0

    };



    saveGame();

    updateUI();

    drawGarden();


});




// ===============================
// NÚT XÓA GAME
// ===============================

function resetGame(){

    if(confirm("Xóa toàn bộ dữ liệu?")){

        localStorage.clear();

        location.reload();

    }

}
