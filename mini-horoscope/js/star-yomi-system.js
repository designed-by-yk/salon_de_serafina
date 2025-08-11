// 星詠みシステム - 完全AI自動生成
class StarYomiSystem {
  constructor() {
    this.apiKey = API_KEYS.zodiac; // 星座専用APIキー
    this.apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  }

  async generateReading(birthdate, name, consultation) {
    console.log('🌟 星詠みシステム鑑定開始:', { birthdate, name, consultation });
    
    try {
      // APIキーの確認
      if (!this.apiKey || this.apiKey === 'YOUR_ZODIAC_API_KEY_HERE') {
        throw new Error('APIキーが設定されていません');
      }

      const zodiacSign = this.getZodiacSign(birthdate);
      const [year, month, day] = birthdate.split('-');
      
      // 完全オリジナル生成プロンプト
      const prompt = `
あなたは星詠み師Serafinaです。挨拶や締めの際は「星詠み師Serafina」として名乗ってください。
以下の情報から、完全オリジナルの鑑定文を2000-2500文字で作成してください。

【重要】
- テンプレート禁止
- 同じ表現を繰り返さない  
- 相談内容に深く寄り添う
- 自然な会話調で書く

相談者：${name}様
生年月日：${month}月${day}日
星座：${zodiacSign}
相談内容：${consultation || '今月の運勢を知りたい'}

必ず含める内容：
1. 誕生日と星座の特性（${month}月${day}日生まれの特別な才能）
2. 今月（8月）の詳細運勢
3. 恋愛・仕事・金運
4. 8月のラッキーデー3日（具体的な日付で）
5. 8月の開運アクション5つ
6. セラフィナの個人鑑定への自然で温かい誘導（「さらに深い洞察をお求めでしたら」など控えめに）

テンプレートではなく、この人だけの特別な鑑定文を書いてください。`;

      console.log('✨ API呼び出し中...');
      
      const response = await fetch(
        `${this.apiEndpoint}?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            contents: [{parts: [{text: prompt}]}]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`API呼び出しエラー: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.candidates[0].content.parts[0].text;
      
      console.log('✅ 星詠み鑑定生成完了');
      
      return {
        success: true,
        reading: generatedText,
        userInfo: { name, birthdate, zodiacSign }
      };

    } catch (error) {
      console.error('❌ 星詠みシステムエラー:', error);
      return {
        success: false,
        error: '申し訳ございません。もう一度お試しください。'
      };
    }
  }

  getZodiacSign(birthdate) {
    const [year, month, day] = birthdate.split('-').map(Number);
    const date = month * 100 + day;

    if ((date >= 321 && date <= 331) || (date >= 1 && date <= 419)) return 'おひつじ座';
    if ((date >= 420 && date <= 430) || (date >= 501 && date <= 520)) return 'おうし座';
    if ((date >= 521 && date <= 531) || (date >= 601 && date <= 621)) return 'ふたご座';
    if ((date >= 622 && date <= 630) || (date >= 701 && date <= 722)) return 'かに座';
    if ((date >= 723 && date <= 731) || (date >= 801 && date <= 822)) return 'しし座';
    if ((date >= 823 && date <= 831) || (date >= 901 && date <= 922)) return 'おとめ座';
    if ((date >= 923 && date <= 930) || (date >= 1001 && date <= 1023)) return 'てんびん座';
    if ((date >= 1024 && date <= 1031) || (date >= 1101 && date <= 1122)) return 'さそり座';
    if ((date >= 1123 && date <= 1130) || (date >= 1201 && date <= 1221)) return 'いて座';
    if ((date >= 1222 && date <= 1231) || (date >= 101 && date <= 119)) return 'やぎ座';
    if ((date >= 120 && date <= 131) || (date >= 201 && date <= 218)) return 'みずがめ座';
    if ((date >= 219 && date <= 229) || (date >= 301 && date <= 320)) return 'うお座';

    return 'おひつじ座'; // デフォルト
  }
}

// グローバルで使用可能にする
window.StarYomiSystem = StarYomiSystem;