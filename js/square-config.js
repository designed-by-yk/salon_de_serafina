/**
 * Square API 設定ファイル
 * 本番環境とサンドボックス環境の設定を管理
 */

const SquareConfig = {
    // 環境設定
    environment: 'sandbox', // 'sandbox' または 'production'
    
    // サンドボックス環境の設定
    sandbox: {
        applicationId: 'sandbox-sq0idb-CB-RIxCr29hj4SCViMshkw', // サンドボックス用アプリケーションID
        locationId: 'LR301WJWM96J9', // サンドボックス用ロケーションID
        webPaymentsSDK: 'https://sandbox.web.squarecdn.com/v1/square.js'
    },
    
    // 本番環境の設定
    production: {
        applicationId: 'YOUR_PRODUCTION_APP_ID', // 本番用アプリケーションID
        locationId: 'YOUR_PRODUCTION_LOCATION_ID', // 本番用ロケーションID  
        webPaymentsSDK: 'https://web.squarecdn.com/v1/square.js'
    },
    
    // 決済設定
    payment: {
        currency: 'JPY',
        minAmount: 100, // 最小決済金額（円）
        maxAmount: 999999, // 最大決済金額（円）
        
        // 無料決済の処理方法
        freeServiceHandling: 'skip', // 'skip' または 'minimum'
        
        // 最小金額未満の場合の処理
        belowMinimumHandling: 'adjust_to_minimum' // 'adjust_to_minimum' または 'error'
    },
    
    // API エンドポイント設定
    api: {
        // サーバーサイド決済処理エンドポイント
        processPayment: '/api/process-payment',
        
        // Webhook エンドポイント
        webhook: '/api/square-webhook',
        
        // ベースURL（本番では実際のドメインに変更）
        baseUrl: window.location.origin
    },
    
    // UI設定
    ui: {
        // カード入力フォームのスタイル
        cardStyle: {
            input: {
                fontSize: '16px',
                fontFamily: 'Arial, sans-serif',
                color: '#373F4A',
                placeholder: {
                    color: '#CCC'
                }
            }
        },
        
        // 決済ボタンのテキスト
        buttonText: {
            default: '決済する',
            processing: '処理中...',
            success: '完了'
        }
    },
    
    // デバッグ設定
    debug: {
        enabled: true, // デバッグログの有効/無効
        logLevel: 'info', // 'error', 'warn', 'info', 'debug'
        mockPayments: false // モック決済の有効/無効（開発用）
    },
    
    /**
     * 現在の環境に基づいた設定を取得
     */
    getCurrentConfig() {
        const envConfig = this.environment === 'production' ? this.production : this.sandbox;
        
        return {
            ...envConfig,
            environment: this.environment,
            payment: this.payment,
            api: this.api,
            ui: this.ui,
            debug: this.debug
        };
    },
    
    /**
     * 本番環境かどうかを判定
     */
    isProduction() {
        return this.environment === 'production';
    },
    
    /**
     * デバッグモードかどうかを判定
     */
    isDebugEnabled() {
        return this.debug.enabled;
    },
    
    /**
     * 環境を設定
     */
    setEnvironment(env) {
        if (env === 'production' || env === 'sandbox') {
            this.environment = env;
            console.log(`🔧 Square環境を ${env} に設定しました`);
        } else {
            console.error('❌ 無効な環境設定:', env);
        }
    },
    
    /**
     * 設定の検証
     */
    validateConfig() {
        const config = this.getCurrentConfig();
        const issues = [];
        
        // 必須設定の確認
        if (!config.applicationId || config.applicationId.includes('YOUR_')) {
            issues.push('Application ID が設定されていません');
        }
        
        if (!config.locationId || config.locationId.includes('YOUR_')) {
            issues.push('Location ID が設定されていません');
        }
        
        if (config.payment.minAmount < 1) {
            issues.push('最小決済金額は1円以上である必要があります');
        }
        
        if (issues.length > 0) {
            console.warn('⚠️ Square設定に問題があります:', issues);
            return { valid: false, issues };
        }
        
        console.log('✅ Square設定は正常です');
        return { valid: true, issues: [] };
    }
};

// 環境の自動検出
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    SquareConfig.setEnvironment('sandbox');
} else if (window.location.hostname.includes('serafina-fortune.com')) {
    // 本番ドメインの場合は本番環境に設定
    SquareConfig.setEnvironment('production');
}

// グローバルに利用可能にする
window.SquareConfig = SquareConfig;

console.log('🔧 Square Config loaded:', SquareConfig.getCurrentConfig());

// 設定の検証を実行
SquareConfig.validateConfig();
