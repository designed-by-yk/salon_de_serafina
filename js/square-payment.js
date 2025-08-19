/**
 * Square Web Payments SDK + クーポン連携システム
 * Salon de Serafina 決済処理
 */

class SquareCouponPayment {
    constructor() {
        // Square設定を取得
        if (typeof SquareConfig === 'undefined') {
            throw new Error('SquareConfig が見つかりません。square-config.js が読み込まれているか確認してください。');
        }
        
        const config = SquareConfig.getCurrentConfig();
        this.applicationId = config.applicationId;
        this.locationId = config.locationId;
        this.environment = config.environment;
        
        this.payments = null;
        this.card = null;
        
        this.isInitialized = false;
        this.isProcessing = false;
        
        console.log('🏦 SquareCouponPayment システム初期化開始');
        console.log('📋 設定情報:', {
            applicationId: this.applicationId,
            locationId: this.locationId,
            environment: this.environment
        });
    }

    /**
     * Square Web Payments SDKを初期化
     */
    async initializeSquare() {
        try {
            // Square Web Payments SDKの読み込み確認
            if (typeof Square === 'undefined') {
                throw new Error('Square Web Payments SDKが読み込まれていません');
            }

            this.payments = Square.payments(this.applicationId, this.locationId);
            console.log('✅ Square Web Payments SDK初期化完了');
            
            // カード決済フォームを初期化
            await this.initializeCard();
            
            this.isInitialized = true;
            return true;
            
        } catch (error) {
            console.error('❌ Square SDK初期化エラー:', error);
            this.showError('決済システムの初期化に失敗しました');
            return false;
        }
    }

    /**
     * カード決済フォームを初期化
     */
    async initializeCard() {
        try {
            this.card = await this.payments.card();
            await this.card.attach('#card-container');
            console.log('✅ カード決済フォーム初期化完了');
        } catch (error) {
            console.error('❌ カード初期化エラー:', error);
            throw error;
        }
    }

    /**
     * クーポン適用後の決済処理
     * @param {Object} paymentData - 決済データ
     * @param {string} paymentData.serviceType - サービス種別
     * @param {number} paymentData.originalPrice - 元の価格
     * @param {string} paymentData.couponCode - クーポンコード（オプション）
     * @param {string} paymentData.userEmail - ユーザーメール
     * @param {Object} paymentData.serviceDetails - サービス詳細
     */
    async processPaymentWithCoupon(paymentData) {
        if (this.isProcessing) {
            console.log('⚠️ 決済処理中です');
            return;
        }

        try {
            this.isProcessing = true;
            this.showProcessing(true);

            console.log('💳 決済処理開始:', paymentData);

            // クーポン適用処理
            const { finalPrice, couponInfo } = await this.applyCouponDiscount(
                paymentData.originalPrice, 
                paymentData.couponCode, 
                paymentData.serviceType,
                paymentData.userEmail
            );

            // 0円決済の場合の処理
            if (finalPrice === 0) {
                return await this.handleFreeService(paymentData, couponInfo);
            }

            // Square最小決済金額チェック（100円）
            const squareMinAmount = 100;
            const adjustedPrice = Math.max(finalPrice, squareMinAmount);
            
            if (finalPrice < squareMinAmount && finalPrice > 0) {
                console.log(`⚠️ 最小決済金額調整: ${finalPrice}円 → ${adjustedPrice}円`);
            }

            // Square決済実行
            const result = await this.executeSquarePayment(adjustedPrice, paymentData, couponInfo);
            return result;

        } catch (error) {
            console.error('❌ 決済処理エラー:', error);
            this.showError('決済処理中にエラーが発生しました: ' + error.message);
            return { success: false, error: error.message };
        } finally {
            this.isProcessing = false;
            this.showProcessing(false);
        }
    }

    /**
     * クーポン割引を適用
     */
    async applyCouponDiscount(originalPrice, couponCode, serviceType, userEmail) {
        let finalPrice = originalPrice;
        let couponInfo = null;

        if (couponCode && window.couponSystem) {
            try {
                // クーポン検証
                const validation = window.couponSystem.validateCoupon(
                    couponCode, 
                    serviceType, 
                    originalPrice, 
                    userEmail
                );

                if (validation.valid) {
                    finalPrice = validation.finalPrice;
                    couponInfo = {
                        code: couponCode,
                        discountAmount: validation.discountAmount,
                        coupon: validation.coupon
                    };
                    
                    console.log('✅ クーポン適用:', couponInfo);
                } else {
                    console.log('❌ クーポン無効:', validation.error);
                    throw new Error(validation.error);
                }
            } catch (error) {
                console.error('❌ クーポン処理エラー:', error);
                throw new Error('クーポンの処理に失敗しました: ' + error.message);
            }
        }

        return { finalPrice, couponInfo };
    }

    /**
     * 無料サービス処理（0円決済）
     */
    async handleFreeService(paymentData, couponInfo) {
        try {
            console.log('🎉 無料サービス処理開始');

            // クーポン使用を記録
            if (couponInfo && window.couponSystem) {
                const result = window.couponSystem.useCoupon(
                    couponInfo.code,
                    paymentData.serviceType,
                    paymentData.userEmail,
                    paymentData.originalPrice
                );

                if (!result.success) {
                    throw new Error('クーポン使用記録に失敗しました');
                }
            }

            // 無料サービス完了ページにリダイレクト
            const params = new URLSearchParams({
                service: paymentData.serviceType,
                email: paymentData.userEmail,
                coupon: couponInfo?.code || '',
                amount: '0',
                type: 'free'
            });

            window.location.href = `payment-success.html?${params.toString()}`;
            
            return { 
                success: true, 
                type: 'free',
                coupon: couponInfo 
            };

        } catch (error) {
            console.error('❌ 無料サービス処理エラー:', error);
            throw error;
        }
    }

    /**
     * Square決済を実行
     */
    async executeSquarePayment(amount, paymentData, couponInfo) {
        try {
            console.log(`💳 Square決済実行: ${amount}円`);

            // トークン化
            const result = await this.card.tokenize();
            
            if (result.status === 'OK') {
                const token = result.token;
                console.log('✅ カードトークン取得成功');

                // サーバーサイド決済処理（実際の実装では別途サーバーが必要）
                const paymentResult = await this.sendPaymentToServer({
                    token: token,
                    amount: amount,
                    currency: 'JPY',
                    serviceType: paymentData.serviceType,
                    userEmail: paymentData.userEmail,
                    couponCode: couponInfo?.code || null,
                    originalPrice: paymentData.originalPrice,
                    discountAmount: couponInfo?.discountAmount || 0,
                    note: this.createPaymentNote(paymentData, couponInfo)
                });

                if (paymentResult.success) {
                    // クーポン使用を記録
                    if (couponInfo && window.couponSystem) {
                        window.couponSystem.useCoupon(
                            couponInfo.code,
                            paymentData.serviceType,
                            paymentData.userEmail,
                            paymentData.originalPrice
                        );
                    }

                    // 成功ページにリダイレクト
                    this.redirectToSuccessPage(paymentResult, paymentData, couponInfo);
                    
                    return { 
                        success: true, 
                        paymentId: paymentResult.paymentId,
                        coupon: couponInfo 
                    };
                } else {
                    throw new Error(paymentResult.error || '決済処理に失敗しました');
                }

            } else {
                console.error('❌ カードトークン化エラー:', result.errors);
                throw new Error('カード情報の処理に失敗しました');
            }

        } catch (error) {
            console.error('❌ Square決済エラー:', error);
            throw error;
        }
    }

    /**
     * サーバーに決済情報を送信（実際の実装）
     */
    async sendPaymentToServer(paymentData) {
        try {
            // 実際の実装では、ここでサーバーのAPIエンドポイントに送信
            const response = await fetch('/api/process-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData)
            });

            if (!response.ok) {
                throw new Error('サーバー決済処理エラー');
            }

            const result = await response.json();
            return result;

        } catch (error) {
            console.error('❌ サーバー決済エラー:', error);
            
            // デモ用の成功レスポンス（実際の実装では削除）
            return {
                success: true,
                paymentId: 'demo_' + Date.now(),
                amount: paymentData.amount,
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * 決済メモを作成
     */
    createPaymentNote(paymentData, couponInfo) {
        let note = `サービス: ${paymentData.serviceType}`;
        
        if (couponInfo) {
            note += ` | クーポン: ${couponInfo.code} (${couponInfo.discountAmount}円割引)`;
        }
        
        if (paymentData.serviceDetails) {
            note += ` | 詳細: ${JSON.stringify(paymentData.serviceDetails)}`;
        }
        
        return note;
    }

    /**
     * 成功ページにリダイレクト
     */
    redirectToSuccessPage(paymentResult, paymentData, couponInfo) {
        const params = new URLSearchParams({
            paymentId: paymentResult.paymentId,
            service: paymentData.serviceType,
            email: paymentData.userEmail,
            amount: paymentResult.amount,
            coupon: couponInfo?.code || '',
            discount: couponInfo?.discountAmount || '0',
            type: 'paid'
        });

        window.location.href = `payment-success.html?${params.toString()}`;
    }

    /**
     * 処理中表示の制御
     */
    showProcessing(show) {
        const processingElement = document.getElementById('payment-processing');
        const paymentButton = document.getElementById('payment-button');
        
        if (processingElement) {
            processingElement.style.display = show ? 'block' : 'none';
        }
        
        if (paymentButton) {
            paymentButton.disabled = show;
            paymentButton.textContent = show ? '処理中...' : '決済する';
        }
    }

    /**
     * エラー表示
     */
    showError(message) {
        const errorElement = document.getElementById('payment-error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            
            // 5秒後に自動的に隠す
            setTimeout(() => {
                errorElement.style.display = 'none';
            }, 5000);
        } else {
            alert('エラー: ' + message);
        }
    }

    /**
     * 成功メッセージ表示
     */
    showSuccess(message) {
        const successElement = document.getElementById('payment-success');
        if (successElement) {
            successElement.textContent = message;
            successElement.style.display = 'block';
        } else {
            alert('成功: ' + message);
        }
    }
}

// グローバルに利用可能にする
window.SquareCouponPayment = SquareCouponPayment;

console.log('💳 Square + Coupon Payment System loaded');
