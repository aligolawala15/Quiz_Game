/* ============================================================
   QUIZVERSE — Difficulty Selection Screen
   ============================================================ */
(function (QV) {
  'use strict';
  const { esc } = QV;
  QV.Screens = QV.Screens || {};

  QV.Screens.difficulty = function (app) {
    QV.quizSetup = QV.quizSetup || {};
    // Guard: must have a category first.
    if (!QV.quizSetup.categoryId) { QV.go('categories'); return; }

    const cat = QV.getCategory(QV.quizSetup.categoryId);
    let selected = QV.quizSetup.difficulty || null;

    const wrap = document.createElement('div');
    wrap.className = 'screen';
    wrap.innerHTML = `
      <div class="crumbs">
        <span class="c-step done" id="crumbCat">✓ ${esc(cat.name)}</span><span class="sep">→</span>
        <span class="c-step now">2 · Difficulty</span><span class="sep">→</span>
        <span class="c-step">3 · Quiz</span>
      </div>
      <div class="section-head">
        <span class="eyebrow">Step 2 · ${cat.icon} ${esc(cat.name)}</span>
        <h2>Choose <span class="gradient-text">Difficulty</span></h2>
        <p>Higher difficulty means less time per question — and more of a challenge.</p>
      </div>
      <div class="grid-3" id="diffGrid" role="list"></div>
      <div class="select-footer">
        <button class="btn btn-ghost" id="backBtn">← Change Category</button>
        <button class="btn btn-primary btn-lg" id="startBtn" ${selected ? '' : 'disabled'}><span class="ico">🚀</span> START QUIZ</button>
      </div>`;
    app.appendChild(wrap);

    const grid = QV.el('#diffGrid', wrap);
    const startBtn = QV.el('#startBtn', wrap);

    function onSelect(id, card) {
      QV.Sound.select();
      selected = id;
      QV.quizSetup.difficulty = id;
      QV.els('.select-card', grid).forEach((c) => {
        const on = c.dataset.diff === id;
        c.classList.toggle('selected', on);
        c.setAttribute('aria-pressed', String(on));
      });
      startBtn.disabled = false;
    }

    QV.DIFFICULTIES.forEach((d) => {
      const card = QV.C.difficultyCard(d, d.id === selected, onSelect);
      card.setAttribute('role', 'listitem');
      grid.appendChild(card);
    });

    QV.el('#backBtn', wrap).onclick = () => { QV.Sound.click(); QV.go('categories'); };
    startBtn.onclick = () => {
      if (!selected) return;
      QV.Sound.click();
      QV.go('quiz');
    };
    QV.el('#crumbCat', wrap).onclick = () => { QV.Sound.click(); QV.go('categories'); };
    QV.el('#crumbCat', wrap).style.cursor = 'pointer';
  };
})(window.QV);
