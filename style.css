document.addEventListener('DOMContentLoaded', () => {
    // --- 配置项 ---
    const TOTAL_DAYS = 693;
    const TOTAL_SCORE = 149;

    // --- DOM 元素 ---
    const daysEl = document.getElementById('days');
    const weeksEl = document.getElementById('weeks');
    const timeProgressBar = document.getElementById('time-progress-bar');
    const scoreDisplay = document.getElementById('score-display');
    const scoreProgressBar = document.getElementById('score-progress-bar');
    const claimWeeklyScoreBtn = document.getElementById('claim-weekly-score-btn');
    const startChallengeBtn = document.getElementById('start-challenge-btn');
    
    // 模态框元素
    const gameModal = document.getElementById('game-modal');
    const historyModal = document.getElementById('history-modal');
    const viewHistoryBtn = document.getElementById('view-history-btn');
    const closeBtns = document.querySelectorAll('.close-btn');
    
    // 游戏元素
    const guessInput = document.getElementById('guess-input');
    const submitGuessBtn = document.getElementById('submit-guess-btn');
    const gameFeedback = document.getElementById('game-feedback');

    // 积分历史
    const historyList = document.getElementById('history-list');

    // --- 游戏状态 ---
    let targetNumber;

    // --- 数据状态 ---
    let state = {
        startDate: null,
        currentScore: 0,
        lastWeeklyClaim: -1, // 记录上一次领取的周数
        scoreHistory: []
    };

    // --- 函数 ---

    function loadState() {
        const savedState = JSON.parse(localStorage.getItem('countdownStateV2')); // 使用新键名避免旧数据冲突
        if (savedState) {
            state = savedState;
            if (state.startDate) {
                state.startDate = new Date(state.startDate);
            }
        } else {
            state.startDate = new Date();
            saveState();
        }
    }

    function saveState() {
        localStorage.setItem('countdownStateV2', JSON.stringify(state));
    }

    function getElapsedInfo() {
        const now = new Date();
        const elapsedMilliseconds = now - state.startDate;
        const elapsedDays = Math.floor(elapsedMilliseconds / (1000 * 60 * 60 * 24));
        const elapsedWeeks = Math.floor(elapsedDays / 7);
        return { elapsedDays, elapsedWeeks };
    }

    function updateCountdown() {
        const { elapsedDays } = getElapsedInfo();
        const daysLeft = Math.max(0, TOTAL_DAYS - elapsedDays);
        const weeksLeft = Math.floor(daysLeft / 7);

        daysEl.textContent = daysLeft;
        weeksEl.textContent = weeksLeft;

        const progress = Math.min(100, (elapsedDays / TOTAL_DAYS) * 100);
        timeProgressBar.style.width = `${progress}%`;
        
        checkSpecialBonuses(elapsedDays);
    }

    function updateScoreDisplay() {
        scoreDisplay.textContent = `当前积分: ${state.currentScore} / ${TOTAL_SCORE}`;
        const scoreProgress = (state.currentScore / TOTAL_SCORE) * 100;
        scoreProgressBar.style.width = `${scoreProgress}%`;
    }
    
    function addScore(points, reason) {
        // 防止重复添加特殊奖励
        if (state.scoreHistory.some(item => item.reason === reason)) {
            return;
        }
        state.currentScore += points;
        const today = new Date().toLocaleDateString();
        state.scoreHistory.push({ date: today, points, reason });
        updateScoreDisplay();
        saveState();
    }

    function checkSpecialBonuses(elapsedDays) {
        if (elapsedDays >= 328) {
            addScore(25, '第328天特别奖励');
        }
        if (elapsedDays >= TOTAL_DAYS) {
            addScore(25, '最后一天特别奖励');
        }
    }

    function checkWeeklyClaimStatus() {
        const { elapsedWeeks } = getElapsedInfo();
        if (elapsedWeeks > state.lastWeeklyClaim) {
            claimWeeklyScoreBtn.disabled = false;
            claimWeeklyScoreBtn.textContent = '领取本周积分 (1分)';
        } else {
            claimWeeklyScoreBtn.disabled = true;
            claimWeeklyScoreBtn.textContent = '本周积分已领取';
        }
    }

    function handleWeeklyClaim() {
        const { elapsedWeeks } = getElapsedInfo();
        if (elapsedWeeks > state.lastWeeklyClaim) {
            state.lastWeeklyClaim = elapsedWeeks;
            addScore(1, `第${elapsedWeeks + 1}周积分`);
            alert('领取成功！获得1点积分！');
            checkWeeklyClaimStatus();
            saveState();
        }
    }

    // 初始化游戏 (无限次尝试)
    function initGame() {
        targetNumber = Math.floor(Math.random() * 10) + 1;
        gameFeedback.textContent = '请猜一个1到10的数字。';
        guessInput.value = '';
        submitGuessBtn.disabled = false;
    }

    // 处理猜数字逻辑 (无限次尝试)
    function handleGuess() {
        const userGuess = parseInt(guessInput.value);
        if (isNaN(userGuess) || userGuess < 1 || userGuess > 10) {
            gameFeedback.textContent = '请输入1到10之间的有效数字。';
            return;
        }

        if (userGuess === targetNumber) {
            gameFeedback.textContent = `恭喜你，猜对了！数字就是 ${targetNumber}。`;
            submitGuessBtn.disabled = true;
            setTimeout(() => {
                gameModal.style.display = 'none';
                alert('游戏成功！真是个小天才！');
            }, 1500);
        } else {
            const hint = userGuess < targetNumber ? '太小了' : '太大了';
            gameFeedback.textContent = `${hint}！再试试吧！`;
            guessInput.select(); // 方便用户再次输入
        }
    }
    
    function showHistory() {
        historyList.innerHTML = '';
        if (state.scoreHistory.length === 0) {
            historyList.innerHTML = '<li>暂无积分记录</li>';
        } else {
            [...state.scoreHistory].reverse().forEach(item => {
                const li = document.createElement('li');
                li.textContent = `${item.date}: ${item.reason} (+${item.points}分)`;
                historyList.appendChild(li);
            });
        }
        historyModal.style.display = 'block';
    }

    // --- 事件监听 ---
    claimWeeklyScoreBtn.addEventListener('click', handleWeeklyClaim);
    startChallengeBtn.addEventListener('click', () => {
        initGame();
        gameModal.style.display = 'block';
    });
    submitGuessBtn.addEventListener('click', handleGuess);
    viewHistoryBtn.addEventListener('click', showHistory);

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            gameModal.style.display = 'none';
            historyModal.style.display = 'none';
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target == gameModal || event.target == historyModal) {
            gameModal.style.display = 'none';
            historyModal.style.display = 'none';
        }
    });

    // --- 初始化 ---
    function initialize() {
        loadState();
        updateCountdown();
        updateScoreDisplay();
        checkWeeklyClaimStatus();
        setInterval(updateCountdown, 1000 * 60); // 每分钟检查一次
    }

    initialize();
});
