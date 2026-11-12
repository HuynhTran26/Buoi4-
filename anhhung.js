// =====================================================
// ANH HUNG JAVASCRIPT - DAI CHIEN RONG GIA
// Giữ công thức chỉ số từ bài tập gốc, bổ sung giao diện,
// hiệu ứng tấn công/bị thương và âm thanh bằng Web Audio.
// =====================================================

const $ = (id) => document.getElementById(id);

let selectedClass = "warrior";
let hero = {};
let dragon = {};
let soundOn = true;
let audioContext = null;
let battleOver = false;

const classButtons = document.querySelectorAll(".class-btn");

classButtons.forEach((button) => {
    button.addEventListener("click", () => {
        classButtons.forEach((item) => item.classList.remove("selected"));
        button.classList.add("selected");
        selectedClass = button.dataset.class;
    });
});

$("soundBtn").addEventListener("click", () => {
    soundOn = !soundOn;
    $("soundBtn").textContent = soundOn ? "🔊 Âm thanh: Bật" : "🔇 Âm thanh: Tắt";
    if (soundOn) playTone(520, 0.08, "sine");
});

$("startBtn").addEventListener("click", startBattle);
$("attackBtn").addEventListener("click", takeTurn);
$("restartBtn").addEventListener("click", resetGame);

function startBattle() {
    const playerName = $("playerName").value.trim() || "Anh Hùng";
    const LEVEL = 5;
    let XP = 0;
    let SKILLPOINT = 5;

    // Công thức từ bài tập ban đầu
    let levelForSetup = 1;
    levelForSetup++;
    XP = 150 * (levelForSetup - 1) + 200;
    SKILLPOINT = SKILLPOINT + XP / 10;

    let strength = 0.6 * SKILLPOINT + 0.1 * XP;
    let agility = 0.2 * SKILLPOINT + 0.2 * XP;
    let intel = 0.6 * SKILLPOINT + 10 * levelForSetup;

    // Cộng điểm theo lựa chọn phân cấp
    if (selectedClass === "warrior") {
        strength += 15;
    } else if (selectedClass === "assassin") {
        strength -= 10;
        agility += 10;
        intel += 5;
    } else if (selectedClass === "hunter") {
        strength -= 15;
        intel += 15;
    }

    hero = {
        name: playerName,
        level: LEVEL,
        className: selectedClass === "warrior" ? "Chiến Binh" :
                   selectedClass === "assassin" ? "Sát Thủ" : "Thợ Săn",
        strength,
        agility,
        intel,
        maxHp: 105,
        hp: 105
    };

    dragon = { maxHp: 600, hp: 600, strength: 100, agility: 15, intel: 80 };
    battleOver = false;

    $("introPanel").classList.add("hidden");
    $("battlePanel").classList.remove("hidden");
    $("heroName").textContent = hero.name;
    $("heroClass").textContent = hero.className;
    $("heroLevel").textContent = "CẤP " + hero.level;
    $("strength").textContent = Math.round(hero.strength);
    $("agility").textContent = Math.round(hero.agility);
    $("intel").textContent = Math.round(hero.intel);
    $("attackBtn").disabled = false;
    $("attackBtn").textContent = "⚔️ TẤN CÔNG";
    $("battleLog").className = "log";
    updateBars();
    logMessage("Trận chiến bắt đầu! " + hero.name + " đối đầu Hỏa Long Cổ Đại.", "good");
    playTone(330, 0.16, "triangle");
}

function takeTurn() {
    if (battleOver) return;

    // Anh hùng tấn công Rồng
    $("hero").classList.remove("attack", "hurt");
    void $("hero").offsetWidth;
    $("hero").classList.add("attack");

    const heroHit = Math.random() * 100 > dragon.agility;
    if (heroHit) {
        let damage = hero.strength;
        const critical = Math.random() * 100 < hero.intel;
        if (critical) damage *= 2;

        dragon.hp = Math.max(0, dragon.hp - damage);
        $("dragon").classList.add("hurt");
        showDamage("dragon", Math.round(damage), critical);
        playTone(critical ? 115 : 190, 0.18, "sawtooth");
        logMessage(
            (critical ? "💥 CHÍ MẠNG! " : "⚔️ TRẢM LONG! ") +
            hero.name + " gây " + Math.round(damage) + " sát thương lên Rồng!",
            "good"
        );
        updateBars();

        if (dragon.hp <= 0) {
            endBattle(true);
            return;
        }
    } else {
        logMessage("💨 XÍ HỤT! Rồng đã né được đòn tấn công của bạn.", "bad");
        playTone(260, 0.08, "sine");
    }

    // Rồng phản công sau một nhịp ngắn
    $("attackBtn").disabled = true;
    setTimeout(() => {
        if (battleOver) return;

        $("dragon").classList.remove("attack", "hurt");
        void $("dragon").offsetWidth;
        $("dragon").classList.add("attack");

        const dragonHit = Math.random() * 100 > hero.agility;
        if (dragonHit) {
            let damage = dragon.strength;
            const critical = Math.random() * 100 < dragon.intel;
            if (critical) damage *= 2;

            hero.hp = Math.max(0, hero.hp - damage);
            $("hero").classList.add("hurt");
            showDamage("hero", Math.round(damage), critical);
            playTone(critical ? 75 : 125, 0.25, "sawtooth");
            logMessage(
                (critical ? "🔥 CHÍ MẠNG! " : "🔥 HỎA CẦU! ") +
                "Rồng gây " + Math.round(damage) + " sát thương lên bạn!",
                "bad"
            );
            updateBars();

            if (hero.hp <= 0) {
                endBattle(false);
                return;
            }
        } else {
            logMessage("💨 Bạn né được đòn phun lửa của Rồng!", "good");
            playTone(440, 0.08, "sine");
        }

        $("attackBtn").disabled = false;
    }, 520);
}

function updateBars() {
    $("heroHp").style.width = (hero.hp / hero.maxHp * 100) + "%";
    $("dragonHp").style.width = (dragon.hp / dragon.maxHp * 100) + "%";
    $("heroHpText").textContent = hero.hp + " / " + hero.maxHp;
    $("dragonHpText").textContent = dragon.hp + " / " + dragon.maxHp;
}

function showDamage(target, damage, critical) {
    const element = target === "hero" ? $("hero") : $("dragon");
    const popup = document.createElement("div");
    popup.className = "damage-popup";
    popup.textContent = (critical ? "CHÍ MẠNG -" : "-") + damage;
    popup.style.cssText = `
        position:absolute; left:50%; top:42%; transform:translate(-50%,0);
        z-index:5; color:${target === "hero" ? "#ff776d" : "#ffe17a"};
        font-size:${critical ? "27px" : "22px"}; font-weight:900;
        text-shadow:0 3px 8px #000; pointer-events:none;
        animation:damageFloat .85s ease forwards;
    `;
    element.appendChild(popup);
    setTimeout(() => popup.remove(), 900);
}

function logMessage(message, type) {
    const log = $("battleLog");
    log.textContent = message;
    log.className = "log " + (type || "");
}

function endBattle(won) {
    battleOver = true;
    $("attackBtn").disabled = true;
    $("attackBtn").textContent = won ? "🏆 ĐÃ CHIẾN THẮNG" : "💀 BẠN ĐÃ GỤC NGÃ";
    if (won) {
        logMessage("🏆 CHIẾN THẮNG! " + hero.name + " đã hạ gục Rồng Già và trở thành huyền thoại!", "good");
        playVictory();
    } else {
        logMessage("💀 THẤT BẠI! Rồng Già đã chiến thắng. Hãy chơi lại và thử chiến thuật khác!", "bad");
        playTone(90, 0.6, "sawtooth");
    }
}

function resetGame() {
    $("battlePanel").classList.add("hidden");
    $("introPanel").classList.remove("hidden");
    $("hero").classList.remove("attack", "hurt");
    $("dragon").classList.remove("attack", "hurt");
    $("attackBtn").disabled = false;
    battleOver = false;
}

function getAudioContext() {
    if (!soundOn) return null;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!audioContext) audioContext = new AudioCtx();
    if (audioContext.state === "suspended") audioContext.resume();
    return audioContext;
}

// Âm thanh tổng hợp, không cần tải file mp3 bên ngoài
function playTone(frequency, duration, type) {
    const ctx = getAudioContext();
    if (!ctx) return;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = type || "sine";
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.16, ctx.currentTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + duration + 0.02);
}

function playVictory() {
    playTone(523, 0.14, "triangle");
    setTimeout(() => playTone(659, 0.14, "triangle"), 150);
    setTimeout(() => playTone(784, 0.3, "triangle"), 300);
}
