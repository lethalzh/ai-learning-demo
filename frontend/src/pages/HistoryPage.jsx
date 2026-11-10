import { EmptyState } from "../components/EmptyState";

export default function HistoryPage({ history, setHistory }) {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-5 flex items-baseline justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">历史记录</h2>
          <p className="mt-0.5 text-xs text-slate-400">最近 20 次分析结果，保存在本地浏览器</p>
        </div>
        {history.length > 0 && (
          <span className="text-[11px] tabular-nums text-slate-400">{history.length} 条</span>
        )}
      </div>

      {history.length === 0 ? (
        <EmptyState title="暂无历史记录" description="在「分析」页生成一次学习分析后，记录会自动出现在这里" />
      ) : (
        <div className="space-y-3">
          {history.map((item) => {
            const offline = item.mode === "fallback";
            return (
              <article
                key={item.id}
                className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-violet-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-slate-900">{item.theme}</div>
                    <div className="mt-1 text-[11px] text-slate-400">
                      {new Date(item.createdAt).toLocaleString()} · {item.learningGoal}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        offline ? "bg-slate-100 text-slate-500" : "bg-emerald-50 text-emerald-600"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${offline ? "bg-slate-400" : "bg-emerald-500"}`} />
                      {offline ? "离线" : "在线"}
                    </span>
                    <button
                      onClick={() => setHistory((prev) => prev.filter((x) => x.id !== item.id))}
                      className="flex min-h-[44px] items-center rounded-lg px-2 text-[11px] text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 sm:min-h-0 sm:py-1"
                    >
                      删除
                    </button>
                  </div>
                </div>

                <p className="mt-3 line-clamp-2 border-t border-slate-100 pt-3 text-xs leading-6 text-slate-600">
                  {item.result?.summary}
                </p>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
