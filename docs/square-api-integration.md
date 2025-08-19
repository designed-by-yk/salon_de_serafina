# Square API クーポン連携ガイド

## 概要
Salon de Serafinaのクーポンシステムを Square Payment Links API と連携させる方法を説明します。

## 実装方針

### 1. 動的な価格設定
クーポン適用時に、Square Payment Links API を使用して動的に価格を調整します。

```javascript
// 基本的な Square API 連携例
async function createDynamicPaymentLink(originalPrice, discountAmount, serviceType) {
    const finalPrice = originalPrice - discountAmount;
    
    const paymentLinkData = {
        quick_pay: {
            location_id: "YOUR_LOCATION_ID",
            name: getServiceName(serviceType),
            price_money: {
                amount: finalPrice * 100, // Square は cents 単位
                currency: "JPY"
            }
        },
        checkout_options: {
            redirect_url: `${window.location.origin}/payment-success.html?service=${serviceType}&coupon=${couponCode}`
        }
    };
    
    try {
        const response = await fetch('https://connect.squareup.com/v2/online-checkout/payment-links', {
            method: 'POST',
            headers: {
                'Square-Version': '2023-10-18',
                'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentLinkData)
        });
        
        const result = await response.json();
        return result.payment_link.url;
    } catch (error) {
        console.error('Square API Error:', error);
        throw error;
    }
}
```

### 2. サービス名マッピング
```javascript
function getServiceName(serviceType) {
    const serviceNames = {
        'shintaku': '神託システムタロット占い',
        'star_yomi': '星詠みシステム星座占い',
        'personal': 'セラフィナの個人鑑定',
        'mini_tarot': 'miniタロット占い',
        'mini_horoscope': 'mini星座占い'
    };
    return serviceNames[serviceType] || 'Salon de Serafina 鑑定';
}
```

### 3. Webhook での検証
Square Webhook を設定して、実際の決済完了を検証します。

```javascript
// Webhook エンドポイント（サーバーサイド）
app.post('/webhook/square/payment', async (req, res) => {
    const { event_type, data } = req.body;
    
    if (event_type === 'payment.created') {
        const payment = data.object.payment;
        const orderId = payment.order_id;
        
        // Square Order API から詳細情報を取得
        const orderDetails = await getSquareOrderDetails(orderId);
        
        // クーポン情報を確認（redirect_url から抽出）
        const redirectUrl = new URL(orderDetails.redirect_url);
        const couponCode = redirectUrl.searchParams.get('coupon');
        const serviceType = redirectUrl.searchParams.get('service');
        
        if (couponCode) {
            // クーポン使用を記録
            const userEmail = payment.buyer_email_address || 'unknown@example.com';
            await recordCouponUsage(couponCode, serviceType, userEmail, payment.amount_money.amount / 100);
        }
    }
    
    res.status(200).send('OK');
});
```

### 4. 無料クーポンの処理
100%割引クーポンの場合は、Square決済をスキップして直接サービスを提供します。

```javascript
function handleFreeCoupon(couponCode, serviceType, userEmail) {
    // クーポン使用を記録
    const result = couponSystem.useCoupon(couponCode, serviceType, userEmail, originalPrice);
    
    if (result.success) {
        // 直接サービス提供画面へリダイレクト
        window.location.href = `service-form.html?coupon=${couponCode}&email=${encodeURIComponent(userEmail)}`;
    } else {
        alert('エラー: ' + result.error);
    }
}
```

## 環境変数設定

```javascript
// 本番環境
const SQUARE_ENVIRONMENT = 'production';
const SQUARE_ACCESS_TOKEN = 'YOUR_PRODUCTION_ACCESS_TOKEN';
const SQUARE_LOCATION_ID = 'YOUR_LOCATION_ID';

// テスト環境
const SQUARE_SANDBOX_TOKEN = 'YOUR_SANDBOX_ACCESS_TOKEN';
const SQUARE_SANDBOX_LOCATION_ID = 'YOUR_SANDBOX_LOCATION_ID';
```

## 実装手順

1. **Square Developer Dashboard でアプリを作成**
   - https://developer.squareup.com/
   - Payment Links API の権限を有効化

2. **Webhook エンドポイントを設定**
   - payment.created イベントを購読
   - SSL 対応のエンドポイント URL を設定

3. **フロントエンド実装**
   - 既存の決済ボタンを動的 Payment Link 生成に変更
   - クーポン情報を Square に渡す

4. **バックエンド実装**
   - Webhook 受信処理
   - クーポン使用記録
   - メール送信（決済完了通知）

## セキュリティ考慮事項

- Square Access Token はサーバーサイドのみで使用
- Webhook 署名の検証を実装
- クーポンコードの重複使用防止
- 価格操作の検証

## テスト方法

1. Square Sandbox 環境でテスト
2. テスト用クーポンで割引動作確認
3. Webhook の動作確認
4. エラーケースのテスト

## 今後の拡張

- クーポン使用期限の細かい制御
- ユーザー別使用制限
- クーポンの自動生成
- A/Bテスト機能
- 売上分析ダッシュボード
