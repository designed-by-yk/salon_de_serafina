/**
 * Salon de Serafina - 統合管理画面連携システム
 * 管理画面の設定をメインサイトに自動反映
 */

class AdminIntegration {
    constructor() {
        this.adminDataKey = 'adminData';
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
        // 重複を避けるため、表示中の商品のみをフィルタリング
        const visibleProducts = adminData.products.filter(product => product.visible);
        this.log(`👁️ 表示中の商品: ${visibleProducts.length}件`);
        
        // 重複商品を除去（同じstableIdの商品は1つだけ残す）
        const uniqueProducts = [];
        const seenStableIds = new Set();
        
        visibleProducts.forEach(product => {
            if (!seenStableIds.has(product.stableId)) {
                seenStableIds.add(product.stableId);
                uniqueProducts.push(product);
            } else {
                this.log(`🔄 重複商品をスキップ: ${product.name} (stableId: ${product.stableId})`);
            }
        });
        
        this.log(`✅ 重複除去後の商品数: ${uniqueProducts.length}件`);
        
        uniqueProducts.forEach(product => {
            const serviceKey = this.getServiceKeyFromProduct(product);
            this.log(`🔍 商品チェック: ${product.name || product.productName} → サービスキー: ${serviceKey}`);
            this.log(`🔍 価格データ: 通常価格=${product.regularPrice}, 販売価格=${product.salePrice}, 表示=${product.visible}`);
            
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
            'index.html': ['shintaku', 'star_yomi', 'personal_tarot', 'personal_birthday', 'personal_set'], // トップページは全サービス対応
            '': ['shintaku', 'star_yomi', 'personal_tarot', 'personal_birthday', 'personal_set'] // GitHub Pages ルート対応
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
        // 商品管理で表示設定された商品の価格を取得
        let displayPrice;
        if (product.visible) {
            // 表示中の商品の場合、販売価格を優先
            displayPrice = product.salePrice || product.regularPrice;
        } else {
            // 非表示の商品は処理しない
            this.log(`⏭️ 非表示商品のため価格更新をスキップ: ${product.name || product.productName}`);
            return;
        }
        
        if (!displayPrice) {
            this.log(`⚠️ 価格が設定されていません: ${product.name || product.productName}`);
            return;
        }

        this.log(`💰 ${serviceKey} の価格更新開始: ¥${displayPrice.toLocaleString()} (表示設定: ${product.visible})`);

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
            `#${serviceKey}-price`,
            
            // より包括的なセレクタ
            `.price[data-service="${serviceKey}"]`,
            `.original-price[data-service="${serviceKey}"]`,
            `.special-price[data-service="${serviceKey}"]`,
            `.price-large[data-service="${serviceKey}"]`,
            
            // より広範囲のセレクタを追加
            `[data-service="${serviceKey}"] span`,
            `[data-service="${serviceKey}"] p`,
            `[data-service="${serviceKey}"] div`,
            `[data-service="${serviceKey}"] h3`,
            `[data-service="${serviceKey}"] h4`,
            
            // ページ固有のセレクタ（共通セレクタを完全削除して競合を回避）
        ];
        
        // ページ固有のセレクタを追加（各サービス専用で競合を回避）
        if (serviceKey.startsWith('personal_')) {
            // 個人鑑定ページの場合のみ、特定のIDを含める
            if (serviceKey === 'personal_tarot') {
                // タロット専用セレクタのみ（共通セレクタを完全削除）
                priceSelectors.push(`.option-card .price[data-service="${serviceKey}"]`);
                priceSelectors.push(`.price[data-service="${serviceKey}"]`);
                priceSelectors.push(`.original-price[data-service="${serviceKey}"]`);
            } else if (serviceKey === 'personal_birthday') {
                // 誕生日専用セレクタのみ（共通セレクタを完全削除）
                priceSelectors.push(`.option-card .price[data-service="${serviceKey}"]`);
                priceSelectors.push(`.price[data-service="${serviceKey}"]`);
                priceSelectors.push(`.original-price[data-service="${serviceKey}"]`);
            } else if (serviceKey === 'personal_set') {
                // セット専用セレクタのみ（共通セレクタを完全削除）
                priceSelectors.push(`.bundle-pricing .price[data-service="${serviceKey}"]`);
                priceSelectors.push(`.price[data-service="${serviceKey}"]`);
            }
        } else if (serviceKey === 'star_yomi') {
            // 星詠みページ用の特別なセレクタ
            priceSelectors.push(`.price-badge[data-service="${serviceKey}"]`);
            priceSelectors.push(`.special-price .price[data-service="${serviceKey}"]`);
            priceSelectors.push(`.original-price[data-service="${serviceKey}"]`);
        }

        let elementsFound = 0;
        const processedElements = new Set(); // 処理済み要素を追跡
        
        priceSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            this.log(`🔍 セレクタ "${selector}" で ${elements.length} 個の要素を発見`);
            
            elements.forEach(element => {
                // 既に処理済みの要素はスキップ
                if (processedElements.has(element)) {
                    this.log(`⏭️ 要素は既に処理済みのためスキップ: ${selector}`);
                    return;
                }
                processedElements.add(element);
                const oldPrice = element.textContent;
                let formattedPrice;
                
                // data-price-type に基づいて価格表示を調整
                const priceType = element.getAttribute('data-price-type');
                if (priceType === 'regular') {
                    // 通常価格は regularPrice を使用
                    const regularPrice = product.regularPrice;
                    const salePrice = product.salePrice;
                    
                    // 商品管理の表示設定に基づく一貫した価格表示ロジック
                    if (product.visible) {
                        // 表示中の商品の場合
                        if (regularPrice === salePrice) {
                            // 通常価格 = 販売価格の場合：通常価格要素は非表示にして重複を回避
                            element.style.setProperty('display', 'none', 'important');
                            element.style.setProperty('visibility', 'hidden', 'important');
                            element.style.setProperty('opacity', '0', 'important');
                            this.log(`✅ 表示中商品の通常価格: ${serviceKey} (通常価格=販売価格、重複回避のため非表示)`);
                            // 価格テキストの更新をスキップ（非表示なので不要）
                            return;
                        } else {
                            // 通常価格 ≠ 販売価格の場合：白い文字で取り消し線表示
                            element.style.setProperty('display', 'block', 'important');
                            element.style.setProperty('text-decoration', 'line-through', 'important');
                            element.style.setProperty('color', '#ccc', 'important');
                            element.style.setProperty('font-size', '0.9em', 'important');
                            element.style.setProperty('font-weight', 'normal', 'important');
                            element.style.setProperty('visibility', 'visible', 'important');
                            element.style.setProperty('opacity', '1', 'important');
                            this.log(`✅ 表示中商品の通常価格: ${serviceKey} (通常価格≠販売価格、取り消し線表示)`);
                        }
                    } else {
                        // 非表示商品の場合：非表示
                        element.style.display = 'none';
                        this.log(`🚫 非表示商品の通常価格: ${serviceKey} (非表示)`);
                    }
                    
                    if (serviceKey === 'personal_set') {
                        // セット価格の場合は価格のみ表示（「セット価格」の重複を避ける）
                        formattedPrice = `${regularPrice.toLocaleString()}円`;
                    } else if (serviceKey === 'shintaku') {
                        // 通常価格と販売価格が同じ場合は「通常価格」表示を削除
                        formattedPrice = `${regularPrice.toLocaleString()}円`;
                    } else if (serviceKey === 'star_yomi') {
                        // 通常価格と販売価格が同じ場合は「通常価格」表示を削除
                        formattedPrice = `${regularPrice.toLocaleString()}円`;
                    } else if (serviceKey.startsWith('personal_')) {
                        // 個人鑑定の場合は「通常価格」表示を削除
                        formattedPrice = `${regularPrice.toLocaleString()}円`;
                    } else {
                        formattedPrice = `${regularPrice.toLocaleString()}円`;
                    }
                } else if (priceType === 'sale') {
                    // 販売価格は商品管理で表示設定された価格を使用
                    
                    // 商品管理の表示設定に基づく一貫した販売価格表示ロジック
                    if (product.visible) {
                        // 表示中の商品の場合：黄色の大きい文字で表示
                        element.style.setProperty('display', 'block', 'important');
                        element.style.setProperty('text-decoration', 'none', 'important');
                        element.style.setProperty('color', '#ffd700', 'important');
                        element.style.setProperty('font-size', '1.4em', 'important');
                        element.style.setProperty('font-weight', 'bold', 'important');
                        element.style.setProperty('visibility', 'visible', 'important');
                        element.style.setProperty('opacity', '1', 'important');
                        element.classList.remove('strikethrough', 'gray-text', 'small-text');
                        this.log(`✅ 表示中商品のセール価格: ${serviceKey} (黄色表示)`);
                    } else {
                        // 非表示商品の場合：非表示
                        element.style.display = 'none';
                        this.log(`🚫 非表示商品のセール価格: ${serviceKey} (非表示)`);
                    }
                    
                    formattedPrice = `${displayPrice.toLocaleString()}円`;
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
                    // デフォルトの価格表示（商品管理の表示設定に基づく）
                    if (product.visible) {
                        // 表示中の商品の場合：黄色の大きい文字で表示
                        element.style.setProperty('display', 'block', 'important');
                        element.style.setProperty('text-decoration', 'none', 'important');
                        element.style.setProperty('color', '#ffd700', 'important');
                        element.style.setProperty('font-size', '1.4em', 'important');
                        element.style.setProperty('font-weight', 'bold', 'important');
                        element.style.setProperty('visibility', 'visible', 'important');
                        element.style.setProperty('opacity', '1', 'important');
                        element.classList.remove('strikethrough', 'gray-text', 'small-text');
                        this.log(`✅ 表示中商品のデフォルト価格: ${serviceKey} (黄色表示)`);
                    } else {
                        // 非表示商品の場合：非表示
                        element.style.display = 'none';
                        this.log(`🚫 非表示商品のデフォルト価格: ${serviceKey} (非表示)`);
                    }
                    
                    formattedPrice = `${displayPrice.toLocaleString()}円`;
                }
                
                element.textContent = formattedPrice;
                
                // 価格要素の表示を強制
                element.style.display = 'block';
                element.style.visibility = 'visible';
                element.style.opacity = '1';
                element.style.position = 'relative';
                
                // 強制的にDOMに再描画させる
                element.offsetHeight;
                
                this.log(`💴 価格更新[${priceType || 'default'}]: ${oldPrice} → ${formattedPrice} (${selector})`);
                elementsFound++;
            });
        });

        // data-price 属性も更新
        const serviceElements = document.querySelectorAll(`[data-service="${serviceKey}"]`);
        this.log(`🏷️ data-service="${serviceKey}" で ${serviceElements.length} 個の要素を発見`);
        
        serviceElements.forEach(element => {
            const oldDataPrice = element.getAttribute('data-price');
            element.setAttribute('data-price', displayPrice);
            this.log(`🔢 data-price更新: ${oldDataPrice} → ${displayPrice}`);
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

        // 表示中の商品のみを対象に決済リンクを更新
        const visibleProducts = adminData.products.filter(p => p.visible === true);
        this.log(`👁️ 表示中の商品: ${visibleProducts.length}件`);

        visibleProducts.forEach(product => {
            const serviceKey = this.getServiceKeyFromProduct(product);
            if (!serviceKey) return;

            // 現在のページに関連するサービスのみ処理
            if (!this.isServiceRelevantToCurrentPage(serviceKey)) {
                this.log(`⏭️ ${serviceKey} の決済リンク更新をスキップ（現在のページに関連しない）`);
                return;
            }

            // 商品の価格に一致する決済リンクを検索
            const productPrice = product.salePrice || product.regularPrice;
            const matchingLinks = adminData.paymentLinks.filter(link => {
                return link.active === true && 
                       link.stableId === product.stableId && 
                       link.price === productPrice &&
                       link.url && 
                       link.url !== 'https://square.link/u/PLACEHOLDER_LINK';
            });

            this.log(`🔍 ${serviceKey} (¥${productPrice}) の一致する決済リンク: ${matchingLinks.length}件`);

            if (matchingLinks.length > 0) {
                // 最初の一致するリンクを使用
                const link = matchingLinks[0];
                this.updateLinkElements(serviceKey, link);
                this.log(`✅ ${serviceKey} の決済リンクを更新: ${link.id} (¥${link.price})`);
            } else {
                this.log(`⚠️ ${serviceKey} (¥${productPrice}) に一致する決済リンクが見つかりません`);
                // デバッグ用: 利用可能なリンクを表示
                const availableLinks = adminData.paymentLinks.filter(link => 
                    link.stableId === product.stableId && link.active === true
                );
                this.log(`📋 利用可能なリンク:`, availableLinks.map(l => `${l.id}: ¥${l.price}`));
            }
        });
    }

    /**
     * リンク要素の更新
     */
    updateLinkElements(serviceKey, link) {
        // 決済ボタンのリンクを更新（サービス固有のセレクタのみ使用）
        const linkSelectors = [
            // サービス固有のセレクタのみ（グローバルセレクタを削除して競合を回避）
            `[data-payment-button="${serviceKey}"]`, // 決済ボタン用データ属性
            `button[data-service="${serviceKey}"]`, // サービス固有のボタン
            
            // より広範囲のセレクタを追加
            `[data-service="${serviceKey}"] button`,
            `[data-service="${serviceKey}"] a`,
            `[data-service="${serviceKey}"] .btn`,
            `[data-service="${serviceKey}"] .button`,
        ];
        
        // サービス別の専用セレクタを追加
        if (serviceKey === 'personal_tarot') {
            linkSelectors.push(`#tarot-payment-btn`); // タロット専用
            linkSelectors.push(`button[onclick*="7000"]`); // 7000円の決済ボタン
        } else if (serviceKey === 'personal_birthday') {
            linkSelectors.push(`#star-payment-btn`); // 誕生日専用
            linkSelectors.push(`button[onclick*="7000"]`); // 7000円の決済ボタン
        } else if (serviceKey === 'personal_set') {
            linkSelectors.push(`#bundle-payment-btn`); // セット専用
            linkSelectors.push(`button[onclick*="10000"]`); // 10000円の決済ボタン
        } else if (serviceKey === 'shintaku') {
            linkSelectors.push(`#payment-btn`); // 神託専用
        } else if (serviceKey === 'star_yomi') {
            linkSelectors.push(`#payment-btn`); // 星詠み専用
        }

        let buttonFound = false;
        linkSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            this.log(`🔍 決済ボタン検索: "${selector}" で ${elements.length} 個の要素を発見`);
            
            elements.forEach(element => {
                // 決済ボタンかどうかを確認（ナビゲーションボタンを除外）
                const isPaymentButton = element.id?.includes('payment') || 
                                      element.classList.contains('payment-button') ||
                                      element.classList.contains('btn-primary') ||
                                      element.classList.contains('option-button') ||
                                      element.classList.contains('bundle-button') ||
                                      element.getAttribute('data-payment-button') ||
                                      element.textContent?.includes('申し込む') ||
                                      element.textContent?.includes('決済') ||
                                      element.textContent?.includes('鑑定') ||
                                      element.textContent?.includes('タロット') ||
                                      element.textContent?.includes('星詠み') ||
                                      element.textContent?.includes('セット') ||
                                      element.textContent?.includes('購入') ||
                                      element.textContent?.includes('注文') ||
                                      element.textContent?.includes('支払い') ||
                                      element.onclick?.toString().includes('square.link') ||
                                      element.onclick?.toString().includes('payment') ||
                                      element.onclick?.toString().includes('7000') ||
                                      element.onclick?.toString().includes('10000');
                
                if (isPaymentButton) {
                    // onclickイベントを更新（決済ボタンのみ）
                    element.onclick = () => window.open(link.url, '_blank');
                    
                    // 決済ボタンの表示を強制
                    element.style.setProperty('display', 'block', 'important');
                    element.style.setProperty('visibility', 'visible', 'important');
                    element.style.setProperty('opacity', '1', 'important');
                    element.style.setProperty('pointer-events', 'auto', 'important');
                    element.style.setProperty('cursor', 'pointer', 'important');
                    element.style.setProperty('position', 'relative', 'important');
                    element.style.setProperty('z-index', '999', 'important');
                    
                    // 親要素の表示も強制
                    let parent = element.parentElement;
                    let depth = 0;
                    while (parent && parent !== document.body && depth < 5) {
                        parent.style.setProperty('display', 'block', 'important');
                        parent.style.setProperty('visibility', 'visible', 'important');
                        parent.style.setProperty('opacity', '1', 'important');
                        parent.style.setProperty('position', 'relative', 'important');
                        parent = parent.parentElement;
                        depth++;
                    }
                    
                    // 強制的にDOMに再描画させる
                    element.offsetHeight;
                    
                    this.log(`🔗 ${serviceKey} の決済ボタンを更新: ${link.url}`);
                    buttonFound = true;
                }
            });
        });
        
        if (!buttonFound) {
            this.log(`⚠️ ${serviceKey} の決済ボタンが見つかりませんでした`);
            this.log(`🔍 ページ内の全ボタン要素:`, document.querySelectorAll('button, .btn, [class*="btn"]'));
        }
    }

    /**
     * 商品からサービスキーを取得
     */
    getServiceKeyFromProduct(product) {
        // デバッグ用ログ
        this.log(`🔍 商品からサービスキー取得:`, {
            productName: product.productName,
            name: product.name,
            stableId: product.stableId
        });
        
        // まず productName で検索
        if (product.productName) {
            for (const [key, name] of Object.entries(this.serviceMapping)) {
                if (product.productName === name) {
                    this.log(`✅ productName でマッチ: ${product.productName} → ${key}`);
                    return key;
                }
            }
        }
        
        // 次に name で検索
        if (product.name) {
            for (const [key, name] of Object.entries(this.serviceMapping)) {
                if (product.name === name) {
                    this.log(`✅ name でマッチ: ${product.name} → ${key}`);
                    return key;
                }
            }
        }
        
        // stableId から推測（フォールバック）
        if (product.stableId) {
            if (product.stableId.includes('shintaku')) return 'shintaku';
            if (product.stableId.includes('star_yomi')) return 'star_yomi';
            if (product.stableId.includes('personal_tarot')) return 'personal_tarot';
            if (product.stableId.includes('personal_birthday')) return 'personal_birthday';
            if (product.stableId.includes('personal_set')) return 'personal_set';
        }
        
        this.log(`⚠️ サービスキーが見つかりません:`, product);
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
        // 重複実行防止
        if (this.isSyncing) {
            this.log('⚠️ 同期処理が既に実行中です - スキップ');
            return;
        }
        
        this.isSyncing = true;
        
        try {
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
            
            // 表示文言の更新を確実にするため、少し遅延して再実行
            setTimeout(() => {
                this.log('🔄 表示文言の再更新を実行');
                this.updateDisplayTexts();
            }, 1000);
            
            this.log('✅ 全同期完了');
        } finally {
            // 同期完了フラグをリセット
            this.isSyncing = false;
        }
    }

    /**
     * 商品管理データの整合性をチェック
     */
    validateAdminData() {
        const adminData = this.getAdminData();
        if (!adminData || !adminData.products) {
            this.log('⚠️ 商品管理データが見つかりません');
            return false;
        }

        this.log('🔍 商品管理データの整合性をチェック中...');
        
        // 各商品のデータを確認
        adminData.products.forEach(product => {
            this.log(`📊 商品データ: ${product.productName || product.name}`, {
                stableId: product.stableId,
                productName: product.productName,
                name: product.name,
                regularPrice: product.regularPrice,
                salePrice: product.salePrice,
                displayText: product.displayText,
                visible: product.visible
            });
        });

        return true;
    }

    /**
     * 表示文言を更新
     */
    updateDisplayTexts() {
        // 商品管理データの整合性をチェック
        if (!this.validateAdminData()) {
            this.log('⚠️ 商品管理データが無効なため、表示文言更新をスキップ');
            return;
        }

        const adminData = this.getAdminData();
        this.log('📝 表示文言を更新中...', adminData.products);

        let updatedCount = 0;
        // 重複を避けるため、表示中の商品のみをフィルタリング
        const visibleProducts = adminData.products.filter(product => product.visible);
        this.log(`👁️ 表示中の商品: ${visibleProducts.length}件`);
        
        // 重複商品を除去（同じstableIdの商品は1つだけ残す）
        const uniqueProducts = [];
        const seenStableIds = new Set();
        
        visibleProducts.forEach(product => {
            if (!seenStableIds.has(product.stableId)) {
                seenStableIds.add(product.stableId);
                uniqueProducts.push(product);
            } else {
                this.log(`🔄 重複商品をスキップ: ${product.name} (stableId: ${product.stableId})`);
            }
        });
        
        this.log(`✅ 重複除去後の商品数: ${uniqueProducts.length}件`);
        
        uniqueProducts.forEach(product => {
            this.log(`🔍 商品データ詳細:`, {
                productName: product.productName,
                name: product.name,
                displayText: product.displayText,
                visible: product.visible,
                regularPrice: product.regularPrice,
                salePrice: product.salePrice
            });
            
            // 表示文言データの詳細をログ出力
            this.log(`🔍 表示文言更新対象商品: ${product.productName || product.name}`, {
                displayText: product.displayText,
                visible: product.visible,
                regularPrice: product.regularPrice,
                salePrice: product.salePrice
            });
            
            // 商品管理で登録された表示文言をそのまま使用（強制設定なし）
            this.log(`📝 商品管理の表示文言を使用: "${product.displayText}"`);
            
            const serviceKey = this.getServiceKeyFromProduct(product);
            if (!serviceKey) {
                this.log(`⚠️ サービスキーが見つからない商品: ${product.productName || product.name}`);
                return;
            }

            // 表示中の商品のみ処理
            if (!product.visible) {
                this.log(`⏭️ ${serviceKey} の表示文言更新をスキップ（非表示商品）`);
                return;
            }

            // 現在のページに適したサービスのみ処理
            if (!this.isServiceRelevantToCurrentPage(serviceKey)) {
                this.log(`⏭️ ${serviceKey} の表示文言更新をスキップ（現在のページに関連しない）`);
                return;
            }

            this.log(`🔍 ${serviceKey} の表示文言を更新: "${product.displayText}" (商品: ${product.productName || product.name})`);

            // より確実なセレクタに修正
            const displayElements = document.querySelectorAll(`
                [data-service="${serviceKey}"].display-text,
                [data-service="${serviceKey}"][data-text-type],
                [data-service="${serviceKey}"][data-price-type],
                .display-text[data-service="${serviceKey}"],
                [data-service="${serviceKey}"] .display-text,
                [data-service="${serviceKey}"] h3,
                [data-service="${serviceKey}"] h4,
                [data-service="${serviceKey}"] p,
                [data-service="${serviceKey}"] span
            `);
            
            this.log(`🔍 ${serviceKey} の表示文言要素: ${displayElements.length}個発見`);
            displayElements.forEach(function(element, index) {
                console.log(`🔍 要素${index + 1}:`, {
                    tagName: element.tagName,
                    className: element.className,
                    textType: element.getAttribute('data-text-type'),
                    priceType: element.getAttribute('data-price-type'),
                    currentText: element.textContent,
                    service: element.getAttribute('data-service')
                });
            });
            
            // セレクターの詳細テスト
            console.log(`🔍 ${serviceKey} セレクターテスト:`);
            const testSelectors = [
                `[data-service="${serviceKey}"] .display-text`,
                `[data-service="${serviceKey}"][data-text-type]`,
                `[data-service="${serviceKey}"][data-price-type]`,
                `.display-text[data-service="${serviceKey}"]`
            ];
            
            testSelectors.forEach(function(selector, index) {
                const elements = document.querySelectorAll(selector);
                console.log(`🔍 セレクター${index + 1} "${selector}": ${elements.length}個発見`);
                elements.forEach(function(element, elemIndex) {
                    console.log(`  - 要素${elemIndex + 1}: ${element.tagName}.${element.className} "${element.textContent}"`);
                });
            });
            
            displayElements.forEach(function(element) {
                const textType = element.getAttribute('data-text-type');
                const priceType = element.getAttribute('data-price-type');
                const oldText = element.textContent;
                let newText = product.displayText || '';
                
                // 商品管理で登録された表示文言をそのまま使用（undefinedの場合は空文字）
                if (textType === 'header') {
                    newText = '🌟 ' + (product.displayText || '');
                } else {
                    // その他の場合は商品管理の表示文言をそのまま使用
                    newText = product.displayText || '';
                }
                    
                element.textContent = newText;
                updatedCount++;
                console.log('表示文言更新:', textType, oldText, '→', newText, '商品:', product.productName || product.name, '表示文言:', product.displayText || 'undefined');
            });
            
            // 表示文言が適用されなかった場合のフォールバック処理
            if (displayElements.length === 0) {
                this.log(`⚠️ ${serviceKey} の表示文言要素が見つかりませんでした`);
                // より広範囲のセレクタで再試行
                const fallbackElements = document.querySelectorAll(`[data-service="${serviceKey}"]`);
                this.log(`🔍 ${serviceKey} のフォールバック要素: ${fallbackElements.length}個発見`);
                fallbackElements.forEach(function(element) {
                    if (element.classList.contains('display-text') || element.hasAttribute('data-text-type') || element.hasAttribute('data-price-type')) {
                        element.textContent = product.displayText || '';
                        updatedCount++;
                        console.log('フォールバック表示文言更新:', element.tagName, element.className, '→', product.displayText || 'undefined');
                    }
                });
            }
            
            // 強制的に表示文言を適用（最後の手段）
            if (updatedCount === 0) {
                this.log(`🚨 ${serviceKey} の表示文言が適用されませんでした。強制適用を試行します。`);
                const allElements = document.querySelectorAll(`[data-service="${serviceKey}"]`);
                allElements.forEach(function(element) {
                    if (element.textContent && (element.textContent.includes('オープン') || element.textContent.includes('記念'))) {
                        element.textContent = product.displayText || '';
                        updatedCount++;
                        console.log('強制表示文言更新:', element.tagName, element.className, '→', product.displayText || 'undefined');
                    }
                });
            }
            
            // さらに強制的に表示文言を適用（最終手段）
            if (updatedCount === 0 && product.displayText) {
                this.log(`🚨🚨 ${serviceKey} の表示文言が全く適用されませんでした。最終手段を実行します。`);
                const allElements = document.querySelectorAll(`[data-service="${serviceKey}"]`);
                allElements.forEach(function(element) {
                    // テキストコンテンツがある要素をすべて対象にする
                    if (element.textContent && element.textContent.trim() !== '') {
                        const oldText = element.textContent;
                        element.textContent = product.displayText || '';
                        updatedCount++;
                        console.log('最終手段表示文言更新:', element.tagName, element.className, oldText, '→', product.displayText || 'undefined');
                    }
                });
            }
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
            
            // 商品管理データの整合性をチェック
            this.validateAdminData();
        } else {
            this.log('⚠️ 管理データが見つかりません - 手動で統合管理画面から初期化してください');
        }
        
        // 即座に同期実行
        this.syncAll();
        
        // リアルタイム同期開始
        this.startRealTimeSync();
        
        // 初期化完了フラグを設定
        window.adminIntegrationInitialized = true;
        
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

// 自動初期化（ページ読み込み時）- 重複実行防止
document.addEventListener('DOMContentLoaded', function() {
    // 既に初期化されている場合はスキップ
    if (window.adminIntegration) {
        console.log('⚠️ AdminIntegrationは既に初期化済みです');
        return;
    }
    
    // 初期化フラグを設定
    window.adminIntegrationInitialized = true;
    
    // 他のスクリプトの初期化を待つ
    setTimeout(() => {
        window.adminIntegration = new AdminIntegration();
        window.adminIntegration.initialize();
        
        // 継続的な更新で他のスクリプトの上書きを防ぐ
        const updateInterval = setInterval(() => {
            if (window.adminIntegration) {
                window.adminIntegration.updateDisplayTexts();
                window.adminIntegration.updatePrices();
                window.adminIntegration.updatePaymentLinks();
                console.log('🔧 継続的な更新を実行しました');
            }
        }, 2000); // 2秒ごとに更新
        
        // 10秒後に停止
        setTimeout(() => {
            clearInterval(updateInterval);
            console.log('🔧 継続的な更新を停止しました');
        }, 10000);
    }, 100); // 100ms待機に短縮
});

// ページが既に読み込まれている場合の対応
if (document.readyState === 'loading') {
    // DOMContentLoadedイベントを待つ
} else {
    // 既に読み込み完了している場合は即座に初期化
    if (!window.adminIntegration && !window.adminIntegrationInitialized) {
        window.adminIntegrationInitialized = true;
        setTimeout(() => {
            window.adminIntegration = new AdminIntegration();
            window.adminIntegration.initialize();
            
            // 継続的な更新で他のスクリプトの上書きを防ぐ
            const updateInterval = setInterval(() => {
                if (window.adminIntegration) {
                    window.adminIntegration.updateDisplayTexts();
                    window.adminIntegration.updatePrices();
                    window.adminIntegration.updatePaymentLinks();
                    console.log('🔧 継続的な更新を実行しました（既存ページ）');
                }
            }, 2000); // 2秒ごとに更新
            
            // 10秒後に停止
            setTimeout(() => {
                clearInterval(updateInterval);
                console.log('🔧 継続的な更新を停止しました（既存ページ）');
            }, 10000);
        }, 100); // 100ms待機に短縮
    }
}

console.log('🔗 AdminIntegration スクリプト読み込み完了');

// 手動テスト用の関数を追加
window.testDisplayTexts = function() {
    console.log('🧪 手動テスト: 表示文言の更新を実行');
    if (window.adminIntegration) {
        window.adminIntegration.updateDisplayTexts();
    } else {
        console.log('⚠️ adminIntegrationが初期化されていません');
    }
};

window.testSelectors = function(serviceKey) {
    console.log(`🧪 手動テスト: ${serviceKey} のセレクターテスト`);
    const testSelectors = [
        `[data-service="${serviceKey}"] .display-text`,
        `[data-service="${serviceKey}"][data-text-type]`,
        `[data-service="${serviceKey}"][data-price-type]`,
        `.display-text[data-service="${serviceKey}"]`
    ];
    
    testSelectors.forEach(function(selector, index) {
        const elements = document.querySelectorAll(selector);
        console.log(`🔍 セレクター${index + 1} "${selector}": ${elements.length}個発見`);
        elements.forEach(function(element, elemIndex) {
            console.log(`  - 要素${elemIndex + 1}: ${element.tagName}.${element.className} "${element.textContent}"`);
        });
    });
};

window.checkAdminData = function() {
    console.log('🧪 手動テスト: localStorageのadminDataを確認');
    const adminData = localStorage.getItem('adminData');
    if (adminData) {
        const data = JSON.parse(adminData);
        console.log('📊 localStorageのadminData:', data);
        console.log('📊 商品データ:', data.products);
        console.log('📊 決済リンクデータ:', data.paymentLinks);
        
        // 各商品の詳細を表示
        if (data.products) {
            console.log(`📊 全商品数: ${data.products.length}件`);
            data.products.forEach(function(product, index) {
                console.log(`📊 商品${index + 1}:`, {
                    id: product.id,
                    productId: product.productId,
                    productName: product.productName,
                    name: product.name,
                    regularPrice: product.regularPrice,
                    salePrice: product.salePrice,
                    displayText: product.displayText,
                    visible: product.visible,
                    stableId: product.stableId
                });
            });
            
            // 表示中の商品のみをフィルタリング
            const visibleProducts = data.products.filter(p => p.visible === true);
            console.log(`📊 表示中の商品数: ${visibleProducts.length}件`);
            visibleProducts.forEach(function(product, index) {
                console.log(`📊 表示中商品${index + 1}:`, {
                    id: product.id,
                    productId: product.productId,
                    name: product.name,
                    regularPrice: product.regularPrice,
                    salePrice: product.salePrice,
                    displayText: product.displayText,
                    stableId: product.stableId
                });
            });
        }
    } else {
        console.log('⚠️ localStorageにadminDataが見つかりません');
    }
};

window.forceReloadAdminData = function() {
    console.log('🧪 手動テスト: adminDataを強制再読み込み');
    if (window.adminIntegration) {
        const adminData = window.adminIntegration.getAdminData();
        console.log('📊 再読み込みしたadminData:', adminData);
        if (adminData && adminData.products) {
            adminData.products.forEach(function(product, index) {
                console.log(`📊 再読み込み商品${index + 1}:`, {
                    productName: product.productName,
                    name: product.name,
                    regularPrice: product.regularPrice,
                    salePrice: product.salePrice,
                    displayText: product.displayText,
                    visible: product.visible
                });
            });
        }
    }
};

window.clearAdminData = function() {
    console.log('🧪 手動テスト: localStorageのadminDataをクリア');
    localStorage.removeItem('adminData');
    console.log('✅ adminDataをクリアしました');
};

window.resetAdminData = function() {
    console.log('🧪 手動テスト: adminDataをリセット');
    localStorage.removeItem('adminData');
    console.log('✅ adminDataをクリアしました（商品管理画面で再登録してください）');
};

window.cleanDuplicateProducts = function() {
    console.log('🧪 手動テスト: 重複商品をクリーンアップ');
    const adminData = localStorage.getItem('adminData');
    if (adminData) {
        const data = JSON.parse(adminData);
        if (data.products) {
            console.log(`📊 クリーンアップ前の商品数: ${data.products.length}件`);
            
            // 重複を除去（同じstableIdの商品は1つだけ残す）
            const uniqueProducts = [];
            const seenStableIds = new Set();
            
            data.products.forEach(product => {
                if (!seenStableIds.has(product.stableId)) {
                    seenStableIds.add(product.stableId);
                    uniqueProducts.push(product);
                    console.log(`✅ 保持: ${product.name} (stableId: ${product.stableId})`);
                } else {
                    console.log(`🔄 削除: ${product.name} (stableId: ${product.stableId}) - 重複`);
                }
            });
            
            data.products = uniqueProducts;
            console.log(`📊 クリーンアップ後の商品数: ${data.products.length}件`);
            
            // 保存
            localStorage.setItem('adminData', JSON.stringify(data));
            console.log('✅ 重複商品のクリーンアップ完了');
        }
    } else {
        console.log('⚠️ localStorageにadminDataが見つかりません');
    }
};

// 強制更新用の関数を追加
window.forceUpdateAll = function() {
    console.log('🧪 手動テスト: 全要素を強制更新');
    if (window.adminIntegration) {
        // 全要素を強制的に更新
        window.adminIntegration.updateDisplayTexts();
        window.adminIntegration.updatePrices();
        window.adminIntegration.updatePaymentLinks();
        console.log('✅ 強制更新完了');
    }
};

// 要素検索用の関数を追加
window.findElements = function(serviceKey) {
    console.log(`🔍 ${serviceKey} の要素を検索中...`);
    
    // 表示文言要素
    const displayElements = document.querySelectorAll(`
        [data-service="${serviceKey}"].display-text,
        [data-service="${serviceKey}"][data-text-type],
        [data-service="${serviceKey}"][data-price-type],
        .display-text[data-service="${serviceKey}"],
        [data-service="${serviceKey}"] .display-text,
        [data-service="${serviceKey}"] h3,
        [data-service="${serviceKey}"] h4,
        [data-service="${serviceKey}"] p,
        [data-service="${serviceKey}"] span
    `);
    
    console.log(`📝 表示文言要素: ${displayElements.length}個`);
    displayElements.forEach((element, index) => {
        console.log(`  ${index + 1}. ${element.tagName}.${element.className}: "${element.textContent}"`);
    });
    
    // 価格要素
    const priceElements = document.querySelectorAll(`
        [data-service="${serviceKey}"] .price,
        [data-service="${serviceKey}"][data-price-type],
        .price[data-service="${serviceKey}"]
    `);
    
    console.log(`💰 価格要素: ${priceElements.length}個`);
    priceElements.forEach((element, index) => {
        console.log(`  ${index + 1}. ${element.tagName}.${element.className}: "${element.textContent}"`);
    });
    
    // 決済ボタン要素
    const buttonElements = document.querySelectorAll(`
        [data-service="${serviceKey}"] button,
        [data-service="${serviceKey}"] .btn,
        [data-service="${serviceKey}"] .button
    `);
    
    console.log(`🔗 決済ボタン要素: ${buttonElements.length}個`);
    buttonElements.forEach((element, index) => {
        console.log(`  ${index + 1}. ${element.tagName}.${element.className}: "${element.textContent}"`);
    });
};

// デバッグ用の詳細調査関数を追加
window.debugDisplayData = function() {
    console.log('🔍 表示データの詳細調査を開始...');
    
    // 商品管理データを確認
    const adminData = localStorage.getItem('adminData');
    if (adminData) {
        const data = JSON.parse(adminData);
        console.log('📊 商品管理データ:', data);
        
        if (data.products) {
            console.log('📦 全商品データ:');
            data.products.forEach((product, index) => {
                console.log(`  ${index + 1}. ${product.name}:`, {
                    stableId: product.stableId,
                    regularPrice: product.regularPrice,
                    salePrice: product.salePrice,
                    displayText: product.displayText,
                    visible: product.visible
                });
            });
            
            // 表示中の商品のみ
            const visibleProducts = data.products.filter(p => p.visible === true);
            console.log('👁️ 表示中の商品:');
            visibleProducts.forEach((product, index) => {
                console.log(`  ${index + 1}. ${product.name}:`, {
                    stableId: product.stableId,
                    regularPrice: product.regularPrice,
                    salePrice: product.salePrice,
                    displayText: product.displayText
                });
            });
        }
    } else {
        console.log('⚠️ 商品管理データが見つかりません');
    }
    
    // 各ページの要素を確認
    console.log('🔍 神託システムの要素:');
    findElements('shintaku');
    
    console.log('🔍 星詠みシステムの要素:');
    findElements('star_yomi');
    
    console.log('🔍 個人鑑定タロットの要素:');
    findElements('personal_tarot');
    
    console.log('🔍 個人鑑定誕生日の要素:');
    findElements('personal_birthday');
    
    console.log('🔍 個人鑑定セットの要素:');
    findElements('personal_set');
};

// 特定の要素の詳細を調査する関数
window.debugElement = function(selector) {
    console.log(`🔍 要素調査: ${selector}`);
    const elements = document.querySelectorAll(selector);
    console.log(`📊 発見された要素数: ${elements.length}`);
    
    elements.forEach((element, index) => {
        console.log(`  ${index + 1}. 要素詳細:`, {
            tagName: element.tagName,
            className: element.className,
            id: element.id,
            textContent: element.textContent,
            innerHTML: element.innerHTML,
            dataService: element.getAttribute('data-service'),
            dataTextType: element.getAttribute('data-text-type'),
            dataPriceType: element.getAttribute('data-price-type'),
            style: element.style.cssText
        });
    });
};

// 価格表示の詳細調査
window.debugPriceDisplay = function() {
    console.log('💰 価格表示の詳細調査...');
    
    // 神託システム
    console.log('🔮 神託システム:');
    debugElement('[data-service="shintaku"]');
    
    // 星詠みシステム
    console.log('⭐ 星詠みシステム:');
    debugElement('[data-service="star_yomi"]');
    
    // 個人鑑定
    console.log('👤 個人鑑定タロット:');
    debugElement('[data-service="personal_tarot"]');
    
    console.log('👤 個人鑑定誕生日:');
    debugElement('[data-service="personal_birthday"]');
    
    console.log('👤 個人鑑定セット:');
    debugElement('[data-service="personal_set"]');
};
