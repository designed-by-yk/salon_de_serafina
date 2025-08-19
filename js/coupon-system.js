/**
 * Salon de Serafina - 究極版クーポンシステム
 * 作成日: 2025年1月15日
 * 管理画面統合版
 */

class CouponSystem {
    constructor() {
        console.log('🚀 CouponSystem 究極版 コンストラクタ開始');
        
        // localStorageキーを統一
        this.storageKeys = {
            coupons: 'salon_coupons',
            usage: 'salon_coupon_usage'
        };
        
        this.coupons = {};
        this.usage = [];
        this.serviceTypes = {
            'all': '全サービス共通',
            'shintaku': '神託システムタロット占い',
            'star_yomi': '星詠みシステム星座占い',
            'personal_tarot': '個人鑑定タロット',
            'personal_birthday': '個人鑑定誕生日',
            'personal_set': '個人鑑定セット'
        };
        
        this.loadData();
        console.log('✅ CouponSystem 究極版 初期化完了');
        console.log('📊 初期化後のクーポン数:', Object.keys(this.coupons).length);
        console.log('📊 初期化後の使用履歴数:', this.usage.length);
    }

    // データの読み込み
    loadData() {
        try {
            const savedCoupons = localStorage.getItem(this.storageKeys.coupons);
            const savedUsage = localStorage.getItem(this.storageKeys.usage);
            
            if (savedCoupons) {
                this.coupons = JSON.parse(savedCoupons);
                console.log('📋 クーポンデータ読み込み:', Object.keys(this.coupons).length + '件');
            }
            
            if (savedUsage) {
                this.usage = JSON.parse(savedUsage);
                console.log('📊 使用履歴読み込み:', this.usage.length + '件');
            }
        } catch (error) {
            console.error('❌ データ読み込みエラー:', error);
        }
    }

    // データの保存
    saveData() {
        try {
            localStorage.setItem(this.storageKeys.coupons, JSON.stringify(this.coupons));
            localStorage.setItem(this.storageKeys.usage, JSON.stringify(this.usage));
            console.log('💾 データ保存完了');
            return true;
        } catch (error) {
            console.error('❌ データ保存エラー:', error);
            return false;
        }
    }

    // 互換性のため旧メソッドも保持
    saveCoupons() { return this.saveData(); }
    saveUsage() { return this.saveData(); }

    /**
     * クーポンコードを検証
     * @param {string} code - クーポンコード
     * @param {string|Array} serviceType - サービス種別（文字列または配列）
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
        if (coupon.isActive === false) {
            return {
                valid: false,
                error: 'このクーポンは現在利用できません',
                errorType: 'INACTIVE'
            };
        }

        // 有効期限確認
        if (coupon.expiryDate) {
            const today = new Date().toISOString().split('T')[0];
            if (coupon.expiryDate < today) {
                return {
                    valid: false,
                    error: 'このクーポンは期限切れです',
                    errorType: 'EXPIRED'
                };
            }
        }

        // 使用回数制限確認
        if ((coupon.currentUses || 0) >= coupon.maxUses) {
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
     * @param {string|Array} serviceType - サービス種別
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
        this.coupons[upperCode].currentUses = (this.coupons[upperCode].currentUses || 0) + 1;

        // 使用履歴を記録
        this.usage.push({
            couponCode: upperCode,
            userEmail: userEmail || 'anonymous',
            serviceType: Array.isArray(serviceType) ? serviceType[0] : serviceType,
            originalPrice: originalPrice,
            discountAmount: validation.discountAmount,
            finalPrice: validation.finalPrice,
            usedAt: new Date().toISOString()
        });

        // データを保存
        this.saveData();

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
            description: couponData.description || '',
            discountType: couponData.discountType,
            discountValue: couponData.discountValue,
            maxUses: couponData.maxUses || 1,
            currentUses: 0,
            expiryDate: couponData.expiryDate || null,
            applicableServices: couponData.applicableServices || [],
            isActive: couponData.isActive !== undefined ? couponData.isActive : true,
            createdAt: new Date().toISOString()
        };

        console.log('💾 作成するクーポンオブジェクト:', newCoupon);
        
        this.coupons[code] = newCoupon;
        
        console.log('📊 クーポン追加後のオブジェクト数:', Object.keys(this.coupons).length);
        
        const saveResult = this.saveData();
        console.log('💾 保存結果:', saveResult);
        
        return { success: true, coupon: newCoupon };
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
        this.saveData();
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
        this.saveData();
        return { success: true };
    }

    /**
     * クーポン取得
     */
    getCoupon(code) {
        const upperCode = code.toUpperCase().trim();
        return this.coupons[upperCode] || null;
    }

    /**
     * 全クーポンを取得（配列形式）
     */
    getAllCoupons() {
        console.log('📋 getAllCoupons 呼び出し');
        const couponsArray = Object.values(this.coupons);
        console.log('📋 変換後の配列の長さ:', couponsArray.length);
        return couponsArray;
    }

    /**
     * 使用履歴取得
     */
    getAllUsage() {
        return this.usage;
    }

    /**
     * 使用履歴記録（管理画面用）
     */
    recordUsage(couponCode, serviceType, userEmail, discountAmount) {
        try {
            const usage = {
                couponCode,
                serviceType,
                userEmail: userEmail || 'test-user@example.com',
                discountAmount: discountAmount || 0,
                usedAt: new Date().toISOString()
            };

            this.usage.push(usage);
            
            // クーポンの使用回数を増加
            if (this.coupons[couponCode]) {
                this.coupons[couponCode].currentUses = (this.coupons[couponCode].currentUses || 0) + 1;
            }
            
            this.saveData();
            console.log('✅ 使用履歴記録:', couponCode);
            return { success: true };
        } catch (error) {
            console.error('❌ 使用履歴記録エラー:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * テスト使用履歴作成
     */
    createTestUsage(couponCode) {
        const serviceTypes = Object.keys(this.serviceTypes);
        const randomService = serviceTypes[Math.floor(Math.random() * serviceTypes.length)];
        const randomDiscount = Math.floor(Math.random() * 1000) + 100;
        const userEmails = ['user1@example.com', 'user2@example.com', 'user3@example.com', 'test@salon.com'];
        const randomEmail = userEmails[Math.floor(Math.random() * userEmails.length)];
        
        return this.recordUsage(couponCode, randomService, randomEmail, randomDiscount);
    }

    /**
     * 統計情報取得
     */
    getStatistics() {
        const coupons = this.getAllCoupons();
        const usage = this.getAllUsage();
        
        return {
            totalCoupons: coupons.length,
            activeCoupons: coupons.filter(c => this.getCouponStatus(c).type === 'active').length,
            inactiveCoupons: coupons.filter(c => c.isActive === false).length,
            expiredCoupons: coupons.filter(c => this.getCouponStatus(c).type === 'expired').length,
            usedUpCoupons: coupons.filter(c => this.getCouponStatus(c).type === 'used-up').length,
            totalUsage: usage.length,
            totalDiscount: usage.reduce((sum, u) => sum + (u.discountAmount || 0), 0),
            uniqueUsers: [...new Set(usage.map(u => u.userEmail))].length,
            avgDiscountPerUse: usage.length > 0 ? usage.reduce((sum, u) => sum + (u.discountAmount || 0), 0) / usage.length : 0
        };
    }

    /**
     * クーポンステータス取得
     */
    getCouponStatus(coupon) {
        if (coupon.isActive === false) {
            return { type: 'inactive', text: '無効' };
        }
        
        const now = new Date();
        const expiryDate = coupon.expiryDate ? new Date(coupon.expiryDate) : null;
        
        if (expiryDate && expiryDate < now) {
            return { type: 'expired', text: '期限切れ' };
        }
        
        if ((coupon.currentUses || 0) >= coupon.maxUses) {
            return { type: 'used-up', text: '使用済み' };
        }
        
        return { type: 'active', text: '有効' };
    }

    /**
     * デフォルトクーポンデータを初期化
     */
    initializeDefaultCoupons() {
        // 既存のクーポンがない場合のみデフォルトを設定
        if (Object.keys(this.coupons).length === 0) {
            console.log('🎫 デフォルトクーポンを初期化中...');
            
            const defaultCoupons = {
                'LINE500': {
                    code: 'LINE500',
                    description: 'LINE登録特典500円OFF',
                    discountType: 'fixed',
                    discountValue: 500,
                    maxUses: 1,
                    currentUses: 0,
                    expiryDate: this.addDays(new Date(), 30),
                    applicableServices: ['all'],
                    isActive: true,
                    createdAt: new Date().toISOString()
                },
                'THANKS20': {
                    code: 'THANKS20',
                    description: 'リピーター特典20%OFF',
                    discountType: 'percentage',
                    discountValue: 20,
                    maxUses: 3,
                    currentUses: 0,
                    expiryDate: this.addDays(new Date(), 90),
                    applicableServices: ['all'],
                    isActive: true,
                    createdAt: new Date().toISOString()
                }
            };

            this.coupons = defaultCoupons;
            this.saveData();
            console.log('✅ デフォルトクーポンを作成しました');
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
}

// グローバルに利用可能にする
window.CouponSystem = CouponSystem;

// デフォルトインスタンスを作成（既存のインスタンスがない場合のみ）
if (!window.couponSystem) {
    window.couponSystem = new CouponSystem();
    window.couponSystem.initializeDefaultCoupons();
}

console.log('🎫 Ultimate Coupon System initialized');