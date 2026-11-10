import { useCallback, useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route, NavLink, useLocation } from "react-router-dom";
import AnalyzePage from "./pages/AnalyzePage";
import HistoryPage from "./pages/HistoryPage";
import PlannerPage from "./pages/PlannerPage";
import ExportPage from "./pages/ExportPage";
import PointDetailPage from "./pages/PointDetailPage";
import TermDetailPage from "./pages/TermDetailPage";
import StatusIndicator from "./components/StatusIndicator";
import { getCacheStatus } from "./api/client";
import {
  getHistory,
  saveHistory,
  getTasks,
  saveTasks,
  getTerms,
  saveTerms,
  getCurrentAnalysis,
  saveCurrentAnalysis
} from "./utils/storage";

const DEFAULT_ANALYSIS = {
  theme: "AI基础入门",
  learningGoal: "快速掌握 AI 基础概念",
  materialText:
    "人工智能是让机器模拟人类智能的技术。本文介绍 AI、机器学习和深度学习的关系，并讨论应用场景和学习路径。理解这些概念有助于建立完整的学习框架。",
  keywords: "",
  inputMode: "text",
  expandedMaterial: "",
  result: null,
  recordId: null,
  loadingStage: "",
  resultOrigin: ""
};

function ScrollRestoration() {
  const location = useLocation();
  const positions = useRef({});

  useEffect(() => {
    const handleScroll = () => {
      positions.current[location.key] = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.key]);

  useEffect(() => {
    const y = positions.current[location.key] ?? 0;
    const frame = requestAnimationFrame(() => window.scrollTo(0, y));
    return () => cancelAnimationFrame(frame);
  }, [location.key]);

  return null;
}

export default function App() {
  const [history, setHistory] = useState(() => getHistory());
  const [tasks, setTasks] = useState(() => getTasks());
  const [terms, setTerms] = useState(() => getTerms());
  const [analysis, setAnalysis] = useState(
    () => ({ ...DEFAULT_ANALYSIS, ...(getCurrentAnalysis() || {}) })
  );
  const [status, setStatus] = useState({
    online: true,
    mode: "online",
    source: "deepseek",
    errorMessage: "",
    cacheStatus: null
  });

  useEffect(() => {
    saveHistory(history);
  }, [history]);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    saveTerms(terms);
  }, [terms]);

  useEffect(() => {
    saveCurrentAnalysis({
      ...analysis,
      loadingStage: ""
    });
    // 只在分析产出变化时落盘，避免输入过程中频繁写 storage
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysis.result, analysis.recordId]);

  useEffect(() => {
    let cancelled = false;
    const loadCacheStatus = async () => {
      try {
        const res = await getCacheStatus();
        if (!cancelled && res.success) {
          const online = res.data?.online !== false;
          setStatus((prev) => ({
            ...prev,
            cacheStatus: res.data,
            online,
            mode: online ? "online" : "fallback",
            source: online ? "deepseek" : "local-cache"
          }));
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadCacheStatus();
    return () => {
      cancelled = true;
    };
  }, []);

  const updateStatus = useCallback((patch) => {
    setStatus((prev) => ({ ...prev, ...patch }));
  }, []);

  const patchAnalysis = useCallback((patch) => {
    setAnalysis((prev) => ({ ...prev, ...patch }));
  }, []);

  const navClass = ({ isActive }) =>
    `shrink-0 whitespace-nowrap rounded-xl px-3 py-2 text-[13px] font-medium transition-colors duration-150 sm:px-4 sm:text-sm ${
      isActive
        ? "bg-violet-600 text-white shadow-sm shadow-violet-600/25"
        : "text-slate-500 hover:bg-white hover:text-slate-900"
    }`;

  return (
    <BrowserRouter>
      <ScrollRestoration />
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center gap-2 px-3 py-2.5 sm:gap-4 sm:px-4 sm:py-3 md:px-8">
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-xs font-bold text-white shadow-sm shadow-violet-600/30">
                AI
              </div>
              <div className="hidden leading-tight min-[400px]:block">
                <div className="whitespace-nowrap text-[13px] font-semibold tracking-tight text-slate-900 sm:text-sm">
                  AI 学习助手
                </div>
                <div className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400 sm:block">
                  Learning Demo
                </div>
              </div>
            </div>

            <div className="ml-auto flex min-w-0 items-center gap-2 md:gap-4">
              <nav className="no-scrollbar flex min-w-0 items-center gap-1 overflow-x-auto rounded-2xl bg-slate-100/80 p-1">
                <NavLink to="/" end className={navClass}>分析</NavLink>
                <NavLink to="/history" className={navClass}>历史</NavLink>
                <NavLink to="/planner" className={navClass}>计划</NavLink>
                <NavLink to="/export" className={navClass}>导出</NavLink>
              </nav>

              <div className="shrink-0">
                <StatusIndicator
                  mode={status.mode}
                  source={status.source}
                  errorMessage={status.errorMessage}
                  cacheStatus={status.cacheStatus}
                />
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-3 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-4 sm:px-4 sm:py-6 md:px-8 md:py-10">
          <Routes>
            <Route
              path="/"
              element={
                <AnalyzePage
                  analysis={analysis}
                  patchAnalysis={patchAnalysis}
                  history={history}
                  setHistory={setHistory}
                  tasks={tasks}
                  setTasks={setTasks}
                  terms={terms}
                  setTerms={setTerms}
                  status={status}
                  onStatusChange={updateStatus}
                />
              }
            />
            <Route path="/history" element={<HistoryPage history={history} setHistory={setHistory} />} />
            <Route path="/planner" element={<PlannerPage tasks={tasks} setTasks={setTasks} />} />
            <Route path="/export" element={<ExportPage history={history} tasks={tasks} />} />
            <Route
              path="/point/:caseId"
              element={<PointDetailPage tasks={tasks} setTasks={setTasks} terms={terms} />}
            />
            <Route path="/term/:termId" element={<TermDetailPage terms={terms} tasks={tasks} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
