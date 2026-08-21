/* ============================================================
   QUIZVERSE — Category Selection Screen
   ============================================================ */
(function (QV) {
  'use strict';
  QV.Screens = QV.Screens || {};

  QV.Screens.categories = function (app) {
    QV.quizSetup = QV.quizSetup || {};
    let selected = QV.quizSetup.categoryId || null;

    const wrap = document.createElement('div');
    wrap.className = 'screen';
    wrap.innerHTML = `
      <div class="crumbs">
        <span class="c-step now">1 · Category</span><span class="sep">→</span>
        <span class="c-step">2 · Difficulty</span><span class="sep">→</span>
        <span class="c-step">3 · Quiz</span>
      </div>
      <div class="section-head">
        <span class="eyebrow">Step 1</span>
        <h2>Choose a <span class="gradient-text">Category</span></h2>
        <p>Select the topic you want to be challenged on.</p>
      </div>
      <div class="grid-3" id="catGrid" role="list"></div>
      <div class="select-footer">
        <span class="hint" id="catHint">${selected ? '' : 'Pick a category to continue.'}</span>
        <button class="btn btn-primary btn-lg" id="continueBtn" ${selected ? '' : 'disabled'}>CONTINUE →</button>
      </div>`;
    app.appendChild(wrap);

    const grid = QV.el('#catGrid', wrap);
    const continueBtn = QV.el('#continueBtn', wrap);
    const hint = QV.el('#catHint', wrap);

    function onSelect(id, card) {
      QV.Sound.select();
      selected = id;
      QV.quizSetup.categoryId = id;
      QV.els('.select-card', grid).forEach((c) => {
        const on = c.dataset.cat === id;
        c.classList.toggle('selected', on);
        c.setAttribute('aria-pressed', String(on));
      });
      continueBtn.disabled = false;
      hint.textContent = QV.getCategory(id).name + ' selected.';
    }

    QV.CATEGORIES.forEach((cat) => {
      const card = QV.C.categoryCard(cat, cat.id === selected, onSelect);
      card.setAttribute('role', 'listitem');
      grid.appendChild(card);
    });

    continueBtn.onclick = () => {
      if (!selected) return;
      QV.Sound.click();
      QV.go('difficulty');
    };
  };
})(window.QV);
