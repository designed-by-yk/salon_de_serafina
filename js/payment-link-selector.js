/**
 * 決済リンク選択システム - メインサイト用
 * クーポン適用後の最終金額に基づいて最適な決済リンクを選択
 */
class PaymentLinkSelector {
    constructor() {
        this.currentData = null;
        this.selectedLink = null;
        this.couponApplied = null;
        this.finalPrice = 0;
        this.originalPrice = 0;
        
        // 初期化
        this.init();
    }
    
    /**
     * 初期化
     */
    init() {
        console.log('🔗 PaymentLinkSelector初期化開始');
        this.loadData();
        this.setupEventListeners();
    }
    
    /**
     * 統合管理画面からデータを読み込み
     */
    loadData() {
        try {
            const data = localStorage.getItem('integratedAdminData');
            if (data) {
                this.currentData = JSON.parse(data);
                console.log('✅ 統合管理画面データを読み込みました');
                console.log('📦 商品数:', this.currentData.products?.length || 0);
                console.log('🔗 決済リンク数:', this.currentData.paymentLinks?.length || 0);
            } else {
                console.warn('⚠️ 統合管理画面データが見つかりません');
            }
        } catch (error) {
            console.error('❌ データ読み込みエラー:', error);
        }
    }
    
    /**
     * イベントリスナーの設定
     */
    setupEventListeners() {
        // クーポン適用時のイベント
        document.addEventListener('couponApplied', (event) => {
            this.handleCouponApplied(event.detail);
        });
        
        // クーポン削除時のイベント
        document.addEventListener('couponRemoved', (event) => {
            this.handleCouponRemoved(event.detail);
        });
        
        // 価格変更時のイベント
        document.addEventListener('priceChanged', (event) => {
            this.handlePriceChanged(event.detail);
        });
    }
    
    /**
     * クーポン適用時の処理
     */
    handleCouponApplied(couponData) {
        console.log('🎫 クーポン適用:', couponData);
        this.couponApplied = couponData;
        this.updatePaymentLink();
    }
    
    /**
     * クーポン削除時の処理
     */
    handleCouponRemoved(couponData) {
        console.log('🗑️ クーポン削除:', couponData);
        this.couponApplied = null;
        this.updatePaymentLink();
    }
    
    /**
     * 価格変更時の処理
     */
    handlePriceChanged(priceData) {
        console.log('💰 価格変更:', priceData);
        this.originalPrice = priceData.originalPrice || this.originalPrice;
        this.finalPrice = priceData.finalPrice || this.finalPrice;
        this.updatePaymentLink();
    }
    
    /**
     * 決済リンクの更新
     */
    updatePaymentLink() {
        if (!this.currentData) {
            console.warn('⚠️ 統合管理画面データが読み込まれていません');
            return;
        }
        
        // 現在の商品名を取得
        const productName = this.getCurrentProductName();
        if (!productName) {
            console.warn('⚠️ 商品名を取得できません');
            return;
        }
        
        // 最終金額を計算
        this.calculateFinalPrice();
        
        // 最適な決済リンクを選択
        this.selectedLink = this.selectOptimalPaymentLink(productName, this.finalPrice, this.couponApplied?.code);
        
        // UIを更新
        this.updatePaymentUI();
    }
    
    /**
     * 現在の商品名を取得
     */
    getCurrentProductName() {
        // ページタイトルや商品名要素から商品名を取得
        const title = document.title;
        const productElements = document.querySelectorAll('[data-product-name], .product-name, h1, h2');
        
        for (const element of productElements) {
            const text = element.textContent || element.innerText;
            if (text.includes('神託システム') || text.includes('星詠みシステム') || text.includes('個人鑑定')) {
                return text.trim();
            }
        }
        
        // ページタイトルから推測
        if (title.includes('神託システム')) return '神託システムタロット占い';
        if (title.includes('星詠みシステム')) return '星詠みシステム星座占い';
        if (title.includes('個人鑑定')) return '個人鑑定';
        
        return null;
    }
    
    /**
     * 最終金額を計算
     */
    calculateFinalPrice() {
        if (this.couponApplied) {
            if (this.couponApplied.discountType === 'fixed') {
                this.finalPrice = this.originalPrice - this.couponApplied.discountValue;
            } else if (this.couponApplied.discountType === 'percentage') {
                this.finalPrice = this.originalPrice * (1 - this.couponApplied.discountValue / 100);
            }
        } else {
            this.finalPrice = this.originalPrice;
        }
        
        console.log(`💰 最終金額計算: 元価格 ¥${this.originalPrice} → 最終金額 ¥${this.finalPrice}`);
    }
    
    /**
     * 最適な決済リンクを選択
     */
    selectOptimalPaymentLink(productName, finalPrice, couponCode = null) {
        console.log(`🔗 決済リンク選択開始: ${productName}, 最終金額: ¥${finalPrice}, クーポン: ${couponCode || 'なし'}`);
        
        if (!this.currentData.paymentLinks) {
            console.error('❌ 決済リンクデータが不足しています');
            return null;
        }
        
        // 商品名に基づいて関連する決済リンクを検索
        const relatedLinks = this.currentData.paymentLinks.filter(link => {
            // 商品名での直接マッチ
            if (link.productName === productName) {
                return true;
            }
            
            // productRefIdでのマッチ（商品管理との連携）
            const product = this.currentData.products.find(p => p.id === link.productRefId);
            if (product && product.name === productName) {
                return true;
            }
            
            return false;
        });
        
        if (relatedLinks.length === 0) {
            console.warn(`⚠️ 商品「${productName}」に関連する決済リンクが見つかりません`);
            return null;
        }
        
        console.log(`🔍 関連する決済リンク: ${relatedLinks.length}件`);
        relatedLinks.forEach(link => {
            console.log(`  - ${link.id}: ¥${link.price} (${link.active ? '有効' : '無効'})`);
        });
        
        // 有効な決済リンクのみを対象とする
        const activeLinks = relatedLinks.filter(link => link.active);
        
        if (activeLinks.length === 0) {
            console.warn(`⚠️ 商品「${productName}」の有効な決済リンクがありません`);
            return null;
        }
        
        // 最終金額に最も近い決済リンクを選択
        let optimalLink = null;
        let minDifference = Infinity;
        
        activeLinks.forEach(link => {
            const difference = Math.abs(link.price - finalPrice);
            if (difference < minDifference) {
                minDifference = difference;
                optimalLink = link;
            }
        });
        
        if (optimalLink) {
            console.log(`✅ 最適な決済リンク選択: ${optimalLink.id} (¥${optimalLink.price})`);
            console.log(`💰 価格差: ¥${Math.abs(optimalLink.price - finalPrice)}`);
            return optimalLink;
        } else {
            console.error('❌ 最適な決済リンクの選択に失敗しました');
            return null;
        }
    }
    
    /**
     * 決済UIの更新
     */
    updatePaymentUI() {
        if (!this.selectedLink) {
            console.warn('⚠️ 選択された決済リンクがありません');
            return;
        }
        
        // 決済ボタンのURLを更新
        this.updatePaymentButton();
        
        // 決済リンク選択UIを表示
        this.showPaymentLinkSelector();
        
        // 価格表示を更新
        this.updatePriceDisplay();
    }
    
    /**
     * 決済ボタンの更新
     */
    updatePaymentButton() {
        const paymentButtons = document.querySelectorAll('.payment-button, .checkout-button, [data-payment-url]');
        
        paymentButtons.forEach(button => {
            // ボタンのURL属性を更新
            if (button.hasAttribute('href')) {
                button.href = this.selectedLink.url;
            }
            if (button.hasAttribute('data-payment-url')) {
                button.setAttribute('data-payment-url', this.selectedLink.url);
            }
            
            // ボタンのテキストを更新（価格を含む場合）
            const buttonText = button.textContent || button.innerText;
            if (buttonText.includes('¥') || buttonText.includes('円')) {
                const newText = buttonText.replace(/¥\d+/, `¥${this.finalPrice}`);
                button.textContent = newText;
            }
            
            console.log(`🔗 決済ボタン更新: ${buttonText} → ${this.selectedLink.url}`);
        });
    }
    
    /**
     * 決済リンク選択UIの表示
     */
    showPaymentLinkSelector() {
        // 既存の選択UIがあれば削除
        const existingSelector = document.getElementById('payment-link-selector');
        if (existingSelector) {
            existingSelector.remove();
        }
        
        // 選択UIを作成
        const selector = this.createPaymentLinkSelector();
        document.body.appendChild(selector);
        
        // アニメーションで表示
        setTimeout(() => {
            selector.style.opacity = '1';
            selector.style.transform = 'translateY(0)';
        }, 100);
    }
    
    /**
     * 決済リンク選択UIの作成
     */
    createPaymentLinkSelector() {
        const selector = document.createElement('div');
        selector.id = 'payment-link-selector';
        selector.innerHTML = `
            <div class="payment-link-selector-content">
                <h3>🎯 最適な決済リンクが選択されました</h3>
                <div class="selected-link-info">
                    <p><strong>選択された決済リンク:</strong> ${this.selectedLink.id}</p>
                    <p><strong>価格:</strong> ¥${this.selectedLink.price}</p>
                    <p><strong>最終金額:</strong> ¥${this.finalPrice}</p>
                    ${this.couponApplied ? `<p><strong>適用クーポン:</strong> ${this.couponApplied.code}</p>` : ''}
                </div>
                <div class="payment-link-actions">
                    <button class="btn btn-primary" onclick="window.open('${this.selectedLink.url}', '_blank')">
                        💳 今すぐ決済
                    </button>
                    <button class="btn btn-secondary" onclick="this.parentElement.parentElement.parentElement.remove()">
                        ✕ 閉じる
                    </button>
                </div>
            </div>
        `;
        
        // スタイルを適用
        Object.assign(selector.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            width: '350px',
            maxWidth: '90vw',
            backgroundColor: '#fff',
            border: '2px solid #007bff',
            borderRadius: '10px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            zIndex: '10000',
            opacity: '0',
            transform: 'translateY(-20px)',
            transition: 'all 0.3s ease',
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px'
        });
        
        return selector;
    }
    
    /**
     * 価格表示の更新
     */
    updatePriceDisplay() {
        // 価格表示要素を検索して更新
        const priceElements = document.querySelectorAll('.price, .final-price, [data-price]');
        
        priceElements.forEach(element => {
            const currentText = element.textContent || element.innerText;
            if (currentText.includes('¥') || currentText.includes('円')) {
                const newText = currentText.replace(/¥\d+/, `¥${this.finalPrice}`);
                element.textContent = newText;
                console.log(`💰 価格表示更新: ${currentText} → ${newText}`);
            }
        });
    }
    
    /**
     * 手動で決済リンクを更新
     */
    manualUpdatePaymentLink(productName, originalPrice, couponCode = null) {
        this.originalPrice = originalPrice;
        this.couponApplied = couponCode ? { code: couponCode } : null;
        this.updatePaymentLink();
    }
    
    /**
     * データの再読み込み
     */
    refreshData() {
        this.loadData();
        console.log('🔄 データを再読み込みしました');
    }
}

// グローバルインスタンスを作成
window.paymentLinkSelector = new PaymentLinkSelector();

// デバッグ用の関数
window.debugPaymentLinkSelector = () => {
    console.log('🔍 PaymentLinkSelector デバッグ情報:');
    console.log('currentData:', window.paymentLinkSelector.currentData);
    console.log('selectedLink:', window.paymentLinkSelector.selectedLink);
    console.log('couponApplied:', window.paymentLinkSelector.couponApplied);
    console.log('finalPrice:', window.paymentLinkSelector.finalPrice);
    console.log('originalPrice:', window.paymentLinkSelector.originalPrice);
};
