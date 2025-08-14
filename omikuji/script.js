// ----------------------------------
// 占いデータ
// スプレッドシートから読み込んだ最新のデータ（絵文字反映版）
// ----------------------------------

const fortunes = [
  {
    name: "大吉",
    message: "最大級のチャンスが到来！ ゴールドの輝きが「富」と「自信」を引き寄せます☀️ 自分へのご褒美に【18金ネックレス】を身につければ、さらに運気が加速！ 特別な一日を彩るアイテムをチェック👇",
    colorName: "ゴールド",
    colorCode: "gold",
    item: "高級ジュエリー",
    link: "https://example.com/dummy",
    probability: 10
  },
  {
    name: "吉",
    message: "小さな幸せが連鎖する一日に💙 パステルブルーで「人間関係の波」を穏やかに！ 手元から香る【天然成分ハンドクリーム】で、大切な人との触れ合い運UP↑ プレゼントにも大人気のアイテムです🎁",
    colorName: "パステルブルー",
    colorCode: "#a7c7e7",
    item: "ハンドクリーム",
    link: "https://example.com/dummy",
    probability: 30
  },
  {
    name: "中吉",
    message: "アイデアが光るチャンス日！ イエローが「集中力」をサポート🌟「 オシャレな【USB充電式ライト】で作業効率が変わるかも？ 在宅ワーク派に響く一言添えて✨",
    colorName: "イエロー",
    colorCode: "yellow",
    item: "デスクライト",
    link: "https://example.com/dummy",
    probability: 25
  },
  {
    name: "末吉",
    message: "穏やかな気持ちが開運のカギ🍀 ベージュで「日常の不安」を中和！ 【森林系アロマ】の香りでリラックス空間を演出すれば、思わぬ良い知らせが届くかも…？ 今なら詰め替え用オイル付き🎵",
    colorName: "ベージュ",
    colorCode: "beige",
    item: "アロマディフューザー",
    link: "https://example.com/dummy",
    probability: 20
  },
  {
    name: "凶",
    message: "ピンチは好機に変えよう！ レッドのパワーで「悪い流れを遮断」🔥 天然石の【邪気払いブレスレット】を身につけて、ネガティブエネルギーをリセット！ 自分を守る習慣から始めてみて💪",
    colorName: "レッド",
    colorCode: "red",
    item: "パワーストーンブレス",
    link: "https://example.com/dummy",
    probability: 15
  }
];


// ----------------------------------
// DOM要素の取得
// ----------------------------------

const omikujiBtn = document.getElementById('omikuji-btn');
const resultContainer = document.getElementById('result-container');
const resultContent = document.getElementById('result-content');
const closeBtn = document.getElementById('close-btn');
const itemLinkBtn = document.getElementById('item-link-btn');
const comingSoonBtns = document.querySelectorAll('.btn:disabled');
const personalReadingBtn = document.getElementById('personal-reading-btn');

// ----------------------------------
// 占いロジック
// ----------------------------------

function getRandomFortune() {
  const total = fortunes.reduce((sum, f) => sum + f.probability, 0);
  const rand = Math.random() * total;
  let cumulative = 0;
  for (const fortune of fortunes) {
    cumulative += fortune.probability;
    if (rand < cumulative) {
      return fortune;
    }
  }
  return fortunes[0];
}

function getTodayKey() {
  const today = new Date();
  return `fortune_${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
}

function getTodayFortune() {
  const key = getTodayKey();
  const saved = localStorage.getItem(key);
  if (saved) {
    return JSON.parse(saved);
  } else {
    const fortune = getRandomFortune();
    localStorage.setItem(key, JSON.stringify(fortune));
    return fortune;
  }
}

// ----------------------------------
// 結果表示ロジック
// ----------------------------------

function displayFortune() {
  const fortune = getTodayFortune();
  
  // 運勢名から絵文字を分離するロジックを削除（元に戻す）
  const fortuneText = fortune.name;

  resultContent.innerHTML = `
    <h2 style="font-family: 'Kiwi Maru', sans-serif !important; font-size: clamp(28px, calc(52 / 1200 * 100vw), 52px); margin: 0.5em 0; color: #ff6a87; display: flex; align-items: center; gap: 0.2em; font-weight: bold; line-height: 1.2; text-align: center;">
      <span class="fortune-text" style="font-family: 'Kiwi Maru', sans-serif !important; text-shadow: -1.5px -1.5px 0 #fff, 1.5px -1.5px 0 #fff, -1.5px 1.5px 0 #fff, 1.5px 1.5px 0 #fff; font-weight: bold; line-height: 1.2; text-align: center;">${fortuneText}</span>
    </h2>
    <div class="item-line" style="font-family: 'Kiwi Maru', sans-serif !important; font-size: clamp(18px, calc(26 / 1200 * 100vw), 26px); margin: 0.3em 0; color: #5c4846; display: flex; align-items: center; justify-content: center; gap: 0.5em; font-weight: 500; line-height: 1.4; text-align: center;">
      <p style="font-family: 'Kiwi Maru', sans-serif !important; margin: 0; font-weight: 500; line-height: 1.4; text-align: center;">
        <strong style="font-family: 'Kiwi Maru', sans-serif !important; font-weight: bold; line-height: 1.4; text-align: center;">ラッキーカラー：</strong>
        <span class="color-chip" style="background-color: ${fortune.colorCode}; display: inline-block; width: 1em; height: 1em; border-radius: 50%; border: 1px solid rgba(0,0,0,0.2);"></span>
        <span style="font-family: 'Kiwi Maru', sans-serif !important; font-weight: 500; line-height: 1.4; text-align: center;">${fortune.colorName}</span>
      </p>
    </div>
    <div class="item-line" style="font-family: 'Kiwi Maru', sans-serif !important; font-size: clamp(18px, calc(26 / 1200 * 100vw), 26px); margin: 0.3em 0; color: #5c4846; display: flex; align-items: center; justify-content: center; gap: 0.5em; font-weight: 500; line-height: 1.4; text-align: center;">
      <p style="font-family: 'Kiwi Maru', sans-serif !important; margin: 0; font-weight: 500; line-height: 1.4; text-align: center;"><strong style="font-family: 'Kiwi Maru', sans-serif !important; font-weight: bold; line-height: 1.4; text-align: center;">ラッキーアイテム：</strong><span style="font-family: 'Kiwi Maru', sans-serif !important; font-weight: 500; line-height: 1.4; text-align: center;">${fortune.item}</span></p>
    </div>
    <div class="advice" style="font-family: 'Kiwi Maru', sans-serif !important; font-size: clamp(16px, calc(22 / 1200 * 100vw), 22px); margin-top: 1em; padding: 1em; background-color: rgba(255, 255, 255, 0.6); border-radius: 10px; max-width: 80%; color: #5c4846; text-shadow: none; line-height: 1.6; font-weight: 400; text-align: center;">
      <p style="font-family: 'Kiwi Maru', sans-serif !important; margin: 0; font-weight: 400; line-height: 1.6; text-align: center;">${fortune.message}</p>
    </div>
  `;
  
  resultContainer.classList.remove('hidden');
}

// ----------------------------------
// イベントリスナーの設定
// ----------------------------------

omikujiBtn.addEventListener('click', displayFortune);

closeBtn.addEventListener('click', () => {
  resultContainer.classList.add('hidden');
});

itemLinkBtn.addEventListener('click', () => {
  alert('この機能は現在準備中です。お楽しみに！');
});

if (personalReadingBtn) {
  personalReadingBtn.addEventListener('click', () => {
    window.location.href = '../personal-reading-detail.html';
  });
}

comingSoonBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    alert('この機能は現在準備中です。お楽しみに！');
  });
});
