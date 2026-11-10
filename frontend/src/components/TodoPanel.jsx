import { useNavigate } from "react-router-dom";

const PRIORITY_STYLES = {
  high: "bg-rose-50 text-rose-600",
  medium: "bg-amber-50 text-amber-600",
  low: "bg-sky-50 text-sky-600"
};

function CheckBox({ done }) {
  return (
    <span
      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition ${
        done ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 bg-white group-hover/check:border-violet-400"
      }`}
      aria-hidden="true"
    >
      {done && (
        <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none">
          <path
            d="M2.5 6.2 4.7 8.4 9.5 3.6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
  );
}

export default function TodoPanel({ cases, onToggleTask }) {
  const navigate = useNavigate();
  const doneCount = cases?.filter((item) => item.status === "done").length || 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="h-4 w-1 rounded-full bg-violet-500" aria-hidden="true" />
          <h3 className="text-base font-semibold text-slate-900">待办列表</h3>
        </div>
        {cases?.length > 0 && (
          <span className="text-[11px] tabular-nums text-slate-400">
            {doneCount}/{cases.length} 已完成
          </span>
        )}
      </div>

      {!cases || cases.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-200 px-3 py-6 text-center text-xs text-slate-400">
          暂无待办
        </p>
      ) : (
        <div className="space-y-2.5">
          {cases.map((task) => {
            const done = task.status === "done";
            return (
              <div
                key={task.id}
                className={`flex items-start gap-2.5 rounded-xl border p-3 transition ${
                  done
                    ? "border-emerald-200 bg-emerald-50/60"
                    : "border-slate-200 bg-white hover:border-violet-300 hover:bg-violet-50/40 hover:shadow-sm"
                }`}
              >
                <button
                  type="button"
                  onClick={() => onToggleTask(task.id)}
                  aria-label={done ? "标记为未完成" : "标记为已完成"}
                  className="group/check -ml-2.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 sm:-ml-1 sm:h-6 sm:w-6"
                >
                  <CheckBox done={done} />
                </button>

                <button
                  type="button"
                  onClick={() => navigate(`/point/${task.id}`)}
                  className="min-w-0 flex-1 text-left"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`text-sm font-medium leading-5 ${
                        done ? "text-slate-400 line-through" : "text-slate-800"
                      }`}
                    >
                      {task.title}
                    </span>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        PRIORITY_STYLES[task.priority] || "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-400">
                    {done ? "已完成" : "待完成"} · {task.category} · 点击阅读
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
