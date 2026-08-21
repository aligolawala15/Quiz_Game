/* ============================================================
   QUIZVERSE — Leaderboard Screen
   ============================================================ */
(function (QV) {
  'use strict';
  const { esc } = QV;
  QV.Screens = QV.Screens || {};

  QV.Screens.leaderboard = function (app) {
    const board = QV.Store.getLeaderboard();
    const medals = ['🥇', '🥈', '🥉'];
    const top3 = board.slice(0, 3);
    const rest = board.slice(3);

    // Podium order: 2nd, 1st, 3rd
    const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean);
    const posClass = { 0: 'p2', 1: 'p1', 2: 'p3' };

    const wrap = document.createElement('div');
    wrap.className = 'screen lb-wrap';
    wrap.innerHTML = `
      <div class="section-head">
        <span class="eyebrow">Rankings</span>
        <h2>🏆 <span class="gradient-text">Global Leaderboard</span></h2>
        <p>Beat the top players and claim your spot. Your best score updates automatically.</p>
      </div>

      <div class="podium" id="podium"></div>
      <div id="lbList"></div>

      <div style="text-align:center;margin-top:26px">
        <button class="btn btn-primary btn-lg" id="playBtn"><span class="ico">🚀</span> Play & Climb the Ranks</button>
      </div>`;
    app.appendChild(wrap);

    // Podium
    const podium = QV.el('#podium', wrap);
    podiumOrder.forEach((entry, i) => {
      const realRank = board.indexOf(entry) + 1;
      const col = document.createElement('div');
      col.className = 'podium-col ' + (posClass[i] || '');
      col.innerHTML = `
        <div class="podium-card ${entry.me ? 'me' : ''}">
          <div class="medal">${medals[realRank - 1] || ''}</div>
          <div class="avatar" style="background:${QV.colorFor(entry.name)}">${QV.initials(entry.name)}</div>
          <div class="p-name">${esc(entry.name)}</div>
          <div class="p-score">${entry.score}</div>
        </div>
        <div class="p-bar"></div>`;
      podium.appendChild(col);
    });

    // Full list (rows 4+)
    const list = QV.el('#lbList', wrap);
    rest.forEach((entry) => {
      const rank = board.indexOf(entry) + 1;
      const row = document.createElement('div');
      row.className = 'lb-row' + (entry.me ? ' me' : '');
      row.innerHTML = `
        <div class="lb-rank">${rank}</div>
        <div class="lb-avatar" style="background:${QV.colorFor(entry.name)}">${QV.initials(entry.name)}</div>
        <div class="lb-name">${esc(entry.name)}<small>${entry.me ? 'That\u2019s you!' : 'Quiz player'}</small></div>
        <div class="lb-pts">${entry.score}<small>points</small></div>`;
      list.appendChild(row);
    });

    // If player is in top 3 (no row rendered), show a friendly note
    if (!rest.length) {
      list.innerHTML = `<p style="text-align:center;color:var(--text-3);margin-top:10px">Play more quizzes to grow the leaderboard!</p>`;
    }

    QV.el('#playBtn', wrap).onclick = () => { QV.Sound.click(); QV.go('categories'); };
  };
})(window.QV);
