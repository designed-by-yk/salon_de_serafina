# 🏦 Square + クーポン連携システム導入ガイド

## 📋 概要

このシステムは、Square Web Payments SDKとクーポンシステムを統合し、以下の機能を提供します：

### ✨ 主要機能
- ✅ **動的決済金額**: クーポン適用後の金額で決済処理
- ✅ **0円決済対応**: 100%割引クーポンの場合は決済をスキップ
- ✅ **最小金額調整**: Square最小決済額（100円）未満の場合は自動調整
- ✅ **クーポン記録**: 決済履歴にクーポン情報を記録
- ✅ **統合管理**: 既存のクーポン管理システムと完全連携

---

## 🚀 導入手順

### 1. Square開発者アカウント設定

#### 📝 Square Developerアカウント作成
1. [Square Developer](https://developer.squareup.com/) にアクセス
2. アカウント作成またはログイン
3. 新しいアプリケーションを作成

#### 🔑 APIキーの取得
```
サンドボックス環境:
- Application ID: sandbox-sq0idb-XXXXXXXXXX
- Location ID: LXXXXXXXXXX

本番環境:
- Application ID: sq0idp-XXXXXXXXXX  
- Location ID: LXXXXXXXXXX
```

### 2. 設定ファイルの更新

#### 📄 `js/square-config.js` の編集
```javascript
const SquareConfig = {
    environment: 'sandbox', // 本番では 'production' に変更
    
    sandbox: {
        applicationId: 'あなたのサンドボックスアプリID',
        locationId: 'あなたのサンドボックスロケーションID'
    },
    
    production: {
        applicationId: 'あなたの本番アプリID', 
        locationId: 'あなたの本番ロケーションID'
    }
};
```

### 3. サーバーサイド実装

#### 🖥️ 決済処理API (`/api/process-payment`)
```javascript
// Express.js での実装例
app.post('/api/process-payment', async (req, res) => {
    try {
        const { token, amount, currency, note } = req.body;
        
        const squareClient = new Client({
            accessToken: process.env.SQUARE_ACCESS_TOKEN,
            environment: Environment.Sandbox // 本番では Production
        });
        
        const paymentsApi = squareClient.paymentsApi;
        
        const request = {
            sourceId: token,
            amountMoney: {
                amount: amount,
                currency: currency
            },
            note: note,
            idempotencyKey: require('crypto').randomUUID()
        };
        
        const response = await paymentsApi.createPayment(request);
        
        res.json({
            success: true,
            paymentId: response.result.payment.id,
            amount: amount
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
```

---

## 🎯 使用方法

### 📱 ユーザーの操作フロー

```
1. サービス選択
   ↓
2. クーポンコード入力（任意）
   ↓
3. Square決済ページに移動
   ↓ 
4. カード情報入力
   ↓
5. 決済処理
   ↓
6. 完了ページ表示
```

### 🔧 開発者向け実装

#### 決済ページへのリダイレクト
```javascript
// 個人鑑定の場合
const paymentRedirect = new PaymentRedirect();
paymentRedirect.redirectToPersonalTarotPayment('user@example.com');

// クーポン適用状態での決済
paymentRedirect.redirectWithCoupon(
    'personal_tarot', 
    5000, 
    'タロット鑑定',
    '詳細鑑定', 
    'COUPON123',
    'user@example.com'
);
```

#### 決済処理
```javascript
const squarePayment = new SquareCouponPayment();
await squarePayment.initializeSquare();

const result = await squarePayment.processPaymentWithCoupon({
    serviceType: 'personal_tarot',
    originalPrice: 5000,
    couponCode: 'DISCOUNT500',
    userEmail: 'user@example.com',
    serviceDetails: {
        name: 'タロット鑑定',
        description: '個人向け詳細鑑定'
    }
});
```

---

## 🎛️ 設定オプション

### 💰 決済設定
```javascript
// 最小決済金額
minAmount: 100 // 100円未満は100円に調整

// 0円決済の処理
freeServiceHandling: 'skip' // 決済をスキップして直接完了ページへ

// 最小金額未満の処理  
belowMinimumHandling: 'adjust_to_minimum' // 最小金額に調整
```

### 🎫 クーポン連携
```javascript
// 100%割引の場合
if (finalPrice === 0) {
    // 決済をスキップして無料サービス処理
    return handleFreeService();
}

// 割引ありの通常決済
const adjustedPrice = Math.max(finalPrice, 100);
return executeSquarePayment(adjustedPrice);
```

---

## 🧪 テスト方法

### 🏗️ サンドボックステスト

#### テスト用カード番号
```
Visa: 4111 1111 1111 1111
Mastercard: 5555 5555 5555 4444
JCB: 3566 0020 2036 0505

CVV: 123
有効期限: 将来の任意の日付
```

#### テストシナリオ
1. **通常決済**: クーポンなしで決済
2. **割引決済**: 割引クーポンで決済金額変更
3. **無料決済**: 100%割引クーポンで決済スキップ
4. **最小金額調整**: 100円未満になる割引の調整

### 🔍 デバッグ方法
```javascript
// デバッグモード有効化
SquareConfig.debug.enabled = true;

// ブラウザコンソールでのテスト
const squarePayment = new SquareCouponPayment();
squarePayment.initializeSquare();
```

---

## 🚨 トラブルシューティング

### ❌ よくあるエラー

#### 1. Square SDKが読み込まれない
```
エラー: Square Web Payments SDKが読み込まれていません
解決: HTMLに正しいSquare SDKを追加
<script src="https://sandbox.web.squarecdn.com/v1/square.js"></script>
```

#### 2. APIキー設定エラー
```
エラー: Application ID が設定されていません
解決: square-config.js のIDを正しく設定
```

#### 3. 決済処理エラー
```
エラー: サーバー決済処理エラー
解決: サーバーサイドAPIの実装とSquareアクセストークンの確認
```

### 🔧 デバッグコマンド
```javascript
// 設定確認
SquareConfig.validateConfig();

// 決済システム状態確認
console.log(squarePayment.isInitialized);

// クーポンシステム確認  
console.log(window.couponSystem.getAllCoupons());
```

---

## 📊 本番環境移行

### 🌐 本番設定チェックリスト

- [ ] `square-config.js` で `environment: 'production'` に変更
- [ ] 本番用 Application ID と Location ID を設定
- [ ] 本番用 Square Access Token をサーバーに設定
- [ ] SSL証明書の確認（HTTPSが必須）
- [ ] Webhook URLの設定（決済完了通知用）

### 🔐 セキュリティ確認

- [ ] APIキーをコードに直接記載していない
- [ ] サーバーサイドでの決済検証実装
- [ ] 決済ログの適切な記録
- [ ] 不正決済の検知・防止策

---

## 📞 サポート

### 🆘 問題が発生した場合

1. **設定確認**: `SquareConfig.validateConfig()` を実行
2. **ログ確認**: ブラウザのコンソールログを確認  
3. **Square Dashboard**: Square開発者ダッシュボードで決済状況を確認
4. **デバッグモード**: `SquareConfig.debug.enabled = true` で詳細ログを有効化

### 📚 参考資料

- [Square Web Payments SDK Documentation](https://developer.squareup.com/docs/web-payments/overview)
- [Square API Reference](https://developer.squareup.com/reference/square)
- [Square Sandbox Testing](https://developer.squareup.com/docs/testing/sandbox)

---

## 🎉 実装完了

このガイドに従って実装すると、クーポンシステムと完全連携したSquare決済システムが完成します！

**何かご質問があれば、お気軽にお問い合わせください。** 🚀
