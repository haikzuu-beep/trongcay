// ===============================
// DỮ LIỆU GAME
// ===============================

let money = Number(localStorage.getItem("money")) || 100;

let selectedSeed = "";

let bag = JSON.parse(localStorage.getItem("bag")) || {
    lua:0,
    carot:0,
    cachua:0,
    bap:0,
    huongduong:0
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
// KHỞI ĐỘNG GAME
// ===============================


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



    alert(
    "🎉 Thu hoạch "
    +
    cell.seed
    +
    " +"
    +
    plantInfo.reward
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



// ===============================
// NÚT XÓA GAME
// ===============================

function resetGame(){

    if(confirm("Xóa toàn bộ dữ liệu?")){

        localStorage.clear();

        location.reload();

    }

}
