// ===============================
// DỮ LIỆU GAME
// ===============================

let money = Number(localStorage.getItem("money")) || 136;
let level = Number(localStorage.getItem("level")) || 1;
let exp = Number(localStorage.getItem("exp")) || 0;
function expNeed(){

    return Math.floor(100 * Math.pow(1.5, level - 1));
}

let selectedSeed = "";
// ===============================
// BÌNH TƯỚI
// ===============================

let wateringCan = JSON.parse(localStorage.getItem("wateringCan")) || null;

const wateringData = {

basic:{
        name:"⭐ Bình tưới Sơ cấp",
        reduceTime:5000,
        durability:10,
        price:1000
    },

    normal:{
        name:"⭐⭐ Bình tưới Thường",
        reduceTime:10000,
        durability:10,
        price:5000
    },

    advanced:{
        name:"⭐⭐⭐ Bình tưới Cao cấp",
        reduceTime:20000,
        durability:20,
        price:10000
    },

    vip:{
        name:"⭐⭐⭐⭐ Bình tưới VIP",
        reduceTime:35000,
        durability:20,
        price:30000
    },

    legendary:{
        name:"⭐⭐⭐⭐⭐ Bình tưới Huyền thoại",
        reduceTime:60000,
        durability:20,
        price:50000
    }

};

let bag = JSON.parse(localStorage.getItem("bag")) || {
    lua:0,
    carot:0,
    cachua:0,
    bap:0,
    huongduong:0,
    dautay:0,
    xoai:0,
    dua:0
};

let garden = JSON.parse(localStorage.getItem("garden")) || [];


if(garden.length !== 16){

    garden=[];

    for(let i=0;i<16;i++){

        garden.push({

            seed:"",

            stage:0,

            time:0

        });

    }

}
// ===============================
// HIỂN THỊ
// ===============================

function updateUI(){

    document.getElementById("money").innerText = money;
    document.getElementById("level").innerText = level;

    document.getElementById("expText").innerText =
    exp + " / " + expNeed();

    document.getElementById("expFill").style.width =
    (exp / expNeed() * 100) + "%";
    document.getElementById("luaCount").innerText = bag.lua;

    document.getElementById("carotCount").innerText = bag.carot;

    document.getElementById("cachuaCount").innerText = bag.cachua;

    document.getElementById("bapCount").innerText = bag.bap;

    document.getElementById("huongduongCount").innerText = bag.huongduong;

    document.getElementById("dautayCount").innerText = bag.dautay;

    document.getElementById("xoaiCount").innerText = bag.xoai;

    document.getElementById("duaCount").innerText = bag.dua;

    const seedName = {
    lua:"🌾 Hạt lúa",
    carot:"🥕 Hạt cà rốt",
    cachua:"🍅 Hạt cà chua",
    bap:"🌽 Hạt bắp",
    huongduong:"🌻 Hạt hướng dương",
    dautay:"🍓 Hạt dâu tây",
    xoai:"🥭 Hạt xoài",
    dua:"🍍 Hạt dứa"
};

document.getElementById("selected").innerText =
selectedSeed=="" ? "Chưa chọn" : seedName[selectedSeed];
if(document.getElementById("myCan")){

    if(wateringCan){

        document.getElementById("myCan").innerText =
        wateringData[wateringCan.type].name +
        " | Độ bền: " +
        wateringCan.durability +
        "/" +
        wateringData[wateringCan.type].durability;

    }else{

        document.getElementById("myCan").innerText =
        "Chưa có bình tưới";

    }

}
if(document.getElementById("canName")){

   document.getElementById("canName").innerText =
   wateringData[todayCan].name;

   document.getElementById("canPrice").innerText =
   wateringData[todayCan].price;
 
}

}


// ===============================
// LƯU GAME
// ===============================

function saveGame(){

    localStorage.setItem("money",money);
    localStorage.setItem("level",level);
    localStorage.setItem("exp",exp);

    localStorage.setItem("bag",JSON.stringify(bag));
    localStorage.setItem("garden",JSON.stringify(garden));
    localStorage.setItem("wateringCan",JSON.stringify(wateringCan));
}

function addExp(amount){

    exp += amount;

    while(exp >= expNeed()){

        exp -= expNeed();

        level++;

        alert("🎉 Chúc mừng! Bạn đã lên cấp " + level);

    }

    saveGame();

    updateUI();

}
function randomWateringCan(){

   
    let r=Math.random()*100;

    if(r<50){

        return "basic";

    }

    if(r<75){

        return "normal";

    }

    if(r<90){

        return "advanced";

    }

    if(r<98){

        return "vip";

    }

    return "legendary";

}
let todayCan = randomWateringCan();
updateUI();
function buyWateringCan(){

    let can = wateringData[todayCan];

    if(money < can.price){

        alert("❌ Có tiền không mà đòi mua hả cưng");

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

    alert("🎉 Đủ tiền mua luôn hả? Để mai tăng lên 100k" + can.name);

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
        alert("❌ Xu đâu mà đòi mua hả cưng, XU ĐÂUUU");
        return;
    }

    money -= price;
    bag[type]++;

    saveGame();
    updateUI();

    alert("✅ Mua thành công rồi đó, chia miếng đi. Nói chứ ai thèm.");
}


// ===============================
// CHỌN HẠT GIỐNG
// ===============================

function selectSeed(type){

    if(bag[type] <= 0){
        alert("❌ hạt giống đâu hả mày? có cái lò tôn mà cho free nhé!");
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
        case "dautay":
            name = "🍓 Hạt dâu tây";
            break;

        case "xoai":
            name = "🥭 Hạt xoài";
            break;

        case "dua":
            name = "🍍 Hạt dứa";
            break;
            
    }

    document.getElementById("selected").innerText = name;

}




// ===============================
// KHỞI ĐỘNG GAME
// ===============================


// ===============================
// HỆ THỐNG SINH TRƯỞNG CÂY
// ===============================

const plantData = {

    lua:{
        icon:["🌱","🌿","🌾"],
        time:7,
        reward:30
    },

    carot:{
        icon:["🌱","🌿","🥕"],
        time:14,
        reward:60
    },

    cachua:{
        icon:["🌱","🪴","🍅"],
        time:24,
        reward:90
    },

    bap:{
        icon:["🌱","🪴","🌽"],
        time:34,
        reward:150
    },

    huongduong:{
        icon:["🌱","🪴","🌻"],
        time:44,
        reward:250
    },

    dautay:{
        icon:["🌱","🪴","🍓"],
        time:44,
        reward:200
    },

    xoai:{
        icon:["🌱","🌳","🥭"],
        time:54,
        reward:250
    },

    dua:{
        icon:["🌱","🪴","🍍"],
        time:50,
        reward:210
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
// TRỒNG CÂY
// ===============================

function plant(index){


    // kiểm tra ô đất
    if(garden[index].seed !== ""){

        alert("🌳 Ô này bạn đã trồng cây rồi mà skibidi!");

        return;

    }


    // chưa chọn hạt
    if(selectedSeed === ""){

        alert("🌱 Hãy chọn hạt giống trước đê!");

        return;

    }


    // hết hạt
    if(bag[selectedSeed] <= 0){

        alert("❌ Bạn đã hết hạt giống mất rồi, hãy mua thêm ở cửa hàng!");

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
// CLICK TRỒNG + THU HOẠCH
// ===============================

document.addEventListener("click",function(e){

    let plot = e.target.closest(".plot");

    if(!plot)
        return;


    let plots=document.getElementsByClassName("plot");

    let index=Array.from(plots).indexOf(plot);


    let cell = garden[index];


    // ô trống -> trồng cây
    if(cell.seed === ""){

        plant(index);
        return;

    }



    // ô có cây -> kiểm tra thu hoạch

    let plantInfo = plantData[cell.seed];


    let grow =
    (Date.now()-cell.time)/1000;



    if(grow < plantInfo.time){

        alert(
        "🌱 Cây chưa lớn!\nCòn "
        +
        Math.ceil(plantInfo.time-grow)
        +
        " giây"
        );

        return;

    }



    money += plantInfo.reward;
addExp(20);

const seedName = {
    lua:"🌾 Lúa",
    carot:"🥕 Cà rốt",
    cachua:"🍅 Cà chua",
    bap:"🌽 Bắp",
    huongduong:"🌻 Hướng dương",
    dautay:"🍓 Dâu tây",
    xoai:"🥭 Xoài",
    dua:"🍍 Dứa"
};

alert(
`🎉 Thu hoạch ${seedName[cell.seed]} +${plantInfo.reward} xu`
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
// VẼ VƯỜN + THANH TIẾN TRÌNH
// ===============================

function drawGarden(){

    let plots = document.getElementsByClassName("plot");


    for(let i=0;i<plots.length;i++){


        let cell = garden[i];


        if(cell.seed === ""){

            plots[i].innerHTML = "";

            continue;

        }



        let plant = plantData[cell.seed];



        let growTime =
        (Date.now() - cell.time) / 1000;



        let percent =
        Math.floor(
            (growTime / plant.time) * 100
        );



        if(percent > 100){

            percent = 100;

        }



        // cập nhật giai đoạn cây

        if(percent >= 100){

            cell.stage = 2;

        }

        else if(percent >= 50){

            cell.stage = 1;

        }

        else{

            cell.stage = 0;

        }



        let barLength = 10;

        let filled =
        Math.floor(
            percent / 10
        );



        let bar =
        "█".repeat(filled)
        +
        "░".repeat(barLength-filled);



        plots[i].innerHTML = `

            <div class="plant">
            
            <div class="plantIcon">
                ${plant.icon[cell.stage]}
            </div>
        
            <button onclick="waterPlant(${i})">
                💧 Tưới
            </button>

            <div class="progress">

                ${bar}

            </div>


            <small>
                ${percent}%
            </small>


            </div>

        `;


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

function waterPlant(index){

    if(!wateringCan){

        alert("❌ Bạn chưa có bình tưới!");
        return;
    }

    let cell = garden[index];

    if(cell.seed==""){

        alert("❌ Ô này chưa có cây!");
        return;

    }

    if(wateringCan.durability<=0){

        alert("💥 Bình tưới đã hỏng!");
        return;

    }

    // Giảm thời gian trồng (5 giây)
  let reduceTime = wateringData[wateringCan.type].reduceTime;

  cell.time -= reduceTime;
  
  wateringCan.durability--;

    saveGame();

    updateUI();

    drawGarden();

}

// ===============================
// NÚT XÓA GAME
// ===============================

function resetGame(){

    if(confirm("Xóa toàn bộ dữ liệu?")){

        localStorage.clear();

        location.reload();

    }

}
