import { useNavigate, useParams } from "react-router-dom";
import { EmptyState } from "../components/EmptyState";

const DIFFICULTY_LABELS = {
  easy: "基础",
  medium: "进阶",
  hard: "困难"
};

export default function TermDetailPage({ terms, tasks }) {
  const { termId } = useParams();
  const navigate = useNavigate();

  const term = terms.find((item) => item.id === termId);

  if (!term) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <EmptyState title="未找到该术语" description="它可能已被清除，请返回分析页重新生成" />
        <div className="text-center">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700"
          >
            返回分析页
          </button>
        </div>
      </div>
    );
  }

  const relatedCases = tasks.filter((task) => (task.relatedTermIds || []).includes(term.id));
  const difficulty = DIFFICULTY_LABELS[term.difficulty] || term.difficulty || "进阶";

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-2 text-xs font-medium text-slate-500 transition hover:bg-white hover:text-slate-900 sm:min-h-0 sm:py-1.5"
        >
          <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
            <path d="m10 3.5-4.5 4.5L10 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          返回
        </button>

        <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-medium text-violet-600">
          {difficulty}
        </span>
      </div>

      <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm break-words sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-medium text-violet-600">
            {term.theme}
          </span>
          <span className="text-[11px] text-slate-400">术语卡</span>
        </div>

        <h1 className="mt-3 text-lg font-bold text-slate-900 break-words sm:text-xl">{term.word}</h1>
        <p className="mt-1 text-sm text-slate-500">释义：{term.meaning}</p>

        <div className="mt-6 space-y-6">
          <section>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-3.5 w-1 rounded-full bg-violet-500" aria-hidden="true" />
              <h2 className="text-sm font-semibold text-slate-900">释义说明</h2>
            </div>
            <p className="rounded-xl bg-slate-50/80 p-4 text-sm leading-7 text-slate-700">
              {term.detail ||
                `${term.word} 表示「${term.meaning}」。在「${term.theme}」的语境下理解这个词，会更容易把它和实际场景对应起来。`}
            </p>
          </section>

          <section>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-3.5 w-1 rounded-full bg-violet-500" aria-hidden="true" />
              <h2 className="text-sm font-semibold text-slate-900">例句</h2>
            </div>
            {term.example ? (
              <blockquote className="rounded-xl border-l-2 border-violet-300 bg-violet-50/40 px-4 py-3 text-sm italic leading-6 text-slate-600">
                {term.example}
              </blockquote>
            ) : (
              <p className="rounded-xl border border-dashed border-slate-200 px-4 py-3 text-xs text-slate-400">
                暂无例句
              </p>
            )}
          </section>

          <section>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-3.5 w-1 rounded-full bg-violet-500" aria-hidden="true" />
              <h2 className="text-sm font-semibold text-slate-900">相关说明</h2>
            </div>
            <ul className="space-y-2">
              {(term.notes || []).map((note, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm leading-6 text-slate-600">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" aria-hidden="true" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </section>

          {relatedCases.length > 0 && (
            <section>
              <div className="mb-2 flex items-center gap-2">
                <span className="h-3.5 w-1 rounded-full bg-violet-500" aria-hidden="true" />
                <h2 className="text-sm font-semibold text-slate-900">相关知识点</h2>
              </div>
              <div className="space-y-2">
                {relatedCases.map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => navigate(`/point/${task.id}`)}
                    className="flex min-h-[44px] w-full items-center justify-between gap-3 rounded-xl border border-slate-200 px-3 py-2 text-left transition hover:border-violet-300 hover:bg-violet-50/50 sm:min-h-0"
                  >
                    <span className="text-xs leading-5 text-slate-700">{task.title}</span>
                    <span
                      className={`shrink-0 text-[10px] ${
                        task.status === "done" ? "text-emerald-600" : "text-slate-400"
                      }`}
                    >
                      {task.status === "done" ? "已完成" : "待完成"}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </div>
  );
}
