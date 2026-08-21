/* ============================================================
   QUIZVERSE — Audio (WebAudio synthesized SFX, no assets needed)
   ============================================================ */
(function (QV) {
  'use strict';

  let ctx = null;
  function ac() {
    if (!ctx) {
      try { ctx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch (e) { ctx = null; }
    }
    if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
    return ctx;
  }

  /** Play a tone. opts: {freq, dur, type, vol, glideTo} */
  function tone(opts) {
    const c = ac();
    if (!c) return;
    const now = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = opts.type || 'sine';
    osc.frequency.setValueAtTime(opts.freq, now);
    if (opts.glideTo) osc.frequency.exponentialRampToValueAtTime(opts.glideTo, now + (opts.dur || 0.15));
    const vol = opts.vol == null ? 0.14 : opts.vol;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(vol, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + (opts.dur || 0.15));
    osc.connect(gain).connect(c.destination);
    osc.start(now);
    osc.stop(now + (opts.dur || 0.15) + 0.02);
  }

  function chord(freqs, dur, type, vol) {
    freqs.forEach((f, i) => setTimeout(() => tone({ freq: f, dur: dur || 0.18, type: type || 'triangle', vol: vol || 0.1 }), i * 70));
  }

  const Sound = {
    enabled: true,
    setEnabled(v) { this.enabled = !!v; },
    /** Called on first user gesture to unlock audio */
    unlock() { ac(); },

    click() { if (this.enabled) tone({ freq: 420, dur: 0.06, type: 'square', vol: 0.05, glideTo: 560 }); },
    select() { if (this.enabled) tone({ freq: 520, dur: 0.08, type: 'triangle', vol: 0.07, glideTo: 700 }); },
    correct() { if (this.enabled) { tone({ freq: 660, dur: 0.12, type: 'triangle', vol: 0.12, glideTo: 880 }); setTimeout(() => tone({ freq: 990, dur: 0.16, type: 'triangle', vol: 0.11 }), 90); } },
    wrong() { if (this.enabled) { tone({ freq: 300, dur: 0.18, type: 'sawtooth', vol: 0.1, glideTo: 150 }); setTimeout(() => tone({ freq: 180, dur: 0.2, type: 'sawtooth', vol: 0.09, glideTo: 110 }), 110); } },
    tick() { if (this.enabled) tone({ freq: 900, dur: 0.04, type: 'square', vol: 0.04 }); },
    complete() { if (this.enabled) chord([523, 659, 784, 1047], 0.28, 'triangle', 0.11); },
    achievement() { if (this.enabled) chord([784, 988, 1319], 0.3, 'triangle', 0.12); },
    levelup() { if (this.enabled) chord([392, 523, 659, 784, 1047], 0.26, 'triangle', 0.11); },
  };

  QV.Sound = Sound;
})(window.QV);
