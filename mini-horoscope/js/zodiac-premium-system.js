// 星詠みシステム - 天体運勢鑑定
class ZodiacPremiumSystem {
  constructor() {
    this.apiKey = 'AIzaSyDB5vNo-R-MzX1JAq1vvBc8c7LJh7BigCI'; // ←ここにAPIキーを設定
    this.apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
    
    this.systemPrompt = `
あなたは占い師Serafinaです。
星詠みシステムを使って星座と誕生日から詳細な月間運勢を鑑定します。

【重要ルール】
- 自然な長さで丁寧に作成
- 同じ表現を繰り返さない
- 温かく寄り添う文章
- 相談者の名前を自然に3-4回織り込む
- 具体的で実践的なアドバイス

【必須構成】
1. 挨拶と共感
   「○月○日生まれの〇〇座のあなたは...」で始める

2. 今月の総合運
   運気の流れと全体的な傾向

3. 恋愛運
   具体的なアドバイスと行動指針

4. 仕事運
   実践的な提案とチャンス

5. 金運
   お金の流れと注意点

6. ラッキーデー
   3つの重要な日付と理由

7. 開運アクション
   5つの具体的行動

8. 締めと個人鑑定への誘導
   「より深い鑑定をご希望でしたら、セラフィナの個人鑑定もご利用ください」
   
【トーン】
- 温かく愛情深い
- 希望に満ちた
- 具体的で実用的
- エンパワーメント重視`;
  }

  async generateReading(userData) {
    console.log('🌟 星詠みシステム鑑定開始:', userData);
    
    const zodiacSign = this.getZodiacSign(userData.birthdate);
    const age = this.calculateAge(userData.birthdate);
    const [year, month, day] = userData.birthdate.split('-');
    
    const prompt = this.buildDetailedPrompt(userData, zodiacSign, age, month, day);
    
    try {
      if (this.apiKey && this.apiKey !== 'YOUR_ZODIAC_API_KEY_HERE') {
        console.log('✨ 星詠みシステム完全生成モード');
        return await this.generateWithGeminiAPI(prompt, userData);
      } else {
        console.log('🎯 フォールバック鑑定モード');
        return this.generateFallbackReading(userData, zodiacSign);
      }
    } catch (error) {
      console.error('💥 鑑定エラー:', error);
      return this.generateFallbackReading(userData, zodiacSign);
    }
  }

  buildDetailedPrompt(userData, zodiacSign, age, month, day) {
    return `
${this.systemPrompt}

相談者情報：
- 名前：${userData.name}様
- 誕生日：${month}月${day}日
- 年齢：${age}歳
- 星座：${zodiacSign}
- 相談内容：${userData.consultation || '総合運を知りたい'}

この方の今月の詳細運勢を鑑定してください。
${userData.name}さんの人生がより豊かになるよう、心を込めて鑑定文を作成してください。`;
  }

  async generateWithGeminiAPI(prompt, userData) {
    try {
      const response = await fetch(`${this.apiEndpoint}?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.9,
            topK: 50,
            topP: 0.95,
            maxOutputTokens: 4096,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const reading = data.candidates[0].content.parts[0].text;
        
        return {
          reading: reading,
          luckyDays: this.extractLuckyDays(reading),
          actionPlan: this.generateActionPlan(userData),
          source: 'gemini_api'
        };
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (error) {
      console.error('Gemini API エラー:', error);
      throw error;
    }
  }

  generateFallbackReading(userData, zodiacSign) {
    const month = new Date().getMonth() + 1;
    
    return {
      reading: `
${userData.name}様、${zodiacSign}のあなたの今月の運勢をお伝えします。

【総合運】
${zodiacSign}の${userData.name}さんにとって、今月は新しい可能性が開ける月となります。特に人間関係の面で素晴らしい展開が期待できます。

【恋愛運】
パートナーとの絆が深まる時期です。シングルの方は、意外な場所での出会いに注目してください。

【仕事運】
創造性が高まり、新しいアイデアが評価される時期です。積極的に提案してみましょう。

【金運】
計画的な支出を心がけることで、安定した金運を維持できます。

【ラッキーデー】
5日、15日、25日が特に幸運な日となります。

【開運アクション】
1. 朝の散歩を習慣化する
2. 新しいスキルを学ぶ
3. 感謝の気持ちを言葉にする
4. 整理整頓を心がける
5. 質の良い睡眠を取る

より深い鑑定をご希望でしたら、セラフィナの個人鑑定もご利用ください。`,
      luckyDays: ['5日', '15日', '25日'],
      actionPlan: this.generateActionPlan(userData),
      source: 'fallback'
    };
  }

  extractLuckyDays(reading) {
    // 読み取り結果からラッキーデーを抽出
    const matches = reading.match(/(\d{1,2}日)/g);
    return matches ? matches.slice(0, 3) : ['5日', '15日', '25日'];
  }

  generateActionPlan(userData) {
    const actions = [
      '朝の瞑想を5分間行う',
      '新しい本を読む',
      '感謝日記をつける',
      '自然と触れ合う時間を作る',
      '大切な人に連絡を取る'
    ];
    
    return actions;
  }

  getZodiacSign(birthdate) {
    const date = new Date(birthdate);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return "牡羊座";
    if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return "牡牛座";
    if ((month == 5 && day >= 21) || (month == 6 && day <= 21)) return "双子座";
    if ((month == 6 && day >= 22) || (month == 7 && day <= 22)) return "蟹座";
    if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return "獅子座";
    if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return "乙女座";
    if ((month == 9 && day >= 23) || (month == 10 && day <= 23)) return "天秤座";
    if ((month == 10 && day >= 24) || (month == 11 && day <= 22)) return "蠍座";
    if ((month == 11 && day >= 23) || (month == 12 && day <= 21)) return "射手座";
    if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) return "山羊座";
    if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return "水瓶座";
    if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return "魚座";
    
    return "牡羊座"; // デフォルト
  }

  calculateAge(birthdate) {
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  // テスト用のAPI接続確認
  async testConnection() {
    try {
      const testPrompt = "こんにちは、テストです。";
      const response = await fetch(`${this.apiEndpoint}?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: testPrompt }] }]
        })
      });
      
      console.log('API接続テスト結果:', response.ok ? '成功' : '失敗');
      return response.ok;
    } catch (error) {
      console.error('API接続テストエラー:', error);
      return false;
    }
  }
}
