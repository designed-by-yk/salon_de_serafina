// 神託システムエンジン（修正版）
class OracleSystem {
    constructor() {
        this.apiKey = 'AIzaSyAcZsBj4YVN8x_7RzInpKaLG-CywGjOotI';
        this.systemPrompt = this.buildSystemPrompt();
        this.readingTemplates = this.initializeReadingTemplates();
    }

    buildSystemPrompt() {
        return `
あなたは経験豊かな占い師セラフィナです。相談者の心に深く寄り添い、温かく包み込むような鑑定を行ってください。

【鑑定の基本方針】
1. 相談者の気持ちを完全に理解し、共感することから始める
2. 一人ひとりの人生を大切に扱い、個別性を重視する
3. 希望と勇気を与え、前向きな気持ちにさせる
4. 具体的で実践可能なアドバイスを提供する
5. 2000-3000文字の詳細で心のこもった鑑定文を作成する

【詳細な文章構成（必須）】
1. 【心のこもった挨拶】（200-300文字）
2. 【現在の状況への深い洞察】（400-500文字）
3. 【潜在意識からのメッセージ】（400-500文字）
4. 【未来への道筋】（400-500文字）
5. 【具体的な行動指針】（400-500文字）
6. 【愛と励ましの締めくくり】（200-300文字）

相談者が読み終わった時に、心が温かくなり、明日への希望を感じられるような、愛情深い鑑定文を心を込めて作成してください。
        `;
    }

    initializeReadingTemplates() {
        return {
            love: {
                opening: [
                    "恋愛のお悩み、とても大切なことですね。あなたの心の声をしっかりと受け取らせていただきました。",
                    "愛に関するご相談をいただき、ありがとうございます。あなたの優しい心が伝わってきます。"
                ]
            },
            work: {
                opening: [
                    "お仕事に関するご相談、現代社会で多くの方が抱える大切な問題ですね。",
                    "キャリアについて真剣に考えていらっしゃる姿勢が素晴らしいです。"
                ]
            },
            default: {
                opening: [
                    "ご相談をいただき、ありがとうございます。あなたの真摯な気持ちが伝わってきます。"
                ]
            }
        };
    }

    async generateReading(consultationData) {
        console.log('🌟 神託システム開始:', consultationData);
        
        try {
            if (this.apiKey && this.apiKey !== 'YOUR_GEMINI_API_KEY_HERE') {
                console.log('✨ Gemini API鑑定モード');
                return await this.generateWithAPI(consultationData);
            } else {
                console.log('🎯 フォールバック鑑定モード');
                return this.generateFallbackReading(consultationData);
            }
        } catch (error) {
            console.error('💥 鑑定エラー:', error);
            return this.generateFallbackReading(consultationData);
        }
    }

    async generateWithAPI(consultationData) {
        const cards = drawThematicCards(consultationData.focusArea);
        const prompt = this.buildPrompt(consultationData, cards);
        
        try {
            const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + this.apiKey, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.8,
                        topK: 40,
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
                return this.formatAPIReading(reading, cards, consultationData);
            } else {
                throw new Error('Invalid API response');
            }
        } catch (error) {
            console.error('API Error:', error);
            return this.generateFallbackReading(consultationData);
        }
    }

    buildPrompt(consultationData, cards) {
        const cardsText = cards.map(card => 
            `${card.position}: ${card.name}${card.isUpright ? '(正位置)' : '(逆位置)'} - ${card.meaning}`
        ).join('\n');

        const consultationKeywords = this.extractKeywords(consultationData.consultation);
        const personalInsights = this.generatePersonalInsights(consultationData);

        return `${this.systemPrompt}

【相談者情報】
名前: ${consultationData.name}
年齢: ${this.calculateAge(consultationData.birthdate)}歳
星座: ${this.getZodiacSign(consultationData.birthdate)}
相談分野: ${this.getFocusAreaName(consultationData.focusArea)}

【相談内容】
"${consultationData.consultation}"
キーワード: ${consultationKeywords.join('、')}

【個人的特徴】
${personalInsights}

【選ばれたタロットカード】
${cardsText}

上記の情報を基に、${consultationData.name}さんだけの完全オリジナルな鑑定文を作成してください。`;
    }

    generateFallbackReading(consultationData) {
        const cards = drawThematicCards(consultationData.focusArea);
        const reading = this.createDetailedReading(consultationData, cards);
        const actionPlan = this.generateActionPlan(consultationData.focusArea, cards);

        return {
            cards: cards,
            reading: reading,
            actionPlan: actionPlan,
            timestamp: new Date().toISOString()
        };
    }

    createDetailedReading(consultationData, cards) {
        const consultationKeywords = this.extractKeywords(consultationData.consultation);
        const age = this.calculateAge(consultationData.birthdate);
        const zodiac = this.getZodiacSign(consultationData.birthdate);
        
        let reading = '';
        
        // 1. 心のこもった挨拶
        reading += `${consultationData.name}さん、この度は神託システムタロット占いにご相談いただき、心から感謝申し上げます。`;
        reading += `「${consultationData.consultation.substring(0, 50)}...」というお悩みを拝読させていただき、その真摯なお気持ちが私の心にもそっと伝わってまいりました。`;
        reading += `${age}歳の${zodiac}の${consultationData.name}さんが、${this.getFocusAreaName(consultationData.focusArea)}について真剣に向き合っていらっしゃることが、文面からも深く感じられます。`;
        reading += `どうぞ安心してください。神託システムが選び出したカードたちが、あなたの心に寄り添う温かなメッセージを運んでくれています。\n\n`;

        // 2. 現在の状況への深い洞察
        reading += `【現在のあなたの状況について】\n`;
        reading += `神託システムが選び出した3枚のカードを通して、${consultationData.name}さんの現在の状況を詳しく見てみましょう。\n\n`;
        
        cards.forEach((card, index) => {
            reading += `${card.position}の位置に現れた「${card.name}」は、`;
            if (card.isUpright) {
                reading += `正位置で現れており、${card.interpretation} この時期のあなたは、${card.keywords.slice(0, 2).join('や')}といったエネルギーに包まれています。`;
            } else {
                reading += `逆位置で現れており、${card.interpretation} 今は少し立ち止まって、内なる声に耳を傾ける大切な時期なのかもしれません。`;
            }
            reading += `\n\n`;
        });

        // 3. 潜在意識からのメッセージ
        reading += `【あなたの潜在意識が伝えたいこと】\n`;
        reading += `${consultationData.name}さん、カードたちはあなたの潜在意識に眠る美しい真実を教えてくれています。`;
        reading += `特に今回のご相談「${consultationData.consultation.substring(0, 80)}」について、`;
        if (consultationKeywords.length > 0) {
            reading += `「${consultationKeywords[0]}」というキーワードが重要な意味を持っています。`;
        }
        reading += `表面的には困難に感じられる現在の状況も、実はあなたの魂が次のステージへと進むための大切な準備期間なのです。\n\n`;

        // 4. 未来への道筋
        const futureCard = cards.find(c => c.position === '未来・結果') || cards[2];
        reading += `【未来への美しい道筋】\n`;
        reading += `${futureCard.name}のカードが未来の位置に現れたということは、とても希望に満ちた展開が待っています。`;
        reading += `3ヶ月後の${this.getSeasonalReference()}頃には、${futureCard.keywords[0]}や${futureCard.keywords[1] || '新しい可能性'}といった、素晴らしい変化を実感されることでしょう。\n\n`;

        // 5. 具体的な行動指針
        reading += `【今すぐ始められる具体的なアクション】\n`;
        reading += `${consultationData.name}さんに今お勧めしたいのは、まず朝起きた時に「今日も素晴らしい一日になる」と心の中で唱えることです。`;
        reading += `小さなことのように思えますが、この習慣があなたの潜在意識に明るい変化をもたらします。\n\n`;

        // 6. 愛と励ましの締めくくり
        reading += `【あなたへの愛と励ましのメッセージ】\n`;
        reading += `${consultationData.name}さん、あなたはこれまで本当によく頑張ってこられました。`;
        reading += `その優しい心と強い意志は、必ずあなたを幸せな未来へと導いてくれます。`;
        reading += `私は心の底から確信しています。${consultationData.name}さんの未来は、光に満ち溢れた美しいものとなることを。`;

        return reading;
    }

    extractKeywords(consultation) {
        const keywords = [];
        const patterns = {
            '恋愛': ['恋愛', '恋人', '彼氏', '彼女', '好き', '愛', 'パートナー', '結婚', '交際'],
            '仕事': ['仕事', '職場', '転職', 'キャリア', '上司', '同僚', '会社', '昇進'],
            '人間関係': ['友達', '友人', '家族', '親', '子供', '関係', '人間関係'],
            '将来': ['将来', '未来', '夢', '目標', '希望', '不安', '心配']
        };
        
        const lowerConsultation = consultation.toLowerCase();
        for (const [category, words] of Object.entries(patterns)) {
            for (const word of words) {
                if (lowerConsultation.includes(word)) {
                    keywords.push(word);
                }
            }
        }
        
        return [...new Set(keywords)].slice(0, 5);
    }

    generatePersonalInsights(consultationData) {
        const age = this.calculateAge(consultationData.birthdate);
        const zodiac = this.getZodiacSign(consultationData.birthdate);
        
        let insights = `${age}歳の${zodiac}の方として、`;
        
        if (age < 25) {
            insights += '人生の基盤を築く大切な時期にいらっしゃいます。';
        } else if (age < 35) {
            insights += 'キャリアや人生の方向性を確立する重要な時期です。';
        } else if (age < 50) {
            insights += '人生の中核を担う充実期にあります。';
        } else {
            insights += '豊富な人生経験と知恵を持つ素晴らしい時期です。';
        }
        
        return insights;
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

    getFocusAreaName(focusArea) {
        const areaMap = {
            'love': '恋愛・パートナーシップ',
            'work': '仕事・キャリア',
            'relationship': '人間関係',
            'money': '金運・財運',
            'health': '健康・ライフスタイル',
            'future': '将来・人生の方向性',
            'other': 'その他'
        };
        
        return areaMap[focusArea] || 'その他';
    }

    generateActionPlan(focusArea, cards) {
        const baseActions = {
            love: ["自分の気持ちを素直に表現する練習をしましょう", "相手との共通の趣味や関心事を見つけてみてください"],
            work: ["新しいスキル習得のための学習計画を立てましょう", "職場の人間関係を積極的に築いていきましょう"],
            default: ["毎日少しずつでも前進する習慣を作りましょう", "信頼できる人に相談することを恐れないでください"]
        };

        return baseActions[focusArea] || baseActions.default;
    }

    getSeasonalReference() {
        const month = new Date().getMonth() + 1;
        if (month >= 3 && month <= 5) return "春の訪れの";
        if (month >= 6 && month <= 8) return "夏の盛りの";
        if (month >= 9 && month <= 11) return "秋の深まりの";
        return "冬の静寂の";
    }

    formatAPIReading(reading, cards, consultationData) {
        const actionPlan = this.generateActionPlan(consultationData.focusArea, cards);
        
        return {
            cards: cards,
            reading: reading,
            actionPlan: actionPlan,
            timestamp: new Date().toISOString()
        };
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



