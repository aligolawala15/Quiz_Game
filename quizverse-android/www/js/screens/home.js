/* ============================================================
   QUIZVERSE — Home Screen
   ============================================================ */
(function (QV) {
  'use strict';
  const { esc } = QV;

  QV.Screens = QV.Screens || {};

  QV.Screens.home = function (app) {
    const s = QV.Store.get();
    const li = QV.Store.levelInfo();
    const totalQ = QV.CATEGORIES.reduce((n, c) => n + (QV.QUESTIONS[c.id] || []).length, 0);

    const features = [
      { icon: '⚡', title: 'Fast Challenges', text: 'Quick quizzes designed to test your knowledge.' },
      { icon: '🧠', title: 'Multiple Categories', text: 'Choose from technology, science, history, sports and more.' },
      { icon: '🏆', title: 'Track Your Progress', text: 'Improve your score and beat your personal best.' },
    ];

    const wrap = document.createElement('div');
    wrap.className = 'screen';
    wrap.innerHTML = `
      <section class="hero">
        <div class="hero-copy">
          <span class="hero-badge"><span class="dot"></span> ${totalQ}+ questions · 6 categories</span>
          <h1>Test Your <span class="gradient-text">Knowledge.</span></h1>
          <p class="lead">Choose a category, challenge yourself, and become the ultimate quiz master.</p>
          <div class="hero-cta">
            <button class="btn btn-primary btn-lg" id="startBtn"><span class="ico">🚀</span> START QUIZ</button>
            <button class="btn btn-ghost btn-lg" id="exploreBtn"><span class="ico">🧭</span> EXPLORE CATEGORIES</button>
          </div>
          <div class="hero-stats">
            <div class="hero-stat"><b>${s.bestScore}</b><span>Best Score</span></div>
            <div class="hero-stat"><b>${s.totalQuizzes}</b><span>Quizzes Played</span></div>
            <div class="hero-stat"><b>🔥 ${s.streak}</b><span>Current Streak</span></div>
            <div class="hero-stat"><b>Lv ${li.cur.lvl}</b><span>${esc(li.cur.name)}</span></div>
          </div>
        </div>
        <div class="hero-visual">
          <div class="orb">
            <span class="ring r1"></span>
            <span class="ring r2"></span>
            <span class="q-mark">?</span>
          </div>
          <div class="orb-chip c1"><span class="em">💻</span> Technology</div>
          <div class="orb-chip c2"><span class="em">🔬</span> +10 pts</div>
          <div class="orb-chip c3"><span class="em">🏆</span> Quiz Master</div>
        </div>
      </section>

      <section aria-label="Features">
        <div class="features">
          ${features.map((f) => `
            <div class="card pad feature">
              <div class="f-ico">${f.icon}</div>
              <h3>${esc(f.title)}</h3>
              <p>${esc(f.text)}</p>
            </div>`).join('')}
        </div>
      </section>

      <section class="home-panels">
        <div class="card pad-lg">
          <h3 style="font-size:1.3rem;margin-bottom:6px">Jump into a category</h3>
          <p style="color:var(--text-3)">Pick a topic and start playing in seconds.</p>
          <div class="mini-cats" id="miniCats">
            ${QV.CATEGORIES.map((c) => `<button class="mini-cat" data-jump="${c.id}">${c.icon} ${esc(c.name)}</button>`).join('')}
          </div>
        </div>
        <div class="card pad-lg">
          <h3 style="font-size:1.3rem;margin-bottom:6px">Your progress</h3>
          <div class="level-block">
            <div class="lvl-row"><span>Level ${li.cur.lvl} · <b>${esc(li.cur.name)}</b></span><span>${s.xp} XP</span></div>
            ${QV.C.progressBar(li.pct)}
            <p style="color:var(--text-3);margin-top:10px;font-size:.9rem">
              ${li.next ? `${li.toNext} XP to <b style="color:var(--text)">Level ${li.next.lvl} · ${esc(li.next.name)}</b>` : 'Max level reached — you are a Quiz Master! 🏆'}
            </p>
          </div>
          <button class="btn btn-outline btn-sm btn-block" id="viewProfile" style="margin-top:16px">View full profile →</button>
        </div>
      </section>
    `;
    app.appendChild(wrap);

    QV.el('#startBtn', wrap).onclick = () => { QV.Sound.click(); QV.go('categories'); };
    QV.el('#exploreBtn', wrap).onclick = () => { QV.Sound.click(); QV.go('categories'); };
    QV.el('#viewProfile', wrap).onclick = () => { QV.Sound.click(); QV.go('profile'); };
    QV.els('[data-jump]', wrap).forEach((b) => {
      b.onclick = () => { QV.Sound.select(); QV.quizSetup = { categoryId: b.dataset.jump }; QV.go('difficulty'); };
    });
  };
})(window.QV);
