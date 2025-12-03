const questions = [
    {
        q: "FMKJの苦手なものは何",
        options: ["蜂", "高い所", "狭い部屋", "冷えピタ"],
        a: 1,
        explanation: "高所恐怖症です。出社して4Fから階段で下を覗くと恐怖を感じます。"
    },
    {
        q: "FMKJのやめられない趣味/行動はどれ",
        options: ["商品購入時奥の物から取る", "仕事から帰宅後に缶ビールを開ける", "食品購入時に成分表示とカロリーをチェックする", "じゃんけんで必ず最初にグーを出す"],
        a: 2,
        explanation: "カロリーを気にしてしまう癖がやめられず。食べるときに「あ～、これで200kcalもあるのかぁ」などいつも思っている"
    },
    {
        q: "FMKJ(ミカワ ジュン)の学生時代のあだ名は？",
        options: ["みかじゅん", "M.J.", "じゅんじゅん", "みかわ"],
        a: 1,
        explanation: "高校時代からあまり名前で呼ばれることのない人生でした。スパイダーマンのヒロイン由来です。"
    },
    {
        q: "FMKJのプライベートPCのGoogle検索履歴の「一番上」に残っているワードは？(12/03時点)",
        options: ["疲労回復 足つぼ", "トイストーリー4 駄作 原因", "尾てい骨 痛い なぜ", "しもやけ なぜ"],
        a: 2,
        explanation: "床に長く座っていたら尾てい骨の痛みを発症しもう2週間経ちます。"
    },
    {
        q: "FMKJがAmazonで買って一番要らなかったものはどれ",
        options: ["少し長めの木刀", "温泉などの脱衣所入口にある\"男\"と書いてある青色の暖簾", "家庭用流しそうめん機", "プロテイン1kg"],
        a: 0,
        explanation: "使い道もなく邪魔。冷静になるとなぜ買ったのかと自問自答する毎日。去年のブラックフライデーで買ってしまった。"
    }
];

let currentStage = 0;
let health = 3;
let timer = 10;
let timerInterval;
let isGameOver = false;

const maxTime = 15;
const enemyBaseScale = 1.0;
const enemyMaxScale = 3.0; // How big the enemy gets at 0 seconds

// DOM Elements
const healthEl = document.getElementById('health');
const stageEl = document.getElementById('stage');
const enemyImg = document.getElementById('enemy-img');
const timerBar = document.getElementById('timer-bar');
const questionText = document.getElementById('question-text');
const optionBtns = document.querySelectorAll('.option-btn');
const messageOverlay = document.getElementById('message-overlay');
const messageText = document.getElementById('message-text');
const explanationText = document.getElementById('explanation-text');
const restartBtn = document.getElementById('restart-btn');
const nextStageBtn = document.getElementById('next-stage-btn');
const gameContainer = document.getElementById('game-container');

function loadStage() {
    if (currentStage >= questions.length) {
        gameClear();
        return;
    }

    stageEl.textContent = currentStage + 1;

    // Load Enemy Image
    enemyImg.src = `assets/enemy${currentStage + 1}.png`;
    enemyImg.style.transform = `scale(${enemyBaseScale})`;

    // Load Question
    const q = questions[currentStage];
    questionText.textContent = q.q;
    optionBtns.forEach((btn, index) => {
        btn.textContent = q.options[index];
        btn.disabled = false;
        btn.style.background = ""; // Reset color
    });

    startTimer();
}

function startTimer() {
    timer = maxTime;
    updateTimerVisuals();

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timer -= 0.05; // Update every 50ms
        if (timer <= 0) {
            timer = 0;
            clearInterval(timerInterval);
            takeDamage("TIME UP!");
        }
        updateTimerVisuals();
    }, 50);
}

function updateTimerVisuals() {
    const percentage = (timer / maxTime) * 100;
    timerBar.style.width = `${percentage}%`;

    // Color change based on time
    if (percentage < 30) {
        timerBar.style.backgroundColor = "#e74c3c"; // Red
    } else if (percentage < 60) {
        timerBar.style.backgroundColor = "#f1c40f"; // Yellow
    } else {
        timerBar.style.backgroundColor = "#2ecc71"; // Green
    }

    // Enemy Approach (Scale)
    // Scale from 1.0 to 3.0 as time goes from 10 to 0
    const scale = enemyBaseScale + ((maxTime - timer) / maxTime) * (enemyMaxScale - enemyBaseScale);
    enemyImg.style.transform = `scale(${scale})`;
}

function checkAnswer(selectedIndex) {
    if (isGameOver) return;

    clearInterval(timerInterval);

    const correctIndex = questions[currentStage].a;

    if (selectedIndex === correctIndex) {
        // Correct
        optionBtns[selectedIndex].style.background = "#2ecc71";
        showExplanation();
    } else {
        // Wrong
        optionBtns[selectedIndex].style.background = "#e74c3c";
        // Do NOT show correct answer
        setTimeout(() => {
            takeDamage("WRONG!");
        }, 500);
    }

    // Disable buttons temporarily
    optionBtns.forEach(btn => btn.disabled = true);
}

function showExplanation() {
    const q = questions[currentStage];
    messageText.innerHTML = "CORRECT!";
    explanationText.textContent = q.explanation;
    explanationText.classList.remove('hidden');

    restartBtn.classList.add('hidden');
    nextStageBtn.classList.remove('hidden');
    messageOverlay.classList.remove('hidden');
}

function nextStage() {
    messageOverlay.classList.add('hidden');
    explanationText.classList.add('hidden');
    currentStage++;
    loadStage();
}

function takeDamage(reason) {
    health--;
    updateHealthDisplay();

    // Enhanced Damage Effect (Flash + Shake)
    const flash = document.createElement('div');
    flash.className = 'damage-flash';
    gameContainer.appendChild(flash);
    setTimeout(() => flash.remove(), 300);

    gameContainer.classList.add('shake');
    setTimeout(() => {
        gameContainer.classList.remove('shake');
    }, 500);

    if (health <= 0) {
        gameOver();
    } else {
        // Restart current question
        setTimeout(() => {
            loadStage();
        }, 1000);
    }
}

function updateHealthDisplay() {
    let hearts = "";
    for (let i = 0; i < 3; i++) {
        if (i < health) {
            hearts += "❤️";
        } else {
            hearts += "🖤";
        }
    }
    healthEl.textContent = hearts;
}

function gameOver() {
    isGameOver = true;
    messageText.innerHTML = "GAME OVER<br><span style='font-size:1rem'>The enemy got you!</span>";
    explanationText.classList.add('hidden');
    restartBtn.classList.remove('hidden');
    nextStageBtn.classList.add('hidden');
    messageOverlay.classList.remove('hidden');
    restartBtn.textContent = "TRY AGAIN";
}

function gameClear() {
    isGameOver = true;
    clearInterval(timerInterval);
    messageText.innerHTML = "CONGRATULATIONS!<br><span style='font-size:1rem'>あなたは FMKJ に一歩近づいた...</span>";
    explanationText.innerHTML = "しかし、これはまだ序章にすぎない。<br>さらなる試練があなたを待っているだろう。<br><br>TO BE CONTINUED...";
    explanationText.classList.remove('hidden');
    restartBtn.classList.remove('hidden');
    nextStageBtn.classList.add('hidden');
    messageOverlay.classList.remove('hidden');
    restartBtn.textContent = "PLAY AGAIN";
}

const prologueOverlay = document.getElementById('prologue-overlay');
const storyText = document.getElementById('story-text');
const startAdventureBtn = document.getElementById('start-adventure-btn');

const storyLines = [
    "伝説の存在...",
    "「神」と呼ばれる FMKJ に近づくため",
    "あなたは選ばれた",
    "彼に関するクイズに正解すること",
    "それこそが世界平和へ残された唯一の道",
    "準備はいいか？"
];

function initGame() {
    currentStage = 0;
    health = 3;
    isGameOver = false;
    updateHealthDisplay();
    messageOverlay.classList.add('hidden');
    // loadStage(); // Removed: Game starts after prologue now
}

async function playPrologue() {
    for (const line of storyLines) {
        storyText.textContent = line;
        storyText.classList.remove('fade-out');
        storyText.classList.add('fade-in');

        await new Promise(r => setTimeout(r, 2000)); // Read time

        storyText.classList.remove('fade-in');
        storyText.classList.add('fade-out');

        await new Promise(r => setTimeout(r, 1000)); // Fade out time
    }

    storyText.classList.add('hidden');
    startAdventureBtn.classList.remove('hidden');
}

function restartGame() {
    initGame();
    loadStage();
}

function startGame() {
    prologueOverlay.style.opacity = 0;
    setTimeout(() => {
        prologueOverlay.classList.add('hidden');
        loadStage();
    }, 1000);
}

// Start the game flow
initGame();
playPrologue();

