// ===============================
// DỮ LIỆU GAME
// ===============================

let money = Number(localStorage.getItem("money")) || 136;
let level = Number(localStorage.getItem("level")) || 1;
let exp = Number(localStorage.getItem("exp")) || 0;
let diamonds = Number(localStorage.getItem("diamonds")) || 30;
let gifts = Number(localStorage.getItem("gifts")) || 10;
let rareSeeds = Number(localStorage.getItem("rareSeeds")) || 5;
// ===============================
// CÔNG ĐỨC + MAY MẮN
// ===============================

let merit = Number(localStorage.getItem("merit")) || 0;
let luck = Number(localStorage.getItem("luck")) || 0;
let monkWorking = false;
let monkTimer = null;
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
    dua:0,
    nho:0,
    duahau:0,
    chuoi:0,
    tao:0,
    anhdao:0,
    hoahong:0,
    thong:0,
    xuongrong:0,
    rarePlant:0
};

// Nếu save cũ thiếu dữ liệu thì bổ sung
bag.lua ??= 0;
bag.carot ??= 0;
bag.cachua ??= 0;
bag.bap ??= 0;
bag.huongduong ??= 0;
bag.dautay ??= 0;
bag.xoai ??= 0;
bag.dua ??= 0;
bag.nho ??= 0;
bag.duahau ??= 0;
bag.chuoi ??= 0;
bag.tao ??= 0;
bag.anhdao ??= 0;
bag.hoahong ??= 0;
bag.thong ??= 0;
bag.xuongrong ??= 0;
bag.rarePlant ??= 0;
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

if(document.getElementById("nhoCount"))
document.getElementById("nhoCount").innerText = bag.nho;


if(document.getElementById("duahauCount"))
document.getElementById("duahauCount").innerText = bag.duahau;


if(document.getElementById("chuoiCount"))
document.getElementById("chuoiCount").innerText = bag.chuoi;


if(document.getElementById("taoCount"))
document.getElementById("taoCount").innerText = bag.tao;


if(document.getElementById("anhdaoCount"))
document.getElementById("anhdaoCount").innerText = bag.anhdao;


if(document.getElementById("hoahongCount"))
document.getElementById("hoahongCount").innerText = bag.hoahong;


if(document.getElementById("thongCount"))
document.getElementById("thongCount").innerText = bag.thong;


if(document.getElementById("xuongrongCount"))
document.getElementById("xuongrongCount").innerText = bag.xuongrong;

 if(document.getElementById("rarePlantCount"))
document.getElementById("rarePlantCount").innerText = bag.rarePlant;
    
    const seedName = {
    lua:"🌾 Hạt lúa",
    carot:"🥕 Hạt cà rốt",
    cachua:"🍅 Hạt cà chua",
    bap:"🌽 Hạt bắp",
    huongduong:"🌻 Hạt hướng dương",
    dautay:"🍓 Hạt dâu tây",
    xoai:"🥭 Hạt xoài",
    dua:"🍍 Hạt dứa",
    nho:"🍇 Hạt nho",
    duahau:"🍉 Hạt dưa hấu",
    chuoi:"🍌 Hạt chuối",
    tao:"🍎 Hạt táo",
    anhdao:"🍒 Hạt anh đào",
    hoahong:"🌹 Hạt hoa hồng",
    thong:"🌲 Hạt cây thông",
    xuongrong:"🌵 Hạt Xương rồng",
    rarePlant:"🌈 Cây hiếm"
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
if(document.getElementById("merit")){

    document.getElementById("merit").innerText = merit;

}
    if(document.getElementById("luck")){
    document.getElementById("luck").innerText = luck;
}


    if(document.getElementById("luckPercent")){

    document.getElementById("luckPercent").innerText =
    "Hiện tại: " + (luck*2) + "% may mắn"
}
    if(document.getElementById("canName")){

   document.getElementById("canName").innerText =
   wateringData[todayCan].name;

   document.getElementById("canPrice").innerText =
   wateringData[todayCan].price;
 }
// ===============================
// HIỂN THỊ KIM CƯƠNG
// ===============================

if(document.getElementById("diamondCount")){
    document.getElementById("diamondCount").innerText = diamonds;
}

if(document.getElementById("diamondCountShop")){
    document.getElementById("diamondCountShop").innerText = diamonds;
}

if(document.getElementById("diamondCountBag")){
    document.getElementById("diamondCountBag").innerText = diamonds;
}

// ===============================
// HỘP QUÀ
// ===============================

if(document.getElementById("gift")){
    document.getElementById("gift").innerText = gifts;
}

if(document.getElementById("boxCount")){
    document.getElementById("boxCount").innerText = gifts;
}

// ===============================
// HẠT GIỐNG HIẾM
// ===============================

if(document.getElementById("rareSeed")){
    document.getElementById("rareSeed").innerText = rareSeeds;
}

// Hiển thị số hạt giống hiếm trong túi
if(document.getElementById("rareSeedCount")){
    document.getElementById("rareSeedCount").innerText = rareSeeds;
}
}


// ===============================
// LƯU GAME
// ===============================

function saveGame(){

    localStorage.setItem("money",money);
    localStorage.setItem("level",level);
    localStorage.setItem("exp",exp);
    localStorage.setItem("merit",merit);
    localStorage.setItem("luck",luck);
    localStorage.setItem("bag",JSON.stringify(bag));
    localStorage.setItem("garden",JSON.stringify(garden));
    localStorage.setItem("wateringCan",JSON.stringify(wateringCan));
    localStorage.setItem("diamonds", diamonds);
    localStorage.setItem("gifts", gifts);
    localStorage.setItem("rareSeeds", rareSeeds);
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

  
    let r = Math.random()*100;

    let basic = 50;
    let normal = 25;
    let advanced = 15;
    let vip = 8;
    let legendary = 2;

    // mỗi điểm vận may chuyển 0.2% từ đồ thường sang đồ hiếm
    basic -= luck * 0.2;
    normal -= luck * 0.1;
    advanced += luck * 0.15;
    vip += luck * 0.1;
    legendary += luck * 0.05;

    if(r < basic)
        return "basic";

    if(r < basic + normal)
        return "normal";

    if(r < basic + normal + advanced)
        return "advanced";

    if(r < basic + normal + advanced + vip)
        return "vip";

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
if(type == "rarePlant"){

    if(rareSeeds <= 0){

        alert("❌ Bạn không còn Hạt giống hiếm!");

        return;
    }

}else{

    if(bag[type] <= 0){

        alert("❌ Hết hạt giống!");

        return;
    }

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
       
        case "nho":
            name="🍇 Hạt nho";
            break;

        case "duahau":
            name="🍉 Hạt dưa hấu";
            break;

case "chuoi":
    name="🍌 Hạt chuối";
    break;

case "tao":
    name="🍎 Hạt táo";
    break;

case "anhdao":
    name="🍒 Hạt anh đào";
    break;

case "hoahong":
    name="🌹 Hạt hoa hồng";
    break;

case "thong":
    name="🌲 Hạt cây thông";
    break;

case "xuongrong":
    name="🌵 Hạt xương rồng";
    break;

case "rarePlant":
    name = "🌈 Hạt giống hiếm";
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
        reward:360
    },

    dua:{
        icon:["🌱","🪴","🍍"],
        time:50,
        reward:310
    },

   nho:{
    icon:["🌱","🌿","🍇"],
    time:60,
    reward:670
},

duahau:{
    icon:["🌱","🌿","🍉"],
    time:70,
    reward:400
},

chuoi:{
    icon:["🌱","🌴","🍌"],
    time:80,
    reward:500
},

tao:{
    icon:["🌱","🌳","🍎"],
    time:90,
    reward:600
},

anhdao:{
    icon:["🌱","🌸","🍒"],
    time:100,
    reward:1000
},

hoahong:{
    icon:["🌱","🌹","🌹"],
    time:40,
    reward:1367
},

thong:{
    icon:["🌱","🌲","🌲"],
    time:120,
    reward:1000
},

xuongrong:{
    icon:["🌱","🌵","🌵"],
    time:110,
    reward:1500
},
rarePlant:{
    icon:["🌱","🌳","🌈"],
    time:3600,      // 3600 giây = 1 giờ
    reward:2500
  
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

if(cell.seed == "rarePlant"){

    let randomDiamond = Math.floor(Math.random() * 20) + 1;

    diamonds += randomDiamond;

    alert(
        "🌈 Thu hoạch cây hiếm!\n\n" +
        "+" + plantInfo.reward + " xu\n" +
        "+" + randomDiamond + " Kim cương 💎"
    );

}else{

    dropRareItem();

}

 
const seedName = {
    lua:"🌾 Lúa",
    carot:"🥕 Cà rốt",
    cachua:"🍅 Cà chua",
    bap:"🌽 Bắp",
    huongduong:"🌻 Hướng dương",
    dautay:"🍓 Dâu tây",
    xoai:"🥭 Xoài",
    dua:"🍍 Dứa",
    nho:"🍇 Nho",
    duahau:"🍉 Dưa hấu",
    chuoi:"🍌 Chuối",
    tao:"🍎 Táo",
    anhdao:"🍒 Anh đào",
    hoahong:"🌹 Hoa hồng",
    thong:"🌲 Cây thông",
    xuongrong:"🌵 Xương rồng",
    rarePlant:"🌈 Cây hiếm"
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
  let can = wateringData[wateringCan.type];

  cell.time -= can.reduceTime;
  alert("💧 Tưới thành công!\nGiảm " + can.reduceTime/1000 + " giây.");
  wateringCan.durability--;
if(wateringCan.durability <= 0){

    alert("💥 Bình tưới đã hỏng!");

    wateringCan = null;

}
    saveGame();

    updateUI();

    drawGarden();

}

// ===============================
// GÕ MÕ
// ===============================

function gong(){

        merit++;


    // hiệu ứng mõ

    let gong = document.getElementById("gong");

    gong.classList.add("gongShake");
    gong.classList.add("gongLight");


    setTimeout(()=>{

        gong.classList.remove("gongShake");
        gong.classList.remove("gongLight");

    },300);



    // chữ +1 công đức

    let text=document.createElement("div");

    text.innerText="+1 Công đức";

    text.className="meritText";


    document.getElementById("gongBox")
    .appendChild(text);



    setTimeout(()=>{

        text.remove();

    },1000);
 // cập nhật ngay số công đức
saveGame();
updateUI();

}


// ===============================
// ĐỔI VẬN MAY
// ===============================

function prayLuck(){
if(luck >= 50){

    alert("🍀 Vận may đã đạt tối đa!(100%)");

    return;

}
    if(merit < 100){

        alert("🙏 Bạn cần 100 Công đức!");

        return;

    }

    merit -= 100;

    luck++;

    saveGame();

    updateUI();

    alert(
    "🍀 Phật độ rồi!\n" +
    "+1 Vận may\n\n" +
    "Hiện tại: " + luck + " điểm vận may"
    );


}

// ===============================
// RƠI VẬT PHẨM HIẾM
// ===============================

function dropRareItem(){

    let chance = Math.random() * 100;

    // tăng tỉ lệ rơi
    chance -= luck * 0.2;


    let received = false;


    if(chance < 1){

        diamonds++;

        alert("💎 Bạn nhận được Kim cương!");

        received = true;

    }

    else if(chance < 3){

        gifts++;

        alert("🎁 Bạn nhận được Hộp quà bí ẩn!");

        received = true;

    }

    else if(chance < 6){

        rareSeeds++;

        alert("🌟 Bạn nhận được Hạt giống hiếm!");

        received = true;

    }


    // ==========================
    // TRỪ VẬN MAY KHI NHẬN ĐỒ HIẾM
    // ==========================

    if(received){

        if(luck > 0){

            luck--;

            alert(
            "🍀 Vận may giảm 5 điểm!\n" +
            "Hiện tại: " + luck + " điểm"
            );

        }

    }


    saveGame();
    updateUI();

}

// ===============================
// THUÊ SƯ THẦY
// ===============================

function hireMonk(type){

    if(monkWorking){

        alert("🧘 Đã có sư thầy đang làm việc!");

        return;

    }

    let price = 0;
    let meritPerSecond = 0;
    let name = "";

    switch(type){

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

    if(money < price){

        alert("❌ Không đủ xu!");

        return;

    }

    money -= price;

    monkWorking = true;

    updateUI();

    alert(name + " bắt đầu gõ mõ!");

    let second = 60;

    monkTimer = setInterval(function(){

        merit += meritPerSecond;

        second--;

        updateUI();

        saveGame();

        if(second <= 0){

            clearInterval(monkTimer);

            monkWorking = false;

            alert(name + " đã nghỉ ngơi.");

        }

    },1000);


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
function exchangeDiamond(){

    if(diamonds < 1){

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


function spinLuckyWheel(){

    if(spinning) return; 
    
    if(diamonds < 5){

        alert("Không đủ kim cương!");

        return;

    }


    diamonds -= 5;

    spinning =true;


    let wheel = document.getElementById("wheel");


    let random = Math.floor(Math.random()*360);


    wheel.style.transform =
    `rotate(${random + 1800}deg)`;


    setTimeout(()=>{


        let reward =
        Math.floor(Math.random()*6);


        let result="";


        switch(reward){


            case 0:

            result="💎 Nhận 10 kim cương";

            diamonds +=10;

            break;



            case 1:

            result="💰 Nhận 500 xu";

            money +=500;

            break;



            case 2:

            result="🎁 Nhận 1 hộp quà";

            gifts++;

            break;



            case 3:

            result="🌱 Nhận hạt giống hiếm";

            rareSeeds++;

            break;



            case 4:

            result="💰 Nhận 1000 xu";

            money+=1000;

            break;



            case 5:

            result="💎 Nhận 5 kim cương";

            diamonds+=5;

            break;


        }




        document.getElementById("wheelResult")
        .innerText=result;

saveGame();
updateUI();
        spinning=false;


    },4000);


}
