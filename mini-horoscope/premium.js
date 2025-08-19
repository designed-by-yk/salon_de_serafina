document.addEventListener('DOMContentLoaded', () => {
  // 星座データ
  const zodiacData = {
    aries: { name: '牡羊座', symbol: '♈' },
    taurus: { name: '牡牛座', symbol: '♉' },
    gemini: { name: '双子座', symbol: '♊' },
    cancer: { name: '蟹座', symbol: '♋' },
    leo: { name: '獅子座', symbol: '♌' },
    virgo: { name: '乙女座', symbol: '♍' },
    libra: { name: '天秤座', symbol: '♎' },
    scorpio: { name: '蠍座', symbol: '♏' },
    sagittarius: { name: '射手座', symbol: '♐' },
    capricorn: { name: '山羊座', symbol: '♑' },
    aquarius: { name: '水瓶座', symbol: '♒' },
    pisces: { name: '魚座', symbol: '♓' }
  };

  // 日別特別メッセージテンプレート
  const dailyMessageTemplates = {
    aries: [
      'エネルギッシュなあなたは、今日新しい挑戦を始めるのに最適です。直感を信じて大胆に行動してください。午後の時間帯に特に良い出来事が期待できます。',
      '今日のあなたは、リーダーシップを発揮する絶好の機会に恵まれます。周りの人たちがあなたの行動力に注目しています。自信を持って前進しましょう。',
      '創造性が高まっている今日、新しいアイデアが次々と浮かんできそうです。メモを取ることを忘れずに。夕方以降に重要な連絡があるかもしれません。',
      '今日は人間関係で嬉しい変化がありそうです。古い友人からの連絡や、新しい出会いが期待できます。積極的にコミュニケーションを取ってください。',
      '仕事面で大きな進展がある日です。あなたの努力が認められ、新しい責任や役割を任される可能性があります。準備を怠らないようにしましょう。',
      '健康運が特に良い今日は、新しい運動や健康法を始めるのに適しています。体調を整えることで、全体的な運気もアップします。',
      '金運に恵まれた一日となりそうです。思いがけない収入や、良い投資の話が舞い込むかもしれません。ただし、慎重な判断も大切です。'
    ],
    taurus: [
      '安定を求めるあなたにとって、今日は基盤を固める良い日です。長期的な計画について考え、着実なステップを踏んでいきましょう。',
      '美しいものや心地よいものに触れることで、今日の運気がさらに上昇します。芸術鑑賞や自然散策がおすすめです。',
      '今日は忍耐力が試される場面があるかもしれませんが、あなたの粘り強さが最終的に良い結果をもたらします。諦めずに続けてください。',
      '金銭面で良いニュースが期待できる一日です。貯蓄や投資について真剣に考える良い機会でもあります。専門家のアドバイスも参考にしてください。',
      '家族や親しい人との時間を大切にすることで、心の安定が得られます。温かい食事を囲んでのひとときが特に幸運を呼びます。',
      '今日はあなたの実用的なアドバイスが多くの人に喜ばれるでしょう。困っている人がいたら、積極的に手を差し伸べてください。',
      '健康面では、規則正しい生活リズムを心がけることが重要です。質の良い睡眠と栄養バランスの取れた食事で、体調を万全に保ちましょう。'
    ],
    gemini: [
      '好奇心旺盛なあなたは、今日新しい情報や知識を得ることで大きな刺激を受けるでしょう。学習や読書に時間を割いてください。',
      'コミュニケーション能力が冴えている今日、多くの人との交流が幸運を運んできます。SNSでの発信も効果的です。',
      '今日は変化を恐れず、柔軟性を持って物事に取り組むことが成功の鍵となります。予定の変更も前向きに受け入れましょう。',
      '知的な刺激を求めて、新しい場所を訪れてみてください。そこで得る経験や出会いが、将来の大きな財産となります。',
      '今日はあなたの多才さが光る一日です。複数のプロジェクトを同時に進めることで、予想以上の成果を上げることができるでしょう。',
      '言葉の力が特に強い今日、重要な交渉や会話には細心の注意を払ってください。誠実なコミュニケーションが信頼を築きます。',
      '旅行や移動に関して良いことがありそうです。短距離でも良いので、普段とは違う場所に足を向けてみてください。'
    ],
    cancer: [
      '感受性豊かなあなたは、今日直感が特に鋭くなっています。第六感を信じて行動することで、良い結果を得られるでしょう。',
      '家族や親しい人との絆が深まる素晴らしい一日となりそうです。大切な人と過ごす時間を意識的に作ってください。',
      '今日は過去の経験や思い出が、現在の問題解決のヒントを与えてくれます。温故知新の精神で物事に取り組みましょう。',
      '感情的になりやすい今日ですが、その豊かな感性が創作活動や芸術的な分野で力を発揮します。自己表現を大切にしてください。',
      '母性的な優しさが周りの人を癒し、多くの感謝を受けることになるでしょう。人のお世話をすることで、あなた自身も満たされます。',
      '今日は心の声に耳を傾けることが大切です。理性だけでなく、感情や直感も判断材料として活用してください。',
      '安心できる環境を整えることで、今日の運気がさらに向上します。お気に入りの場所でリラックスした時間を過ごしましょう。'
    ],
    leo: [
      '輝くあなたは、今日多くの人の注目を集めることになりそうです。自信を持って、あなたらしさを存分に発揮してください。',
      '創造力が最高潮に達している今日、芸術的な活動や表現に取り組むことで素晴らしい作品が生まれるかもしれません。',
      'リーダーシップを発揮する絶好の機会が訪れます。チームを率いて、大きな目標に向かって進んでいきましょう。',
      '今日はあなたの寛大さと温かい心が、多くの人に希望と勇気を与えます。太陽のような存在として、周りを明るく照らしてください。',
      '舞台やステージに関わることで幸運が訪れそうです。人前で話す機会があれば、積極的に引き受けてください。',
      'プライドを持つことは良いことですが、今日は謙虚さも忘れずに。バランスの取れた態度が成功につながります。',
      '愛情表現が豊かになる一日です。大切な人への感謝の気持ちを、言葉や行動で表現してください。きっと喜ばれるでしょう。'
    ],
    virgo: [
      '完璧主義のあなたは、今日細部への注意が大きな成果をもたらします。丁寧な作業と確実な段取りで、目標を達成してください。',
      '今日は健康管理に特に意識を向けることで、全体的な運気がアップします。規則正しい生活習慣を心がけましょう。',
      '分析力が冴えている今日、複雑な問題も論理的に解決することができるでしょう。データや事実に基づいた判断が正解です。',
      '他人への奉仕精神が光る一日となります。困っている人を助けることで、あなた自身にも良いことが返ってきます。',
      '今日は整理整頓に力を入れることで、心も環境もスッキリと整います。断捨離にも良いタイミングです。',
      '実用的なスキルや知識を身につけることで、将来の役に立つ投資となります。学習や研修の機会があれば参加してください。',
      '批判的な目線も大切ですが、今日は建設的な提案や改善案を示すことで、より良い結果を生み出すことができるでしょう。'
    ],
    libra: [
      'バランス感覚に優れたあなたは、今日対立する意見を調和させる重要な役割を果たすことになりそうです。',
      '美的センスが冴えている今日、ファッションやインテリアにこだわることで運気がアップします。美しいものに囲まれて過ごしましょう。',
      '今日は公平性と正義感が評価される場面があります。偏見を持たず、客観的な判断を心がけてください。',
      'パートナーシップや協力関係において、新たな発展が期待できます。一人では成し得ないことも、チームワークで乗り越えられるでしょう。',
      '社交性が発揮される一日です。パーティーや集まりに参加することで、有益な人脈を築くことができます。',
      '今日は平和を愛するあなたの性格が、争いを収める力となります。仲裁役として、重要な任務を担うかもしれません。',
      '芸術や文化に触れることで、心が豊かになる一日です。美術館やコンサートなど、文化的な活動に時間を使ってください。'
    ],
    scorpio: [
      '深い洞察力を持つあなたは、今日隠された真実を見抜く能力が特に高まっています。本質を見極める眼で物事を判断してください。',
      '集中力が最高レベルに達している今日、重要なプロジェクトや研究に取り組むことで大きな成果を上げることができるでしょう。',
      '今日は変革の時です。古いものを手放し、新しいステージに進む勇気を持ってください。恐れずに前進しましょう。',
      'ミステリアスな魅力が際立つ一日となります。あなたの神秘的な雰囲気に、多くの人が惹きつけられることでしょう。',
      '感情の起伏が激しくなりがちな今日ですが、その情熱を建設的な方向に向けることで、素晴らしい結果を生み出せます。',
      '今日は心理学や精神世界への関心が高まります。自己分析や内省の時間を持つことで、新たな自分を発見できるかもしれません。',
      '秘密や重要な情報を扱う機会があるかもしれません。信頼関係を大切にし、責任を持って行動してください。'
    ],
    sagittarius: [
      '自由を愛するあなたは、今日新しい冒険や挑戦の機会に恵まれます。恐れずに一歩踏み出してください。',
      '哲学的な思考が深まる一日です。人生の意味や目的について考えることで、新たな価値観を見つけることができるでしょう。',
      '今日は海外や遠方に関することで良いニュースがありそうです。旅行の計画を立てるのにも適した日です。',
      '学習意欲が高まっている今日、新しい分野の勉強を始めることで、将来の可能性が大きく広がります。',
      '楽観的な態度が周りの人に勇気を与える一日となります。あなたの前向きなエネルギーで、チーム全体を明るくしてください。',
      '今日は直感と論理のバランスが重要です。感覚的な判断と理性的な分析を組み合わせることで、最適な答えが見つかります。',
      '教師や指導者としての役割を果たす機会があるかもしれません。あなたの知識と経験を、積極的に他者と分かち合ってください。'
    ],
    capricorn: [
      '責任感の強いあなたは、今日重要なプロジェクトのリーダーとして選ばれる可能性があります。その責任を誇りに思って取り組んでください。',
      '長期的な計画や目標について見直すのに適した日です。現実的で実現可能な戦略を立てることで、着実に前進できるでしょう。',
      '今日は伝統や歴史から学ぶことの大切さを実感する出来事がありそうです。先人の知恵を現代に活かす方法を考えてみてください。',
      '忍耐力と持続力が試される場面がありますが、あなたの粘り強さが最終的に勝利をもたらします。諦めずに続けることが重要です。',
      '社会的な地位や名誉に関して良い知らせが届く可能性があります。これまでの努力が認められ、新たなステップアップのチャンスが訪れます。',
      '今日は実用性と効率性を重視することで、大きな成果を上げることができます。無駄を省き、本質に集中してください。',
      '年長者や経験豊富な人からの助言が、あなたの人生に大きな影響を与えることになりそうです。素直に耳を傾けてください。'
    ],
    aquarius: [
      '独創性あふれるあなたは、今日革新的なアイデアで周りを驚かせることになりそうです。常識にとらわれない発想を大切にしてください。',
      '友人や仲間との絆が深まる素晴らしい一日となります。チームワークを活かして、共通の目標に向かって進んでいきましょう。',
      '今日はテクノロジーや最新の技術に関することで幸運が訪れます。新しいツールやアプリを試してみると良いでしょう。',
      '人道主義的な活動やボランティアに参加することで、心の充実感を得ることができます。社会貢献の機会を積極的に探してください。',
      '今日は個性を大切にすることが成功の鍵となります。他人と同じである必要はありません。あなたらしさを貫いてください。',
      '未来志向の思考が光る一日です。長期的な視点で物事を考えることで、他の人が見落としがちなチャンスを発見できるでしょう。',
      '知的な刺激を求めて、新しい分野の研究や学習に取り組むことをお勧めします。あなたの探究心が新たな発見をもたらします。'
    ],
    pisces: [
      '想像力豊かなあなたは、今日芸術的なインスピレーションに満ちています。創作活動に時間を費やすことで、素晴らしい作品が生まれるでしょう。',
      '共感力が高まっている今日、他人の気持ちを深く理解することで、人間関係がより良好になります。優しさを大切にしてください。',
      '今日は直感力が特に鋭くなっています。論理よりも感覚を信じて行動することで、正しい道を見つけることができるでしょう。',
      '精神世界や霊性への関心が高まる一日です。瞑想やヨガなど、心を静める時間を持つことで、内なる平和を得ることができます。',
      '今日は夢や理想を現実にするための具体的な計画を立てる良い機会です。空想だけでなく、実現可能な形に落とし込んでください。',
      '水に関することで幸運が訪れそうです。海や川、温泉など、水辺で過ごす時間が特に癒しと運気向上をもたらします。',
      '他人への奉仕や犠牲的な愛が、最終的にあなた自身に大きな幸福をもたらすことになります。無償の愛の力を信じてください。'
    ]
  };

  // DOM要素の取得
  const loginRequired = document.getElementById('login-required');
  const premiumContent = document.getElementById('premium-content');

  const dailyMessageBtn = document.getElementById('daily-message-btn');
  const monthlyReadingBtn = document.getElementById('monthly-reading-btn');
  const dailyMessage = document.getElementById('daily-message');
  const monthlyReading = document.getElementById('monthly-reading');
  const historySection = document.getElementById('history-section');

  // URLから星座パラメータを取得
  function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  // 現在の星座を取得（URLパラメータまたはローカルストレージから）
  function getCurrentSign() {
    return getUrlParameter('sign') || localStorage.getItem('current_sign') || 'aries';
  }

  // 日付ベースのシード値を生成
  function getDateSeed(daysOffset = 0) {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  }

  // シード値を使った疑似ランダム生成器
  function seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  // 日別メッセージを生成
  function generateDailyMessage(sign, daysOffset = 0) {
    const templates = dailyMessageTemplates[sign] || dailyMessageTemplates.aries;
    const seed = getDateSeed(daysOffset);
    const random = seededRandom(seed + sign.charCodeAt(0));
    const index = Math.floor(random * templates.length);
    return templates[index];
  }

  // 日付文字列を生成
  function getDateString(daysOffset = 0) {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  }

  // プレミアム会員状態をチェック
  function isPremiumUser() {
    // 実際の決済システムと連携するまで常にfalseを返す
    return false;
  }



  // 現在の星座を保存
  function saveCurrentSign(sign) {
    localStorage.setItem('current_sign', sign);
  }

  // 今日の特別メッセージを表示
  function showDailyMessage() {
    const sign = getCurrentSign();
    const zodiac = zodiacData[sign];
    const message = generateDailyMessage(sign);
    const today = getDateString();
    
    document.getElementById('daily-message-content').textContent = 
      `${zodiac.symbol} ${zodiac.name}のあなたへ：${message}`;
    document.getElementById('message-date').textContent = today;
    
    // 他のセクションを非表示
    monthlyReading.classList.add('hidden');
    historySection.classList.add('hidden');
    
    // メッセージを表示
    dailyMessage.classList.remove('hidden');
    
    // 履歴に保存
    saveMessageHistory(sign, message, today);
  }

  // 今月の詳細鑑定書を表示
  function showMonthlyReading() {
    const sign = getCurrentSign();
    const zodiac = zodiacData[sign];
    
    document.getElementById('selected-sign-name').textContent = 
      `${zodiac.symbol} ${zodiac.name}`;
    
    // 他のセクションを非表示
    dailyMessage.classList.add('hidden');
    historySection.classList.add('hidden');
    
    // 鑑定書を表示
    monthlyReading.classList.remove('hidden');
  }

  // メッセージ履歴を保存
  function saveMessageHistory(sign, message, date) {
    const key = 'message_history';
    let history = JSON.parse(localStorage.getItem(key) || '[]');
    
    // 同じ日付のメッセージは更新
    const existingIndex = history.findIndex(item => item.date === date && item.sign === sign);
    const newItem = { sign, message, date, zodiac: zodiacData[sign] };
    
    if (existingIndex >= 0) {
      history[existingIndex] = newItem;
    } else {
      history.unshift(newItem);
    }
    
    // 7日分のみ保持
    history = history.slice(0, 7);
    localStorage.setItem(key, JSON.stringify(history));
  }

  // 履歴を表示
  function showHistory() {
    const history = JSON.parse(localStorage.getItem('message_history') || '[]');
    const historyList = document.getElementById('history-list');
    
    if (history.length === 0) {
      historyList.innerHTML = '<p style="color: rgba(255,255,255,0.7);">まだ履歴がありません。</p>';
    } else {
      historyList.innerHTML = history.map(item => `
        <div class="history-item">
          <div class="history-date">${item.date} - ${item.zodiac.symbol} ${item.zodiac.name}</div>
          <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0;">${item.message}</p>
        </div>
      `).join('');
    }
    
    // 他のセクションを非表示
    dailyMessage.classList.add('hidden');
    monthlyReading.classList.add('hidden');
    
    // 履歴を表示
    historySection.classList.remove('hidden');
  }

  // 初期化
  function initialize() {
    const urlSign = getUrlParameter('sign');
    if (urlSign && zodiacData[urlSign]) {
      saveCurrentSign(urlSign);
    }
    
    if (isPremiumUser()) {
      loginRequired.classList.add('hidden');
      premiumContent.classList.remove('hidden');
    } else {
      loginRequired.classList.remove('hidden');
      premiumContent.classList.add('hidden');
    }
  }

  // イベントリスナーの設定

  dailyMessageBtn.addEventListener('click', showDailyMessage);
  monthlyReadingBtn.addEventListener('click', showMonthlyReading);
  
  // 履歴ボタンを追加
  const historyBtn = document.createElement('button');
  historyBtn.textContent = '📅 過去の履歴';
  historyBtn.className = 'premium-btn';
  historyBtn.addEventListener('click', showHistory);
  
  // ボタンを挿入
  const controls = document.querySelector('.controls');
  if (controls) {
    controls.appendChild(historyBtn);
  }

  // 初期化実行
  initialize();
});
