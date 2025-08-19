/**
 * Salon de Serafina - クーポンUI コンポーネント
 * 作成日: 2025年8月19日
 */

class CouponUI {
    constructor(serviceType, originalPrice) {
        // サービスタイプが配列の場合と単一の場合を対応
        this.serviceType = Array.isArray(serviceType) ? serviceType : [serviceType];
        this.originalPrice = originalPrice;
        this.appliedCoupon = null;
        this.finalPrice = originalPrice;
        this.couponSystem = window.couponSystem;
        
        this.init();
    }

    init() {
        this.createCouponSection();
        this.bindEvents();
        this.ensureHiddenElements();
    }

    /**
     * クーポン入力セクションを作成
     */
    createCouponSection() {
        const couponHTML = `
            <div class="coupon-section" style="
                background: rgba(255, 215, 0, 0.1);
                border: 1px solid rgba(255, 215, 0, 0.3);
                border-radius: 10px;
                padding: 20px;
                margin: 20px 0;
                font-family: 'Kiwi Maru', sans-serif;
            ">
                <h3 style="
                    color: #ffd700;
                    margin: 0 0 15px 0;
                    font-size: 18px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                ">
                    🎫 クーポンコード
                    <span style="
                        font-size: 12px;
                        color: rgba(255, 255, 255, 0.7);
                        font-weight: normal;
                    ">お持ちの方はご入力ください</span>
                </h3>
                
                <div class="coupon-input-group" style="
                    display: flex;
                    gap: 10px;
                    margin-bottom: 15px;
                    flex-wrap: wrap;
                ">
                    <input 
                        type="text" 
                        id="coupon-code" 
                        placeholder="クーポンコードを入力"
                        style="
                            flex: 1;
                            min-width: 200px;
                            padding: 12px 15px;
                            border: 2px solid rgba(255, 215, 0, 0.3);
                            border-radius: 6px;
                            background: rgba(255, 255, 255, 0.1);
                            color: #fff;
                            font-size: 16px;
                            font-family: inherit;
                        "
                    >
                    <button 
                        type="button" 
                        id="apply-coupon" 
                        style="
                            padding: 12px 20px;
                            background: linear-gradient(45deg, #ffd700, #ffed4e);
                            color: #2d1b69;
                            border: none;
                            border-radius: 6px;
                            font-weight: bold;
                            cursor: pointer;
                            font-size: 14px;
                            white-space: nowrap;
                            transition: all 0.3s ease;
                        "
                    >
                        適用
                    </button>
                </div>
                
                <div id="coupon-message" style="
                    min-height: 20px;
                    font-size: 14px;
                    margin-bottom: 10px;
                "></div>
                
                <div id="coupon-discount" style="
                    display: none !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                    background: rgba(76, 175, 80, 0.2);
                    border: 1px solid rgba(76, 175, 80, 0.5);
                    border-radius: 6px;
                    padding: 15px;
                    margin-top: 15px;
                ">
                    <div style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 10px;
                    ">
                        <span style="color: #4caf50; font-weight: bold;">
                            ✅ クーポンが適用されました
                        </span>
                        <button 
                            type="button" 
                            id="remove-coupon" 
                            style="
                                background: none;
                                border: 1px solid rgba(255, 255, 255, 0.3);
                                color: rgba(255, 255, 255, 0.7);
                                padding: 4px 8px;
                                border-radius: 4px;
                                cursor: pointer;
                                font-size: 12px;
                            "
                        >
                            取消
                        </button>
                    </div>
                    <div id="discount-details"></div>
                </div>
                
                <div class="price-summary" style="
                    border-top: 1px solid rgba(255, 215, 0, 0.2);
                    padding-top: 15px;
                    margin-top: 15px;
                ">
                    <div style="
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 5px;
                        color: rgba(255, 255, 255, 0.8);
                    ">
                        <span>元の価格:</span>
                        <span id="original-price">¥${this.originalPrice.toLocaleString()}</span>
                    </div>
                    <div id="discount-row" style="
                        display: none !important;
                        visibility: hidden !important;
                        opacity: 0 !important;
                        justify-content: space-between;
                        margin-bottom: 5px;
                        color: #4caf50;
                    ">
                        <span>割引額:</span>
                        <span id="discount-amount">-¥0</span>
                    </div>
                    <div style="
                        display: flex;
                        justify-content: space-between;
                        font-size: 18px;
                        font-weight: bold;
                        color: #ffd700;
                        border-top: 1px solid rgba(255, 215, 0, 0.3);
                        padding-top: 10px;
                    ">
                        <span>お支払い金額:</span>
                        <span id="final-price">¥${this.originalPrice.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        `;

        return couponHTML;
    }

    /**
     * 非表示要素を確実に隠す
     */
    ensureHiddenElements() {
        setTimeout(() => {
            const discountDiv = document.getElementById('coupon-discount');
            const discountRow = document.getElementById('discount-row');
            
            if (discountDiv) {
                discountDiv.style.setProperty('display', 'none', 'important');
                discountDiv.style.setProperty('visibility', 'hidden', 'important');
                discountDiv.style.setProperty('opacity', '0', 'important');
            }
            if (discountRow) {
                discountRow.style.setProperty('display', 'none', 'important');
                discountRow.style.setProperty('visibility', 'hidden', 'important');
                discountRow.style.setProperty('opacity', '0', 'important');
            }
        }, 100);
    }

    /**
     * 既存の価格表示エリアにクーポンセクションを挿入
     */
    insertIntoPage() {
        // 価格表示エリアを探す
        const priceBox = document.querySelector('.price-box, .price-card, .pricing');
        
        if (priceBox) {
            const couponSection = document.createElement('div');
            couponSection.innerHTML = this.createCouponSection();
            
            // 決済ボタンの前に挿入
            const paymentButton = priceBox.querySelector('button[id*="payment"], .payment-button, .btn-primary');
            if (paymentButton) {
                paymentButton.parentNode.insertBefore(couponSection.firstElementChild, paymentButton);
            } else {
                priceBox.appendChild(couponSection.firstElementChild);
            }
            
            this.bindEvents();
            this.ensureHiddenElements();
        } else {
            console.warn('価格表示エリアが見つかりません');
        }
    }

    /**
     * イベントリスナーをバインド
     */
    bindEvents() {
        const applyCouponBtn = document.getElementById('apply-coupon');
        const removeCouponBtn = document.getElementById('remove-coupon');
        const couponInput = document.getElementById('coupon-code');

        if (applyCouponBtn) {
            applyCouponBtn.addEventListener('click', () => this.applyCoupon());
        }

        if (removeCouponBtn) {
            removeCouponBtn.addEventListener('click', () => this.removeCoupon());
        }

        if (couponInput) {
            couponInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.applyCoupon();
                }
            });

            // リアルタイム入力チェック
            couponInput.addEventListener('input', (e) => {
                const value = e.target.value.trim();
                if (value.length === 0 && this.appliedCoupon) {
                    this.removeCoupon();
                }
            });
        }
    }

    /**
     * クーポンを適用
     */
    applyCoupon() {
        const couponInput = document.getElementById('coupon-code');
        const messageDiv = document.getElementById('coupon-message');
        
        if (!couponInput || !messageDiv) return;

        const code = couponInput.value.trim();
        
        if (!code) {
            this.showMessage('クーポンコードを入力してください', 'error');
            return;
        }

        // 検証実行（複数サービスタイプの場合は最初のタイプで検証）
        const serviceTypeForValidation = this.serviceType[0];
        const result = this.couponSystem.validateCoupon(code, serviceTypeForValidation, this.originalPrice);
        
        if (result.valid) {
            this.appliedCoupon = result.coupon;
            this.finalPrice = result.finalPrice;
            
            this.showMessage('', '');
            this.showDiscountInfo(result);
            this.updatePriceDisplay(result.discountAmount, result.finalPrice);
            
            // 入力欄を無効化
            couponInput.disabled = true;
            document.getElementById('apply-coupon').textContent = '適用済み';
            document.getElementById('apply-coupon').disabled = true;
            
        } else {
            this.showMessage(result.error, 'error');
        }
    }

    /**
     * クーポンを取消
     */
    removeCoupon() {
        this.appliedCoupon = null;
        this.finalPrice = this.originalPrice;
        
        // UI をリセット
        document.getElementById('coupon-code').value = '';
        document.getElementById('coupon-code').disabled = false;
        document.getElementById('apply-coupon').textContent = '適用';
        document.getElementById('apply-coupon').disabled = false;
        
        const discountDiv = document.getElementById('coupon-discount');
        const discountRow = document.getElementById('discount-row');
        
        if (discountDiv) {
            discountDiv.classList.remove('show-discount');
            discountDiv.classList.add('force-hidden');
        }
        if (discountRow) {
            discountRow.classList.remove('show-discount');
        }
        
        this.showMessage('', '');
        this.updatePriceDisplay(0, this.originalPrice);
    }

    /**
     * メッセージを表示
     */
    showMessage(message, type) {
        const messageDiv = document.getElementById('coupon-message');
        if (!messageDiv) return;

        if (!message) {
            messageDiv.innerHTML = '';
            return;
        }

        const colors = {
            error: '#f44336',
            success: '#4caf50',
            info: '#2196f3'
        };

        messageDiv.innerHTML = `
            <div style="
                color: ${colors[type] || colors.info};
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 8px;
            ">
                ${type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️'}
                ${message}
            </div>
        `;
    }

    /**
     * 割引情報を表示
     */
    showDiscountInfo(result) {
        const discountDiv = document.getElementById('coupon-discount');
        const detailsDiv = document.getElementById('discount-details');
        
        if (!discountDiv || !detailsDiv) return;

        let discountText = '';
        if (result.coupon.discountType === 'percentage') {
            discountText = `${result.coupon.discountValue}%OFF (¥${result.discountAmount.toLocaleString()})`;
        } else {
            discountText = `¥${result.discountAmount.toLocaleString()}OFF`;
        }

        detailsDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div style="color: #fff; font-weight: bold;">${result.coupon.code}</div>
                    <div style="color: rgba(255, 255, 255, 0.8); font-size: 12px;">${result.coupon.description}</div>
                </div>
                <div style="color: #4caf50; font-weight: bold; font-size: 16px;">
                    ${discountText}
                </div>
            </div>
        `;

        discountDiv.classList.add('show-discount');
        discountDiv.classList.remove('force-hidden');
    }

    /**
     * 価格表示を更新
     */
    updatePriceDisplay(discountAmount, finalPrice) {
        const discountRow = document.getElementById('discount-row');
        const discountAmountSpan = document.getElementById('discount-amount');
        const finalPriceSpan = document.getElementById('final-price');

        if (discountAmount > 0) {
            if (discountRow) {
                discountRow.classList.add('show-discount');
            }
            if (discountAmountSpan) discountAmountSpan.textContent = `-¥${discountAmount.toLocaleString()}`;
        } else {
            if (discountRow) {
                discountRow.classList.remove('show-discount');
            }
        }

        if (finalPriceSpan) {
            finalPriceSpan.textContent = `¥${finalPrice.toLocaleString()}`;
            
            // 無料の場合は特別なスタイル
            if (finalPrice === 0) {
                finalPriceSpan.style.color = '#4caf50';
                finalPriceSpan.innerHTML = `<span style="text-decoration: line-through; opacity: 0.5;">¥${this.originalPrice.toLocaleString()}</span> 無料`;
            }
        }

        // カスタムイベントを発火（他のコンポーネントが価格変更を監視できるように）
        window.dispatchEvent(new CustomEvent('priceUpdated', {
            detail: {
                originalPrice: this.originalPrice,
                discountAmount: discountAmount,
                finalPrice: finalPrice,
                appliedCoupon: this.appliedCoupon
            }
        }));
    }

    /**
     * 適用されたクーポン情報を取得
     */
    getAppliedCoupon() {
        return {
            coupon: this.appliedCoupon,
            finalPrice: this.finalPrice,
            discountAmount: this.originalPrice - this.finalPrice
        };
    }

    /**
     * 指定されたクーポンコードを事前入力（URLパラメータなどから）
     */
    presetCoupon(code) {
        const couponInput = document.getElementById('coupon-code');
        if (couponInput && code) {
            couponInput.value = code;
            this.applyCoupon();
        }
    }
}

// グローバルに利用可能にする
window.CouponUI = CouponUI;

// ページロード時に自動初期化する関数
window.initializeCouponUI = function(serviceType, originalPrice) {
    // クーポンシステムが初期化されるまで待機
    if (!window.couponSystem) {
        setTimeout(() => window.initializeCouponUI(serviceType, originalPrice), 100);
        return;
    }

    const couponUI = new CouponUI(serviceType, originalPrice);
    couponUI.insertIntoPage();
    
    // 確実に非表示要素を隠す
    setTimeout(() => {
        couponUI.ensureHiddenElements();
    }, 200);
    
    // URLパラメータからクーポンコードを自動適用
    const urlParams = new URLSearchParams(window.location.search);
    const presetCode = urlParams.get('coupon');
    if (presetCode) {
        setTimeout(() => couponUI.presetCoupon(presetCode), 500);
    }
    
    return couponUI;
};

console.log('🎫 Coupon UI initialized');
