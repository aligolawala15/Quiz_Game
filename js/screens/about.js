/* ============================================================
   QUIZVERSE — About Screen
   ============================================================ */
(function (QV) {
  'use strict';
  QV.Screens = QV.Screens || {};

  QV.Screens.about = function (app) {
    const totalQ = QV.CATEGORIES.reduce((n, c) => n + (QV.QUESTIONS[c.id] || []).length, 0);

    const points = [
      { i: '🎯', t: 'Smart Quizzes', d: 'Questions are randomized every round, with shuffled options so no two runs feel the same.' },
      { i: '⏱️', t: 'Beat the Clock', d: 'A per-question timer rewards fast, confident answers with bonus points.' },
      { i: '🔥', t: 'Streaks & XP', d: 'Earn XP, climb levels from Beginner to Quiz Master, and keep your win streak alive.' },
      { i: '🏆', t: 'Leaderboard', d: 'Your best score is tracked locally and ranked against the global board.' },
      { i: '🌙', t: 'Themes & Sound', d: 'Switch between polished dark and light modes, with optional game sound effects.' },
      { i: '💾', t: 'Saves Automatically', d: 'All progress, stats and preferences persist right in your browser.' },
    ];

    const wrap = document.createElement('div');
    wrap.className = 'screen';
    wrap.innerHTML = `
      <div class="section-head">
        <span class="eyebrow">About</span>
        <h2>Welcome to <span class="gradient-text">QUIZVERSE</span></h2>
        <p>Challenge Your Mind. Beat Your Best. A modern quiz gaming platform with ${totalQ}+ questions across 6 categories and 3 difficulty levels.</p>
      </div>

      <div class="features" style="grid-template-columns:repeat(2,1fr)">
        ${points.map((p) => `
          <div class="card pad feature">
            <div class="f-ico">${p.i}</div>
            <h3>${QV.esc(p.t)}</h3>
            <p>${QV.esc(p.d)}</p>
          </div>`).join('')}
      </div>

      <div class="card pad-lg" style="margin-top:24px;text-align:center">
        <h3 style="font-size:1.4rem;margin-bottom:8px">How to play</h3>
        <p style="color:var(--text-3);max-width:620px;margin:0 auto 18px">
          Pick a category → choose a difficulty → answer 10 multiple-choice questions before the timer runs out.
          Correct answers earn +10 points, and answering quickly adds a speed bonus. Aim for a perfect score!
        </p>
        <button class="btn btn-primary btn-lg" id="startBtn"><span class="ico">🚀</span> Start Playing</button>
      </div>`;
    app.appendChild(wrap);

    QV.el('#startBtn', wrap).onclick = () => { QV.Sound.click(); QV.go('categories'); };
  };
})(window.QV);
