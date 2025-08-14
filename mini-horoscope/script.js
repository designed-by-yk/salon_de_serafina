document.addEventListener('DOMContentLoaded', () => {
  // 星座データ
  const zodiacData = {
    aries: { name: '牡羊座', symbol: '♈' },
    taurus: { name: '牡牛座', symbol: '♉' },
    gemini: { name: '双子座', symbol: '♊' },
    cancer: { name: '蟹座', symbol: '♋' },
    leo: { name: '獅子座', symbol: '♌' },
    virgo: { name: '乙女座', symbol: '♍' },
    libra: { name: '天秤座', symbol: '♎' },
    scorpio: { name: '蠍座', symbol: '♏' },
    sagittarius: { name: '射手座', symbol: '♐' },
    capricorn: { name: '山羊座', symbol: '♑' },
    aquarius: { name: '水瓶座', symbol: '♒' },
    pisces: { name: '魚座', symbol: '♓' }
  };

  // アドバイスメッセージ
  const adviceMessages = [
    '今日は新しいチャレンジに向いています。積極的に行動してみましょう。',
    '直感を信じて行動すると、思わぬ良い結果が待っています。',
    '人とのコミュニケーションが運気アップのカギとなります。',
    '今日は慎重に物事を進めることで、安定した成果を得られるでしょう。',
    '創造性を発揮することで、新たな可能性が開けそうです。',
    '過去の経験を活かして、今日の課題に取り組んでみてください。',
    'バランス感覚を大切にすることで、調和のとれた一日になります。',
    '集中力が高まる日です。重要な作業に取り組むのに最適です。',
    '冒険心を大切にして、普段とは違うことにチャレンジしてみましょう。',
    '計画性を持って行動すると、目標達成に近づけるでしょう。',
    '独創的なアイデアが浮かびやすい日です。メモを取ることをお勧めします。',
    '感受性が豊かになる日です。芸術や美しいものに触れてみてください。'
  ];

  // DOM要素の取得
  const zodiacButtons = document.querySelectorAll('.zodiac-btn');
  const zodiacSelection = document.getElementById('zodiac-selection');
  const resultSection = document.getElementById('result-section');
  const selectedSign = document.getElementById('selected-sign');
  const luckyTime = document.getElementById('lucky-time');
  const decisionLevel = document.getElementById('decision-level');
  const moneyIndex = document.getElementById('money-index');
  const dailyAdvice = document.getElementById('daily-advice');
  const resetBtn = document.getElementById('reset-btn');
  const premiumBtn = document.getElementById('premium-btn');
  const closeBtn = document.getElementById('close-btn');

  // DOM要素の取得確認

  // 今日の日付キーを取得
  function getTodayKey() {
    const today = new Date();
    return `horoscope_${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  }

  // 制限機能を削除（無料で何度でも使用可能）
  function checkDailyLimit() {
    return false; // 常に制限なし
  }

  // 制限設定も削除
  function setDailyLimit() {
    // 何もしない
  }



  // 日付ベースのシード値を生成
  function getDateSeed() {
    const today = new Date();
    return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  }

  // シード値を使った疑似ランダム生成器
  function seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  // 星座ごとの運勢を生成
  function generateFortune(sign) {
    const dateSeed = getDateSeed();
    const signSeed = sign.charCodeAt(0);
    const combinedSeed = dateSeed + signSeed;

    // 最強運の時間帯
    const hourSeed = seededRandom(combinedSeed * 1.1);
    const hour = Math.floor(hourSeed * 24);
    const minuteSeed = seededRandom(combinedSeed * 1.2);
    const minute = Math.floor(minuteSeed * 60);
    const luckyTimeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

    // 決断力レベル (1-5星)
    const decisionSeed = seededRandom(combinedSeed * 1.3);
    const decisionStars = Math.floor(decisionSeed * 5) + 1;
    const decisionLevelStr = '★'.repeat(decisionStars) + '☆'.repeat(5 - decisionStars);

    // 金運指数 (20-100%)
    const moneySeed = seededRandom(combinedSeed * 1.4);
    const moneyPercent = Math.floor(moneySeed * 81) + 20; // 20-100の範囲

    // アドバイスメッセージ
    const adviceSeed = seededRandom(combinedSeed * 1.5);
    const adviceIndex = Math.floor(adviceSeed * adviceMessages.length);
    const advice = adviceMessages[adviceIndex];

    return {
      luckyTime: luckyTimeStr,
      decisionLevel: decisionLevelStr,
      moneyIndex: `${moneyPercent}%`,
      advice: advice
    };
  }

  // 制限メッセージを表示
  function showLimitMessage() {
    zodiacSelection.classList.add('hidden');
    resultSection.classList.remove('hidden');
    
    selectedSign.textContent = '⏰ 本日の占いは終了';
    luckyTime.textContent = '--:--';
    decisionLevel.textContent = '-- --';
    moneyIndex.textContent = '--%';
    dailyAdvice.textContent = '本日はすでに占い済みです。より詳しい運勢を知りたい方は、プレミアム版をお試しください。';
    
    // プレミアムボタンを強調
    premiumBtn.style.background = 'linear-gradient(45deg, #ff6b6b, #ffd93d)';
    premiumBtn.style.animation = 'pulse 2s infinite';
  }

  // 結果を表示
  function showResult(sign) {
    // 既に占い済みかチェック
    if (checkDailyLimit()) {
      showLimitMessage();
      return;
    }

    const zodiac = zodiacData[sign];
    const fortune = generateFortune(sign);
    
    // 1日制限を設定
    setDailyLimit();

    // 星座名を設定
    selectedSign.textContent = `${zodiac.symbol} ${zodiac.name}`;

    // 運勢データを設定
    luckyTime.textContent = fortune.luckyTime;
    decisionLevel.textContent = fortune.decisionLevel;
    moneyIndex.textContent = fortune.moneyIndex;
    dailyAdvice.textContent = fortune.advice;

    // 画面切り替え
    zodiacSelection.classList.add('hidden');
    resultSection.classList.remove('hidden');
  }

  // プレミアム星座占いへの誘導を表示
  function showPremiumModal() {
    window.location.href = 'star-yomi-detail.html';
  }

  // 旧プレミアムモーダル関数（削除予定）
  function showOldPremiumModal() {
    const modal = document.createElement('div');
    modal.className = 'premium-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>🌟 プレミアム版で分かること</h2>
          <button class="modal-close">&times;</button>
        </div>
        
        <!-- 価格とボタンを上部に移動 -->
        <div class="modal-footer" style="padding: 15px 30px; border-bottom: 1px solid rgba(255,255,255,0.1);">
          <div class="price-highlight" style="margin-bottom: 10px; text-align: center;">
            <div style="margin-bottom: 5px;">
              <span class="original-price" style="text-decoration: line-through; color: rgba(255,255,255,0.6); font-size: 16px;">月額380円</span>
              <span class="discount-price" style="color: #ffd700; font-size: 24px; font-weight: bold; margin-left: 10px;">初月100円</span>
            </div>
            <p class="price-note" style="color: rgba(255,255,255,0.8); font-size: 12px; margin: 0; text-align: center;">いつでも解約可能</p>
          </div>
          <button class="premium-signup-btn" style="margin-bottom: 10px;">💎 申し込みはこちら</button>
          <button class="modal-cancel">後で確認する</button>
        </div>
        
        <div class="modal-body">
          <div class="premium-features">
            <div class="feature-item">
              <span class="feature-icon">🔍</span>
              <span class="feature-text">なぜこの時間が最強なのか詳しい理由</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">📅</span>
              <span class="feature-text">1週間分の詳細運勢</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">💕</span>
              <span class="feature-text">恋愛・仕事・健康の具体的アドバイス</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🎯</span>
              <span class="feature-text">毎日無制限で占い放題</span>
            </div>
          </div>
        </div>
        <div class="scroll-indicator">↓</div>
      </div>
    `;

    document.body.appendChild(modal);

    const modalContent = modal.querySelector('.modal-content');
    const scrollIndicator = modal.querySelector('.scroll-indicator');

    // スクロール検知機能
    modalContent.addEventListener('scroll', () => {
      const scrollTop = modalContent.scrollTop;
      const scrollHeight = modalContent.scrollHeight;
      const clientHeight = modalContent.clientHeight;
      
      // スクロール位置が下部近くになったらインジケーターを非表示
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        modalContent.classList.add('scrolled');
      } else {
        modalContent.classList.remove('scrolled');
      }
    });

    // モーダル内のイベントリスナー
    modal.querySelector('.modal-close').addEventListener('click', () => {
      document.body.removeChild(modal);
    });

    modal.querySelector('.modal-cancel').addEventListener('click', () => {
      document.body.removeChild(modal);
    });

    modal.querySelector('.premium-signup-btn').addEventListener('click', () => {
      // プレミアムページに遷移（星座情報も引き継ぎ）
      const currentSign = localStorage.getItem('current_selected_sign') || 'aries';
      window.location.href = `premium.html?sign=${currentSign}`;
    });

    // モーダル背景クリックで閉じる
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });

    // 初期状態でスクロール可能かチェック
    setTimeout(() => {
      const scrollHeight = modalContent.scrollHeight;
      const clientHeight = modalContent.clientHeight;
      
      // スクロールが不要な場合はインジケーターを非表示
      if (scrollHeight <= clientHeight + 10) {
        modalContent.classList.add('scrolled');
      }
    }, 100);
  }

  // 星座選択画面に戻る
  function resetToSelection() {
    resultSection.classList.add('hidden');
    zodiacSelection.classList.remove('hidden');
    // プレミアムボタンのスタイルをリセット
    premiumBtn.style.background = '';
    premiumBtn.style.animation = '';
  }

  // 現在選択中の星座を保存
  function saveCurrentSign(sign) {
    localStorage.setItem('current_selected_sign', sign);
  }

  // デバッグ用：制限をリセット
  function resetDailyLimit() {
    const key = getTodayKey();
    localStorage.removeItem(key);
    console.log('制限がリセットされました');
  }

  // デバッグ用：グローバル関数として公開
  window.debugReset = resetDailyLimit;

  // イベントリスナーの設定
  zodiacButtons.forEach(button => {
    button.addEventListener('click', () => {
      const sign = button.getAttribute('data-sign');
      // 星座選択処理
      saveCurrentSign(sign); // 星座を保存
      showResult(sign);
    });
  });

  resetBtn.addEventListener('click', resetToSelection);

  premiumBtn.addEventListener('click', showPremiumModal);

  // 閉じるボタンのイベントリスナー
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      // トップページに戻る
      window.location.href = '../omikuji/index.html';
    });
  }

  // CSSアニメーション追加
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
  `;
  document.head.appendChild(style);

  // 初期状態の設定
  resultSection.classList.add('hidden');
});