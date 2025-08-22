/**
 * Salon de Serafina - 統合管理画面連携システム
 * 管理画面の設定をメインサイトに自動反映
 */

class AdminIntegration {
    constructor() {
        this.adminDataKey = 'salon_integrated_admin';
        this.lastSyncKey = 'admin_last_sync';
        this.debug = true; // デバッグモード
        
        this.serviceMapping = {
            'shintaku': '神託システムタロット占い',
            'star_yomi': '星詠みシステム星座占い',
            'personal_tarot': '個人鑑定タロット',
            'personal_birthday': '個人鑑定誕生日',
            'personal_set': '個人鑑定セット'
        };
        
        console.log('🔗 AdminIntegration システム初期化');
    }

    /**
     * 管理画面データを取得
     */
    getAdminData() {
        try {
            const data = localStorage.getItem(this.adminDataKey);
            if (data) {
                return JSON.parse(data);
            }
            console.log('⚠️ 統合管理データが見つかりません');
            return null;
        } catch (error) {
            console.error('❌ 管理データ読み込みエラー:', error);
            return null;
        }
    }

    /**
     * メンテナンスモードチェック
     */
    checkMaintenanceMode() {
        const adminData = this.getAdminData();
        if (adminData && adminData.maintenanceMode) {
            this.log('🚧 メンテナンスモード有効');
            this.showMaintenanceMessage();
            this.disableAllInteractions();
            return true;
        }
        return false;
    }

    /**
     * メンテナンスメッセージ表示
     */
    showMaintenanceMessage() {
        // 既存のメンテナンス表示を削除
        const existing = document.getElementById('maintenance-overlay');
        if (existing) existing.remove();

        // メンテナンスオーバーレイ作成
        const overlay = document.createElement('div');
        overlay.id = 'maintenance-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.95);
            color: white;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 99999;
            font-family: Arial, sans-serif;
            text-align: center;
        `;

        overlay.innerHTML = `
            <div style="max-width: 600px; padding: 40px;">
                <h1 style="font-size: 2.5em; margin-bottom: 20px; color: #FFD700;">🚧 メンテナンス中 🚧</h1>
                <p style="font-size: 1.3em; margin-bottom: 30px; line-height: 1.6;">
                    現在、システムのメンテナンスを行っております。<br>
                    しばらくお待ちください。
                </p>
                <div style="font-size: 1.1em; opacity: 0.8;">
                    <p>📧 お急ぎの場合は公式LINEまでお問い合わせください</p>
                    <p>💚 LINE ID: @439nqjol</p>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
    }

    /**
     * 全ての操作を無効化
     */
    disableAllInteractions() {
        // 全てのボタンを無効化
        document.querySelectorAll('button, .button, .btn, a[href]').forEach(element => {
            element.style.pointerEvents = 'none';
            element.style.opacity = '0.5';
            element.setAttribute('disabled', 'true');
        });

        // フォーム無効化
        document.querySelectorAll('input, select, textarea').forEach(element => {
            element.setAttribute('disabled', 'true');
        });
    }

    /**
     * 商品の表示/非表示制御
     */
    updateProductVisibility() {
        const adminData = this.getAdminData();
        if (!adminData || !adminData.products) return;

        this.log('👁️ 商品表示設定を更新中...');

        adminData.products.forEach(product => {
            // data-service 属性で商品要素を特定
            const serviceKey = this.getServiceKeyFromProduct(product);
            if (serviceKey) {
                const elements = document.querySelectorAll(`[data-service="${serviceKey}"]`);
                elements.forEach(element => {
                    if (product.visible === false) {
                        element.style.display = 'none';
                        this.log(`🚫 ${product.productName} を非表示にしました`);
                    } else {
                        element.style.display = '';
                        this.log(`✅ ${product.productName} を表示しました`);
                    }
                });
            }
        });
    }

    /**
     * 価格の自動更新
     */
    updatePrices() {
        const adminData = this.getAdminData();
        if (!adminData || !adminData.products) {
            this.log('⚠️ 価格更新: 管理データがありません');
            return;
        }

        this.log('💰 価格情報を更新中...', adminData.products);

        let updatedCount = 0;
        adminData.products.forEach(product => {
            const serviceKey = this.getServiceKeyFromProduct(product);
            this.log(`🔍 商品チェック: ${product.name || product.productName} → サービスキー: ${serviceKey}`);
            
            if (serviceKey) {
                // 現在のページに適したサービスのみ処理
                if (this.isServiceRelevantToCurrentPage(serviceKey)) {
                    this.log(`✅ ${serviceKey} は現在のページに関連しています`);
                    this.updatePriceElements(serviceKey, product);
                    updatedCount++;
                } else {
                    this.log(`⏭️ ${serviceKey} は現在のページには関連しないためスキップ`);
                }
            } else {
                this.log(`⚠️ サービスキーが見つかりません: ${product.name || product.productName}`);
            }
        });
        
        this.log(`✅ 価格更新完了: ${updatedCount}個の商品を処理`);
    }

    /**
     * 現在のページに関連するサービスかどうかを判定
     */
    isServiceRelevantToCurrentPage(serviceKey) {
        const currentPath = window.location.pathname;
        const currentFileName = currentPath.split('/').pop();
        
        console.log('🔍 ページ判定開始:');
        console.log('  - パス: ' + currentPath);
        console.log('  - ファイル名: ' + currentFileName);
        console.log('  - サービス: ' + serviceKey);
        
        // ページごとの関連サービス定義
        const pageServiceMapping = {
            'personal-reading-detail.html': ['personal_tarot', 'personal_birthday', 'personal_set'],
            'tarot-detail.html': ['shintaku'],
            'star-yomi-detail.html': ['star_yomi'],
            'index.html': [] // トップページは価格更新しない
        };
        
        // 現在のページに対応するサービスリストを取得
        const relevantServices = pageServiceMapping[currentFileName] || [];
        
        // サービスが関連リストに含まれているかチェック
        const isRelevant = relevantServices.includes(serviceKey);
        
        console.log('📋 ' + currentFileName + ' の関連サービス: [' + relevantServices.join(', ') + ']');
        console.log('🎯 ' + serviceKey + ' は関連サービス? ' + (isRelevant ? 'Yes' : 'No'));
        
        this.log(`🔍 ページ判定: ${currentFileName} vs サービス: ${serviceKey}`);
        this.log(`📋 ${currentFileName} の関連サービス: [${relevantServices.join(', ')}]`);
        this.log(`🎯 ${serviceKey} は関連サービス? ${isRelevant ? 'Yes' : 'No'}`);
        
        return isRelevant;
    }

    /**
     * 価格要素の更新
     */
    updatePriceElements(serviceKey, product) {
        const price = product.salePrice || product.regularPrice;
        if (!price) {
            this.log(`⚠️ 価格が設定されていません: ${product.name || product.productName}`);
            return;
        }

        this.log(`💰 ${serviceKey} の価格更新開始: ¥${price.toLocaleString()}`);

        // 価格表示要素を検索して更新（data-price-type別に処理）
        const priceSelectors = [
            // 通常の価格要素
            `[data-service="${serviceKey}"] .price`,
            `[data-service="${serviceKey}"] .price-display`,
            `[data-service="${serviceKey}"] .service-price`,
            `[data-service="${serviceKey}"] .amount`,
            
            // data-price-type指定の要素
            `[data-service="${serviceKey}"][data-price-type="sale"]`,
            `[data-service="${serviceKey}"][data-price-type="regular"]`,
            `[data-service="${serviceKey}"][data-price-type="savings"]`,
            
            // サービス固有のセレクタ（ページ判定後なので安全）
            `.${serviceKey}-price`,
            `#${serviceKey}-price`
        ];
        
        // ページ固有のセレクタを追加
        if (serviceKey.startsWith('personal_')) {
            // 個人鑑定ページの場合のみ、特定のIDを含める
            if (serviceKey === 'personal_tarot') {
                priceSelectors.push(`[data-service="${serviceKey}"]#tarot-price`);
            } else if (serviceKey === 'personal_birthday') {
                priceSelectors.push(`[data-service="${serviceKey}"]#star-price`);
            } else if (serviceKey === 'personal_set') {
                priceSelectors.push(`[data-service="${serviceKey}"]#bundle-price`);
            }
        } else if (serviceKey === 'star_yomi') {
            // 星詠みページ用の特別なセレクタ
            priceSelectors.push(`.price-badge[data-service="${serviceKey}"]`);
        }

        let elementsFound = 0;
        priceSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            this.log(`🔍 セレクタ "${selector}" で ${elements.length} 個の要素を発見`);
            
            elements.forEach(element => {
                const oldPrice = element.textContent;
                let formattedPrice;
                
                // data-price-type に基づいて価格表示を調整
                const priceType = element.getAttribute('data-price-type');
                if (priceType === 'regular') {
                    // 通常価格は regularPrice を使用
                    const regularPrice = product.regularPrice || price;
                    const salePrice = product.salePrice || price;
                    
                    // 販売価格と通常価格が同じ場合は非表示
                    if (regularPrice === salePrice) {
                        element.style.display = 'none';
                        this.log(`🚫 通常価格非表示: ${serviceKey} (販売価格と同額のため)`);
                        return; // 価格更新をスキップ
                    } else {
                        element.style.display = ''; // 表示に戻す
                    }
                    
                    if (serviceKey === 'personal_set') {
                        formattedPrice = `単品合計 ${regularPrice.toLocaleString()}円`;
                    } else if (serviceKey === 'shintaku') {
                        formattedPrice = `通常価格 ${regularPrice.toLocaleString()}円`;
                    } else if (serviceKey === 'star_yomi') {
                        formattedPrice = `通常価格: ${regularPrice.toLocaleString()}円`;
                    } else {
                        formattedPrice = `通常 ${regularPrice.toLocaleString()}円`;
                    }
                } else if (priceType === 'sale') {
                    // セール価格は salePrice を使用
                    formattedPrice = `${price.toLocaleString()}円`;
                } else if (priceType === 'savings') {
                    // 割引額表示の場合
                    const regularPrice = product.regularPrice || price;
                    const salePrice = product.salePrice || price;
                    const savings = regularPrice - salePrice;
                    if (savings > 0) {
                        formattedPrice = `${savings.toLocaleString()}円お得！`;
                    } else {
                        formattedPrice = 'オープン記念価格';
                    }
                } else {
                    // 通常の価格表示（個人鑑定ページ形式に統一）
                    formattedPrice = `${price.toLocaleString()}円`;
                }
                
                element.textContent = formattedPrice;
                this.log(`💴 価格更新[${priceType || 'default'}]: ${oldPrice} → ${formattedPrice} (${selector})`);
                elementsFound++;
            });
        });

        // data-price 属性も更新
        const serviceElements = document.querySelectorAll(`[data-service="${serviceKey}"]`);
        this.log(`🏷️ data-service="${serviceKey}" で ${serviceElements.length} 個の要素を発見`);
        
        serviceElements.forEach(element => {
            const oldDataPrice = element.getAttribute('data-price');
            element.setAttribute('data-price', price);
            this.log(`🔢 data-price更新: ${oldDataPrice} → ${price}`);
        });

        if (elementsFound === 0) {
            this.log(`⚠️ ${serviceKey} の価格表示要素が見つかりませんでした`);
            this.log(`🔍 ページ内の全data-service要素:`, document.querySelectorAll('[data-service]'));
        } else {
            this.log(`✅ ${serviceKey}: ${elementsFound}個の価格要素を更新完了`);
        }
    }

    /**
     * 決済リンクの更新
     */
    updatePaymentLinks() {
        const adminData = this.getAdminData();
        if (!adminData || !adminData.paymentLinks) return;

        this.log('🔗 決済リンクを更新中...');

        adminData.paymentLinks.forEach(link => {
            if (link.active && link.url) {
                const serviceKey = this.getServiceKeyFromLink(link);
                if (serviceKey) {
                    this.updateLinkElements(serviceKey, link);
                }
            }
        });
    }

    /**
     * リンク要素の更新
     */
    updateLinkElements(serviceKey, link) {
        // 決済ボタンのリンクを更新
        const linkSelectors = [
            `[data-service="${serviceKey}"] a`,
            `[data-service="${serviceKey}"] .payment-button`,
            `[data-service="${serviceKey}"] .btn`,
            `.${serviceKey}-link`,
            `#${serviceKey}-link`
        ];

        linkSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element.tagName === 'A') {
                    element.href = link.url;
                    this.log(`🔗 ${serviceKey} のリンクを更新: ${link.url}`);
                } else if (element.onclick || element.addEventListener) {
                    // ボタンの場合、クリックイベントを更新
                    element.onclick = () => window.open(link.url, '_blank');
                }
            });
        });
    }

    /**
     * 商品からサービスキーを取得
     */
    getServiceKeyFromProduct(product) {
        for (const [key, name] of Object.entries(this.serviceMapping)) {
            if (product.productName === name || product.name === name) {
                return key;
            }
        }
        return null;
    }

    /**
     * リンクからサービスキーを取得
     */
    getServiceKeyFromLink(link) {
        for (const [key, name] of Object.entries(this.serviceMapping)) {
            if (link.productName === name) {
                return key;
            }
        }
        return null;
    }

    /**
     * 決済ボタンの動的更新
     */
    updatePaymentButtons() {
        const adminData = this.getAdminData();
        if (!adminData) return;

        this.log('🔘 決済ボタンを更新中...');

        // payment-redirect.js の設定を動的に更新
        if (window.PaymentRedirect) {
            const redirect = new window.PaymentRedirect();
            
            adminData.products?.forEach(product => {
                const serviceKey = this.getServiceKeyFromProduct(product);
                if (serviceKey) {
                    const price = product.salePrice || product.regularPrice;
                    const link = adminData.paymentLinks?.find(l => 
                        this.getServiceKeyFromLink(l) === serviceKey
                    );

                    if (price && link?.url) {
                        // PaymentRedirect の設定を更新
                        redirect.updateServiceConfig(serviceKey, {
                            price: price,
                            name: product.productName,
                            url: link.url
                        });
                    }
                }
            });
        }
    }

    /**
     * リアルタイム同期チェック
     */
    startRealTimeSync() {
        this.log('🔄 リアルタイム同期開始');
        
        setInterval(() => {
            this.syncIfNeeded();
        }, 5000); // 5秒ごとにチェック
    }

    /**
     * 必要に応じて同期
     */
    syncIfNeeded() {
        const adminData = this.getAdminData();
        if (!adminData) return;

        const lastSync = localStorage.getItem(this.lastSyncKey);
        const currentTime = Date.now();

        // 管理データの更新時刻をチェック
        if (adminData.lastModified && (!lastSync || adminData.lastModified > parseInt(lastSync))) {
            this.log('🔄 管理データの変更を検出、同期実行');
            this.syncAll();
            localStorage.setItem(this.lastSyncKey, currentTime.toString());
        }
    }

    /**
     * 全ての同期を実行
     */
    syncAll() {
        // メンテナンスモードが最優先
        if (this.checkMaintenanceMode()) {
            return;
        }

        // 各機能を順次実行
        this.updateProductVisibility();
        this.updatePrices();
        this.updateDisplayTexts();
        this.updatePaymentLinks();
        this.updatePaymentButtons();
        
        this.log('✅ 全同期完了');
    }

    /**
     * 表示文言を更新
     */
    updateDisplayTexts() {
        const adminData = this.getAdminData();
        if (!adminData || !adminData.products) {
            this.log('⚠️ 管理データが見つからないため、表示文言更新をスキップ');
            return;
        }

        this.log('📝 表示文言を更新中...', adminData.products);

        let updatedCount = 0;
        adminData.products.forEach(product => {
            const serviceKey = this.getServiceKeyFromProduct(product);
            if (!serviceKey || !product.displayText) return;

            // 現在のページに適したサービスのみ処理
            if (!this.isServiceRelevantToCurrentPage(serviceKey)) {
                this.log(`⏭️ ${serviceKey} の表示文言更新をスキップ（現在のページに関連しない）`);
                return;
            }

            const displayElements = document.querySelectorAll(`[data-service="${serviceKey}"] .display-text, [data-service="${serviceKey}"][data-text-type]`);
            
            this.log(`🔍 ${serviceKey} の表示文言要素: ${displayElements.length}個発見`);
            
            displayElements.forEach(function(element) {
                const textType = element.getAttribute('data-text-type');
                const oldText = element.textContent;
                let newText = product.displayText;
                
                if (textType === 'header') {
                    newText = '🌟 ' + product.displayText;
                } else if (textType === 'discount') {
                    newText = product.displayText;
                }
                    
                element.textContent = newText;
                updatedCount++;
                console.log('表示文言更新:', textType, oldText, newText);
            });
        });

        this.log('✅ 表示文言更新完了: ' + updatedCount + '個の要素を更新');
    }

    /**
     * 初期化（ページ読み込み時）
     */
    initialize() {
        this.log('🚀 AdminIntegration初期化開始');
        
        // データ状況を確認
        const adminData = this.getAdminData();
        if (adminData) {
            this.log('📊 管理データ検出:', {
                products: adminData.products?.length || 0,
                paymentLinks: adminData.paymentLinks?.length || 0,
                maintenanceMode: adminData.maintenanceMode
            });
        } else {
            this.log('⚠️ 管理データが見つかりません - 手動で統合管理画面から初期化してください');
        }
        
        // 即座に同期実行
        this.syncAll();
        
        // リアルタイム同期開始
        this.startRealTimeSync();
        
        this.log('✅ AdminIntegration初期化完了');
    }

    /**
     * デバッグログ
     */
    log(message) {
        if (this.debug) {
            console.log(`[AdminIntegration] ${message}`);
        }
    }

    /**
     * エラーログ
     */
    error(message, error) {
        console.error(`[AdminIntegration] ${message}`, error);
    }

    /**
     * 手動同期テスト（デバッグ用）
     */
    manualSyncTest() {
        this.log('🧪 手動同期テスト開始');
        
        // 管理データの確認
        const adminData = this.getAdminData();
        this.log('📊 現在の管理データ:', adminData);
        
        if (adminData && adminData.products) {
            this.log(`📦 商品数: ${adminData.products.length}`);
            adminData.products.forEach((product, index) => {
                this.log(`${index + 1}. ${product.name}: ¥${product.salePrice || product.regularPrice}`);
            });
        }
        
        // 全同期を実行
        this.syncAll();
        
        this.log('🧪 手動同期テスト完了');
        return adminData;
    }
}

// グローバルに公開
window.AdminIntegration = AdminIntegration;

// 自動初期化（ページ読み込み時）
document.addEventListener('DOMContentLoaded', function() {
    window.adminIntegration = new AdminIntegration();
    window.adminIntegration.initialize();
});

console.log('🔗 AdminIntegration スクリプト読み込み完了');
