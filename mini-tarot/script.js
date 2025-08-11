document.addEventListener('DOMContentLoaded', () => {
  // 78枚フルデッキのタロットカード（YES/NO用にシンプル化）
  const cards = [
    // 大アルカナ
    { name: '愚者', type: 'YES', message: '「自由」のカード。無限の可能性。常識にとらわれず、冒険しよう。', img: 'images/1.fool.jpg' },
    { name: '魔術師', type: 'YES', message: '「行動」のカード。今がその時です。迷いを捨てて一歩踏み出そう。', img: 'images/2.magician.jpg' },
    { name: '女教皇', type: 'NO', message: '「直感」のカード。心の声に耳を傾けて。答えは内側にあります。', img: 'images/3.high-priestess.jpg' },
    { name: '女帝', type: 'YES', message: '「創造」のカード。素晴らしいアイデアが実現する兆し。', img: 'images/4.empress.jpg' },
    { name: '皇帝', type: 'YES', message: '「安定」のカード。確実な基盤の上に成功が築かれます。', img: 'images/5.emperor.jpg' },
    { name: '教皇', type: 'NO', message: '「伝統」のカード。慎重に。まずは学びと準備を。', img: 'images/6.hierophant.jpg' },
    { name: '恋人', type: 'YES', message: '「調和」のカード。心の繋がりが成功をもたらします。', img: 'images/7.lovers.jpg' },
    { name: '戦車', type: 'YES', message: '「意志力」のカード。困難を乗り越える力があります。', img: 'images/8.chariot.jpg' },
    { name: '力', type: 'YES', message: '「内なる強さ」のカード。優しさと勇気で道は開けます。', img: 'images/9.strength.jpg' },
    { name: '隠者', type: 'NO', message: '「内省」のカード。一人の時間を大切に。答えは自分の中に。', img: 'images/10.hermit.jpg' },
    { name: '運命の輪', type: 'YES', message: '「変化」のカード。運命の歯車が良い方向に回っています。', img: 'images/11.wheel-of-fortune.jpg' },
    { name: '正義', type: 'YES', message: '「バランス」のカード。公正な判断が良い結果をもたらします。', img: 'images/12.justice.jpg' },
    { name: '吊された男', type: 'NO', message: '「忍耐」のカード。今は待つ時。新しい視点が必要です。', img: 'images/13.hanged-man.jpg' },
    { name: '死神', type: 'NO', message: '「変容」のカード。終わりは始まり。今は手放す時。', img: 'images/14.death.jpg' },
    { name: '節制', type: 'YES', message: '「調整」のカード。バランスを取りながら進めば成功します。', img: 'images/15.temperance.jpg' },
    { name: '悪魔', type: 'NO', message: '「束縛」のカード。誘惑に注意。本当に大切なものを見失わないで。', img: 'images/16.devil.jpg' },
    { name: '塔', type: 'NO', message: '「破綻」のカード。急激な変化の兆し。慎重に行動を。', img: 'images/17.tower.jpg' },
    { name: '星', type: 'YES', message: '「希望」のカード。明るい未来が待っています。夢を諦めないで。', img: 'images/18.star.jpg' },
    { name: '月', type: 'NO', message: '「迷い」のカード。不安定な時期。情報をしっかり確認して。', img: 'images/19.moon.jpg' },
    { name: '太陽', type: 'YES', message: '「成功」のカード。最高の結果が期待できます。', img: 'images/20.sun.jpg' },
    { name: '審判', type: 'YES', message: '「復活」のカード。新しいチャンスの到来。過去を乗り越えて。', img: 'images/21.judgement.jpg' },
    { name: '世界', type: 'YES', message: '「完成」のカード。最高の達成感。完璧なエンディング。', img: 'images/22.world.jpg' },
    
    // 小アルカナ - ワンド（行動・情熱）
    { name: 'ワンドのエース', type: 'YES', message: '「新しい始まり」のカード。情熱的なスタートを。', img: 'images/23.ace-of-wands.jpg' },
    { name: 'ワンドの2', type: 'YES', message: '「計画」のカード。将来への明確なビジョンを持って。', img: 'images/24.2-wands.jpg' },
    { name: 'ワンドの3', type: 'YES', message: '「拡張」のカード。新しい機会が広がります。', img: 'images/25.3-wands.jpg' },
    { name: 'ワンドの4', type: 'YES', message: '「祝福」のカード。目標達成への道筋が見えます。', img: 'images/26.4-wands.jpg' },
    { name: 'ワンドの5', type: 'NO', message: '「競争」のカード。争いは避けて協調を。', img: 'images/27.5-wands.jpg' },
    { name: 'ワンドの6', type: 'YES', message: '「勝利」のカード。努力が認められる時。', img: 'images/28.6-wands.jpg' },
    { name: 'ワンドの7', type: 'NO', message: '「防御」のカード。困難に立ち向かう準備を。', img: 'images/29.7-wands.jpg' },
    { name: 'ワンドの8', type: 'YES', message: '「速度」のカード。物事が急速に進展します。', img: 'images/30.8-wands.jpg' },
    { name: 'ワンドの9', type: 'NO', message: '「忍耐」のカード。もう少し努力が必要。', img: 'images/31.9-wands.jpg' },
    { name: 'ワンドの10', type: 'NO', message: '「重荷」のカード。責任が重いですが完成は近い。', img: 'images/32.10-wands.jpg' },
    { name: 'ワンドのペイジ', type: 'YES', message: '「探求」のカード。新しいことを学ぶ機会。', img: 'images/33.page-wands.jpg' },
    { name: 'ワンドのナイト', type: 'YES', message: '「行動」のカード。情熱を持って行動する時。', img: 'images/34.knight-wands.jpg' },
    { name: 'ワンドのクイーン', type: 'YES', message: '「自信」のカード。あなたの魅力が輝きます。', img: 'images/35.queen-wands.jpg' },
    { name: 'ワンドのキング', type: 'YES', message: '「リーダーシップ」のカード。統率力を発揮して。', img: 'images/36.king-wands.jpg' },
    
    // 小アルカナ - カップ（感情・愛）
    { name: 'カップのエース', type: 'YES', message: '「新しい愛」のカード。感情的な充実が待っています。', img: 'images/37.ace-cups.jpg' },
    { name: 'カップの2', type: 'YES', message: '「愛」のカード。深いつながりが生まれます。', img: 'images/38.2-cups.jpg' },
    { name: 'カップの3', type: 'YES', message: '「友情」のカード。周りの人々と喜びを分かち合って。', img: 'images/39.3-cups.jpg' },
    { name: 'カップの4', type: 'NO', message: '「無関心」のカード。新しい機会に目を向けて。', img: 'images/40.4-cups.jpg' },
    { name: 'カップの5', type: 'NO', message: '「失望」のカード。残されたものに目を向けて。', img: 'images/41.5-cups.jpg' },
    { name: 'カップの6', type: 'YES', message: '「ノスタルジア」のカード。過去の美しい思い出に感謝。', img: 'images/42.6-cups.jpg' },
    { name: 'カップの7', type: 'NO', message: '「幻想」のカード。現実的な判断が必要。', img: 'images/43.7-cups.jpg' },
    { name: 'カップの8', type: 'NO', message: '「放棄」のカード。新しい道を探求する時。', img: 'images/44.8-cups.jpg' },
    { name: 'カップの9', type: 'YES', message: '「満足」のカード。願いが叶い満足を得られます。', img: 'images/45.9-cups.jpg' },
    { name: 'カップの10', type: 'YES', message: '「幸福」のカード。家族や愛する人との調和。', img: 'images/46.10-cups.jpg' },
    { name: 'カップのペイジ', type: 'YES', message: '「感受性」のカード。新しいインスピレーションを。', img: 'images/47.page-cups.jpg' },
    { name: 'カップのナイト', type: 'YES', message: '「ロマンス」のカード。魅力的なアプローチを。', img: 'images/48.knight-cups.jpg' },
    { name: 'カップのクイーン', type: 'YES', message: '「直感」のカード。共感力があなたを導きます。', img: 'images/49.queen-cups.jpg' },
    { name: 'カップのキング', type: 'YES', message: '「感情の統制」のカード。思いやり深い指導を。', img: 'images/50.king-cups.jpg' },
    
    // 小アルカナ - ソード（思考・困難）
    { name: 'ソードのエース', type: 'YES', message: '「明晰さ」のカード。新しいアイデアが浮かびます。', img: 'images/51.ace-swords.jpg' },
    { name: 'ソードの2', type: 'NO', message: '「決断」のカード。慎重に選択する必要があります。', img: 'images/52.2-swords.jpg' },
    { name: 'ソードの3', type: 'NO', message: '「悲しみ」のカード。辛い時期ですが成長の機会。', img: 'images/53.3-swords.jpg' },
    { name: 'ソードの4', type: 'NO', message: '「休息」のカード。心身の休息を取りましょう。', img: 'images/54.4-swords.jpg' },
    { name: 'ソードの5', type: 'NO', message: '「敗北」のカード。和解の道を見つけて。', img: 'images/55.5-swords.jpg' },
    { name: 'ソードの6', type: 'YES', message: '「移行」のカード。困難から抜け出せます。', img: 'images/56.6-swords.jpg' },
    { name: 'ソードの7', type: 'NO', message: '「欺瞞」のカード。誠実さを保ちましょう。', img: 'images/57.7-swords.jpg' },
    { name: 'ソードの8', type: 'NO', message: '「束縛」のカード。制限は一時的です。', img: 'images/58.8-swords.jpg' },
    { name: 'ソードの9', type: 'NO', message: '「不安」のカード。恐怖から解放される日が来ます。', img: 'images/59.9-swords.jpg' },
    { name: 'ソードの10', type: 'NO', message: '「破滅」のカード。最悪の状況も終わりがあります。', img: 'images/60.10-swords.jpg' },
    { name: 'ソードのペイジ', type: 'YES', message: '「好奇心」のカード。知的な探求を大切に。', img: 'images/61.page-swords.jpg' },
    { name: 'ソードのナイト', type: 'YES', message: '「行動」のカード。勇気を持って進みましょう。', img: 'images/62.knight-swords.jpg' },
    { name: 'ソードのクイーン', type: 'YES', message: '「知性」のカード。明晰な判断力があります。', img: 'images/63.queen-swords.jpg' },
    { name: 'ソードのキング', type: 'YES', message: '「知性」のカード。論理的思考で解決できます。', img: 'images/64.king-swords.jpg' },
    
    // 小アルカナ - ペンタクル（物質・成功）
    { name: 'ペンタクルのエース', type: 'YES', message: '「新しい機会」のカード。物質的な成功の兆し。', img: 'images/65.ace-pentacles.jpg' },
    { name: 'ペンタクルの2', type: 'NO', message: '「バランス」のカード。優先順位を整理して。', img: 'images/66.2-pentacles.jpg' },
    { name: 'ペンタクルの3', type: 'YES', message: '「技術」のカード。協力で大きな成果を。', img: 'images/67.3-pentacles.jpg' },
    { name: 'ペンタクルの4', type: 'NO', message: '「所有」のカード。柔軟性も大切に。', img: 'images/68.4-pentacles.jpg' },
    { name: 'ペンタクルの5', type: 'NO', message: '「困窮」のカード。助けを求めることも大切。', img: 'images/69.5-pentacles.jpg' },
    { name: 'ペンタクルの6', type: 'YES', message: '「寛大さ」のカード。与えることで豊かになります。', img: 'images/70.6-pentacles.jpg' },
    { name: 'ペンタクルの7', type: 'NO', message: '「努力」のカード。成果が現れるまで忍耐を。', img: 'images/71.7-pentacles.jpg' },
    { name: 'ペンタクルの8', type: 'YES', message: '「技術」のカード。努力が実を結びます。', img: 'images/72.8-pentacles.jpg' },
    { name: 'ペンタクルの9', type: 'YES', message: '「独立」のカード。豊かな生活を手にできます。', img: 'images/73.9-pentacles.jpg' },
    { name: 'ペンタクルの10', type: 'YES', message: '「世代」のカード。家族の繁栄と安定。', img: 'images/74.10-pentacles.jpg' },
    { name: 'ペンタクルのペイジ', type: 'YES', message: '「学習」のカード。実用的なスキルを学んで。', img: 'images/75.page-pentacles.jpg' },
    { name: 'ペンタクルのナイト', type: 'YES', message: '「責任感」のカード。着実に進めば成功します。', img: 'images/76.knight-pentacles.jpg' },
    { name: 'ペンタクルのクイーン', type: 'YES', message: '「母性」のカード。実用的な知恵を活かして。', img: 'images/77.queen-pentacles.jpg' },
    { name: 'ペンタクルのキング', type: 'YES', message: '「富」のカード。安定した成功を手にできます。', img: 'images/78.king-pentacles.jpg' }
  ];

  const preDrawDiv = document.getElementById('pre-draw');
  const cardRoulette = document.getElementById('card-roulette');
  const drawButton = document.getElementById('draw-button');
  const resultDiv = document.getElementById('result');
  const resultCardImage = document.getElementById('result-card-image');
  const resultMessage = document.getElementById('result-message');
  const resetButton = document.getElementById('reset-button');
  const closeButton = document.getElementById('close-button');

  let intervalId;

  function createCardBack(index) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.style.zIndex = index;
    
    // カード裏面画像を使用
    cardElement.style.backgroundImage = 'url("images/card-back-1.jpg")';
    cardElement.style.backgroundSize = 'cover';
    cardElement.style.backgroundPosition = 'center';
    cardElement.innerHTML = ''; // テキストを削除
    
    return cardElement;
  }

  function setupRoulette() {
    resultDiv.classList.add('hidden');
    preDrawDiv.classList.remove('hidden');
    cardRoulette.innerHTML = '';
    
    for (let i = 0; i < 5; i++) {
        cardRoulette.appendChild(createCardBack(i));
    }
  }

  function startRoulette() {
    drawButton.disabled = true;
    let angle = 0;
    intervalId = setInterval(() => {
      angle += 15;
      const cardElements = cardRoulette.querySelectorAll('.card');
      cardElements.forEach((card, index) => {
          const rotation = angle + index * (360 / cardElements.length);
          card.style.transform = `rotateY(${rotation}deg) translateX(150px) rotateY(-${rotation}deg)`;
      });
    }, 50);

    setTimeout(() => {
        clearInterval(intervalId);
        const resultCard = cards[Math.floor(Math.random() * cards.length)];
        displayResult(resultCard);
        drawButton.disabled = false;
    }, 3000);
  }

  function displayResult(card) {
    preDrawDiv.classList.add('hidden');
    resultDiv.classList.remove('hidden');
    
    resultCardImage.src = card.img;
    resultCardImage.alt = card.name;
    
    const typeColor = card.type === 'YES' ? '#ff6a87' : '#6a87ff';
    resultMessage.innerHTML = `
      <h2 style="color: ${typeColor};">${card.type}</h2>
      <h3>${card.name}</h3>
      <p>${card.message}</p>
    `;
  }

  drawButton.addEventListener('click', startRoulette);
  resetButton.addEventListener('click', setupRoulette);
  closeButton.addEventListener('click', () => {
    window.location.href = '../omikuji/index.html';
  });

  // 初期化
  setupRoulette();
});