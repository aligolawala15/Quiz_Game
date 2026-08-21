/* ============================================================
   QUIZVERSE — App Router & Bootstrap
   ============================================================ */
(function (QV) {
  'use strict';

  const ROUTES = ['home', 'categories', 'difficulty', 'quiz', 'result', 'leaderboard', 'profile', 'about'];
  const NAV_ROUTES = ['home', 'categories', 'leaderboard', 'about']; // shown in navbar hash
  QV.currentRoute = 'home';
  QV.quizSetup = {};
  QV.lastResult = null;

  /* ---------- Theme ---------- */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0F172A' : '#eef2f9');
  }

  QV.toggleTheme = function () {
    const s = QV.Store.get();
    const next = s.theme === 'dark' ? 'light' : 'dark';
    QV.Store.setTheme(next);
    applyTheme(next);
    QV.C.renderNavbar();
    QV.C.setActiveNav(QV.currentRoute);
  };

  QV.toggleSound = function () {
    const s = QV.Store.get();
    const next = !s.sound;
    QV.Store.setSound(next);
    QV.Sound.setEnabled(next);
    QV.C.renderNavbar();
    QV.C.setActiveNav(QV.currentRoute);
    if (next) QV.Sound.click();
    QV.C.toast({ icon: next ? '🔊' : '🔇', title: next ? 'Sound on' : 'Sound off' });
  };

  /* ---------- Router ---------- */
  QV.go = function (route, opts) {
    if (!ROUTES.includes(route)) route = 'home';

    // Cleanup hook (e.g., quiz timer) when leaving a screen
    const prev = QV.currentRoute;
    const prevScreen = QV.Screens[prev];
    if (prevScreen && typeof prevScreen.cleanup === 'function' && prev !== route) {
      try { prevScreen.cleanup(); } catch (e) { console.warn(e); }
    }

    QV.currentRoute = route;
    QV.C.closeMobileNav();

    // Update hash for shareable/persistent nav (only meaningful routes)
    const hashRoute = NAV_ROUTES.includes(route) ? route : (route === 'profile' ? 'profile' : '');
    if (hashRoute && ('#' + hashRoute) !== location.hash) {
      history.replaceState(null, '', '#' + hashRoute);
    }

    const app = QV.el('#app');
    app.innerHTML = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const render = QV.Screens[route];
    if (typeof render === 'function') {
      try { render(app); }
      catch (e) {
        console.error('Screen render error:', e);
        renderCrash(app, route);
      }
    } else {
      renderCrash(app, route);
    }

    QV.C.setActiveNav(route);
  };

  function renderCrash(app, route) {
    app.innerHTML = `
      <div class="screen card pad-lg empty-state">
        <div class="e-ico">🛠️</div>
        <h3>Something went wrong</h3>
        <p>We couldn't load the "${QV.esc(route)}" screen. Let's get you back on track.</p>
        <button class="btn btn-primary" id="crashHome">Back to Home</button>
      </div>`;
    const b = QV.el('#crashHome', app);
    if (b) b.onclick = () => QV.go('home');
  }

  /* ---------- Global event wiring ---------- */
  function wireBus() {
    QV.bus.on('achievement', (def) => {
      QV.Sound.achievement();
      QV.C.toast({ kind: 'ach', icon: def.icon, title: 'Achievement Unlocked!', sub: def.name });
    });
    QV.bus.on('levelup', (lvl) => {
      QV.Sound.levelup();
      QV.C.confetti();
      QV.C.toast({ kind: 'ach', icon: '⬆️', title: `Level ${lvl.lvl} — ${lvl.name}!`, sub: 'You leveled up!' });
      QV.C.renderNavbar();
      QV.C.setActiveNav(QV.currentRoute);
    });
  }

  /* ---------- Unlock audio on first gesture ---------- */
  function wireAudioUnlock() {
    const unlock = () => { QV.Sound.unlock(); window.removeEventListener('pointerdown', unlock); window.removeEventListener('keydown', unlock); };
    window.addEventListener('pointerdown', unlock, { once: false });
    window.addEventListener('keydown', unlock, { once: false });
  }

  /* ---------- Refresh-during-quiz guard ---------- */
  function wireUnloadGuard() {
    window.addEventListener('beforeunload', (e) => {
      if (QV.currentRoute === 'quiz') {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    });
  }

  /* ---------- Hash back/forward support ---------- */
  function wireHashNav() {
    window.addEventListener('hashchange', () => {
      const r = (location.hash || '').replace('#', '');
      if (r && ROUTES.includes(r) && r !== QV.currentRoute && r !== 'quiz' && r !== 'result' && r !== 'difficulty') {
        QV.go(r);
      }
    });
  }

  /* ---------- Boot ---------- */
  function boot() {
    const s = QV.Store.get();
    applyTheme(s.theme);
    QV.Sound.setEnabled(s.sound);

    QV.C.renderNavbar();
    QV.C.renderFooter();
    wireBus();
    wireAudioUnlock();
    wireUnloadGuard();
    wireHashNav();

    // Initial route from hash (only safe entry routes)
    const initial = (location.hash || '').replace('#', '');
    const safe = ['home', 'categories', 'leaderboard', 'about', 'profile'];
    QV.go(safe.includes(initial) ? initial : 'home');

    console.log('%cQUIZVERSE ready 🎮', 'color:#7C3AED;font-weight:bold');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(window.QV);
