/* ============================================================
   QUIZVERSE — Quiz Screen (timer, scoring, feedback)
   ============================================================ */
(function (QV) {
  'use strict';
  const { esc, h } = QV;
  QV.Screens = QV.Screens || {};

  const KEYS = ['A', 'B', 'C', 'D'];
  const BASE_POINTS = 10;      // per correct answer
  const MAX_BONUS = 5;         // max speed bonus per question
  const MAX_PER_Q = BASE_POINTS + MAX_BONUS;

  // Live quiz session object
  let sess = null;
  let timerId = null;

  QV.Screens.quiz = function (app) {
    QV.quizSetup = QV.quizSetup || {};
    if (!QV.quizSetup.categoryId || !QV.quizSetup.difficulty) { QV.go('categories'); return; }

    // Build a randomized quiz. Handle failure gracefully.
    const built = QV.buildQuiz(QV.quizSetup.categoryId, QV.quizSetup.difficulty, 10);
    if (built.error || !built.questions || !built.questions.length) {
      renderError(app, built.error || 'Could not load questions.');
      return;
    }

    const cat = QV.getCategory(built.meta.categoryId);
    sess = {
      questions: built.questions,
      meta: built.meta,
      idx: 0,
      score: 0,
      correct: 0,
      wrong: 0,
      speedBonusCount: 0,
      answered: false,
      timeLeft: built.meta.timePerQ,
      startTime: Date.now(),
      comboMax: 0,
      combo: 0,
    };

    const wrap = document.createElement('div');
    wrap.className = 'screen quiz-wrap';
    wrap.innerHTML = `
      <div class="quiz-top">
        <div class="quiz-meta">
          <span class="q-count">Question <b id="qNum">1</b> / ${sess.questions.length}</span>
          <span class="q-cat-tag">${cat.icon} ${esc(cat.name)} · ${esc(sess.meta.difficulty)}</span>
          <span class="combo" id="combo" hidden>🔥 <b id="comboN">0</b> streak</span>
        </div>
        <div style="display:flex;align-items:center;gap:14px">
          <span class="q-score-live"><span class="em">⭐</span> <span id="scoreLive">0</span></span>
          <span id="timerSlot"></span>
        </div>
      </div>
      ${QV.C.progressBar(0)}
      <div class="card question-card" id="qCard"></div>
    `;
    app.appendChild(wrap);

    // Mount timer ring
    const timer = QV.C.timerRing();
    QV.el('#timerSlot', wrap).appendChild(timer.node);
    sess.timerUI = timer;

    // Cache nodes
    sess.nodes = {
      wrap,
      qNum: QV.el('#qNum', wrap),
      scoreLive: QV.el('#scoreLive', wrap),
      progress: QV.el('.progress i', wrap),
      progressWrap: QV.el('.progress', wrap),
      qCard: QV.el('#qCard', wrap),
      combo: QV.el('#combo', wrap),
      comboN: QV.el('#comboN', wrap),
    };

    // Keyboard support: 1-4 / A-D to answer, Enter/N for next
    sess.keyHandler = (e) => onKey(e);
    document.addEventListener('keydown', sess.keyHandler);

    renderQuestion();
  };

  // Called by router before leaving the quiz screen
  QV.Screens.quiz.cleanup = function () {
    stopTimer();
    if (sess && sess.keyHandler) document.removeEventListener('keydown', sess.keyHandler);
  };

  /* -------------------- Rendering a question -------------------- */
  function renderQuestion() {
    const q = sess.questions[sess.idx];
    sess.answered = false;
    sess.timeLeft = sess.meta.timePerQ;

    const n = sess.nodes;
    n.qNum.textContent = String(sess.idx + 1);
    const pct = (sess.idx / sess.questions.length) * 100;
    n.progress.style.width = pct + '%';
    n.progressWrap.setAttribute('aria-valuenow', String(Math.round(pct)));

    n.qCard.innerHTML = `
      <div class="q-text">${esc(q.q)}</div>
      <div class="answers" id="answers" role="listbox" aria-label="Answer options"></div>
      <div id="explainSlot"></div>
      <div class="quiz-actions" id="actions"></div>`;

    const answersEl = QV.el('#answers', n.qCard);
    q.options.forEach((opt, i) => {
      const a = h('button', { class: 'answer', 'data-i': i, role: 'option', 'aria-label': `${KEYS[i]}. ${opt}` }, [
        h('span', { class: 'key' }, KEYS[i]),
        h('span', { class: 'a-text' }, opt),
        h('span', { class: 'a-mark', 'aria-hidden': 'true' }, ''),
      ]);
      a.onclick = () => selectAnswer(i);
      answersEl.appendChild(a);
    });

    sess.timerUI.update(sess.timeLeft, sess.meta.timePerQ);
    startTimer();
  }

  /* -------------------- Timer -------------------- */
  function startTimer() {
    stopTimer();
    timerId = setInterval(() => {
      sess.timeLeft -= 1;
      sess.timerUI.update(Math.max(0, sess.timeLeft), sess.meta.timePerQ);
      if (sess.timeLeft <= 3 && sess.timeLeft > 0 && !sess.answered) QV.Sound.tick();
      if (sess.timeLeft <= 0) {
        stopTimer();
        onTimeout();
      }
    }, 1000);
  }
  function stopTimer() { if (timerId) { clearInterval(timerId); timerId = null; } }

  function onTimeout() {
    if (sess.answered) return;
    // Auto-submit as no answer -> counts wrong, reveals correct.
    lockAndReveal(-1, true);
  }

  /* -------------------- Answering -------------------- */
  function selectAnswer(i) {
    if (sess.answered) return;          // prevent multiple selection
    stopTimer();
    lockAndReveal(i, false);
  }

  function lockAndReveal(chosenIdx, timedOut) {
    sess.answered = true;
    const q = sess.questions[sess.idx];
    const answersEl = QV.el('#answers', sess.nodes.qCard);
    answersEl.classList.add('locked');
    const buttons = QV.els('.answer', answersEl);

    const isCorrect = chosenIdx === q.answer;

    // Scoring
    let gained = 0;
    if (isCorrect) {
      gained = BASE_POINTS;
      // Speed bonus: fraction of time remaining, up to MAX_BONUS
      const bonus = Math.round((sess.timeLeft / sess.meta.timePerQ) * MAX_BONUS);
      if (bonus > 0) { gained += bonus; sess.speedBonusCount += (bonus >= 3 ? 1 : 0); }
      sess.score += gained;
      sess.correct += 1;
      sess.combo += 1;
      sess.comboMax = Math.max(sess.comboMax, sess.combo);
      QV.Sound.correct();
      flash('correct');
    } else {
      sess.wrong += 1;
      sess.combo = 0;
      QV.Sound.wrong();
      flash('wrong');
    }

    // Combo chip
    if (sess.combo >= 2) {
      sess.nodes.combo.hidden = false;
      sess.nodes.comboN.textContent = String(sess.combo);
    } else {
      sess.nodes.combo.hidden = true;
    }

    // Mark answer states
    buttons.forEach((btn) => {
      const bi = Number(btn.dataset.i);
      const mark = btn.querySelector('.a-mark');
      if (bi === q.answer) { btn.classList.add('correct'); mark.textContent = '✓'; }
      else if (bi === chosenIdx) { btn.classList.add('wrong'); mark.textContent = '✗'; }
      else btn.classList.add('dim');
    });

    // Animate live score
    animateScore(sess.score);

    // Explanation
    const slot = QV.el('#explainSlot', sess.nodes.qCard);
    let msg;
    if (timedOut) msg = `<b>⏱ Time's up!</b> The correct answer was <b>${esc(q.options[q.answer])}</b>.`;
    else if (isCorrect) msg = `<b>✓ Correct!</b> +${gained} points${gained > BASE_POINTS ? ' (speed bonus!)' : ''}`;
    else msg = `<b>✗ Not quite.</b> The correct answer was <b>${esc(q.options[q.answer])}</b>.`;
    if (q.explain) msg += ` ${esc(q.explain)}`;
    slot.innerHTML = `<div class="explain">${msg}</div>`;

    // Next / Finish button
    const isLast = sess.idx >= sess.questions.length - 1;
    const actions = QV.el('#actions', sess.nodes.qCard);
    const nextBtn = h('button', { class: 'btn btn-primary btn-lg', id: 'nextBtn' }, isLast ? 'SEE RESULTS →' : 'NEXT QUESTION →');
    nextBtn.onclick = () => { QV.Sound.click(); nextQuestion(); };
    actions.appendChild(nextBtn);
    nextBtn.focus();
  }

  function nextQuestion() {
    if (sess.idx >= sess.questions.length - 1) { finishQuiz(); return; }
    sess.idx += 1;
    renderQuestion();
  }

  /* -------------------- Finish -------------------- */
  function finishQuiz() {
    stopTimer();
    if (sess.keyHandler) document.removeEventListener('keydown', sess.keyHandler);

    const total = sess.questions.length;
    const maxScore = total * MAX_PER_Q;
    const timeTaken = Math.round((Date.now() - sess.startTime) / 1000);
    const accuracy = total ? Math.round((sess.correct / total) * 100) : 0;
    const perfect = sess.correct === total && total > 0;

    const result = {
      categoryId: sess.meta.categoryId,
      difficulty: sess.meta.difficulty,
      score: sess.score,
      maxScore,
      correct: sess.correct,
      wrong: sess.wrong,
      total,
      timeTaken,
      accuracy,
      perfect,
      speedBonusCount: sess.speedBonusCount,
      comboMax: sess.comboMax,
    };

    QV.Sound.complete();
    const outcome = QV.Store.recordQuiz(result);
    QV.lastResult = Object.assign({}, result, outcome);
    sess = null;
    QV.go('result');
  }

  /* -------------------- Helpers -------------------- */
  function animateScore(to) {
    const node = sess.nodes.scoreLive;
    const from = Number(node.textContent) || 0;
    const start = performance.now();
    (function frame(now) {
      const p = QV.clamp((now - start) / 500, 0, 1);
      node.textContent = String(Math.round(from + (to - from) * p));
      if (p < 1) requestAnimationFrame(frame);
    })(performance.now());
  }

  function flash(kind) {
    const f = h('div', { class: 'feedback-flash ' + kind });
    document.body.appendChild(f);
    setTimeout(() => f.remove(), 650);
  }

  function onKey(e) {
    if (!sess) return;
    const k = e.key.toLowerCase();
    if (!sess.answered) {
      const map = { '1': 0, '2': 1, '3': 2, '4': 3, a: 0, b: 1, c: 2, d: 3 };
      if (map[k] !== undefined) { e.preventDefault(); selectAnswer(map[k]); }
    } else if (k === 'enter' || k === 'n' || k === ' ') {
      const btn = QV.el('#nextBtn'); if (btn) { e.preventDefault(); btn.click(); }
    }
  }

  /* -------------------- Error state -------------------- */
  function renderError(app, msg) {
    const wrap = h('div', { class: 'screen' });
    wrap.innerHTML = `
      <div class="card pad-lg empty-state">
        <div class="e-ico">😕</div>
        <h3>Quiz couldn't start</h3>
        <p>${esc(msg)}</p>
        <div style="display:flex;gap:12px;justify-content:center">
          <button class="btn btn-primary" id="retryBtn">Try Again</button>
          <button class="btn btn-ghost" id="homeBtn">Back to Categories</button>
        </div>
      </div>`;
    app.appendChild(wrap);
    QV.el('#retryBtn', wrap).onclick = () => QV.go('quiz');
    QV.el('#homeBtn', wrap).onclick = () => QV.go('categories');
  }
})(window.QV);
