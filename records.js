'use strict';

const RECORDS_KEY = 'tetris-records';
const RECORDS_STATS_KEY = 'tetris-records-stats';
const MAX_RECORDS = 5;

function loadRecords() {
  let raw = null;
  try {
    raw = localStorage.getItem(RECORDS_KEY);
  } catch (e) {
    raw = null;
  }
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(entry => entry && typeof entry.name === 'string' && typeof entry.score === 'number')
      .map(entry => ({
        name: entry.name,
        score: entry.score,
        lines: typeof entry.lines === 'number' ? entry.lines : 0,
        level: typeof entry.level === 'number' ? entry.level : 1,
        date: typeof entry.date === 'string' ? entry.date : '',
      }));
  } catch (e) {
    return [];
  }
}

function saveRecord(entry) {
  const records = loadRecords();
  records.push(entry);
  records.sort((a, b) => b.score - a.score);
  const trimmed = records.slice(0, MAX_RECORDS);
  try {
    localStorage.setItem(RECORDS_KEY, JSON.stringify(trimmed));
  } catch (e) {
    // localStorage no disponible: no persistimos, se mantiene en memoria
  }
  return trimmed;
}

function resetRecords() {
  try {
    localStorage.removeItem(RECORDS_KEY);
  } catch (e) {
    // localStorage no disponible
  }
  try {
    localStorage.removeItem(RECORDS_STATS_KEY);
  } catch (e) {
    // localStorage no disponible
  }
}

function qualifiesForTop(score, records) {
  const list = records || loadRecords();
  if (list.length < MAX_RECORDS) return true;
  return list.some(r => score > r.score);
}

function loadStats() {
  let raw = null;
  try {
    raw = localStorage.getItem(RECORDS_STATS_KEY);
  } catch (e) {
    raw = null;
  }
  const fallback = { bestCombo: 0, maxLines: 0 };
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return fallback;
    return {
      bestCombo: typeof parsed.bestCombo === 'number' ? parsed.bestCombo : 0,
      maxLines: typeof parsed.maxLines === 'number' ? parsed.maxLines : 0,
    };
  } catch (e) {
    return fallback;
  }
}

function saveStats(stats) {
  try {
    localStorage.setItem(RECORDS_STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    // localStorage no disponible: no persistimos
  }
}

function updateStats(combo, maxLines) {
  const current = loadStats();
  const updated = {
    bestCombo: Math.max(current.bestCombo, combo),
    maxLines: Math.max(current.maxLines, maxLines),
  };
  saveStats(updated);
  return updated;
}
