!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Farm - Tu Tiên Nông Trại</title>
    <link rel="stylesheet" href="style.css">

    <!-- CSS Bổ sung dành cho Hiệu ứng Weather & Đổi chủ đề toàn bộ Skin -->
    <style>
        /* Khung chứa hiệu ứng thời tiết phủ toàn màn hình */
        #fx-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 999;
            overflow: hidden;
        }

        /* ----- ANIMATIONS TỰ NHIÊN ----- */
        @keyframes fallAndSway {
            0% {
                transform: translateY(-20px) translateX(0) rotate(0deg);
                opacity: 0.9;
            }
            100% {
                transform: translateY(105vh) translateX(100px) rotate(360deg);
                opacity: 0.2;
            }
        }

        @keyframes tumbleweedRoll {
            0% {
                left: -60px;
                transform: rotate(0deg);
                opacity: 0.8;
            }
            100% {
                left: 105vw;
                transform: rotate(720deg);
                opacity: 0.8;
            }
        }

        @keyframes sandDustBlow {
            0% {
                transform: translateX(-10%) translateY(0);
                opacity: 0;
            }
            50% {
                opacity: 0.25;
            }
            100% {
                transform: translateX(110%) translateY(-20px);
                opacity: 0;
            }
        }

        .fx-petal {
            position: absolute;
            background: #ffb7c5;
            border-radius: 15px 0 15px 0;
            opacity: 0.8;
            animation: fallAndSway linear infinite;
        }

        .fx-snowflake {
            position: absolute;
            color: #ffffff;
            font-size: 14px;
            user-select: none;
            animation: fallAndSway linear infinite;
        }

        .fx-tumbleweed {
            position: absolute;
            font-size: 28px;
            bottom: 5vh;
            animation: tumbleweedRoll linear infinite;
        }

        .fx-dust {
            position: absolute;
            width: 120vw;
            height: 100vh;
            background: radial-gradient(circle, rgba(210, 180, 140, 0.2) 10%, transparent 70%);
            animation: sandDustBlow 8s linear infinite;
        }

        /* ==================== THEME STYLES (ĐỔI TẤT CẢ GIAO DIỆN) ==================== */
        
        /* 🌸 SKIN HOA ANH ĐÀO (CHERRY) */
        body.skin-cherry {
            background-color: #2d1b24 !important;
            color: #ffd6e8 !important;
        }
        body.skin-cherry .card, 
        body.skin-cherry .tab, 
        body.skin-cherry .shopItem, 
        body.skin-cherry .bagItem, 
        body.skin-cherry .monk-card {
            background: #422535 !important;
            border-color: #ff9ebb !important;
            color: #ffeef5 !important;
        }
        body.skin-cherry button, 
        body.skin-cherry .nav-btn {
            background: #ff6b9d !important;
            color: #fff !important;
            border-color: #ffb7c5 !important;
        }
        body.skin-cherry .plot {
            background: #5c3549 !important;
            border-color: #ff9ebb !important;
        }

        /* 🏜️ SKIN SA MẠC (DESERT) */
        body.skin-desert {
            background-color: #2a2118 !important;
            color: #f2d6b3 !important;
        }
        body.skin-desert .card, 
        body.skin-desert .tab, 
        body.skin-desert .shopItem, 
        body.skin-desert .bagItem, 
        body.skin-desert .monk-card {
            background: #3d3023 !important;
            border-color: #d4a359 !important;
            color: #faebd7 !important;
        }
        body.skin-desert button, 
        body.skin-desert .nav-btn {
            background: #c28d3a !important;
            color: #2a2118 !important;
            border-color: #e6c585 !important;
            font-weight: bold;
        }
        body.skin-desert .plot {
            background: #544230 !important;
            border-color: #d4a359 !important;
        }

        /* ❄️ SKIN MÙA ĐÔNG (WINTER) */
        body.skin-winter {
            background-color: #141e28 !important;
            color: #d0f0fd !important;
        }
        body.skin-winter .card, 
        body.skin-winter .tab, 
        body.skin-winter .shopItem, 
        body.skin-winter .bagItem, 
        body.skin-winter .monk-card {
            background: #1f2f3e !important;
            border-color: #70c1b3 !important;
            color: #eaf8ff !important;
        }
        body.skin-winter button, 
        body.skin-winter .nav-btn {
            background: #247ba0 !important;
            color: #fff !important;
            border-color: #70c1b3 !important;
        }
        body.skin-winter .plot {
            background: #2d4356 !important;
            border-color: #70c1b3 !important;
        }
    </style>
</head>

<body>

    <!-- Container hiệu ứng thời tiết động -->
    <div id="fx-overlay"></div>

    <div class="game-container">

        <!-- ==================== HEADER ==================== -->
        <header class="game-header">
            <div class="header-left">
                <h1 class="game-title">🌾 Your Farm</h1>
                <span class="farm-level-badge">Cấp Nông Trại: <span id="farmLevel">1</span></span>
            </div>

            <div class="header-right">
                <div class="currency-badge money-badge">
                    💰 Xu: <span id="money">200</span>
                </div>
                <div class="currency-badge diamond-badge">
                    💎 KC: <span id="diamondCount">0</span>
                </div>
            </div>
        </header>

        <!-- ==================== THANH ĐIỀU HƯỚNG (NAV) ==================== -->
        <nav class="main-nav">
            <button class="nav-btn active" onclick="openTab('farm')">🌾 Nông Trại</button>
            <button class="nav-btn" onclick="openTab('animals')">🐾 Chuồng Thú</button>
            <button class="nav-btn" onclick="openTab('shop')">🛒 Cửa Hàng</button>
            <button class="nav-btn" onclick="openTab('bag')">🎒 Túi Đồ</button>
            <button class="nav-btn" onclick="openTab('temple')">🔔 Chùa Công Đức</button>
            
            <a href="admin.html">
                <button type="button" class="nav-btn">⚙️ Đến trang Admin</button>
            </a>
        </nav>
        
        <!-- ==================== DASHBOARD CHÍNH ==================== -->
        <main class="game-dashboard">

            <!-- CỘT BÊN TRÁI: THỐNG KÊ NHÂN VẬT & MÕ CÔNG ĐỨC -->
            <aside class="side-panel panel-left">
                <div class="card">
                    <h3>⭐ NHÂN VẬT</h3>
                    <div class="stat-row">
                        <span>Cấp độ:</span>
                        <strong id="level">1</strong>
                    </div>
                    <div class="exp-section">
                        <div class="exp-label">
                            <span>✨ EXP:</span>
                            <small id="expText">0 / 100</small>
                        </div>
                        <div class="expBar">
                            <div id="expFill"></div>
                        </div>
                    </div>
                </div>

                <div class="card gong-card">
                    <h3>🔔 TÍCH CÔNG ĐỨC</h3>
                    <div id="gongBox" class="quick-gong-box">
                        <div id="gong" class="gong" onclick="gong()">🥁</div>
                    </div>
                    <p class="hint-text">Bấm vào trống/mõ để gõ</p>
                    <div class="stat-row">
                        <span>🙏 Công đức:</span>
                        <strong id="merit">0</strong>
                    </div>
                    <div class="stat-row">
                        <span>🍀 Vận may:</span>
                        <strong id="luck">0</strong>
                    </div>
                </div>
            </aside>

            <!-- CỘT GIỮA: NỘI DUNG CHÍNH (CÁC TAB) -->
            <section class="main-content">

                <!-- TAB 1: NÔNG TRẠI -->
                <section id="farm" class="tab">
                    <div class="panel-header" style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <h2>Khu Vườn Nông Trại</h2>
                            <p class="subtitle">Đang chọn: <strong id="selected">Chưa chọn</strong></p>
                        </div>
                        <button onclick="moGhiChu()" style="padding: 6px 14px; cursor: pointer; border-radius: 6px; border: 1px solid #d4af37; background: #1a1a1a; color: #d4af37; font-weight: bold;">📜 Thơ</button>
                    </div>

                    <!-- Lưới đất 32 ô -->
                    <div id="garden" class="garden-grid">
                        <div class="plot"></div><div class="plot"></div><div class="plot"></div><div class="plot"></div>
                        <div class="plot"></div><div class="plot"></div><div class="plot"></div><div class="plot"></div>
                        <div class="plot"></div><div class="plot"></div><div class="plot"></div><div class="plot"></div>
                        <div class="plot"></div><div class="plot"></div><div class="plot"></div><div class="plot"></div>
                        <div class="plot"></div><div class="plot"></div><div class="plot"></div><div class="plot"></div>
                        <div class="plot"></div><div class="plot"></div><div class="plot"></div><div class="plot"></div>
                        <div class="plot"></div><div class="plot"></div><div class="plot"></div><div class="plot"></div>
                        <div class="plot"></div><div class="plot"></div><div class="plot"></div><div class="plot"></div>
                    </div>
                </section>

                <!-- TAB 2: TRANG TRẠI THÚ NUÔI -->
                <section id="animals" class="tab" style="display:none;">
                    <h2>🐾 Trang Trại Thú Nuôi</h2>
                    
                    <div class="shop-section">
                        <h3>🛒 Mua Thú Nuôi</h3>
                        <div class="shop-grid">
                            <div class="shopItem">
                                <h3>🐔 Gà Mái Linh Thạch</h3>
                                <p>Giá: 500 Xu</p>
                                <p>Đẻ trứng linh khí</p>
                                <button onclick="buyAnimal('chicken', 500)">Mua Gà</button>
                            </div>
                            <div class="shopItem">
                                <h3>🐄 Bò Tiên Cảnh</h3>
                                <p>Giá: 1.500 Xu</p>
                                <p>Cho sữa tiên</p>
                                <button onclick="buyAnimal('cow', 1500)">Mua Bò</button>
                            </div>
                            <div class="shopItem">
                                <h3>🐖 Heo Kim Giáp</h3>
                                <p>Giá: 3.000 Xu</p>
                                <p>Sản xuất vàng thỏi</p>
                                <button onclick="buyAnimal('pig', 3000)">Mua Heo</button>
                            </div>
                        </div>
                    </div>

                    <hr style="margin: 20px 0;">

                    <h3>🏠 Khu Vực Thú Nuôi Của Bạn</h3>
                    <div id="animalList" class="shop-grid">
                        <p>Chưa có con vật nào trong trang trại.</p>
                    </div>
                </section>

                <!-- TAB 3: CỬA HÀNG -->
                <section id="shop" class="tab" style="display:none;">
                    <h2>🛒 Cửa Hàng Tổng Hợp</h2>

                    <div class="shop-section">
                        <h3>🌱 Hạt Giống</h3>
                        <div class="shop-grid">
                            <div class="shopItem"><h3>🌾 Hạt Lúa</h3><p>Giá: 20 xu</p><button onclick="buySeed('lua',20)">Mua</button></div>
                            <div class="shopItem"><h3>🥕 Hạt Cà Rốt</h3><p>Giá: 40 xu</p><button onclick="buySeed('carot',40)">Mua</button></div>
                            <div class="shopItem"><h3>🍅 Hạt Cà Chua</h3><p>Giá: 60 xu</p><button onclick="buySeed('cachua',60)">Mua</button></div>
                            <div class="shopItem"><h3>🌽 Hạt Bắp</h3><p>Giá: 100 xu</p><button onclick="buySeed('bap',100)">Mua</button></div>
                            <div class="shopItem"><h3>🌻 Hướng Dương</h3><p>Giá: 150 xu</p><button onclick="buySeed('huongduong',150)">Mua</button></div>
                            <div class="shopItem"><h3>🍓 Hạt Dâu Tây</h3><p>Giá: 180 xu</p><button onclick="buySeed('dautay',180)">Mua</button></div>
                            <div class="shopItem"><h3>🥭 Hạt Xoài</h3><p>Giá: 220 xu</p><button onclick="buySeed('xoai',220)">Mua</button></div>
                            <div class="shopItem"><h3>🍍 Hạt Dứa</h3><p>Giá: 200 xu</p><button onclick="buySeed('dua',200)">Mua</button></div>
                            <div class="shopItem"><h3>🍇 Hạt Nho</h3><p>Giá: 300 xu</p><button onclick="buySeed('nho',300)">Mua</button></div>
                            <div class="shopItem"><h3>🍉 Hạt Dưa Hấu</h3><p>Giá: 350 xu</p><button onclick="buySeed('duahau',350)">Mua</button></div>
                            <div class="shopItem"><h3>🍌 Hạt Chuối</h3><p>Giá: 400 xu</p><button onclick="buySeed('chuoi',400)">Mua</button></div>
                            <div class="shopItem"><h3>🍎 Hạt Táo</h3><p>Giá: 500 xu</p><button onclick="buySeed('tao',500)">Mua</button></div>
                            <div class="shopItem"><h3>🍒 Hạt Anh Đào</h3><p>Giá: 600 xu</p><button onclick="buySeed('anhdao',600)">Mua</button></div>
                            <div class="shopItem"><h3>🌹 Hạt Hoa Hồng</h3><p>Giá: 800 xu</p><button onclick="buySeed('hoahong',800)">Mua</button></div>
                            <div class="shopItem"><h3>🌵 Hạt Xương Rồng</h3><p>Giá: 1000 xu</p><button onclick="buySeed('xuongrong',1000)">Mua</button></div>
                        </div>
                    </div>

                    <hr>

                    <div class="shop-section">
                        <h3>💧 Dụng Cụ & Nâng Cấp</h3>
                        <div class="shop-grid">
                            <div class="shopItem">
                                <h3 id="canName">Đang tải...</h3>
                                <p>Giá: <span id="canPrice">0</span> xu</p>
                                <button onclick="buyWateringCan()">Mua bình</button>
                            </div>
                            <div class="shopItem">
                                <h3>🏡 Nâng Cấp Nông Trại</h3>
                                <p>Mỗi lần nâng cấp sẽ mở thêm ô đất.</p>
                                <button onclick="upgradeFarm()">Nâng cấp</button>
                            </div>
                            <div class="shopItem">
                                <h3>🪨 Đá Quý Thô</h3>
                                <p>Giá: 50.000 Xu</p>
                                <button onclick="buyGem()">Mua đá quý</button>
                            </div>
                            <div class="shopItem">
                                <h3>⛏️ Đập Đá Quý</h3>
                                <p>Chi phí: 50.000 Xu</p>
                                <button onclick="breakGem()">Đập ngay</button>
                            </div>
                        </div>
                    </div>

                    <hr>

                    <div class="shop-section">
                        <h3>💎 Cửa Hàng Kim Cương</h3>
                        <div class="shop-grid">
                            <div class="shopItem">
                                <h3>💰 Đổi Kim Cương</h3>
                                <p>1 💎 = 1000 Xu</p>
                                <button onclick="exchangeDiamond()">Đổi ngay</button>
                            </div>
                            <div class="shopItem">
                                <h3>🎨 Skin Mặc Định</h3>
                                <p>Cơ bản</p>
                                <button onclick="changeSkin('default', 0)">Áp dụng</button>
                            </div>
                            <div class="shopItem">
                                <h3>🎨 Skin Hoa Anh Đào</h3>
                                <p>Giá: 20 💎</p>
                                <button id="btnSkinCherry" onclick="changeSkin('cherry', 20)">Mua</button>
                            </div>
                            <div class="shopItem">
                                <h3>🎨 Skin Sa Mạc</h3>
                                <p>Giá: 30 💎</p>
                                <button id="btnSkinDesert" onclick="changeSkin('desert', 30)">Mua</button>
                            </div>
                            <div class="shopItem">
                                <h3>🎨 Skin Mùa Đông</h3>
                                <p>Giá: 40 💎</p>
                                <button id="btnSkinWinter" onclick="changeSkin('winter', 40)">Mua</button>
                            </div>
                        </div>

                        <div class="wheel-container">
                            <h3>🎡 Vòng Quay May Mắn (5 💎 / lượt)</h3>
                            <button onclick="spinLuckyWheel()" class="btn-spin">Quay ngay</button>
                            <div class="wheelBox">
                                <div class="arrow">▼</div>
                                <div id="wheel">
                                    <div>💎 10 KC</div>
                                    <div>💰 500 Xu</div>
                                    <div>🎁 Hộp quà</div>
                                    <div>🌱 Hạt hiếm</div>
                                    <div>💰 1000 Xu</div>
                                    <div>💎 5 KC</div>
                                </div>
                            </div>
                            <p id="wheelResult">Chưa quay</p>
                        </div>
                    </div>
                </section>

                <!-- TAB 4: TÚI ĐỒ -->
                <section id="bag" class="tab" style="display:none;">
                    <h2>🎒 Túi Đồ Hạt Giống</h2>
                    <div class="bag-grid">
                        <div class="bagItem">🌾 Lúa: <span id="luaCount">0</span> <button onclick="selectSeed('lua')">Chọn</button></div>
                        <div class="bagItem">🥕 Cà rốt: <span id="carotCount">0</span> <button onclick="selectSeed('carot')">Chọn</button></div>
                        <div class="bagItem">🍅 Cà chua: <span id="cachuaCount">0</span> <button onclick="selectSeed('cachua')">Chọn</button></div>
                        <div class="bagItem">🌽 Bắp: <span id="bapCount">0</span> <button onclick="selectSeed('bap')">Chọn</button></div>
                        <div class="bagItem">🌻 Hướng dương: <span id="huongduongCount">0</span> <button onclick="selectSeed('huongduong')">Chọn</button></div>
                        <div class="bagItem">🍓 Dâu tây: <span id="dautayCount">0</span> <button onclick="selectSeed('dautay')">Chọn</button></div>
                        <div class="bagItem">🥭 Xoài: <span id="xoaiCount">0</span> <button onclick="selectSeed('xoai')">Chọn</button></div>
                        <div class="bagItem">🍍 Dứa: <span id="duaCount">0</span> <button onclick="selectSeed('dua')">Chọn</button></div>
                        <div class="bagItem">🍇 Nho: <span id="nhoCount">0</span> <button onclick="selectSeed('nho')">Chọn</button></div>
                        <div class="bagItem">🍉 Dưa hấu: <span id="duahauCount">0</span> <button onclick="selectSeed('duahau')">Chọn</button></div>
                        <div class="bagItem">🍌 Chuối: <span id="chuoiCount">0</span> <button onclick="selectSeed('chuoi')">Chọn</button></div>
                        <div class="bagItem">🍎 Táo: <span id="taoCount">0</span> <button onclick="selectSeed('tao')">Chọn</button></div>
                        <div class="bagItem">🍒 Anh đào: <span id="anhdaoCount">0</span> <button onclick="selectSeed('anhdao')">Chọn</button></div>
                        <div class="bagItem">🌹 Hoa hồng: <span id="hoahongCount">0</span> <button onclick="selectSeed('hoahong')">Chọn</button></div>
                        <div class="bagItem">🌲 Cây thông: <span id="thongCount">0</span> <button onclick="selectSeed('thong')">Chọn</button></div>
                        <div class="bagItem">🌵 Xương rồng: <span id="xuongrongCount">0</span> <button onclick="selectSeed('xuongrong')">Chọn</button></div>
                        <div class="bagItem">🪷 Sen tuyết: <span id="sentuyetCount">0</span> <button onclick="selectSeed('sentuyet')">Chọn</button></div>
                    </div>

                    <hr>
                    <h2>🎒 Rương Đồ Đặc Biệt</h2>
                    <div class="bag-grid">
                        <div class="bagItem">🎁 Hộp bí ẩn: <span id="boxCount">0</span> <button onclick="openGift()">Mở</button></div>
                        <div class="bagItem">🌟 Hạt giống hiếm: <span id="rareSeedCount">0</span> <button onclick="selectSeed('rarePlant')">Chọn</button></div>
                        <div class="bagItem">🪨 Đá quý thô: <span id="gemCount">0</span></div>
                    </div>
                </section>

                <!-- TAB 5: CHÙA CÔNG ĐỨC -->
                <section id="temple" class="tab" style="display:none;">
                    <h2>🔔 Chùa Công Đức</h2>
                    <div id="templeContent">
                        <div class="temple-box">
                            <p>🙏 Tỷ lệ may mắn hiện tại: <strong id="luckPercent">0%</strong></p>
                            <button class="btn-pray" onclick="prayLuck()">Đổi 100 Công đức lấy 1 Vận may</button>
                            <button class="btn-pray" onclick="prayLuckAdvanced()" style="margin-left: 10px;">Đổi 1.000 Công đức lấy 12 Vận may</button>
                        </div>

                        <hr>
                        <h3>🧘 Thuê Sư Thầy Tự Động Gõ Mõ</h3>
                        <div class="monk-grid">
                            <div class="monk-card">
                                <h4>🧘 Sư thầy</h4>
                                <p>Giá: 1.000 Xu</p>
                                <p>+1 Công đức / giây</p>
                                <button onclick="hireMonk(1)">Thuê ngay</button>
                            </div>
                            <div class="monk-card">
                                <h4>🧘‍♂️ Đại sư</h4>
                                <p>Giá: 5.000 Xu</p>
                                <p>+5 Công đức / giây</p>
                                <button onclick="hireMonk(2)">Thuê ngay</button>
                            </div>
                            <div class="monk-card">
                                <h4>👼 Trụ trì</h4>
                                <p>Giá: 10.000 Xu</p>
                                <p>+10 Công đức / giây</p>
                                <button onclick="hireMonk(3)">Thuê ngay</button>
                            </div>
                            <div class="monk-card">
                                <h4>✨ Tổ sư</h4>
                                <p>Giá: 50.000 Xu</p>
                                <p>+60 Công đức / giây</p>
                                <button onclick="hireMonk(4)">Thuê ngay</button>
                            </div>
                        </div>
                        <p id="monkStatus" class="monk-status">Chưa thuê sư thầy</p>
                    </div>
                </section>

            </section>

            <!-- CỘT BÊN PHẢI: TRANG BỊ, TÀI NGUYÊN & KHUNG CHAT -->
            <aside class="side-panel panel-right">
                <div class="card">
                    <h3>💧 TRANG BỊ</h3>
                    <div class="equipment-box">
                        <span id="myCan">Chưa có bình tưới</span>
                    </div>
                </div>

                <div class="card">
                    <h3>💎 TÀI NGUYÊN HIẾM</h3>
                    <div class="stat-row">
                        <span>💎 Kim Cương:</span>
                        <strong id="diamondCountShop">0</strong>
                    </div>
                    <div class="stat-row">
                        <span>💎 Kim Cương (Túi):</span>
                        <strong id="diamondCountBag">0</strong>
                    </div>
                    <div class="stat-row">
                        <span>🎁 Hộp Quà:</span>
                        <strong id="gift">0</strong>
                    </div>
                    <div class="stat-row">
                        <span>🌟 Hạt Hiếm:</span>
                        <strong id="rareSeed">0</strong>
                    </div>
                </div>

                <!-- BẢNG XẾP HẠNG -->
                <div class="card leaderboard-card">
                    <h3>🏆 BẢNG XẾP HẠNG TOP XU</h3>
                    <ol id="leaderboardList" class="leaderboard-list">
                        <li>Đang tải...</li>
                    </ol>
                </div>

                <!-- CHAT THẾ GIỚI -->
                <div class="card chat-card">
                    <h3>💬 CHAT THẾ GIỚI</h3>

                    <div id="authStatus" class="auth-box">
                        <input type="text" id="playerNameInput" placeholder="Nhập tên nhân vật..." />
                        <button onclick="loginGame()">Vào Game (Online)</button>
                    </div>

                    <div id="chatBox" class="chat-messages">
                        <div id="messageList" class="chat-messages-list" style="height: 200px; overflow-y: auto;">
                        </div>
                    </div>

                    <div id="chatInputBox" class="chat-input-area" style="display: flex; margin-top: 8px;">
                        <input type="text" id="chatMessageInput" placeholder="Nhập tin nhắn..." onkeypress="handleChatKeyPress(event)" style="flex: 1;" />
                        <button onclick="sendChatMessage()">Gửi</button>
                    </div>
                </div>
            </aside>

        </main>
    </div>

    <!-- Khung màn hình hiển thị bài thơ -->
    <div id="modalTho" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); justify-content: center; align-items: center; z-index: 9999;">
        <div style="background: #1a1a1a; border: 2px solid #d4af37; padding: 25px; border-radius: 12px; width: 85%; max-width: 320px; text-align: center; box-shadow: 0px 4px 15px rgba(212,175,55,0.4);">
            <h3 style="color: #d4af37; margin-top: 0; font-size: 24px;">📜 Bí Kíp Nông Dân</h3>
            <p style="color: #f3f3f3; line-height: 1.8; font-style: italic; font-size: 18px; letter-spacing: 1px;">
                Sáng ra gieo hạt, tối ngóng mầm,<br>
                Chờ cây lớn nổi đúng là hâm.<br>
                Tay ôm luống đất, mơ mộng hão,<br>
                Làm giàu kiểu này chắc mười năm!
            </p>
            <button onclick="dongGhiChu()" style="padding: 8px 20px; background: #d4af37; color: #1a1a1a; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">Đóng</button>
        </div>
    </div>

    <!-- Thư viện Firebase SDK -->
    <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js"></script>

    <!-- Scripts Game -->
    <script src="online.js"></script>
    <script>
        // Quản lý lưu trữ Skin bằng LocalStorage
        let currentSkin = localStorage.getItem('activeSkin') || 'default';
        let ownedSkins = JSON.parse(localStorage.getItem('ownedSkins')) || ['default'];

        // Đổi hoặc mua Skin
        function changeSkin(skinName, cost) {
            let kcElement = document.getElementById("diamondCount");
            let currentKC = kcElement ? parseInt(kcElement.innerText) || 0 : 0;

            // Kiểm tra xem đã sở hữu skin chưa
            if (ownedSkins.includes(skinName)) {
                currentSkin = skinName;
                localStorage.setItem('activeSkin', currentSkin);
                alert("Đã áp dụng giao diện!");
                updateTheme();
                return;
            }

            // Nếu chưa mua -> tiến hành trừ Kim Cương
            if (currentKC >= cost) {
                currentKC -= cost;
                
                if (kcElement) kcElement.innerText = currentKC;
                if (document.getElementById("diamondCountShop")) document.getElementById("diamondCountShop").innerText = currentKC;
                if (document.getElementById("diamondCountBag")) document.getElementById("diamondCountBag").innerText = currentKC;

                ownedSkins.push(skinName);
                localStorage.setItem('ownedSkins', JSON.stringify(ownedSkins));

                currentSkin = skinName;
                localStorage.setItem('activeSkin', currentSkin);

                alert("Chúc mừng! Bạn đã mua và mở khóa skin thành công!");
                updateTheme();
            } else {
                alert("Bạn không đủ kim cương (💎) để mua skin này! (Cần " + cost + " 💎)");
            }
        }

        // Cập nhật giao diện & Khởi tạo hiệu ứng động
        function updateTheme() {
            // Xóa toàn bộ class skin cũ
            document.body.classList.remove('skin-cherry', 'skin-desert', 'skin-winter');

            // Áp dụng class mới
            if (currentSkin !== 'default') {
                document.body.classList.add('skin-' + currentSkin);
            }

            // Cập nhật trạng thái hiển thị của các nút Mua -> Áp dụng
            updateShopButtons();

            // Tạo hiệu ứng thời tiết tương ứng
            renderWeatherEffects();
        }

        function updateShopButtons() {
            const btnMap = {
                'cherry': 'btnSkinCherry',
                'desert': 'btnSkinDesert',
                'winter': 'btnSkinWinter'
            };

            for (let skin in btnMap) {
                let btn = document.getElementById(btnMap[skin]);
                if (btn) {
                    if (ownedSkins.includes(skin)) {
                        btn.innerText = (currentSkin === skin) ? "Đang Dùng" : "Sử Dụng";
                    }
                }
            }
        }

        // Tạo hiệu ứng thời tiết
        function renderWeatherEffects() {
            const fxContainer = document.getElementById("fx-overlay");
            if (!fxContainer) return;
            fxContainer.innerHTML = ""; // Clear hiệu ứng cũ

            if (currentSkin === 'cherry') {
                // Tạo cánh hoa rơi
                for (let i = 0; i < 25; i++) {
                    let petal = document.createElement("div");
                    petal.className = "fx-petal";
                    let size = Math.random() * 8 + 8;
                    petal.style.width = size + "px";
                    petal.style.height = (size + 4) + "px";
                    petal.style.left = Math.random() * 100 + "vw";
                    petal.style.animationDuration = (Math.random() * 4 + 4) + "s";
                    petal.style.animationDelay = (Math.random() * 5) + "s";
                    fxContainer.appendChild(petal);
                }
            } else if (currentSkin === 'desert') {
                // Hiệu ứng bụi cát
                let dust = document.createElement("div");
                dust.className = "fx-dust";
                fxContainer.appendChild(dust);

                // Cỏ lăn sa mạc
                let weed = document.createElement("div");
                weed.className = "fx-tumbleweed";
                weed.innerText = "🌾";
                weed.style.animationDuration = "12s";
                fxContainer.appendChild(weed);
            } else if (currentSkin === 'winter') {
                // Tuyết rơi
                for (let i = 0; i < 30; i++) {
                    let flake = document.createElement("div");
                    flake.className = "fx-snowflake";
                    flake.innerText = "❄";
                    flake.style.left = Math.random() * 100 + "vw";
                    flake.style.fontSize = (Math.random() * 10 + 10) + "px";
                    flake.style.animationDuration = (Math.random() * 3 + 3) + "s";
                    flake.style.animationDelay = (Math.random() * 5) + "s";
                    fxContainer.appendChild(flake);
                }
            }
        }

        // Hàm mở/đóng Modal Thơ Bí Kíp Nông Dân
        function moGhiChu() {
            document.getElementById("modalTho").style.display = "flex";
        }

        function dongGhiChu() {
            document.getElementById("modalTho").style.display = "none";
        }

        // Chạy khởi tạo giao diện khi trang web load xong
        window.addEventListener('DOMContentLoaded', () => {
            updateTheme();
        });
    </script>
</body>

</html>
