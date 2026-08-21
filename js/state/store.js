/* ============================================================
   QUIZVERSE — State Store (persistent via localStorage)
   ============================================================ */
(function (QV) {
  'use strict';

  const KEY = 'quizverse.v1';

  const LEVELS = [
    { lvl: 1, name: 'Beginner',   min: 0 },
    { lvl: 2, name: 'Learner',    min: 200 },
    { lvl: 3, name: 'Challenger', min: 600 },
    { lvl: 4, name: 'Expert',     min: 1200 },
    { lvl: 5, name: 'Quiz Master', min: 2200 },
  ];

  const ACHIEVEMENTS = [
    { id: 'first_quiz',  icon: '🏆', name: 'First Quiz',      desc: 'Complete your first quiz.' },
    { id: 'streak_5',    icon: '🔥', name: '5 Quiz Streak',   desc: 'Keep a 5-quiz win streak.' },
    { id: 'speed',       icon: '⚡', name: 'Speed Master',    desc: 'Earn a speed bonus 10+ times.' },
    { id: 'knowledge',   icon: '🧠', name: 'Knowledge Master', desc: 'Answer 100 questions correctly.' },
    { id: 'perfect',     icon: '💯', name: 'Perfect Score',   desc: 'Get every question right in a quiz.' },
    { id: 'explorer',    icon: '🌍', name: 'Explorer',        desc: 'Play every category at least once.' },
  ];

  const SEED_LEADERBOARD = [
    { name: 'Alex',  score: 980, seed: true },
    { name: 'Rahul', score: 920, seed: true },
    { name: 'Sarah', score: 890, seed: true },
    { name: 'David', score: 850, seed: true },
    { name: 'Maya',  score: 810, seed: true },
    { name: 'Leo',   score: 760, seed: true },
    { name: 'Nina',  score: 700, seed: true },
  ];

  function defaults() {
    return {
      playerName: 'Player',
      theme: 'dark',
      sound: true,
      xp: 0,
      streak: 0,
      bestStreak: 0,
      bestScore: 0,
      totalQuizzes: 0,
      totalCorrect: 0,
      totalWrong: 0,
      totalQuestions: 0,
      scoreSum: 0,            // sum of quiz scores for averaging
      speedBonuses: 0,
      categoryCounts: {},     // categoryId -> plays
      categoryScores: {},     // categoryId -> best score
      achievements: [],       // unlocked ids
      history: [],            // recent quiz results
      leaderboard: SEED_LEADERBOARD.slice(),
    };
  }

  let state = load();

  function load() {
    const saved = QV.storage.get(KEY, null);
    const base = defaults();
    if (saved && typeof saved === 'object') {
      // shallow-merge to tolerate older/newer shapes
      Object.keys(base).forEach((k) => { if (saved[k] !== undefined) base[k] = saved[k]; });
      if (!Array.isArray(base.leaderboard) || !base.leaderboard.length) base.leaderboard = SEED_LEADERBOARD.slice();
    }
    return base;
  }

  function persist() {
    QV.storage.set(KEY, state);
    QV.bus.emit('state:change', state);
  }

  /* ---------- Level helpers ---------- */
  function levelFor(xp) {
    let cur = LEVELS[0];
    for (const l of LEVELS) if (xp >= l.min) cur = l;
    return cur;
  }
  function levelProgress(xp) {
    const cur = levelFor(xp);
    const next = LEVELS.find((l) => l.min > cur.min);
    if (!next) return { cur, next: null, pct: 100, toNext: 0 };
    const span = next.min - cur.min;
    const into = xp - cur.min;
    return { cur, next, pct: QV.clamp(Math.round((into / span) * 100), 0, 100), toNext: next.min - xp };
  }

  const Store = {
    get() { return state; },
    getLevels() { return LEVELS; },
    getAchievementDefs() { return ACHIEVEMENTS; },
    levelInfo() { return levelProgress(state.xp); },

    setName(name) { state.playerName = (name || 'Player').trim().slice(0, 18) || 'Player'; persist(); },
    setTheme(t) { state.theme = t; persist(); },
    setSound(v) { state.sound = !!v; persist(); },

    addXP(amount) {
      const before = levelFor(state.xp).lvl;
      state.xp += amount;
      const after = levelFor(state.xp).lvl;
      persist();
      if (after > before) QV.bus.emit('levelup', levelFor(state.xp));
    },

    unlock(id) {
      if (state.achievements.includes(id)) return false;
      state.achievements.push(id);
      persist();
      const def = ACHIEVEMENTS.find((a) => a.id === id);
      if (def) QV.bus.emit('achievement', def);
      return true;
    },

    /**
     * Record a completed quiz. result = {
     *   categoryId, difficulty, score, maxScore, correct, wrong, total,
     *   timeTaken, accuracy, perfect, speedBonusCount
     * }
     */
    recordQuiz(r) {
      state.totalQuizzes += 1;
      state.totalCorrect += r.correct;
      state.totalWrong += r.wrong;
      state.totalQuestions += r.total;
      state.scoreSum += r.score;
      state.speedBonuses += (r.speedBonusCount || 0);
      state.categoryCounts[r.categoryId] = (state.categoryCounts[r.categoryId] || 0) + 1;
      if (!state.categoryScores[r.categoryId] || r.score > state.categoryScores[r.categoryId]) {
        state.categoryScores[r.categoryId] = r.score;
      }

      const isNewBest = r.score > state.bestScore;
      if (isNewBest) state.bestScore = r.score;

      // Streak: increases if the player passed (>=50% accuracy), else resets.
      if (r.accuracy >= 50) {
        state.streak += 1;
        if (state.streak > state.bestStreak) state.bestStreak = state.streak;
      } else {
        state.streak = 0;
      }

      state.history.unshift({
        categoryId: r.categoryId, difficulty: r.difficulty, score: r.score,
        accuracy: r.accuracy, correct: r.correct, total: r.total, at: Date.now(),
      });
      state.history = state.history.slice(0, 20);

      // XP: completion + per correct + perfect bonus.
      const xpGain = 50 + r.correct * 10 + (r.perfect ? 100 : 0);
      const beforeLvl = levelFor(state.xp).lvl;
      state.xp += xpGain;
      const afterLvl = levelFor(state.xp).lvl;

      // Leaderboard: keep player's best score in the board.
      Store._syncLeaderboard();

      persist();

      // Evaluate achievements.
      const newly = [];
      const tryUnlock = (id) => { if (Store.unlock(id)) newly.push(id); };
      tryUnlock('first_quiz');
      if (state.streak >= 5) tryUnlock('streak_5');
      if (state.speedBonuses >= 10) tryUnlock('speed');
      if (state.totalCorrect >= 100) tryUnlock('knowledge');
      if (r.perfect) tryUnlock('perfect');
      if (QV.CATEGORIES.every((c) => state.categoryCounts[c.id] > 0)) tryUnlock('explorer');

      if (afterLvl > beforeLvl) QV.bus.emit('levelup', levelFor(state.xp));

      return { xpGain, isNewBest, newAchievements: newly };
    },

    _syncLeaderboard() {
      const board = state.leaderboard.filter((e) => !e.me);
      board.push({ name: state.playerName + ' (You)', score: state.bestScore, me: true });
      board.sort((a, b) => b.score - a.score);
      state.leaderboard = board;
    },

    getLeaderboard() {
      Store._syncLeaderboard();
      return state.leaderboard.slice(0, 12);
    },

    averageScore() {
      return state.totalQuizzes ? Math.round(state.scoreSum / state.totalQuizzes) : 0;
    },
    accuracy() {
      return state.totalQuestions ? Math.round((state.totalCorrect / state.totalQuestions) * 100) : 0;
    },
    bestCategory() {
      let best = null, bestScore = -1;
      for (const id in state.categoryScores) {
        if (state.categoryScores[id] > bestScore) { bestScore = state.categoryScores[id]; best = id; }
      }
      const cat = best ? QV.getCategory(best) : null;
      return cat ? cat.name : '—';
    },

    reset() { state = defaults(); persist(); },
  };

  QV.Store = Store;
})(window.QV);
