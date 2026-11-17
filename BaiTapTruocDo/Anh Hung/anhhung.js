
var name = "Huỳnh Yến Trân";
var MSSV = "31241023609";

document.write("Tôi tên là: " + name + " - MSSV: " + MSSV + " sẽ quyết tâm trở thành 1 anh hùng JS");

var LEVEL = 1;
var XP = 0;
var SKILLPOINT = 5;

LEVEL++;
XP = 150 * (LEVEL - 1) + 200;
SKILLPOINT = SKILLPOINT + XP / 10;

document.write("<br>" + name + " sẽ là Anh Hùng Javascript. Cấp độ hiện tại của bạn là: " + LEVEL);

var strength = 0.6 * SKILLPOINT + 0.1 * XP;
var agility = 0.2 * SKILLPOINT + 0.2 * XP;
var intel = 0.6 * SKILLPOINT + 10 * LEVEL;

document.write("<br>LEVEL UP! Chúc mừng bạn lên cấp!");

LEVEL = 3;
XP = XP + 300;

// Nhập tên người chơi
var nhapTen = prompt("Hãy nhập tên bạn");

if (nhapTen == name) {
    console.log("Chính xác! Bạn có trí nhớ rất tốt! intel +5!");
    intel = intel + 5;
} else {
    console.log("Tệ thật! Tên chính mình mà không nhớ sao?! intel -5!");
    intel = intel - 5;
}

// Chọn phân cấp
var chonVai = prompt("Bạn muốn chọn phân cấp nào? a: Chiến Binh | b: Sát Thủ | c: Thợ Săn");

var phancap = "";

switch (chonVai) {
    case "a":
        phancap = "Chiến Binh";
        strength = strength + 15;
        intel = intel;
        break;

    case "b":
        phancap = "Sát Thủ";
        strength = strength - 10;
        agility = agility + 10;
        intel = intel + 5;
        break;

    case "c":
        phancap = "Thợ Săn";
        strength = strength - 15;
        intel = intel + 15;
        break;

    default:
        phancap = "Chưa chọn phân cấp hợp lệ";
        break;
}

document.write("<br>Phân cấp của bạn là: " + phancap);

document.write("<br>LEVEL UP! Chúc mừng bạn lên cấp!");

LEVEL = 3;
XP = XP + 300;

// ========================================================
// Trước khi vào trận chiến, cần xem lại các chỉ số của bạn
// và xem xét các thông tin của đối thủ.
// ========================================================

LEVEL = 5; // Đảm bảo bạn sẽ ở cấp độ 5

var health = LEVEL + 100; // Khi lượng máu <= 0 thì bạn sẽ chết

console.log("Strength: " + strength);
console.log("Agility: " + agility);
console.log("Intel: " + intel);
console.log("Health: " + health);

// ========================================================
// Rồng Già
// Chậm chạp và yếu ớt hơn so với đồng loại, nhưng vẫn rất
// nguy hiểm với khả năng phun lửa có thể gây sát thương chí
// mạng rất cao.
// ========================================================

var dragonHealth = 600;
var dragonStr = 100;
var dragonAgi = 15;
var dragonInt = 80;

var gameContinue = true;

while (gameContinue) {

    // Anh hùng tấn công!
    var heroHit = Math.random() * 100 > dragonAgi;

    if (heroHit) {
        dragonHealth = dragonHealth - strength;

        alert("TRẢM LONG! Bạn gây sát thương " + strength + " điểm cho Rồng!");

        var heroCritical = Math.random() * 100 < intel;

        if (heroCritical) {
            dragonHealth = dragonHealth - strength * 2;

            alert("CHÍ MẠNG! Bạn gây sát thương chí mạng thêm " + strength * 2 + " điểm cho Rồng!");
        }

    } else {
        alert("XÍ HỤT! Rồng đã lượn tránh được đòn tấn công của Bạn!");
    }

    // Kiểm tra Rồng đã bị tiêu diệt chưa
    if (dragonHealth <= 0) {
        gameContinue = false;
        alert("CHIẾN THẮNG!!! Chúc mừng bạn đã chiến thắng!!!");
        break;
    }

    // Rồng tấn công!
    var dragonHit = Math.random() * 100 > agility;

    if (dragonHit) {
        health = health - dragonStr;

        alert("HỎA CẦU! Rồng gây sát thương " + dragonStr + " điểm cho Bạn!");

        var dragonCritical = Math.random() * 100 < dragonInt;

        if (dragonCritical) {
            health = health - dragonStr * 2;

            alert("CHÍ MẠNG! Rồng gây sát thương chí mạng thêm " + dragonStr * 2 + " điểm cho Bạn!");
        }

    } else {
        alert("XÍ HỤT! Bạn đã tránh được đòn tấn công từ Rồng!");
    }

    // Kiểm tra xem Anh Hùng có bị nướng không!
    if (health <= 0) {
        gameContinue = false;

        alert("THẤT BẠI!!! Chúc mừng bạn đã có tên trên menu món tối của Rồng: Hiệp sĩ nướng lá lốt!");
    }

}
