/* ============================================================
   QUIZVERSE — Result Screen
   ============================================================ */
(function (QV) {
  'use strict';
  const { esc } = QV;
  QV.Screens = QV.Screens || {};

  QV.Screens.result = function (app) {
    const r = QV.lastResult;
    if (!r) { QV.go('home'); return; }

    const cat = QV.getCategory(r.categoryId);
    const pct = r.accuracy;

    // Tier messaging
    let tier;
    if (pct >= 80) tier = { emoji: '🏆', title: 'Excellent!', sub: 'You are a Quiz Master!' };
    else if (pct >= 50) tier = { emoji: '👍', title: 'Good Job!', sub: 'Keep practicing and beat your best score.' };
    else tier = { emoji: '💪', title: 'Keep Going!', sub: 'Every attempt makes you better.' };

    const badges = [];
    if (r.isNewBest && r.score > 0) badges.push({ i: '⭐', t: 'New Best Score!' });
    if (r.perfect) badges.push({ i: '💯', t: 'Perfect Quiz' });
    if (r.comboMax >= 3) badges.push({ i: '🔥', t: `${r.comboMax} Answer Streak` });
    badges.push({ i: '✨', t: `+${r.xpGain} XP` });

    // Ring geometry
    const R = 76, CIRC = 2 * Math.PI * R;
    const offset = CIRC * (1 - pct / 100);

    const wrap = document.createElement('div');
    wrap.className = 'screen result-wrap';
    wrap.innerHTML = `
      <div class="card glass result-hero">
        <div class="result-emoji">${tier.emoji}</div>
        <h2>${esc(tier.title)}</h2>
        <p class="sub">${esc(tier.sub)}</p>

        ${r.isNewBest && r.score > 0 ? `<div class="new-best">🎉 New personal best!</div>` : ''}

        <div class="result-ring">
          <svg width="168" height="168" viewBox="0 0 168 168" aria-hidden="true">
            <defs><linearGradient id="rg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#7C3AED"/><stop offset="100%" stop-color="#06B6D4"/>
            </linearGradient></defs>
            <circle class="track" cx="84" cy="84" r="${R}"></circle>
            <circle class="bar" id="ringBar" cx="84" cy="84" r="${R}" stroke-dasharray="${CIRC}" stroke-dashoffset="${CIRC}"></circle>
          </svg>
          <div class="r-center"><b id="ringPct">0%</b><span>Accuracy</span></div>
        </div>

        <div class="result-score" aria-label="Your score">
          <span id="bigScore">0</span> <small>/ ${r.maxScore}</small>
        </div>
        <p style="color:var(--text-3);margin-top:4px">${cat.icon} ${esc(cat.name)} · ${esc(r.difficulty)}</p>

        <div class="stat-grid">
          <div class="card stat-tile ok"><b id="stCorrect">0</b><span>Correct</span></div>
          <div class="card stat-tile err"><b id="stWrong">0</b><span>Wrong</span></div>
          <div class="card stat-tile acc"><b id="stAcc">0%</b><span>Accuracy</span></div>
          <div class="card stat-tile time"><b>${QV.fmtTime(r.timeTaken)}</b><span>Time</span></div>
        </div>

        <div class="result-badges">
          ${badges.map((b) => `<span class="rw-chip">${b.i} ${esc(b.t)}</span>`).join('')}
        </div>

        <div class="result-actions">
          <button class="btn btn-primary btn-lg" id="againBtn"><span class="ico">🔁</span> PLAY AGAIN</button>
          <button class="btn btn-ghost" id="changeBtn"><span class="ico">🧭</span> CHANGE CATEGORY</button>
          <button class="btn btn-outline" id="lbBtn"><span class="ico">🏆</span> LEADERBOARD</button>
          <button class="btn btn-outline" id="homeBtn"><span class="ico">🏠</span> HOME</button>
        </div>
      </div>`;
    app.appendChild(wrap);

    // Animate the numbers + ring
    requestAnimationFrame(() => {
      QV.el('#ringBar', wrap).style.strokeDashoffset = String(offset);
      QV.countUp(QV.el('#bigScore', wrap), r.score, 1000);
      QV.countUp(QV.el('#ringPct', wrap), pct, 1100, '%');
      QV.countUp(QV.el('#stCorrect', wrap), r.correct, 800);
      QV.countUp(QV.el('#stWrong', wrap), r.wrong, 800);
      QV.countUp(QV.el('#stAcc', wrap), pct, 900, '%');
    });

    if (pct >= 80) { QV.C.confetti(); }

    QV.el('#againBtn', wrap).onclick = () => { QV.Sound.click(); QV.go('quiz'); };
    QV.el('#changeBtn', wrap).onclick = () => { QV.Sound.click(); QV.go('categories'); };
    QV.el('#lbBtn', wrap).onclick = () => { QV.Sound.click(); QV.go('leaderboard'); };
    QV.el('#homeBtn', wrap).onclick = () => { QV.Sound.click(); QV.go('home'); };
  };
})(window.QV);
