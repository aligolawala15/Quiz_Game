/* ============================================================
   QUIZVERSE — Profile Screen (stats, level, achievements)
   ============================================================ */
(function (QV) {
  'use strict';
  const { esc } = QV;
  QV.Screens = QV.Screens || {};

  QV.Screens.profile = function (app) {
    const s = QV.Store.get();
    const li = QV.Store.levelInfo();
    const defs = QV.Store.getAchievementDefs();

    const stats = [
      { i: '🎮', b: s.totalQuizzes, l: 'Total Quizzes' },
      { i: '⭐', b: s.bestScore, l: 'Highest Score' },
      { i: '📊', b: QV.Store.averageScore(), l: 'Average Score' },
      { i: '✅', b: s.totalCorrect, l: 'Correct Answers' },
      { i: '🎯', b: QV.Store.accuracy() + '%', l: 'Accuracy' },
      { i: '🏅', b: QV.Store.bestCategory(), l: 'Best Category' },
    ];

    const wrap = document.createElement('div');
    wrap.className = 'screen';
    wrap.innerHTML = `
      <div class="card glass profile-head">
        <div class="profile-avatar">${QV.initials(s.playerName)}</div>
        <div class="profile-id" style="flex:1;min-width:200px">
          <h2 id="pName">${esc(s.playerName)}</h2>
          <div class="lvl-name">Level ${li.cur.lvl} · ${esc(li.cur.name)} · 🔥 ${s.streak} streak</div>
          <div class="level-block">
            <div class="lvl-row"><span>${s.xp} XP</span><span>${li.next ? `${li.toNext} XP to Lv ${li.next.lvl}` : 'Max level'}</span></div>
            ${QV.C.progressBar(li.pct)}
          </div>
        </div>
        <button class="btn btn-ghost btn-sm" id="editName">✏️ Edit name</button>
      </div>

      <div class="stats-grid">
        ${stats.map((st) => `
          <div class="card pstat">
            <div class="p-ico">${st.i}</div>
            <b>${esc(String(st.b))}</b>
            <span>${esc(st.l)}</span>
          </div>`).join('')}
      </div>

      <div class="section-head" style="margin-top:36px;margin-bottom:20px">
        <h2 style="font-size:1.6rem">🏅 Achievements <span style="color:var(--text-3);font-size:1rem">(${s.achievements.length}/${defs.length})</span></h2>
      </div>
      <div class="ach-grid" id="achGrid"></div>

      <div style="display:flex;gap:12px;justify-content:center;margin-top:30px;flex-wrap:wrap">
        <button class="btn btn-primary" id="playBtn"><span class="ico">🚀</span> Play a Quiz</button>
        <button class="btn btn-outline" id="resetBtn">Reset Progress</button>
      </div>`;
    app.appendChild(wrap);

    // Achievements
    const grid = QV.el('#achGrid', wrap);
    defs.forEach((a) => {
      const unlocked = s.achievements.includes(a.id);
      const cell = document.createElement('div');
      cell.className = 'ach ' + (unlocked ? 'unlocked' : 'locked');
      cell.innerHTML = `
        ${unlocked ? '<span class="glow" title="Unlocked">✓</span>' : '<span class="lock-i" title="Locked">🔒</span>'}
        <div class="a-ico">${a.icon}</div>
        <h4>${esc(a.name)}</h4>
        <p>${esc(a.desc)}</p>`;
      grid.appendChild(cell);
    });

    QV.el('#editName', wrap).onclick = () => {
      QV.Sound.click();
      const name = window.prompt('Enter your player name:', s.playerName);
      if (name && name.trim()) {
        QV.Store.setName(name);
        QV.C.renderNavbar();
        QV.go('profile');
      }
    };

    QV.el('#playBtn', wrap).onclick = () => { QV.Sound.click(); QV.go('categories'); };

    QV.el('#resetBtn', wrap).onclick = () => {
      QV.Sound.click();
      if (window.confirm('Reset all progress, scores, XP and achievements? This cannot be undone.')) {
        QV.Store.reset();
        QV.C.renderNavbar();
        QV.C.toast({ icon: '🧹', title: 'Progress reset', sub: 'A fresh start awaits!' });
        QV.go('profile');
      }
    };
  };
})(window.QV);
