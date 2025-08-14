document.addEventListener('DOMContentLoaded', () => {
  // 星座選択とUI更新
  initZodiacSelection();
  
  // 決済ボタンのイベントリスナー
  const purchaseBtn = document.getElementById('purchase-btn');
  if (purchaseBtn) {
    purchaseBtn.addEventListener('click', handlePurchase);
  }
  
  // スムーズスクロール効果
  initSmoothScrolling();
  
  // アニメーション効果
  initScrollAnimations();
});

// 星座データ
const zodiacData = {
  aries: { name: '牡羊座', symbol: '♈', period: '3/21-4/19' },
  taurus: { name: '牡牛座', symbol: '♉', period: '4/20-5/20' },
  gemini: { name: '双子座', symbol: '♊', period: '5/21-6/21' },
  cancer: { name: '蟹座', symbol: '♋', period: '6/22-7/22' },
  leo: { name: '獅子座', symbol: '♌', period: '7/23-8/22' },
  virgo: { name: '乙女座', symbol: '♍', period: '8/23-9/22' },
  libra: { name: '天秤座', symbol: '♎', period: '9/23-10/23' },
  scorpio: { name: '蠍座', symbol: '♏', period: '10/24-11/22' },
  sagittarius: { name: '射手座', symbol: '♐', period: '11/23-12/21' },
  capricorn: { name: '山羊座', symbol: '♑', period: '12/22-1/19' },
  aquarius: { name: '水瓶座', symbol: '♒', period: '1/20-2/18' },
  pisces: { name: '魚座', symbol: '♓', period: '2/19-3/20' }
};

let selectedZodiac = null;

// 星座選択の初期化
function initZodiacSelection() {
  const zodiacButtons = document.querySelectorAll('.zodiac-btn');
  const selectedZodiacDiv = document.getElementById('selected-zodiac');
  const purchaseBtn = document.getElementById('purchase-btn');
  
  zodiacButtons.forEach(button => {
    button.addEventListener('click', () => {
      // 全ての選択を解除
      zodiacButtons.forEach(btn => btn.classList.remove('selected'));
      
      // 選択されたボタンをハイライト
      button.classList.add('selected');
      
      // 選択された星座を記録
      selectedZodiac = button.dataset.sign;
      
      // 選択された星座を表示
      updateSelectedZodiacDisplay(selectedZodiac);
      
      // 決済ボタンを有効化
      updatePurchaseButton(selectedZodiac);
      
      // 選択エリアまでスクロール
      setTimeout(() => {
        selectedZodiacDiv.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 300);
    });
  });
}

// 選択された星座の表示を更新
function updateSelectedZodiacDisplay(sign) {
  const selectedZodiacDiv = document.getElementById('selected-zodiac');
  const symbolSpan = selectedZodiacDiv.querySelector('.selected-symbol');
  const nameSpan = selectedZodiacDiv.querySelector('.selected-name');
  
  const zodiac = zodiacData[sign];
  
  symbolSpan.textContent = zodiac.symbol;
  nameSpan.textContent = `${zodiac.name} (${zodiac.period})`;
  
  selectedZodiacDiv.style.display = 'block';
  selectedZodiacDiv.classList.add('animate-in');
}

// 決済ボタンの状態を更新
function updatePurchaseButton(sign) {
  const purchaseBtn = document.getElementById('purchase-btn');
  const zodiac = zodiacData[sign];
  
  purchaseBtn.disabled = false;
  purchaseBtn.querySelector('.btn-main').textContent = `⭐ ${zodiac.name}の詳細鑑定を申し込む`;
  purchaseBtn.querySelector('.btn-sub').textContent = '特別価格 980円';
  
  // ボタンの背景を変更してアクティブ感を演出
  purchaseBtn.style.background = 'linear-gradient(135deg, #ffd700, #ffb347)';
}

// 決済処理
function handlePurchase() {
  if (!selectedZodiac) {
    alert('まず星座を選択してください。');
    return;
  }
  
  const zodiac = zodiacData[selectedZodiac];
  
  // 確認ダイアログ
  const confirmed = confirm(
    `${zodiac.name}のAI星座詳細鑑定（980円）をお申し込みしますか？\n\n` +
    '含まれる内容：\n' +
    '• 31日分の詳細運勢（約3,000文字）\n' +
    '• 毎日の開運アクション\n' +
    '• 注意すべき日付の詳細\n' +
    '• 運勢グラフとラッキー情報\n\n' +
    '※ 現在は決済システム準備中です'
  );
  
  if (confirmed) {
    showPurchaseModal();
  }
}

// 購入モーダルの表示
function showPurchaseModal() {
  const zodiac = zodiacData[selectedZodiac];
  
  const modal = document.createElement('div');
  modal.className = 'purchase-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>⭐ AI星座詳細鑑定</h2>
        <button class="modal-close">&times;</button>
      </div>
      
      <div class="modal-body">
        <div class="selected-zodiac-info">
          <h3>選択された星座</h3>
          <div class="zodiac-info">
            <span class="zodiac-symbol-large">${zodiac.symbol}</span>
            <div class="zodiac-details">
              <span class="zodiac-name-large">${zodiac.name}</span>
              <span class="zodiac-period-info">${zodiac.period}</span>
            </div>
          </div>
        </div>
        
        <div class="order-summary">
          <h3>注文内容</h3>
          <div class="order-item">
            <span class="item-name">${zodiac.name} AI詳細鑑定</span>
            <span class="item-price">¥980</span>
          </div>
          <div class="order-total">
            <span class="total-label">合計</span>
            <span class="total-price">¥980</span>
          </div>
        </div>
        
        <div class="payment-methods">
          <h3>お支払い方法：<br>クレジットカード・デビットカード<br>（Visa, Mastercard, JCB, Amex対応）</h3>
          <button class="payment-option" data-method="square">
            <span class="payment-icon">💳</span>
            <span class="payment-name">クレジットカード・デビットカード</span>
            <span class="payment-desc">（Visa, Mastercard, JCB, Amex対応）</span>
          </button>
          <button class="payment-option" data-method="paypal">
            <span class="payment-icon">🅿️</span>
            <span class="payment-name">PayPal</span>
          </button>
        </div>
        
        <div class="modal-note">
          <p>🔒 SSL暗号化により安全に決済処理されます</p>
          <p>⚠️ 現在決済システム準備中のため、実際の決済は行われません</p>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // モーダルイベントリスナー
  const closeBtn = modal.querySelector('.modal-close');
  closeBtn.addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  // 決済方法選択
  const paymentOptions = modal.querySelectorAll('.payment-option');
  paymentOptions.forEach(option => {
    option.addEventListener('click', (e) => {
      const method = e.currentTarget.dataset.method;
      alert(`${method === 'square' ? 'クレジットカード・デビットカード' : 'PayPal'}決済を選択しました。\n\n${zodiac.name}の詳細鑑定結果は準備中のため、実際の決済は行われません。`);
      document.body.removeChild(modal);
    });
  });
  
  // 背景クリックで閉じる
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
}

// スムーズスクロール
function initSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 120;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

// スクロールアニメーション
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);
  
  // アニメーション対象要素
  const animateElements = document.querySelectorAll('.feature-card, .sample-card, .payment-card, .faq-item, .zodiac-btn');
  animateElements.forEach(el => {
    observer.observe(el);
  });
}

// モーダル用CSS（動的追加）
const modalStyles = `
<style>
.purchase-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  z-index: 10000;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 20px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  border: 2px solid #9b59b6;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  color: #ffd700;
  margin: 0;
  font-size: 1.4rem;
}

.modal-close {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 5px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.modal-close:hover {
  color: #ffd700;
  background: rgba(255, 255, 255, 0.1);
}

.modal-body {
  padding: 20px;
}

.selected-zodiac-info {
  background: rgba(155, 89, 182, 0.2);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  text-align: center;
}

.selected-zodiac-info h3 {
  color: #9b59b6;
  margin-bottom: 15px;
  font-size: 1.1rem;
}

.zodiac-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.zodiac-symbol-large {
  font-size: 3rem;
  color: #ffd700;
}

.zodiac-details {
  text-align: left;
}

.zodiac-name-large {
  display: block;
  font-size: 1.3rem;
  font-weight: bold;
  color: #ffd700;
  margin-bottom: 5px;
}

.zodiac-period-info {
  display: block;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
}

.order-summary {
  background: rgba(255, 215, 0, 0.1);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
}

.order-summary h3 {
  color: #ffd700;
  margin-bottom: 15px;
  font-size: 1.1rem;
}

.order-item, .order-total {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  padding: 8px 0;
}

.order-total {
  border-top: 1px solid rgba(255, 215, 0, 0.3);
  font-weight: bold;
  font-size: 1.1rem;
}

.payment-methods h3 {
  color: #ffd700;
  margin-bottom: 15px;
  font-size: 1.1rem;
}

.payment-option {
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
}

.payment-option:hover {
  background: rgba(155, 89, 182, 0.2);
  border-color: #9b59b6;
}

.payment-icon {
  font-size: 1.5rem;
  margin-right: 15px;
}

.payment-name {
  font-weight: bold;
}

.modal-note {
  margin-top: 20px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
}

.modal-note p {
  margin: 5px 0;
}

/* アニメーション用CSS */
.feature-card, .sample-card, .payment-card, .faq-item, .zodiac-btn {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease;
}

.feature-card.animate-in, .sample-card.animate-in, .payment-card.animate-in, .faq-item.animate-in, .zodiac-btn.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.selected-zodiac.animate-in {
  animation: fadeInUp 0.5s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
`;

// スタイルを動的に追加
document.head.insertAdjacentHTML('beforeend', modalStyles);

// 結果表示機能
function showReadingResult(zodiacSign) {
  const resultSection = document.getElementById('reading-result');
  const zodiac = zodiacData[zodiacSign];
  
  // サンプル結果データを表示（実際の運用時はAPIから取得）
  displaySampleResult(zodiac);
  
  // 結果セクションを表示
  resultSection.style.display = 'block';
  
  // 結果セクションまでスクロール
  setTimeout(() => {
    resultSection.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }, 300);
}

function displaySampleResult(zodiac) {
  // 実際の運用時はここでAPIから鑑定結果を取得して表示
  const header = document.getElementById('result-zodiac-header');
  const forecast = document.getElementById('monthly-forecast');
  const weekly = document.getElementById('weekly-details');
  const lucky = document.getElementById('lucky-items');
  
  header.innerHTML = `
    <h3>${zodiac.symbol} ${zodiac.name}の詳細鑑定結果</h3>
    <p>期間：${zodiac.period}</p>
  `;
  
  forecast.innerHTML = `
    <h4>📊 今月の総合運勢</h4>
    <p>サンプル結果が表示されます。実際の鑑定結果は決済完了後にお届けします。</p>
  `;
  
  weekly.innerHTML = `
    <h4>📅 週別詳細運勢</h4>
    <p>各週の詳細な運勢とアドバイスが表示されます。</p>
  `;
  
  lucky.innerHTML = `
    <h4>🍀 ラッキー情報</h4>
    <ul>
      <li>ラッキーカラー：サンプル</li>
      <li>ラッキーナンバー：サンプル</li>
      <li>ラッキーアイテム：サンプル</li>
    </ul>
  `;
}

// トップにスクロールする関数
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
  
  // 結果セクションを非表示
  const resultSection = document.getElementById('reading-result');
  resultSection.style.display = 'none';
}



