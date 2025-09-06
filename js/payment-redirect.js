/**
 * 決済ページリダイレクト用ヘルパー
 * 各サービスページからSquare決済ページへの遷移を管理
 */

class PaymentRedirect {
    constructor() {
        this.baseUrl = 'square-payment.html';
        this.adminDataKey = 'adminData';
        this.defaultConfig = this.getDefaultConfig();
        console.log('🔗 PaymentRedirect システム初期化');
    }

    /**
     * デフォルト設定を取得
     */
    getDefaultConfig() {
        return {
            'shintaku': {
                service: 'shintaku',
                price: 3000,
                name: '神託システムタロット占い',
                description: 'AIと人間の直感を組み合わせた深層タロット鑑定'
            },
            'star_yomi': {
                service: 'star_yomi',
                price: 3000,
                name: '星詠みシステム星座占い',
                description: '生年月日から導く詳細運勢'
            },
            'personal_tarot': {
                service: 'personal_tarot',
                price: 5000,
                name: '個人鑑定タロット',
                description: 'セラフィナによる完全個人鑑定'
            },
            'personal_birthday': {
                service: 'personal_birthday',
                price: 5000,
                name: '個人鑑定誕生日占い',
                description: 'セラフィナによる誕生日個人鑑定'
            },
            'personal_set': {
                service: 'personal_set',
                price: 8000,
                name: '個人鑑定セット',
                description: 'タロット＋誕生日のセット鑑定'
            }
        };
    }

    /**
     * 管理画面データを取得
     */
    getAdminData() {
        try {
            const data = localStorage.getItem(this.adminDataKey);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('❌ 管理データ読み込みエラー:', error);
            return null;
        }
    }

    /**
     * サービス設定を取得（管理画面優先）
     */
    getServiceConfig(serviceKey) {
        const adminData = this.getAdminData();
        let config = this.defaultConfig[serviceKey] || {};

        if (adminData && adminData.products) {
            // 表示中の商品のみを対象にする
            const visibleProducts = adminData.products.filter(p => p.visible === true);
            const product = visibleProducts.find(p => 
                this.getServiceKeyFromProduct(p) === serviceKey
            );
            if (product) {
                config.price = product.salePrice || product.regularPrice || config.price;
                config.name = product.productName || product.name || config.name;
                console.log(`🔍 ${serviceKey} 設定更新:`, {
                    productName: product.productName,
                    name: product.name,
                    finalName: config.name,
                    price: config.price,
                    visible: product.visible
                });
            } else {
                console.log(`⚠️ ${serviceKey} の表示中商品が見つかりません`);
                // デバッグ用: 利用可能な商品を表示
                console.log('📋 利用可能な商品:', visibleProducts.map(p => ({
                    name: p.name,
                    productName: p.productName,
                    serviceKey: this.getServiceKeyFromProduct(p),
                    visible: p.visible
                })));
            }
        }

        return config;
    }

    /**
     * 商品からサービスキーを取得
     */
    getServiceKeyFromProduct(product) {
        const mapping = {
            '神託システムタロット占い': 'shintaku',
            '星詠みシステム星座占い': 'star_yomi',
            '個人鑑定タロット': 'personal_tarot',
            '個人鑑定誕生日占い': 'personal_birthday',
            '個人鑑定セット': 'personal_set'
        };
        
        // まず productName で検索
        if (product.productName && mapping[product.productName]) {
            return mapping[product.productName];
        }
        
        // 次に name で検索
        if (product.name && mapping[product.name]) {
            return mapping[product.name];
        }
        
        return null;
    }

    /**
     * サービス設定を動的に更新
     */
    updateServiceConfig(serviceKey, newConfig) {
        this.defaultConfig[serviceKey] = { ...this.defaultConfig[serviceKey], ...newConfig };
        console.log(`🔄 ${serviceKey} 設定を更新:`, newConfig);
    }

    /**
     * 神託システムタロット占い決済
     */
    redirectToShintakuPayment(userEmail = null) {
        const config = this.getServiceConfig('shintaku');
        const params = {
            service: config.service,
            price: config.price,
            name: config.name,
            description: config.description,
            email: userEmail || ''
        };
        
        this.redirect(params);
    }

    /**
     * 星詠みシステム星座占い決済
     */
    redirectToStarYomiPayment(userEmail = null) {
        const config = this.getServiceConfig('star_yomi');
        const params = {
            service: config.service,
            price: config.price,
            name: config.name,
            description: config.description,
            email: userEmail || ''
        };
        
        this.redirect(params);
    }

    /**
     * 個人鑑定タロット決済
     */
    redirectToPersonalTarotPayment(userEmail = null) {
        const config = this.getServiceConfig('personal_tarot');
        const params = {
            service: config.service,
            price: config.price,
            name: config.name,
            description: config.description,
            email: userEmail || ''
        };
        
        this.redirect(params);
    }

    /**
     * 個人鑑定誕生日占い決済
     */
    redirectToPersonalBirthdayPayment(userEmail = null) {
        const config = this.getServiceConfig('personal_birthday');
        const params = {
            service: config.service,
            price: config.price,
            name: config.name,
            description: config.description,
            email: userEmail || ''
        };
        
        this.redirect(params);
    }

    /**
     * 個人鑑定セット決済
     */
    redirectToPersonalSetPayment(userEmail = null) {
        const config = this.getServiceConfig('personal_set');
        const params = {
            service: config.service,
            price: config.price,
            name: config.name,
            description: config.description,
            email: userEmail || ''
        };
        
        this.redirect(params);
    }

    /**
     * 汎用決済リダイレクト
     */
    redirectToCustomPayment(serviceType, price, name, description, userEmail = null) {
        const params = {
            service: serviceType,
            price: price,
            name: name,
            description: description,
            email: userEmail || ''
        };
        
        this.redirect(params);
    }

    /**
     * URLパラメータを作成してリダイレクト
     */
    redirect(params) {
        const searchParams = new URLSearchParams();
        
        Object.entries(params).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                searchParams.append(key, value.toString());
            }
        });
        
        const url = `${this.baseUrl}?${searchParams.toString()}`;
        
        console.log('🔗 決済ページにリダイレクト:', url);
        console.log('📊 パラメータ:', params);
        
        window.location.href = url;
    }

    /**
     * クーポン適用状態でリダイレクト
     */
    redirectWithCoupon(serviceType, price, name, description, couponCode, userEmail = null) {
        // まずクーポンを検証
        if (window.couponSystem && couponCode) {
            const validation = window.couponSystem.validateCoupon(
                couponCode,
                serviceType,
                price,
                userEmail
            );
            
            if (validation.valid) {
                console.log('✅ クーポン事前検証成功:', validation);
                
                // クーポン情報をセッションストレージに保存
                sessionStorage.setItem('appliedCoupon', JSON.stringify({
                    code: couponCode,
                    discountAmount: validation.discountAmount,
                    finalPrice: validation.finalPrice
                }));
            }
        }
        
        // 通常のリダイレクト
        this.redirectToCustomPayment(serviceType, price, name, description, userEmail);
    }
}

/**
 * 既存のサービスページとの互換性を保つためのヘルパー関数
 */

// 神託システム用
function handleShintakuPayment() {
    const paymentRedirect = new PaymentRedirect();
    
    // クーポン適用状態を確認
    const appliedCoupon = getAppliedCouponFromUI();
    const userEmail = prompt('鑑定結果をお送りするメールアドレスを入力してください:');
    
    if (!userEmail || !userEmail.includes('@')) {
        alert('有効なメールアドレスを入力してください。');
        return;
    }
    
    if (appliedCoupon && appliedCoupon.coupon) {
        paymentRedirect.redirectWithCoupon(
            'shintaku', 
            3000, 
            '神託システムタロット占い',
            'AIと人間の直感を組み合わせた深層タロット鑑定',
            appliedCoupon.coupon.code,
            userEmail
        );
    } else {
        paymentRedirect.redirectToShintakuPayment(userEmail);
    }
}

// 個人鑑定用
function handlePersonalPayment(type, originalPrice) {
    const paymentRedirect = new PaymentRedirect();
    
    // クーポン適用状態を確認
    const appliedCoupon = getAppliedCouponFromUI();
    const userEmail = prompt('鑑定結果をお送りするメールアドレスを入力してください:');
    
    if (!userEmail || !userEmail.includes('@')) {
        alert('有効なメールアドレスを入力してください。');
        return;
    }
    
    // タイプに応じた設定
    const serviceConfig = {
        tarot: {
            serviceType: 'personal_tarot',
            name: '個人鑑定タロット',
            description: 'セラフィナによる完全個人向けタロット鑑定'
        },
        star: {
            serviceType: 'personal_birthday',
            name: '個人鑑定誕生日占い', 
            description: 'セラフィナによる生年月日を基にした個人鑑定'
        },
        bundle: {
            serviceType: 'personal_set',
            name: '個人鑑定セット',
            description: 'タロット + 誕生日占いのお得なセット鑑定'
        }
    };
    
    const config = serviceConfig[type];
    if (!config) {
        console.error('❌ 不明なサービスタイプ:', type);
        return;
    }
    
    if (appliedCoupon && appliedCoupon.coupon) {
        paymentRedirect.redirectWithCoupon(
            config.serviceType,
            originalPrice,
            config.name,
            config.description,
            appliedCoupon.coupon.code,
            userEmail
        );
    } else {
        paymentRedirect.redirectToCustomPayment(
            config.serviceType,
            originalPrice,
            config.name,
            config.description,
            userEmail
        );
    }
}

// 星詠みシステム用
function handleStarYomiPayment() {
    const paymentRedirect = new PaymentRedirect();
    
    const appliedCoupon = getAppliedCouponFromUI();
    const userEmail = prompt('鑑定結果をお送りするメールアドレスを入力してください:');
    
    if (!userEmail || !userEmail.includes('@')) {
        alert('有効なメールアドレスを入力してください。');
        return;
    }
    
    if (appliedCoupon && appliedCoupon.coupon) {
        paymentRedirect.redirectWithCoupon(
            'star_yomi',
            3000,
            '星詠みシステム星座占い',
            '生年月日から読み解く詳細な星座鑑定',
            appliedCoupon.coupon.code,
            userEmail
        );
    } else {
        paymentRedirect.redirectToStarYomiPayment(userEmail);
    }
}

/**
 * UIからクーポン適用状態を取得
 */
function getAppliedCouponFromUI() {
    // CouponUIインスタンスが存在する場合
    if (typeof personalCouponUI !== 'undefined' && personalCouponUI) {
        return personalCouponUI.getAppliedCoupon();
    }
    
    if (typeof couponUI !== 'undefined' && couponUI) {
        return couponUI.getAppliedCoupon();
    }
    
    // セッションストレージから取得
    const sessionCoupon = sessionStorage.getItem('appliedCoupon');
    if (sessionCoupon) {
        try {
            return JSON.parse(sessionCoupon);
        } catch (error) {
            console.error('❌ セッションクーポン解析エラー:', error);
        }
    }
    
    return null;
}

/**
 * レガシー関数の互換性を保つ
 */
function proceedToPayment(type, finalPrice, couponCode) {
    console.log('🔄 レガシー決済関数から新システムにリダイレクト');
    
    const paymentRedirect = new PaymentRedirect();
    const userEmail = document.getElementById('user-email')?.value || 
                     prompt('メールアドレスを入力してください:');
    
    if (!userEmail) return;
    
    // タイプに基づいてサービス設定を決定
    const serviceMap = {
        tarot: { serviceType: 'personal_tarot', name: '個人鑑定タロット' },
        star: { serviceType: 'personal_birthday', name: '個人鑑定誕生日占い' },
        bundle: { serviceType: 'personal_set', name: '個人鑑定セット' },
        shintaku: { serviceType: 'shintaku', name: '神託システムタロット占い' },
        star_yomi: { serviceType: 'star_yomi', name: '星詠みシステム星座占い' }
    };
    
    const service = serviceMap[type] || { 
        serviceType: type, 
        name: 'カスタムサービス' 
    };
    
    if (couponCode) {
        paymentRedirect.redirectWithCoupon(
            service.serviceType,
            finalPrice,
            service.name,
            '詳細鑑定サービス',
            couponCode,
            userEmail
        );
    } else {
        paymentRedirect.redirectToCustomPayment(
            service.serviceType,
            finalPrice,
            service.name,
            '詳細鑑定サービス',
            userEmail
        );
    }
}

// グローバルに利用可能にする
window.PaymentRedirect = PaymentRedirect;
window.handleShintakuPayment = handleShintakuPayment;
window.handlePersonalPayment = handlePersonalPayment;
window.handleStarYomiPayment = handleStarYomiPayment;
window.proceedToPayment = proceedToPayment;

console.log('🔗 Payment Redirect System loaded');
