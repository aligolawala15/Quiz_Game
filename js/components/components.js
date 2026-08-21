/* ============================================================
   QUIZVERSE — Reusable Components
   (Navbar, Footer, Toasts, ProgressBar, TimerRing, Buttons, Cards)
   ============================================================ */
(function (QV) {
  'use strict';
  const { h, esc } = QV;
  const C = {};

  /* ---------------- Navbar ---------------- */
  C.renderNavbar = function () {
    const nav = QV.el('#navbar');
    const s = QV.Store.get();
    const li = QV.Store.levelInfo();
    const routes = [
      { r: 'home', label: 'Home' },
      { r: 'categories', label: 'Categories' },
      { r: 'leaderboard', label: 'Leaderboard' },
      { r: 'about', label: 'About' },
    ];
    const active = QV.currentRoute || 'home';

    nav.innerHTML = `
      <div class="nav-inner">
        <button class="brand" id="brandBtn" aria-label="QUIZVERSE home">
          <span class="logo-mark"><img src="assets/logo-mark.png" alt="QUIZVERSE logo" width="38" height="38" /></span>
          <span class="logo-text"><b>QUIZ</b><span>VERSE</span></span>
        </button>

        <nav class="nav-links" id="navLinks" aria-label="Primary">
          ${routes.map((x) => `<a href="#${x.r}" data-route="${x.r}" class="${x.r === active ? 'active' : ''}">${x.label}</a>`).join('')}
        </nav>

        <div class="nav-right">
          <button class="nav-level" id="navProfile" title="Your level & XP" aria-label="Open profile. Level ${li.cur.lvl}, ${s.xp} XP">
            <span class="lvl-badge">${li.cur.lvl}</span>
            <span>Lv ${li.cur.lvl}</span>
            <span class="xp-mini"><i style="width:${li.pct}%"></i></span>
          </button>
          <button class="icon-btn" id="soundBtn" aria-pressed="${s.sound}" title="Toggle sound" aria-label="Toggle sound effects">${s.sound ? '🔊' : '🔇'}</button>
          <button class="icon-btn" id="themeBtn" title="Toggle theme" aria-label="Toggle dark or light mode">${s.theme === 'dark' ? '🌙' : '☀️'}</button>
          <button class="icon-btn nav-toggle" id="navToggle" aria-label="Open menu" aria-expanded="false">☰</button>
        </div>
      </div>`;

    QV.el('#brandBtn', nav).onclick = () => { QV.Sound.click(); QV.go('home'); };
    QV.el('#navProfile', nav).onclick = () => { QV.Sound.click(); QV.go('profile'); };

    QV.els('[data-route]', nav).forEach((a) => {
      a.onclick = (e) => { e.preventDefault(); QV.Sound.click(); QV.go(a.dataset.route); C.closeMobileNav(); };
    });

    QV.el('#themeBtn', nav).onclick = () => { QV.Sound.click(); QV.toggleTheme(); };
    QV.el('#soundBtn', nav).onclick = () => { QV.toggleSound(); };

    const toggle = QV.el('#navToggle', nav);
    toggle.onclick = () => {
      QV.Sound.click();
      const links = QV.el('#navLinks');
      const open = links.classList.toggle('mobile-open');
      toggle.setAttribute('aria-expanded', String(open));
      QV.el('#navScrim').hidden = !open;
    };
    QV.el('#navScrim').onclick = () => C.closeMobileNav();
  };

  C.closeMobileNav = function () {
    const links = QV.el('#navLinks');
    if (links) links.classList.remove('mobile-open');
    const t = QV.el('#navToggle'); if (t) t.setAttribute('aria-expanded', 'false');
    const scrim = QV.el('#navScrim'); if (scrim) scrim.hidden = true;
  };

  C.setActiveNav = function (route) {
    QV.els('#navbar [data-route]').forEach((a) => a.classList.toggle('active', a.dataset.route === route));
  };

  /* ---------------- Footer ---------------- */
  C.renderFooter = function () {
    const f = QV.el('#footer');
    f.innerHTML = `
      <div class="brand" style="justify-content:center">
        <span class="logo-mark"><img src="assets/logo-mark.png" alt="QUIZVERSE logo" width="38" height="38" /></span>
        <span class="logo-text"><b>QUIZ</b><span>VERSE</span></span>
      </div>
      <p>Challenge Your Mind. Beat Your Best.</p>
      <div class="foot-links">
        <a href="#home" data-froute="home">Home</a>
        <a href="#categories" data-froute="categories">Categories</a>
        <a href="#leaderboard" data-froute="leaderboard">Leaderboard</a>
        <a href="#profile" data-froute="profile">Profile</a>
        <a href="#about" data-froute="about">About</a>
      </div>
      <p style="margin-top:14px;opacity:.7">© ${new Date().getFullYear()} QUIZVERSE — a demo quiz gaming platform.</p>`;
    QV.els('[data-froute]', f).forEach((a) => { a.onclick = (e) => { e.preventDefault(); QV.go(a.dataset.froute); }; });
  };

  /* ---------------- Toast / Achievement ---------------- */
  C.toast = function ({ icon, title, sub, kind }) {
    const layer = QV.el('#toastLayer');
    const t = h('div', { class: 'toast' + (kind ? ' ' + kind : ''), role: 'status' }, [
      h('div', { class: 't-ico' }, icon || '🔔'),
      h('div', { class: 't-body' }, [ h('b', {}, title || ''), sub ? h('span', {}, sub) : null ]),
    ]);
    layer.appendChild(t);
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 400); }, 3600);
  };

  /* ---------------- Progress bar ---------------- */
  C.progressBar = function (pct) {
    return `<div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(pct)}"><i style="width:${pct}%"></i></div>`;
  };

  /* ---------------- Timer ring (SVG) ---------------- */
  // Returns { node, update(seconds,total), setState() }
  C.timerRing = function () {
    const R = 27, CIRC = 2 * Math.PI * R;
    const wrap = h('div', { class: 'timer-ring', role: 'timer', 'aria-label': 'Time remaining' });
    wrap.innerHTML = `
      <svg width="66" height="66" viewBox="0 0 66 66" aria-hidden="true">
        <defs><linearGradient id="tg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#7C3AED"/><stop offset="100%" stop-color="#06B6D4"/>
        </linearGradient></defs>
        <circle class="track" cx="33" cy="33" r="${R}"></circle>
        <circle class="bar" cx="33" cy="33" r="${R}" stroke-dasharray="${CIRC}" stroke-dashoffset="0"></circle>
      </svg>
      <div class="t-txt">00:00</div>`;
    const bar = wrap.querySelector('.bar');
    const txt = wrap.querySelector('.t-txt');
    return {
      node: wrap,
      update(seconds, total) {
        const frac = QV.clamp(seconds / total, 0, 1);
        bar.style.strokeDashoffset = String(CIRC * (1 - frac));
        txt.textContent = QV.fmtTime(seconds);
        wrap.classList.toggle('warn', seconds <= Math.ceil(total * 0.5) && seconds > Math.ceil(total * 0.25));
        wrap.classList.toggle('danger', seconds <= Math.ceil(total * 0.25));
        bar.style.stroke = seconds <= Math.ceil(total * 0.25) ? 'var(--err)' : 'url(#tg)';
      },
    };
  };

  /* ---------------- Confetti burst ---------------- */
  C.confetti = function () {
    const layer = h('div', { class: 'confetti' });
    const colors = ['#7C3AED', '#06B6D4', '#fbbf24', '#22c55e', '#ef4444', '#a78bfa'];
    for (let i = 0; i < 90; i++) {
      const p = document.createElement('i');
      p.style.left = Math.random() * 100 + 'vw';
      p.style.background = colors[i % colors.length];
      p.style.animationDuration = (1.6 + Math.random() * 1.8) + 's';
      p.style.animationDelay = (Math.random() * 0.5) + 's';
      p.style.transform = `rotate(${Math.random() * 360}deg)`;
      if (Math.random() > 0.5) p.style.borderRadius = '50%';
      layer.appendChild(p);
    }
    document.body.appendChild(layer);
    setTimeout(() => layer.remove(), 4200);
  };

  /* ---------------- Category card ---------------- */
  C.categoryCard = function (cat, selected, onSelect) {
    const s = QV.Store.get();
    const plays = s.categoryCounts[cat.id] || 0;
    const best = s.categoryScores[cat.id] || 0;
    const card = h('button', {
      class: 'select-card' + (selected ? ' selected' : ''),
      'aria-pressed': selected, 'data-cat': cat.id,
    });
    card.innerHTML = `
      <span class="check" aria-hidden="true">✓</span>
      <span class="cat-ico">${cat.icon}</span>
      <h3>${esc(cat.name)}</h3>
      <p>${esc(cat.desc)}</p>
      <div class="cat-meta">
        <span>🎯 Best ${best}</span>
        <span>🎮 Played ${plays}×</span>
      </div>`;
    card.onclick = () => onSelect(cat.id, card);
    return card;
  };

  /* ---------------- Difficulty card ---------------- */
  C.difficultyCard = function (diff, selected, onSelect) {
    const card = h('button', {
      class: 'select-card diff-card' + (selected ? ' selected' : ''),
      'aria-pressed': selected, dataset: { diff: diff.id },
    });
    card.innerHTML = `
      <span class="check" aria-hidden="true">✓</span>
      <span class="cat-ico">${diff.icon}</span>
      <h3>${esc(diff.name)} <span class="diff-pill ${diff.id}">${diff.id}</span></h3>
      <p>${esc(diff.desc)}</p>
      <div class="cat-meta"><span>⏱ ${diff.time}s / question</span></div>`;
    card.onclick = () => onSelect(diff.id, card);
    return card;
  };

  QV.C = C;
})(window.QV);
