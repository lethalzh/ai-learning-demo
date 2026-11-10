const HISTORY_KEY = "ai_learning_history";
const TASKS_KEY = "ai_learning_tasks";
const TERMS_KEY = "ai_learning_terms";
const CURRENT_ANALYSIS_KEY = "ai_learning_current_analysis";

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getHistory() {
  return read(HISTORY_KEY, []);
}

export function saveHistory(history) {
  write(HISTORY_KEY, history);
}

export function getTasks() {
  return read(TASKS_KEY, []);
}

export function saveTasks(tasks) {
  write(TASKS_KEY, tasks);
}

export function getTerms() {
  return read(TERMS_KEY, []);
}

export function saveTerms(terms) {
  write(TERMS_KEY, terms);
}

export function getCurrentAnalysis() {
  return read(CURRENT_ANALYSIS_KEY, null);
}

export function saveCurrentAnalysis(analysis) {
  write(CURRENT_ANALYSIS_KEY, analysis);
}
