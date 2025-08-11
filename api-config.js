// API設定ファイル
const API_KEYS = {
  tarot: 'AIzaSyAcZsBj4YVN8x_7RzInpKaLG-CywGjOotI', // 既存のタロット用APIキー
  zodiac: 'AIzaSyDB5vNo-R-MzX1JAq1vvBc8c7LJh7BigCI'  // 星座用APIキー
};

// APIエンドポイント設定
const API_ENDPOINTS = {
  gemini: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
};

// 共通設定
const API_CONFIG = {
  timeout: 30000, // 30秒
  retryCount: 3,
  defaultHeaders: {
    'Content-Type': 'application/json'
  }
};

// APIキーのバリデーション
function validateApiKey(service) {
  const key = API_KEYS[service];
  if (!key || key === 'YOUR_ZODIAC_API_KEY_HERE' || key === 'YOUR_GEMINI_API_KEY_HERE') {
    console.warn(`${service} APIキーが設定されていません`);
    return false;
  }
  return true;
}

// このファイルをエクスポート（モジュール対応）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { API_KEYS, API_ENDPOINTS, API_CONFIG, validateApiKey };
}

