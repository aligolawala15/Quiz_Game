/* ============================================================
   QUIZVERSE — Helpers  (global namespace: window.QV)
   ============================================================ */
window.QV = window.QV || {};

(function (QV) {
  'use strict';

  /* --- DOM helpers --- */
  QV.el = (sel, root) => (root || document).querySelector(sel);
  QV.els = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  /**
   * Create an element from attrs + children.
   * children may be strings (text) or nodes.
   */
  QV.h = function (tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      for (const k in attrs) {
        const v = attrs[k];
        if (v == null || v === false) continue;
        if (k === 'class') node.className = v;
        else if (k === 'html') node.innerHTML = v;
        else if (k === 'text') node.textContent = v;
        else if (k === 'style' && typeof v === 'object') Object.assign(node.style, v);
        else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
        else if (k === 'dataset') { for (const d in v) node.dataset[d] = v[d]; }
        else node.setAttribute(k, v);
      }
    }
    if (children != null) {
      (Array.isArray(children) ? children : [children]).forEach((c) => {
        if (c == null || c === false) return;
        node.appendChild(typeof c === 'string' || typeof c === 'number'
          ? document.createTextNode(String(c)) : c);
      });
    }
    return node;
  };

  /* --- Safe HTML escaping for interpolated strings --- */
  QV.esc = function (str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  };

  /* --- Array shuffle (Fisher–Yates, non-mutating) --- */
  QV.shuffle = function (arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  QV.clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  /* --- Time formatting mm:ss --- */
  QV.fmtTime = function (totalSeconds) {
    const s = Math.max(0, Math.round(totalSeconds));
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  /* --- Deterministic color from a string (avatars) --- */
  QV.colorFor = function (str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    const palettes = [
      'linear-gradient(135deg,#7C3AED,#06B6D4)',
      'linear-gradient(135deg,#06B6D4,#22c55e)',
      'linear-gradient(135deg,#f59e0b,#ef4444)',
      'linear-gradient(135deg,#7C3AED,#ef4444)',
      'linear-gradient(135deg,#06B6D4,#7C3AED)',
      'linear-gradient(135deg,#22c55e,#06B6D4)',
      'linear-gradient(135deg,#fbbf24,#f59e0b)',
    ];
    return palettes[Math.abs(hash) % palettes.length];
  };

  QV.initials = function (name) {
    const parts = String(name || '?').trim().split(/\s+/);
    return ((parts[0] || '')[0] || '?').toUpperCase() + (parts[1] ? (parts[1][0] || '').toUpperCase() : '');
  };

  /* --- Animated number counter --- */
  QV.countUp = function (node, to, dur, suffix) {
    dur = dur || 900; suffix = suffix || '';
    const start = performance.now();
    const from = 0;
    function frame(now) {
      const p = QV.clamp((now - start) / dur, 0, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      node.textContent = Math.round(from + (to - from) * eased) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  };

  /* --- localStorage JSON wrappers (guarded) --- */
  QV.storage = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw == null ? fallback : JSON.parse(raw);
      } catch (e) { return fallback; }
    },
    set(key, val) {
      try { localStorage.setItem(key, JSON.stringify(val)); return true; }
      catch (e) { console.warn('QV storage blocked:', e); return false; }
    },
    remove(key) { try { localStorage.removeItem(key); } catch (e) {} },
  };

  /* --- tiny pub/sub --- */
  QV.bus = (function () {
    const map = {};
    return {
      on(evt, fn) { (map[evt] = map[evt] || []).push(fn); },
      emit(evt, data) { (map[evt] || []).forEach((fn) => { try { fn(data); } catch (e) { console.error(e); } }); },
    };
  })();

})(window.QV);
