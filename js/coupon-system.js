/**
 * Salon de Serafina - クーポンシステム
 * 作成日: 2025年8月19日
 */

class CouponSystem {
    constructor() {
        console.log('🚀 CouponSystem コンストラクタ開始');
        
        this.coupons = this.loadCoupons();
        console.log('📊 初期化後のクーポン数:', Object.keys(this.coupons).length);
        
        this.usage = this.loadUsage();
        console.log('📊 初期化後の使用履歴数:', this.usage.length);
        
        this.serviceTypes = {
            'all': '全サービス共通',
            'shintaku': '神託システムタロット占い',
            'star_yomi': '星詠みシステム星座占い',
            'personal_tarot': '個人鑑定タロット',
            'personal_birthday': '個人鑑定誕生日',
            'personal_set': '個人鑑定セット'
        };
        
        console.log('✅ CouponSystem 初期化完了');
    }

    /**
     * デフォルトクーポンデータを初期化
     */
    initializeDefaultCoupons() {
        const defaultCoupons = {
            'MONITOR100': {
                code: 'MONITOR100',
                discountType: 'percentage',
                discountValue: 100,
                maxUses: 1,
                currentUses: 0,
                expiryDate: this.addDays(new Date(), 3),
                applicableServices: ['shintaku'],
                createdAt: new Date().toISOString(),
                description: 'モニター用100%OFF',
                isActive: true
            },
            'LINE500': {
                code: 'LINE500',
                discountType: 'amount',
                discountValue: 500,
                maxUses: 1,
                currentUses: 0,
                expiryDate: this.addDays(new Date(), 30),
                applicableServices: ['all'],
                createdAt: new Date().toISOString(),
                description: 'LINE登録特典500円OFF',
                isActive: true
            },
            'THANKS20': {
                code: 'THANKS20',
                discountType: 'percentage',
                discountValue: 20,
                maxUses: 3,
                currentUses: 0,
                expiryDate: this.addDays(new Date(), 90),
                applicableServices: ['all'],
                createdAt: new Date().toISOString(),
                description: 'リピーター特典20%OFF',
                isActive: true
            },
            'MONITOR_SHINTAKU': {
                code: 'MONITOR_SHINTAKU',
                discountType: 'percentage',
                discountValue: 100,
                maxUses: 1,
                currentUses: 0,
                expiryDate: this.addDays(new Date(), 7),
                applicableServices: ['shintaku'],
                createdAt: new Date().toISOString(),
                description: 'モニター用（神託システム専用）',
                isActive: true
            },
            'FIRST_PERSONAL': {
                code: 'FIRST_PERSONAL',
                discountType: 'amount',
                discountValue: 1000,
                maxUses: 1,
                currentUses: 0,
                expiryDate: this.addDays(new Date(), 60),
                applicableServices: ['personal'],
                createdAt: new Date().toISOString(),
                description: '初回限定（個人鑑定専用）1000円OFF',
                isActive: true
            }
        };

        // 既存のクーポンがない場合のみデフォルトを設定
        if (Object.keys(this.coupons).length === 0) {
            this.coupons = defaultCoupons;
            this.saveCoupons();
        }
    }

    /**
     * 日付に日数を追加
     */
    addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result.toISOString().split('T')[0]; // YYYY-MM-DD形式
    }

    /**
     * クーポンデータを読み込み
     */
    loadCoupons() {
        try {
            console.log('📂 loadCoupons 開始');
            const data = localStorage.getItem('serafina_coupons');
            console.log('📂 localStorage から取得:', data ? `${data.length}文字` : 'null');
            
            const parsed = data ? JSON.parse(data) : {};
            console.log('📂 パース結果:', parsed);
            console.log('📂 オブジェクトキー数:', Object.keys(parsed).length);
            
            return parsed;
        } catch (error) {
            console.error('❌ クーポンデータの読み込みエラー:', error);
            return {};
        }
    }

    /**
     * クーポン使用履歴を読み込み
     */
    loadUsage() {
        try {
            const data = localStorage.getItem('serafina_coupon_usage');
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('使用履歴データの読み込みエラー:', error);
            return [];
        }
    }

    /**
     * クーポンデータを保存
     */
    saveCoupons() {
        try {
            console.log('💾 saveCoupons 開始');
            console.log('💾 保存するデータ:', this.coupons);
            const jsonData = JSON.stringify(this.coupons);
            console.log('💾 JSON文字列長:', jsonData.length);
            localStorage.setItem('serafina_coupons', jsonData);
            console.log('✅ localStorage保存完了');
            
            // 保存後の確認
            const saved = localStorage.getItem('serafina_coupons');
            console.log('🔍 保存確認 - 文字列長:', saved ? saved.length : 'null');
            
            return true;
        } catch (error) {
            console.error('❌ クーポンデータの保存エラー:', error);
            return false;
        }
    }

    /**
     * 使用履歴を保存
     */
    saveUsage() {
        try {
            localStorage.setItem('serafina_coupon_usage', JSON.stringify(this.usage));
        } catch (error) {
            console.error('使用履歴データの保存エラー:', error);
        }
    }

    /**
     * クーポンコードを検証
     * @param {string} code - クーポンコード
     * @param {string} serviceType - サービス種別
     * @param {number} originalPrice - 元の価格
     * @param {string} userEmail - ユーザーのメールアドレス（オプション）
     * @returns {Object} 検証結果
     */
    validateCoupon(code, serviceType, originalPrice, userEmail = null) {
        const upperCode = code.toUpperCase().trim();
        
        // クーポンの存在確認
        if (!this.coupons[upperCode]) {
            return {
                valid: false,
                error: '無効なクーポンコードです',
                errorType: 'INVALID_CODE'
            };
        }

        const coupon = this.coupons[upperCode];

        // アクティブ状態確認
        if (!coupon.isActive) {
            return {
                valid: false,
                error: 'このクーポンは現在利用できません',
                errorType: 'INACTIVE'
            };
        }

        // 有効期限確認
        const today = new Date().toISOString().split('T')[0];
        if (coupon.expiryDate < today) {
            return {
                valid: false,
                error: 'このクーポンは期限切れです',
                errorType: 'EXPIRED'
            };
        }

        // 使用回数制限確認
        if (coupon.currentUses >= coupon.maxUses) {
            return {
                valid: false,
                error: 'このクーポンは使用済みです',
                errorType: 'MAX_USES_EXCEEDED'
            };
        }

        // サービス種別確認
        if (!this.isServiceApplicable(coupon, serviceType)) {
            const serviceNames = coupon.applicableServices
                .map(s => this.serviceTypes[s] || s)
                .join('、');
            return {
                valid: false,
                error: `このクーポンは${serviceNames}専用です`,
                errorType: 'SERVICE_NOT_APPLICABLE'
            };
        }

        // ユーザーの重複使用確認（メールアドレスが提供された場合）
        if (userEmail && this.hasUserUsedCoupon(upperCode, userEmail)) {
            return {
                valid: false,
                error: 'このクーポンは既に使用済みです',
                errorType: 'ALREADY_USED_BY_USER'
            };
        }

        // 割引額計算
        const discountAmount = this.calculateDiscount(coupon, originalPrice);
        const finalPrice = Math.max(0, originalPrice - discountAmount);

        return {
            valid: true,
            coupon: coupon,
            discountAmount: discountAmount,
            finalPrice: finalPrice,
            discountPercentage: coupon.discountType === 'percentage' ? coupon.discountValue : null
        };
    }

    /**
     * サービスがクーポンに適用可能か確認
     */
    isServiceApplicable(coupon, serviceType) {
        // serviceTypeが配列の場合は、いずれかのサービスが適用可能ならOK
        const serviceTypes = Array.isArray(serviceType) ? serviceType : [serviceType];
        
        return coupon.applicableServices.includes('all') || 
               serviceTypes.some(type => coupon.applicableServices.includes(type));
    }

    /**
     * ユーザーがクーポンを使用済みか確認
     */
    hasUserUsedCoupon(code, userEmail) {
        return this.usage.some(usage => 
            usage.couponCode === code && 
            usage.userEmail === userEmail
        );
    }

    /**
     * 割引額を計算
     */
    calculateDiscount(coupon, originalPrice) {
        if (coupon.discountType === 'percentage') {
            return Math.round(originalPrice * (coupon.discountValue / 100));
        } else {
            return Math.min(coupon.discountValue, originalPrice);
        }
    }

    /**
     * クーポンを使用する
     * @param {string} code - クーポンコード
     * @param {string} serviceType - サービス種別
     * @param {string} userEmail - ユーザーのメールアドレス
     * @param {number} originalPrice - 元の価格
     * @returns {Object} 使用結果
     */
    useCoupon(code, serviceType, userEmail, originalPrice) {
        const upperCode = code.toUpperCase().trim();
        const validation = this.validateCoupon(upperCode, serviceType, originalPrice, userEmail);

        if (!validation.valid) {
            return validation;
        }

        // 使用回数を増加
        this.coupons[upperCode].currentUses++;

        // 使用履歴を記録
        this.usage.push({
            couponCode: upperCode,
            userEmail: userEmail,
            serviceType: serviceType,
            originalPrice: originalPrice,
            discountAmount: validation.discountAmount,
            finalPrice: validation.finalPrice,
            usedAt: new Date().toISOString()
        });

        // データを保存
        this.saveCoupons();
        this.saveUsage();

        return {
            success: true,
            ...validation
        };
    }

    /**
     * 新しいクーポンを作成
     */
    createCoupon(couponData) {
        console.log('🔧 CouponSystem.createCoupon 開始', couponData);
        
        const code = couponData.code.toUpperCase().trim();
        console.log('📝 処理するコード:', code);
        
        if (this.coupons[code]) {
            console.log('⚠️ 既存クーポンが存在:', this.coupons[code]);
            return {
                success: false,
                error: 'このクーポンコードは既に存在します'
            };
        }

        const newCoupon = {
            code: code,
            discountType: couponData.discountType,
            discountValue: couponData.discountValue,
            maxUses: couponData.maxUses,
            currentUses: 0,
            expiryDate: couponData.expiryDate,
            applicableServices: couponData.applicableServices,
            description: couponData.description,
            isActive: true,
            createdAt: new Date().toISOString()
        };

        console.log('💾 作成するクーポンオブジェクト:', newCoupon);
        
        this.coupons[code] = newCoupon;
        
        console.log('📊 クーポン追加後のオブジェクト数:', Object.keys(this.coupons).length);
        console.log('📊 現在のクーポン一覧:', Object.keys(this.coupons));
        
        const saveResult = this.saveCoupons();
        console.log('💾 保存結果:', saveResult);
        
        // 保存後の確認
        const savedCoupons = this.loadCoupons();
        console.log('🔍 保存後の読み込み確認:', Object.keys(savedCoupons).length, '件');
        
        return { success: true };
    }

    /**
     * クーポンを更新
     */
    updateCoupon(code, updates) {
        const upperCode = code.toUpperCase().trim();
        
        if (!this.coupons[upperCode]) {
            return {
                success: false,
                error: 'クーポンが見つかりません'
            };
        }

        Object.assign(this.coupons[upperCode], updates);
        this.saveCoupons();
        return { success: true };
    }

    /**
     * クーポンを削除
     */
    deleteCoupon(code) {
        const upperCode = code.toUpperCase().trim();
        
        if (!this.coupons[upperCode]) {
            return {
                success: false,
                error: 'クーポンが見つかりません'
            };
        }

        delete this.coupons[upperCode];
        this.saveCoupons();
        return { success: true };
    }

    /**
     * 全クーポンを取得
     */
    getAllCoupons() {
        console.log('📋 getAllCoupons 呼び出し');
        console.log('📊 this.coupons:', this.coupons);
        console.log('📊 this.coupons type:', typeof this.coupons);
        console.log('📊 Object.keys(this.coupons):', Object.keys(this.coupons));
        
        // オブジェクトを配列に変換
        const couponsArray = Object.values(this.coupons);
        console.log('📋 変換後の配列:', couponsArray);
        console.log('📋 配列の長さ:', couponsArray.length);
        
        return couponsArray;
    }

    /**
     * クーポン使用統計を取得
     */
    getCouponStats(code = null) {
        if (code) {
            const upperCode = code.toUpperCase().trim();
            const couponUsage = this.usage.filter(u => u.couponCode === upperCode);
            return {
                totalUses: couponUsage.length,
                totalDiscountAmount: couponUsage.reduce((sum, u) => sum + u.discountAmount, 0),
                users: [...new Set(couponUsage.map(u => u.userEmail))],
                recentUsage: couponUsage.slice(-10)
            };
        } else {
            return this.usage.reduce((stats, usage) => {
                if (!stats[usage.couponCode]) {
                    stats[usage.couponCode] = {
                        uses: 0,
                        totalDiscount: 0,
                        users: new Set()
                    };
                }
                stats[usage.couponCode].uses++;
                stats[usage.couponCode].totalDiscount += usage.discountAmount;
                stats[usage.couponCode].users.add(usage.userEmail);
                return stats;
            }, {});
        }
    }
}

// グローバルに利用可能にする
window.CouponSystem = CouponSystem;

// デフォルトインスタンスを作成
window.couponSystem = new CouponSystem();
window.couponSystem.initializeDefaultCoupons();

console.log('🎫 Coupon System initialized');
