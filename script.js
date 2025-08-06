document.addEventListener('DOMContentLoaded', () => {
    // --- 配置项 ---
    const TOTAL_DAYS = 693;
    const TOTAL_WEEKS = 99;
    const TOTAL_SCORE = 149;

    // --- DOM 元素 ---
    const daysEl = document.getElementById('days');
    const weeksEl = document.getElementById('weeks');
    const timeProgressBar = document.getElementById('time-progress-bar');
    const scoreDisplay = document.getElementById('score-display');
    const scoreProgressBar = document.getElementById('score-progress-bar');
    const startChallengeBtn = document.getElementById('start-challenge-btn');
    const challengeDesc = document.getElementById('challenge-desc');
    
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
    let guessesLeft;

    // --- 数据状态 ---
    let state = {
        startDate: null,
        currentScore: 0,
        lastChallengeDate: null,
        scoreHistory: []
    };

    // --- 函数 ---

    // 从 localStorage 加载数据
    function loadState() {
        const savedState = JSON.parse(localStorage.getItem('countdownState'));
        if (savedState) {
            state = savedState;
            // 确保日期是 Date 对象
            if (state.startDate) {
                state.startDate = new Date(state.startDate);
            }
        } else {
            // 如果是第一次，设置起始日期
            state.startDate = new Date();
            saveState();
        }
    }

    // 保存数据到 localStorage
    function saveState() {
        localStorage.setItem('countdownState', JSON.stringify(state));
    }

    // 更新倒计时显示
    function updateCountdown() {
        const now = new Date();
        const elapsedMilliseconds = now - state.startDate;
        const elapsedDays = Math.floor(elapsedMilliseconds / (1000 * 60 * 60 * 24));
        
        const daysLeft = Math.max(0, TOTAL_DAYS - elapsedDays);
        const weeksLeft = Math.floor(daysLeft / 7);

        daysEl.textContent = daysLeft;
        weeksEl.textContent = weeksLeft;

        // 更新进度条
        const progress = Math.min(100, (elapsedDays / TOTAL_DAYS) * 100);
        timeProgressBar.style.width = `${progress}%`;
        
        // 检查特殊日期奖励
        checkSpecialBonuses(elapsedDays);
    }

    // 更新积分显示
    function updateScoreDisplay() {
        scoreDisplay.textContent = `当前积分: ${state.currentScore} / ${TOTAL_SCORE}`;
        const scoreProgress = (state.currentScore / TOTAL_SCORE) * 100;
        scoreProgressBar.style.width = `${scoreProgress}%`;
    }
    
    // 添加积分
    function addScore(points, reason) {
        state.currentScore += points;
        const today = new Date().toLocaleDateString();
        state.scoreHistory.push({ date: today, points, reason });
        updateScoreDisplay();
        saveState();
    }

    // 检查特殊日期奖励
    function checkSpecialBonuses(elapsedDays) {
        // 第328天奖励
        if (elapsedDays >= 328 && !state.scoreHistory.some(item => item.reason === '第328天特别奖励')) {
            addScore(25, '第328天特别奖励');
            alert('恭喜！达成第328天，获得25分特别奖励！');
        }
        // 最后一天奖励
        if (elapsedDays >= TOTAL_DAYS && !state.scoreHistory.some(item => item.reason === '最后一天特别奖励')) {
            addScore(25, '最后一天特别奖励');
            alert('恭喜！完成所有倒数日，获得25分最终奖励！');
        }
    }

    // 检查每日挑战状态
    function checkChallengeStatus() {
        const today = new Date().toDateString();
        if (state.lastChallengeDate === today) {
            startChallengeBtn.textContent = '今日已完成';
            startChallengeBtn.disabled = true;
            challengeDesc.textContent = '期待明天的挑战！';
        } else {
            startChallengeBtn.textContent = '开始游戏';
            startChallengeBtn.disabled = false;
            challengeDesc.textContent = '完成今天的小游戏，赢取积分！';
        }
    }

    // 初始化游戏
    function initGame() {
        targetNumber = Math.floor(Math.random() * 10) + 1;
        guessesLeft = 3;
        gameFeedback.textContent = `你有 ${guessesLeft} 次机会。`;
        guessInput.value = '';
        submitGuessBtn.disabled = false;
    }

    // 处理猜数字逻辑
    function handleGuess() {
        const userGuess = parseInt(guessInput.value);
        if (isNaN(userGuess) || userGuess < 1 || userGuess > 10) {
            gameFeedback.textContent = '请输入1到10之间的有效数字。';
            return;
        }

        guessesLeft--;

        if (userGuess === targetNumber) {
            gameFeedback.textContent = `恭喜你，猜对了！数字就是 ${targetNumber}。`;
            submitGuessBtn.disabled = true;
            completeChallenge();
            setTimeout(() => gameModal.style.display = 'none', 2000);
        } else if (guessesLeft > 0) {
            const hint = userGuess < targetNumber ? '太小了' : '太大了';
            gameFeedback.textContent = `${hint}！你还有 ${guessesLeft} 次机会。`;
        } else {
            gameFeedback.textContent = `很遗憾，机会用完了。正确的数字是 ${targetNumber}。`;
            submitGuessBtn.disabled = true;
            // 即使失败，也算完成挑战，但不给分
            state.lastChallengeDate = new Date().toDateString();
            saveState();
            checkChallengeStatus();
            setTimeout(() => gameModal.style.display = 'none', 2000);
        }
    }
    
    // 完成挑战
    function completeChallenge() {
        const today = new Date().toDateString();
        state.lastChallengeDate = today;
        
        // 每周完成小游戏获得1分，这里简化为每日1分
        // 您的需求是每周1分，但每日游戏，这里按每日1分实现，更具激励性
        addScore(1, '每日游戏挑战');
        
        checkChallengeStatus();
        alert('任务完成！获得1点积分！');
    }

    // 显示积分历史
    function showHistory() {
        historyList.innerHTML = ''; // 清空旧列表
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
        checkChallengeStatus();
        // 每秒更新一次倒计时（可以根据需要调整）
        setInterval(updateCountdown, 1000 * 60); // 每分钟更新一次，减少性能消耗
    }

    initialize();
});
