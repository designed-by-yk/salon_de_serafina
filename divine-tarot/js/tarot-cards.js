// タロットカードデータベース
const TAROT_CARDS = {
    majorArcana: [
        {
            id: 0,
            name: "愚者",
            englishName: "The Fool",
            imagePath: "images/1.fool.jpg",
            keywords: ["新しい始まり", "冒険", "自由", "可能性"],
            upright: {
                meaning: "新たなスタート、無限の可能性、自由な精神",
                interpretation: "あなたには無限の可能性が広がっています。恐れずに新しい一歩を踏み出す時です。"
            },
            reversed: {
                meaning: "軽率さ、無責任、計画性の欠如",
                interpretation: "慎重さが必要な時期です。衝動的な判断は避け、しっかりとした計画を立てましょう。"
            }
        },
        {
            id: 1,
            name: "魔術師",
            englishName: "The Magician",
            imagePath: "images/2.magician.jpg",
            keywords: ["意志力", "創造", "技術", "集中"],
            upright: {
                meaning: "強い意志力、創造力、目標達成の力",
                interpretation: "あなたには必要なすべての力が備わっています。意志を集中させることで願いを実現できるでしょう。"
            },
            reversed: {
                meaning: "力の悪用、操作、詐欺",
                interpretation: "自分の能力を正しく使うことが大切です。他者を操ろうとせず、誠実さを保ちましょう。"
            }
        },
        {
            id: 2,
            name: "女教皇",
            englishName: "The High Priestess",
            imagePath: "images/3.high-priestess.jpg",
            keywords: ["直感", "内なる知識", "神秘", "潜在意識"],
            upright: {
                meaning: "直感の声、内なる知恵、精神的な洞察",
                interpretation: "あなたの直感が答えを知っています。静寂の中で内なる声に耳を傾けてください。"
            },
            reversed: {
                meaning: "直感の無視、表面的思考、秘密の露呈",
                interpretation: "内なる声を無視していませんか。もっと深く自分自身と向き合う必要があります。"
            }
        },
        {
            id: 3,
            name: "女帝",
            englishName: "The Empress",
            imagePath: "images/4.empress.jpg",
            keywords: ["豊穣", "母性", "創造", "自然"],
            upright: {
                meaning: "豊かさ、創造性、母性愛、自然との調和",
                interpretation: "あなたの周りには豊かさが満ちています。創造的な力を信じ、愛情深く行動しましょう。"
            },
            reversed: {
                meaning: "依存、過保護、創造性の枯渇",
                interpretation: "自立心を育む時です。他者への過度な依存や干渉は避け、バランスを保ちましょう。"
            }
        },
        {
            id: 4,
            name: "皇帝",
            englishName: "The Emperor",
            imagePath: "images/5.emperor.jpg",
            keywords: ["権威", "安定", "責任", "リーダーシップ"],
            upright: {
                meaning: "権威、統制力、安定した基盤、責任感",
                interpretation: "あなたにはリーダーとしての資質があります。責任をもって決断し、安定した基盤を築きましょう。"
            },
            reversed: {
                meaning: "専制、頑固さ、権力の乱用",
                interpretation: "頑固になりすぎていませんか。柔軟性を持ち、他者の意見にも耳を傾けることが大切です。"
            }
        },
        {
            id: 5,
            name: "教皇",
            englishName: "The Hierophant",
            imagePath: "images/6.hierophant.jpg",
            keywords: ["伝統", "教育", "精神的指導", "信念"],
            upright: {
                meaning: "精神的指導、伝統的価値、学習、信念",
                interpretation: "伝統や教えの中に智慧があります。信頼できる指導者からの助言を求めてみましょう。"
            },
            reversed: {
                meaning: "独断、反抗、新しい道の模索",
                interpretation: "既存の枠にとらわれず、自分なりの道を見つける時期かもしれません。"
            }
        },
        {
            id: 6,
            name: "恋人",
            englishName: "The Lovers",
            imagePath: "images/7.lovers.jpg",
            keywords: ["愛", "選択", "調和", "結合"],
            upright: {
                meaning: "真の愛、重要な選択、調和、パートナーシップ",
                interpretation: "重要な選択の時です。心の声に従い、愛と調和を基盤とした決断をしましょう。"
            },
            reversed: {
                meaning: "不調和、誤った選択、関係の問題",
                interpretation: "関係性を見直す必要があります。自分の価値観を明確にし、正しい選択をしましょう。"
            }
        },
        {
            id: 7,
            name: "戦車",
            englishName: "The Chariot",
            imagePath: "images/8.chariot.jpg",
            keywords: ["勝利", "意志力", "前進", "コントロール"],
            upright: {
                meaning: "勝利、強い意志、前進する力、自制心",
                interpretation: "困難を乗り越える力があなたにはあります。強い意志を持って前進し続けましょう。"
            },
            reversed: {
                meaning: "敗北、方向性の混乱、自制心の欠如",
                interpretation: "一度立ち止まり、方向性を見直す必要があります。感情をコントロールし、冷静に判断しましょう。"
            }
        },
        {
            id: 8,
            name: "力",
            englishName: "Strength",
            imagePath: "images/9.strength.jpg",
            keywords: ["内なる力", "勇気", "忍耐", "自制"],
            upright: {
                meaning: "内なる力、勇気、忍耐力、精神的な強さ",
                interpretation: "あなたには困難を乗り越える内なる力があります。優しさと強さを兼ね備えて進みましょう。"
            },
            reversed: {
                meaning: "弱さ、自信の欠如、感情の乱れ",
                interpretation: "自分の弱さを受け入れ、それを強さに変える時です。内なる力を信じましょう。"
            }
        },
        {
            id: 9,
            name: "隠者",
            englishName: "The Hermit",
            imagePath: "images/10.hermit.jpg",
            keywords: ["内省", "探求", "孤独", "智慧"],
            upright: {
                meaning: "内省、精神的探求、智慧の探求、一人の時間",
                interpretation: "一人の時間を大切にし、内なる智慧を探求しましょう。答えはあなたの中にあります。"
            },
            reversed: {
                meaning: "孤立、内向きすぎ、助言の拒否",
                interpretation: "一人になりすぎていませんか。時には他者との繋がりも大切にしましょう。"
            }
        },
        {
            id: 10,
            name: "運命の輪",
            englishName: "Wheel of Fortune",
            imagePath: "images/11.wheel-of-fortune.jpg",
            keywords: ["運命", "変化", "チャンス", "サイクル"],
            upright: {
                meaning: "好機、運命的な変化、新しいサイクルの始まり",
                interpretation: "人生の転換期が訪れています。変化を恐れず、新しいチャンスを掴みましょう。"
            },
            reversed: {
                meaning: "不運、停滞、変化への抵抗",
                interpretation: "困難な時期ですが、これも一時的なものです。変化を受け入れる準備をしましょう。"
            }
        },
        {
            id: 11,
            name: "正義",
            englishName: "Justice",
            imagePath: "images/12.justice.jpg",
            keywords: ["正義", "バランス", "責任", "公平"],
            upright: {
                meaning: "公正な判断、バランス、責任、真実",
                interpretation: "公正で責任ある行動が求められています。バランスを保ち、正しい道を歩みましょう。"
            },
            reversed: {
                meaning: "不公平、偏見、責任逃れ",
                interpretation: "偏見や先入観に囚われていませんか。公正な視点で物事を見つめ直しましょう。"
            }
        },
        {
            id: 12,
            name: "吊された男",
            englishName: "The Hanged Man",
            imagePath: "images/13.hanged-man.jpg",
            keywords: ["犠牲", "忍耐", "新しい視点", "停滞"],
            upright: {
                meaning: "犠牲、忍耐、新しい視点、精神的成長",
                interpretation: "今は待つ時です。新しい視点から物事を見ることで、重要な気づきが得られるでしょう。"
            },
            reversed: {
                meaning: "無駄な犠牲、停滞からの脱出、焦り",
                interpretation: "無駄な犠牲を払っていませんか。状況を変える行動を起こす時かもしれません。"
            }
        },
        {
            id: 13,
            name: "死神",
            englishName: "Death",
            imagePath: "images/14.death.jpg",
            keywords: ["変容", "終わり", "再生", "新しい始まり"],
            upright: {
                meaning: "大きな変化、終わりと始まり、変容、再生",
                interpretation: "古いものが終わり、新しいものが始まります。変化を恐れず、再生のプロセスを受け入れましょう。"
            },
            reversed: {
                meaning: "変化への抵抗、停滞、恐れ",
                interpretation: "変化を恐れていませんか。抵抗せずに自然な流れに身を任せることが大切です。"
            }
        },
        {
            id: 14,
            name: "節制",
            englishName: "Temperance",
            imagePath: "images/15.temperance.jpg",
            keywords: ["調和", "バランス", "統合", "癒し"],
            upright: {
                meaning: "調和、バランス、統合、癒しの力",
                interpretation: "異なる要素を調和させる時です。バランスを保ち、穏やかな心で進みましょう。"
            },
            reversed: {
                meaning: "不調和、極端、バランスの欠如",
                interpretation: "極端に走りすぎていませんか。中庸の道を見つけ、バランスを取り戻しましょう。"
            }
        },
        {
            id: 15,
            name: "悪魔",
            englishName: "The Devil",
            imagePath: "images/16.devil.jpg",
            keywords: ["誘惑", "束縛", "物質主義", "依存"],
            upright: {
                meaning: "誘惑、束縛、物質への執着、依存",
                interpretation: "何かに束縛されていませんか。自分を縛る鎖を認識し、解放への第一歩を踏み出しましょう。"
            },
            reversed: {
                meaning: "解放、自由、束縛からの脱出",
                interpretation: "束縛から解放される時が来ました。自由を取り戻し、真の自分を見つけましょう。"
            }
        },
        {
            id: 16,
            name: "塔",
            englishName: "The Tower",
            imagePath: "images/17.tower.jpg",
            keywords: ["破壊", "突然の変化", "啓示", "解放"],
            upright: {
                meaning: "突然の変化、破壊と再生、啓示、解放",
                interpretation: "突然の変化が訪れますが、これは必要なプロセスです。古い構造を壊し、新しい基盤を築きましょう。"
            },
            reversed: {
                meaning: "内なる変化、災難の回避、抵抗",
                interpretation: "外的な変化ではなく、内なる変化が必要です。自分自身を見つめ直しましょう。"
            }
        },
        {
            id: 17,
            name: "星",
            englishName: "The Star",
            imagePath: "images/18.star.jpg",
            keywords: ["希望", "インスピレーション", "癒し", "導き"],
            upright: {
                meaning: "希望、インスピレーション、癒し、精神的な導き",
                interpretation: "希望の光が見えています。あなたの夢と願いは実現可能です。星の導きを信じましょう。"
            },
            reversed: {
                meaning: "絶望、希望の喪失、方向性の迷い",
                interpretation: "希望を失いそうになっていますが、必ず光は差します。内なる星を再び輝かせましょう。"
            }
        },
        {
            id: 18,
            name: "月",
            englishName: "The Moon",
            imagePath: "images/19.moon.jpg",
            keywords: ["幻想", "不安", "潜在意識", "直感"],
            upright: {
                meaning: "幻想、不安、潜在意識からのメッセージ、直感",
                interpretation: "物事が曖昧に見える時期ですが、直感を信じて進みましょう。潜在意識があなたを導いています。"
            },
            reversed: {
                meaning: "真実の発見、幻想からの解放、明確さ",
                interpretation: "混乱していた状況が明確になります。真実が見えてくるでしょう。"
            }
        },
        {
            id: 19,
            name: "太陽",
            englishName: "The Sun",
            imagePath: "images/20.sun.jpg",
            keywords: ["成功", "喜び", "活力", "達成"],
            upright: {
                meaning: "成功、喜び、活力、達成感、幸福",
                interpretation: "素晴らしい成功と喜びが待っています。あなたの努力が実を結び、幸福な時期が訪れます。"
            },
            reversed: {
                meaning: "一時的な挫折、喜びの遅れ、過度の楽観",
                interpretation: "一時的な困難がありますが、最終的には成功へと導かれます。"
            }
        },
        {
            id: 20,
            name: "審判",
            englishName: "Judgement",
            imagePath: "images/21.judgement.jpg",
            keywords: ["復活", "再生", "覚醒", "新しい人生"],
            upright: {
                meaning: "復活、再生、覚醒、人生の新章",
                interpretation: "人生の新しい章が始まります。過去を清算し、生まれ変わった自分として歩み始めましょう。"
            },
            reversed: {
                meaning: "自己批判、過去への執着、変化の拒否",
                interpretation: "過去に囚われていませんか。自分を許し、新しいスタートを切る準備をしましょう。"
            }
        },
        {
            id: 21,
            name: "世界",
            englishName: "The World",
            imagePath: "images/22.world.jpg",
            keywords: ["完成", "達成", "統合", "成就"],
            upright: {
                meaning: "完成、達成、統合、目標の成就",
                interpretation: "長い旅路の終わりと新しい始まりです。すべてが統合され、完全な達成感を味わえるでしょう。"
            },
            reversed: {
                meaning: "未完成、達成の遅れ、統合の欠如",
                interpretation: "もう一歩で完成です。諦めずに最後まで努力を続けましょう。"
            }
        }
    ],
    
    // 小アルカナ - ワンド（情熱・創造・仕事）
    wands: [
        {
            id: 22, name: "ワンドのエース", englishName: "Ace of Wands", imagePath: "images/23.ace-of-wands.jpg",
            keywords: ["新しい始まり", "創造力", "情熱", "インスピレーション"],
            upright: { meaning: "新しいプロジェクトの始まり、創造的エネルギー", interpretation: "新しい創造的なプロジェクトが始まります。情熱を持って取り組みましょう。" },
            reversed: { meaning: "計画の遅れ、創造力の枯渇", interpretation: "新しいアイデアを見つけるために、少し休息が必要かもしれません。" }
        },
        {
            id: 23, name: "ワンドの2", englishName: "Two of Wands", imagePath: "images/24.2-wands.jpg",
            keywords: ["計画", "未来への展望", "決断", "パートナーシップ"],
            upright: { meaning: "将来の計画、長期的な視野", interpretation: "将来への明確なビジョンを持つ時です。計画を具体化していきましょう。" },
            reversed: { meaning: "計画の変更、視野の狭さ", interpretation: "計画の見直しが必要です。より広い視野を持ってください。" }
        },
        {
            id: 24, name: "ワンドの3", englishName: "Three of Wands", imagePath: "images/25.3-wands.jpg",
            keywords: ["拡張", "展望", "成長", "冒険"],
            upright: { meaning: "事業の拡張、新しい機会", interpretation: "あなたの努力が実を結び、新しい機会が広がります。" },
            reversed: { meaning: "計画の遅れ、機会の見逃し", interpretation: "タイミングを見極めることが大切です。焦らず準備を整えましょう。" }
        },
        {
            id: 25, name: "ワンドの4", englishName: "Four of Wands", imagePath: "images/26.4-wands.jpg",
            keywords: ["祝福", "安定", "調和", "達成"],
            upright: { meaning: "目標達成、祝福、家庭の調和", interpretation: "重要なマイルストーンに到達しました。成果を祝い、次のステップに進みましょう。" },
            reversed: { meaning: "不安定、達成感の欠如", interpretation: "安定を求める気持ちが強くなっています。基盤作りに集中しましょう。" }
        },
        {
            id: 26, name: "ワンドの5", englishName: "Five of Wands", imagePath: "images/27.5-wands.jpg",
            keywords: ["競争", "争い", "挑戦", "対立"],
            upright: { meaning: "健全な競争、挑戦への意欲", interpretation: "競争を恐れずに挑戦することで成長できます。" },
            reversed: { meaning: "内なる対立、争いの回避", interpretation: "無駄な争いは避け、協調を大切にしましょう。" }
        },
        {
            id: 25, name: "ワンドの6", englishName: "Six of Wands", imagePath: "images/28.6-wands.jpg",
            keywords: ["勝利", "成功", "認知", "栄光"],
            upright: { meaning: "勝利と成功、努力の成果", interpretation: "あなたの努力が認められ、成功を手にする時です。" },
            reversed: { meaning: "失敗、批判、プライドの傷", interpretation: "失敗を恐れず、経験として活かしていきましょう。" }
        },
        {
            id: 26, name: "ワンドの7", englishName: "Seven of Wands", imagePath: "images/29.7-wands.jpg",
            keywords: ["防御", "挑戦", "困難", "勇気"],
            upright: { meaning: "困難への立ち向かい、防御", interpretation: "困難な状況ですが、勇気を持って立ち向かいましょう。" },
            reversed: { meaning: "圧倒、疲弊", interpretation: "無理をせず、適度な休息を取ることも大切です。" }
        },
        {
            id: 27, name: "ワンドの8", englishName: "Eight of Wands", imagePath: "images/30.8-wands.jpg",
            keywords: ["速度", "進歩", "行動", "変化"],
            upright: { meaning: "急速な進展、素早い行動", interpretation: "物事が急速に進展する時期です。チャンスを逃さないようにしましょう。" },
            reversed: { meaning: "遅延、混乱", interpretation: "焦らず、一歩ずつ着実に進めていきましょう。" }
        },
        {
            id: 28, name: "ワンドの9", englishName: "Nine of Wands", imagePath: "images/31.9-wands.jpg",
            keywords: ["忍耐", "持続", "準備", "警戒"],
            upright: { meaning: "忍耐強さ、最後の努力", interpretation: "もう少しで目標達成です。忍耐強く続けましょう。" },
            reversed: { meaning: "疲労、放棄", interpretation: "適度な休息を取って、エネルギーを回復させましょう。" }
        },
        {
            id: 29, name: "ワンドの10", englishName: "Ten of Wands", imagePath: "images/32.10-wands.jpg",
            keywords: ["重荷", "責任", "過負荷", "完成"],
            upright: { meaning: "重い責任、過度な負担", interpretation: "責任は重いですが、完成は近づいています。" },
            reversed: { meaning: "負担の軽減、委託", interpretation: "他の人に頼ることも必要です。一人で抱え込まないでください。" }
        },
        {
            id: 30, name: "ワンドのペイジ", englishName: "Page of Wands", imagePath: "images/33.page-wands.jpg",
            keywords: ["探求", "学習", "メッセンジャー", "冒険"],
            upright: { meaning: "新しい学び、探求心", interpretation: "新しいことを学ぶ良い機会です。探求心を大切にしましょう。" },
            reversed: { meaning: "計画不足、性急", interpretation: "もう少し計画を練ってから行動しましょう。" }
        },
        {
            id: 31, name: "ワンドのナイト", englishName: "Knight of Wands", imagePath: "images/34.knight-wands.jpg",
            keywords: ["行動", "冒険", "衝動", "情熱"],
            upright: { meaning: "情熱的な行動、冒険心", interpretation: "情熱を持って行動する時です。恐れずに進みましょう。" },
            reversed: { meaning: "性急さ、無謀", interpretation: "少し冷静になって、計画的に行動することが大切です。" }
        },
        {
            id: 32, name: "ワンドのクイーン", englishName: "Queen of Wands", imagePath: "images/35.queen-wands.jpg",
            keywords: ["自信", "決断力", "魅力", "独立"],
            upright: { meaning: "自信に満ちた行動、魅力", interpretation: "あなたの魅力と自信が周りを引きつけます。" },
            reversed: { meaning: "嫉妬、わがまま", interpretation: "他者への思いやりを忘れないようにしましょう。" }
        },
        {
            id: 33, name: "ワンドのキング", englishName: "King of Wands", imagePath: "images/36.king-wands.jpg",
            keywords: ["リーダーシップ", "カリスマ", "情熱", "統率力"],
            upright: { meaning: "強力なリーダーシップ、カリスマ性", interpretation: "あなたには人を導く力があります。自信を持ってリーダーシップを発揮しましょう。" },
            reversed: { meaning: "独裁的、短気", interpretation: "力の使い方に注意が必要です。謙虚さを忘れないようにしましょう。" }
        }
    ],
    
    // 小アルカナ - カップ（感情・愛・人間関係）
    cups: [
        {
            id: 36, name: "カップのエース", englishName: "Ace of Cups", imagePath: "images/37.ace-cups.jpg",
            keywords: ["新しい愛", "感情の豊かさ", "直感", "精神的な充実"],
            upright: { meaning: "新しい愛の始まり、感情的な充実", interpretation: "心が愛で満たされる時期です。新しい人間関係や深い感情的つながりが生まれます。" },
            reversed: { meaning: "感情の抑圧、愛の失望", interpretation: "感情を表現することを恐れないでください。心を開くことで新しい可能性が見えてきます。" }
        },
        {
            id: 37, name: "カップの2", englishName: "Two of Cups", imagePath: "images/38.2-cups.jpg",
            keywords: ["愛", "パートナーシップ", "調和", "結合"],
            upright: { meaning: "愛の関係、パートナーシップの深化", interpretation: "特別な人との深いつながりが生まれます。お互いを尊重し合う関係を築きましょう。" },
            reversed: { meaning: "関係の不調和、別れ", interpretation: "関係性を見直す時期です。コミュニケーションを大切にしましょう。" }
        },
        {
            id: 38, name: "カップの3", englishName: "Three of Cups", imagePath: "images/39.3-cups.jpg",
            keywords: ["友情", "祝福", "コミュニティ", "喜び"],
            upright: { meaning: "友情の深まり、社会的な成功", interpretation: "周りの人々と喜びを分かち合える時期です。" },
            reversed: { meaning: "孤立、グループからの排除", interpretation: "人間関係の見直しが必要かもしれません。" }
        },
        {
            id: 39, name: "カップの4", englishName: "Four of Cups", imagePath: "images/40.4-cups.jpg",
            keywords: ["無関心", "退屈", "瞑想", "内省"],
            upright: { meaning: "無気力、機会の見逃し", interpretation: "新しい機会に目を向けることが大切です。" },
            reversed: { meaning: "新しい興味、動機の回復", interpretation: "新しい関心事が見つかり、活力が戻ってきます。" }
        },
        {
            id: 40, name: "カップの5", englishName: "Five of Cups", imagePath: "images/41.5-cups.jpg",
            keywords: ["失望", "悲しみ", "喪失", "後悔"],
            upright: { meaning: "失望と悲しみ、喪失感", interpretation: "辛い時期ですが、残されたものに目を向けましょう。" },
            reversed: { meaning: "回復、許し、前進", interpretation: "悲しみから立ち直り、新しい希望が見えてきます。" }
        },
        {
            id: 41, name: "カップの6", englishName: "Six of Cups", imagePath: "images/42.6-cups.jpg",
            keywords: ["ノスタルジア", "過去", "無邪気", "楽しさ"],
            upright: { meaning: "過去の思い出、ノスタルジア", interpretation: "過去の美しい思い出が心を温めてくれます。" },
            reversed: { meaning: "過去への執着", interpretation: "過去にとらわれず、現在を大切にしましょう。" }
        },
        {
            id: 42, name: "カップの7", englishName: "Seven of Cups", imagePath: "images/43.7-cups.jpg",
            keywords: ["幻想", "選択", "夢", "混乱"],
            upright: { meaning: "多くの選択肢、幻想", interpretation: "選択肢が多すぎて混乱しています。現実的な判断が必要です。" },
            reversed: { meaning: "現実的な判断、決断", interpretation: "現実を見つめ、明確な判断ができるようになります。" }
        },
        {
            id: 43, name: "カップの8", englishName: "Eight of Cups", imagePath: "images/44.8-cups.jpg",
            keywords: ["放棄", "探求", "失望", "精神的な旅"],
            upright: { meaning: "現状への失望、新しい道への旅立ち", interpretation: "現状に満足できず、新しい道を探求する時です。" },
            reversed: { meaning: "停滞、現状維持", interpretation: "変化を恐れず、勇気を持って前進しましょう。" }
        },
        {
            id: 44, name: "カップの9", englishName: "Nine of Cups", imagePath: "images/45.9-cups.jpg",
            keywords: ["満足", "幸福", "達成", "願望実現"],
            upright: { meaning: "願望の実現、満足感", interpretation: "願いが叶い、心からの満足を得られます。" },
            reversed: { meaning: "不満足、欲求不満", interpretation: "真の幸せとは何かを考え直してみましょう。" }
        },
        {
            id: 45, name: "カップの10", englishName: "Ten of Cups", imagePath: "images/46.10-cups.jpg",
            keywords: ["幸福", "満足", "家族", "調和"],
            upright: { meaning: "家族の幸福、完全な満足", interpretation: "家族や愛する人との完全な調和が実現します。" },
            reversed: { meaning: "家庭内の不和", interpretation: "家族との関係を見直し、調和を取り戻しましょう。" }
        },
        {
            id: 46, name: "カップのペイジ", englishName: "Page of Cups", imagePath: "images/47.page-cups.jpg",
            keywords: ["感受性", "直感", "創造性", "メッセージ"],
            upright: { meaning: "感情的なメッセージ、創造性", interpretation: "感受性豊かな心で、新しいインスピレーションを受け取りましょう。" },
            reversed: { meaning: "感情の不安定", interpretation: "感情をコントロールし、冷静さを保ちましょう。" }
        },
        {
            id: 47, name: "カップのナイト", englishName: "Knight of Cups", imagePath: "images/48.knight-cups.jpg",
            keywords: ["ロマンス", "魅力", "理想主義", "感情"],
            upright: { meaning: "ロマンチックなアプローチ、魅力", interpretation: "感情豊かで魅力的なアプローチが効果的です。" },
            reversed: { meaning: "非現実的、感情的すぎ", interpretation: "もう少し現実的な視点を持つことが大切です。" }
        },
        {
            id: 48, name: "カップのクイーン", englishName: "Queen of Cups", imagePath: "images/49.queen-cups.jpg",
            keywords: ["直感", "共感", "感情の知恵", "慈愛"],
            upright: { meaning: "深い直感、共感力", interpretation: "あなたの直感と共感力が人々を癒します。" },
            reversed: { meaning: "感情的な不安定", interpretation: "感情に流されず、バランスを保ちましょう。" }
        },
        {
            id: 49, name: "カップのキング", englishName: "King of Cups", imagePath: "images/50.king-cups.jpg",
            keywords: ["感情の統制", "思いやり", "智恵", "バランス"],
            upright: { meaning: "感情の成熟、思いやり深い指導", interpretation: "感情をコントロールしながら、他者を導く智恵があります。" },
            reversed: { meaning: "感情の不安定、操作的", interpretation: "感情に振り回されないよう注意が必要です。" }
        }
    ],
    
    // 小アルカナ - ソード（思考・コミュニケーション・困難）
    swords: [
        {
            id: 50, name: "ソードのエース", englishName: "Ace of Swords", imagePath: "images/51.ace-swords.jpg",
            keywords: ["新しいアイデア", "真実", "明晰さ", "突破"],
            upright: { meaning: "明確な思考、新しいアイデア", interpretation: "頭脳が冴えわたり、新しいアイデアが浮かびます。真実を見極める力があります。" },
            reversed: { meaning: "混乱、誤解、思考の曇り", interpretation: "情報を整理し、冷静に判断する時間が必要です。" }
        },
        {
            id: 51, name: "ソードの2", englishName: "Two of Swords", imagePath: "images/52.2-swords.jpg",
            keywords: ["決断", "選択", "バランス", "迷い"],
            upright: { meaning: "困難な選択、決断の必要性", interpretation: "重要な決断を迫られています。情報を集め、慎重に選択しましょう。" },
            reversed: { meaning: "優柔不断、決断の回避", interpretation: "決断を先延ばしにしても解決しません。勇気を持って選択してください。" }
        },
        {
            id: 52, name: "ソードの3", englishName: "Three of Swords", imagePath: "images/53.3-swords.jpg",
            keywords: ["悲しみ", "失恋", "裏切り", "心の痛み"],
            upright: { meaning: "深い悲しみ、心の傷", interpretation: "辛い時期ですが、この経験が成長をもたらします。" },
            reversed: { meaning: "癒し、回復、許し", interpretation: "心の傷が癒える時期です。過去を手放し前進しましょう。" }
        },
        {
            id: 53, name: "ソードの4", englishName: "Four of Swords", imagePath: "images/54.4-swords.jpg",
            keywords: ["休息", "瞑想", "平静", "回復"],
            upright: { meaning: "休息と瞑想、平静な状態", interpretation: "心身の休息を取り、内なる平静を保ちましょう。" },
            reversed: { meaning: "不安、動揺", interpretation: "心の平静を取り戻すために、静かな時間を作りましょう。" }
        },
        {
            id: 54, name: "ソードの5", englishName: "Five of Swords", imagePath: "images/55.5-swords.jpg",
            keywords: ["敗北", "対立", "裏切り", "屈辱"],
            upright: { meaning: "敗北と対立、不名誉な勝利", interpretation: "勝利にも代償があることを理解しましょう。" },
            reversed: { meaning: "和解、許し", interpretation: "対立を乗り越え、和解の道を見つけられます。" }
        },
        {
            id: 55, name: "ソードの6", englishName: "Six of Swords", imagePath: "images/56.6-swords.jpg",
            keywords: ["移行", "旅立ち", "困難からの脱出", "平静"],
            upright: { meaning: "困難からの脱出、新しい場所への移行", interpretation: "困難な状況から抜け出し、平静な場所に向かいます。" },
            reversed: { meaning: "停滞、過去への執着", interpretation: "過去を手放し、前進する勇気を持ちましょう。" }
        },
        {
            id: 56, name: "ソードの7", englishName: "Seven of Swords", imagePath: "images/57.7-swords.jpg",
            keywords: ["欺瞞", "策略", "盗み", "逃避"],
            upright: { meaning: "策略と欺瞞、不誠実な行為", interpretation: "誠実さを保ち、正直な方法を選びましょう。" },
            reversed: { meaning: "良心の呼び覚まし", interpretation: "正直な道に戻り、誠実さを取り戻しましょう。" }
        },
        {
            id: 57, name: "ソードの8", englishName: "Eight of Swords", imagePath: "images/58.8-swords.jpg",
            keywords: ["束縛", "制限", "困難", "無力感"],
            upright: { meaning: "制限と束縛、困難な状況", interpretation: "制限は一時的なものです。解決策を見つけましょう。" },
            reversed: { meaning: "制限からの解放", interpretation: "束縛から解放され、自由を取り戻します。" }
        },
        {
            id: 58, name: "ソードの9", englishName: "Nine of Swords", imagePath: "images/59.9-swords.jpg",
            keywords: ["不安", "悪夢", "恐怖", "絶望"],
            upright: { meaning: "深い不安と恐怖、悪夢", interpretation: "不安に支配されず、現実的な解決策を見つけましょう。" },
            reversed: { meaning: "不安の軽減", interpretation: "恐怖から解放され、心の平静を取り戻します。" }
        },
        {
            id: 59, name: "ソードの10", englishName: "Ten of Swords", imagePath: "images/60.10-swords.jpg",
            keywords: ["破滅", "終焉", "裏切り", "最悪の状況"],
            upright: { meaning: "破滅と終焉、最悪の状況", interpretation: "最悪の状況も終わりがあります。新しい始まりが待っています。" },
            reversed: { meaning: "回復、再生", interpretation: "最悪の状況から立ち直り、新しい希望が見えてきます。" }
        },
        {
            id: 60, name: "ソードのペイジ", englishName: "Page of Swords", imagePath: "images/61.page-swords.jpg",
            keywords: ["好奇心", "学習", "監視", "警戒"],
            upright: { meaning: "好奇心旺盛、新しい学び", interpretation: "知的な好奇心を持って、新しいことを学びましょう。" },
            reversed: { meaning: "おしゃべり、軽率", interpretation: "言葉に気をつけ、慎重に行動しましょう。" }
        },
        {
            id: 61, name: "ソードのナイト", englishName: "Knight of Swords", imagePath: "images/62.knight-swords.jpg",
            keywords: ["行動", "衝動", "勇敢", "性急"],
            upright: { meaning: "勇敢で迅速な行動", interpretation: "勇気を持って迅速に行動しましょう。" },
            reversed: { meaning: "性急さ、無謀", interpretation: "もう少し慎重に計画を立ててから行動しましょう。" }
        },
        {
            id: 62, name: "ソードのクイーン", englishName: "Queen of Swords", imagePath: "images/63.queen-swords.jpg",
            keywords: ["知性", "独立", "明晰さ", "判断力"],
            upright: { meaning: "知的で独立した判断", interpretation: "明晰な思考と独立した判断力があります。" },
            reversed: { meaning: "冷酷、批判的", interpretation: "思いやりを忘れず、温かい心を保ちましょう。" }
        },
        {
            id: 63, name: "ソードのキング", englishName: "King of Swords", imagePath: "images/64.king-swords.jpg",
            keywords: ["知性", "権威", "公正", "判断力"],
            upright: { meaning: "知的な権威、公正な判断", interpretation: "論理的思考と公正さで問題を解決できます。" },
            reversed: { meaning: "冷酷、独断的", interpretation: "感情も大切にし、バランスの取れた判断を心がけましょう。" }
        }
    ],
    
    // 小アルカナ - ペンタクル（物質・お金・実用性）
    pentacles: [
        {
            id: 64, name: "ペンタクルのエース", englishName: "Ace of Pentacles", imagePath: "images/65.ace-pentacles.jpg",
            keywords: ["新しい機会", "物質的成功", "豊かさ", "実用性"],
            upright: { meaning: "新しいビジネスチャンス、物質的な豊かさ", interpretation: "物質的な成功や新しい収入源の機会が訪れます。実用的なアプローチで取り組みましょう。" },
            reversed: { meaning: "機会の見逃し、金銭的な不安", interpretation: "チャンスを見逃している可能性があります。現実的な計画を立て直しましょう。" }
        },
        {
            id: 65, name: "ペンタクルの2", englishName: "Two of Pentacles", imagePath: "images/66.2-pentacles.jpg",
            keywords: ["バランス", "優先順位", "柔軟性", "多様性"],
            upright: { meaning: "優先順位の調整、バランスの取り方", interpretation: "複数のことを同時にこなす必要があります。優先順位をつけて効率的に進めましょう。" },
            reversed: { meaning: "バランスの崩れ、圧倒", interpretation: "やることが多すぎて混乱しています。一つずつ整理して取り組みましょう。" }
        },
        {
            id: 66, name: "ペンタクルの3", englishName: "Three of Pentacles", imagePath: "images/67.3-pentacles.jpg",
            keywords: ["技術", "協力", "熟練", "チームワーク"],
            upright: { meaning: "技術の向上、チームでの成功", interpretation: "技術を磨き、他者と協力することで大きな成果を得られます。" },
            reversed: { meaning: "技術不足、協力の欠如", interpretation: "スキルアップや協調性の改善が必要です。" }
        },
        {
            id: 67, name: "ペンタクルの4", englishName: "Four of Pentacles", imagePath: "images/68.4-pentacles.jpg",
            keywords: ["所有", "安全", "けち", "保守"],
            upright: { meaning: "所有欲、安全への執着", interpretation: "セキュリティを重視しすぎず、柔軟性も大切にしましょう。" },
            reversed: { meaning: "寛大さ、共有", interpretation: "他者と分かち合うことで、より豊かになれます。" }
        },
        {
            id: 68, name: "ペンタクルの5", englishName: "Five of Pentacles", imagePath: "images/69.5-pentacles.jpg",
            keywords: ["困窮", "孤立", "健康問題", "精神的貧困"],
            upright: { meaning: "物質的・精神的困窮", interpretation: "困難な時期ですが、助けを求めることも大切です。" },
            reversed: { meaning: "回復、援助", interpretation: "困難から抜け出し、支援を受けられます。" }
        },
        {
            id: 69, name: "ペンタクルの6", englishName: "Six of Pentacles", imagePath: "images/70.6-pentacles.jpg",
            keywords: ["寛大さ", "分配", "慈善", "公正"],
            upright: { meaning: "寛大さと分配、慈善行為", interpretation: "他者への寛大さが巡り巡ってあなたに返ってきます。" },
            reversed: { meaning: "不公正、負債", interpretation: "与えることと受け取ることのバランスを見直しましょう。" }
        },
        {
            id: 70, name: "ペンタクルの7", englishName: "Seven of Pentacles", imagePath: "images/71.7-pentacles.jpg",
            keywords: ["努力", "忍耐", "評価", "投資"],
            upright: { meaning: "努力の成果を待つ、忍耐", interpretation: "努力の成果が現れるまで、もう少し忍耐が必要です。" },
            reversed: { meaning: "努力の無駄、焦り", interpretation: "別のアプローチを考えてみることも必要かもしれません。" }
        },
        {
            id: 71, name: "ペンタクルの8", englishName: "Eight of Pentacles", imagePath: "images/72.8-pentacles.jpg",
            keywords: ["技術", "熟練", "努力", "完璧主義"],
            upright: { meaning: "技術の向上、熟練への道", interpretation: "技術を磨き続けることで、マスターレベルに到達できます。" },
            reversed: { meaning: "手抜き、技術不足", interpretation: "基本に戻って、しっかりと技術を身につけましょう。" }
        },
        {
            id: 72, name: "ペンタクルの9", englishName: "Nine of Pentacles", imagePath: "images/73.9-pentacles.jpg",
            keywords: ["独立", "豊かさ", "成功", "洗練"],
            upright: { meaning: "独立と成功、豊かな生活", interpretation: "努力が実を結び、独立した豊かな生活を手にできます。" },
            reversed: { meaning: "依存、金銭問題", interpretation: "自立心を育て、経済的な安定を目指しましょう。" }
        },
        {
            id: 73, name: "ペンタクルの10", englishName: "Ten of Pentacles", imagePath: "images/74.10-pentacles.jpg",
            keywords: ["世代", "遺産", "家族", "安定"],
            upright: { meaning: "家族の富、世代を超えた成功", interpretation: "家族全体の繁栄と安定した基盤が築かれます。" },
            reversed: { meaning: "家族問題、遺産争い", interpretation: "家族との関係を見直し、調和を大切にしましょう。" }
        },
        {
            id: 74, name: "ペンタクルのペイジ", englishName: "Page of Pentacles", imagePath: "images/75.page-pentacles.jpg",
            keywords: ["学習", "実用性", "新しい機会", "地に足のついた"],
            upright: { meaning: "実用的な学習、新しい機会", interpretation: "実用的なスキルを学ぶ良い機会です。" },
            reversed: { meaning: "非実用的、集中力不足", interpretation: "現実的な目標を設定し、集中して取り組みましょう。" }
        },
        {
            id: 75, name: "ペンタクルのナイト", englishName: "Knight of Pentacles", imagePath: "images/76.knight-pentacles.jpg",
            keywords: ["責任感", "忍耐", "信頼性", "勤勉"],
            upright: { meaning: "責任感と忍耐強さ、信頼性", interpretation: "責任感を持って着実に進めることで成功を得られます。" },
            reversed: { meaning: "怠惰、無責任", interpretation: "責任感を持ち、計画的に行動することが大切です。" }
        },
        {
            id: 76, name: "ペンタクルのクイーン", englishName: "Queen of Pentacles", imagePath: "images/77.queen-pentacles.jpg",
            keywords: ["母性", "実用性", "豊かさ", "世話"],
            upright: { meaning: "母性的な豊かさ、実用的な知恵", interpretation: "豊かな心で他者を支え、実用的な知恵を活かしましょう。" },
            reversed: { meaning: "依存、金銭に執着", interpretation: "自立心を育て、精神的な豊かさも大切にしましょう。" }
        },
        {
            id: 77, name: "ペンタクルのキング", englishName: "King of Pentacles", imagePath: "images/78.king-pentacles.jpg",
            keywords: ["富", "成功", "実用性", "安定"],
            upright: { meaning: "物質的成功、富の蓄積", interpretation: "努力が実を結び、安定した成功を手にできます。" },
            reversed: { meaning: "強欲、浪費", interpretation: "お金に対する価値観を見直すことが大切です。" }
        }
    ]
};

// 全カードを統合した配列を取得
function getAllCards() {
    return [
        ...TAROT_CARDS.majorArcana,
        ...TAROT_CARDS.wands,
        ...TAROT_CARDS.cups,
        ...TAROT_CARDS.swords,
        ...TAROT_CARDS.pentacles
    ];
}

// カードをランダムに選ぶ関数（大アルカナ + 小アルカナ）
function drawRandomCards(count = 3) {
    const availableCards = getAllCards();
    const drawnCards = [];
    
    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * availableCards.length);
        const card = availableCards.splice(randomIndex, 1)[0];
        
        // カードの向き（正位置 or 逆位置）をランダムに決定
        const isUpright = Math.random() > 0.3; // 70%の確率で正位置
        
        drawnCards.push({
            ...card,
            isUpright: isUpright,
            position: getPositionName(i),
            meaning: isUpright ? card.upright.meaning : card.reversed.meaning,
            interpretation: isUpright ? card.upright.interpretation : card.reversed.interpretation
        });
    }
    
    return drawnCards;
}

// ポジション名を取得する関数
function getPositionName(index) {
    const positions = ['過去・原因', '現在・状況', '未来・結果'];
    return positions[index] || `ポジション${index + 1}`;
}

// 特定のテーマに関連するカードを優先的に選ぶ関数
function drawThematicCards(theme, count = 3) {
    const themeKeywords = getThemeKeywords(theme);
    const availableCards = getAllCards();
    
    // テーマに関連するカードを優先的に選出
    const relevantCards = availableCards.filter(card => 
        card.keywords.some(keyword => themeKeywords.includes(keyword))
    );
    
    const drawnCards = [];
    
    // 関連カードから1-2枚選出
    const relevantCount = Math.min(2, relevantCards.length, count);
    for (let i = 0; i < relevantCount; i++) {
        const randomIndex = Math.floor(Math.random() * relevantCards.length);
        const card = relevantCards.splice(randomIndex, 1)[0];
        
        // 選出されたカードを全体のリストからも除去
        const mainIndex = availableCards.findIndex(c => c.id === card.id);
        if (mainIndex > -1) {
            availableCards.splice(mainIndex, 1);
        }
        
        const isUpright = Math.random() > 0.3;
        drawnCards.push({
            ...card,
            isUpright: isUpright,
            position: getPositionName(i),
            meaning: isUpright ? card.upright.meaning : card.reversed.meaning,
            interpretation: isUpright ? card.upright.interpretation : card.reversed.interpretation
        });
    }
    
    // 残りは通常のランダム選出
    const remainingCount = count - drawnCards.length;
    for (let i = 0; i < remainingCount; i++) {
        const randomIndex = Math.floor(Math.random() * availableCards.length);
        const card = availableCards.splice(randomIndex, 1)[0];
        
        const isUpright = Math.random() > 0.3;
        drawnCards.push({
            ...card,
            isUpright: isUpright,
            position: getPositionName(drawnCards.length),
            meaning: isUpright ? card.upright.meaning : card.reversed.meaning,
            interpretation: isUpright ? card.upright.interpretation : card.reversed.interpretation
        });
    }
    
    return drawnCards;
}

// テーマに関連するキーワードを取得
function getThemeKeywords(theme) {
    const themeMap = {
        'love': ['愛', '調和', '選択', '結合', '感情', '新しい愛', 'パートナーシップ', '感情の豊かさ'],
        'work': ['権威', '責任', '成功', '達成', '意志力', '創造力', '情熱', '計画', '新しい機会', '物質的成功'],
        'relationship': ['調和', '公正', 'バランス', '統合', '結合', 'パートナーシップ', '人間関係', '感情'],
        'money': ['豊穣', '成功', '達成', '物質', '安定', '新しい機会', '物質的成功', '豊かさ'],
        'health': ['バランス', '調和', '癒し', '統合', '自然', '柔軟性'],
        'future': ['変化', 'サイクル', '新しい始まり', '希望', '達成', '拡張', '成長', '冒険']
    };
    
    return themeMap[theme] || [];
}

// カード名をIDから取得
function getCardById(id) {
    return getAllCards().find(card => card.id === id);
}

// カード検索機能
function searchCards(query) {
    const lowercaseQuery = query.toLowerCase();
    return getAllCards().filter(card => 
        card.name.toLowerCase().includes(lowercaseQuery) ||
        card.englishName.toLowerCase().includes(lowercaseQuery) ||
        card.keywords.some(keyword => keyword.toLowerCase().includes(lowercaseQuery))
    );
}
