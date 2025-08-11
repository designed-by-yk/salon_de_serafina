// 神託システムエンジン（Gemini API完全生成版）
class OracleSystem {
    constructor() {
        this.apiKey = 'AIzaSyAcZsBj4YVN8x_7RzInpKaLG-CywGjOotI';
    }

    async generateReading(consultationData) {
        console.log('🌟 神託システム開始:', consultationData);
        
        // カードを選択
        const cards = drawThematicCards(consultationData.focusArea);
        
        try {
            if (this.apiKey && this.apiKey !== 'YOUR_GEMINI_API_KEY_HERE') {
                console.log('✨ Gemini API完全生成モード');
                return await this.generateWithGeminiAPI(consultationData, cards);
            } else {
                console.log('🎯 フォールバック鑑定モード');
                return this.generateSimpleFallback(consultationData, cards);
            }
        } catch (error) {
            console.error('💥 鑑定エラー:', error);
            return this.generateSimpleFallback(consultationData, cards);
        }
    }

    async generateWithGeminiAPI(consultationData, cards) {
        const prompt = this.buildNaturalPrompt(consultationData, cards);
        
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
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
                    cards: cards,
                    reading: reading,
                    actionPlan: this.generateSimpleActionPlan(consultationData.focusArea),
                    timestamp: new Date().toISOString()
                };
            } else {
                throw new Error('Invalid API response');
            }
        } catch (error) {
            console.error('API Error:', error);
            return this.generateSimpleFallback(consultationData, cards);
        }
    }

    buildNaturalPrompt(consultationData, cards) {
        const age = this.calculateAge(consultationData.birthdate);
        const zodiac = this.getZodiacSign(consultationData.birthdate);
        
        return `
あなたは占い師Serafinaです。
以下の相談に対して、2000-3000文字の自然な鑑定文を書いてください。

【重要】
- 定型文は使わない
- 相談内容に深く寄り添う
- カードの意味を相談内容に合わせて解釈
- 同じ表現を繰り返さない
- まるで対面で話しているような自然な文章
- 相談者の名前「${consultationData.name}さん」を文中に3-4回自然に織り込む

相談内容：${consultationData.consultation}

引いたカード：
1. ${cards[0].position}：${cards[0].name}${cards[0].isUpright ? '(正位置)' : '(逆位置)'} - ${cards[0].meaning}
2. ${cards[1].position}：${cards[1].name}${cards[1].isUpright ? '(正位置)' : '(逆位置)'} - ${cards[1].meaning}
3. ${cards[2].position}：${cards[2].name}${cards[2].isUpright ? '(正位置)' : '(逆位置)'} - ${cards[2].meaning}

相談者情報：${consultationData.name}さん（${age}歳・${zodiac}）

必ず以下の構成で：
1. 相談者の気持ちに共感（その人の言葉を引用して）
2. 各カードを相談内容に合わせて解釈
3. 具体的で実践的なアドバイス
4. 個人鑑定への自然な誘導「より深い鑑定をご希望でしたら、セラフィナの個人鑑定もご利用ください」
5. 温かい締めの言葉

温かく、愛情深く、希望に満ちた鑑定文を心を込めて書いてください。
        `;
    }

    generateSimpleFallback(consultationData, cards) {
        const age = this.calculateAge(consultationData.birthdate);
        const zodiac = this.getZodiacSign(consultationData.birthdate);
        
        const reading = `
${consultationData.name}さん、ご相談をいただきありがとうございます。

「${consultationData.consultation}」というお悩みを読ませていただき、あなたの真摯なお気持ちが伝わってきました。

選ばれたカードからのメッセージをお伝えいたします。

${cards[0].position}の「${cards[0].name}」は、現在のあなたの状況を表しています。${cards[0].interpretation}

${cards[1].position}の「${cards[1].name}」は、状況の背景や原因を示しています。${cards[1].interpretation}

${cards[2].position}の「${cards[2].name}」は、これからの展開を暗示しています。${cards[2].interpretation}

${age}歳の${zodiac}である${consultationData.name}さんには、きっと素晴らしい未来が待っています。

現在はAPIの調整中のため、より詳細な鑑定をご希望の場合は、セラフィナの個人鑑定をご利用ください。

あなたの幸せを心から願っています。
        `;

        return {
            cards: cards,
            reading: reading.trim(),
            actionPlan: this.generateSimpleActionPlan(consultationData.focusArea),
            timestamp: new Date().toISOString()
        };
    }

    generateSimpleActionPlan(focusArea) {
        const actionPlans = {
            love: [
                "自分の気持ちを素直に表現してみましょう",
                "相手の立場に立って考える時間を作りましょう",
                "日々の小さな感謝を大切にしましょう"
            ],
            work: [
                "新しいスキル習得に挑戦してみましょう",
                "職場での人間関係を大切にしましょう",
                "目標を明確にして計画を立てましょう"
            ],
            default: [
                "毎日少しずつ前進することを心がけましょう",
                "信頼できる人に相談してみましょう",
                "自分を大切にする時間を作りましょう"
            ]
        };
        
        return actionPlans[focusArea] || actionPlans.default;
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

    getZodiacSign(birthdate) {
        const date = new Date(birthdate);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        
        if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return '山羊座';
        if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return '水瓶座';
        if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return '魚座';
        if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return '牡羊座';
        if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return '牡牛座';
        if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return '双子座';
        if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return '蟹座';
        if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return '獅子座';
        if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return '乙女座';
        if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) return '天秤座';
        if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) return '蠍座';
        if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) return '射手座';
        
        return '山羊座';
    }


}

// ユーザー情報取得関数
function getUserInfo() {
    const consultationData = JSON.parse(localStorage.getItem('consultationData') || '{}');
    return {
        name: consultationData.name || 'ゲスト',
        birthdate: consultationData.birthdate || '',
        focusArea: consultationData.focusArea || 'default'
    };
}

// 鑑定結果の保存
function saveReading(reading) {
    localStorage.setItem('lastReading', JSON.stringify(reading));
    localStorage.setItem('readingHistory', JSON.stringify(
        [...getReadingHistory(), { ...reading, id: Date.now() }]
    ));
}

// 鑑定履歴の取得
function getReadingHistory() {
    return JSON.parse(localStorage.getItem('readingHistory') || '[]');
}
