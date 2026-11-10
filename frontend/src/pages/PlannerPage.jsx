import { useNavigate } from "react-router-dom";
import { EmptyState } from "../components/EmptyState";

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

export default function PlannerPage({ tasks, setTasks }) {
  const navigate = useNavigate();
  const doneCount = tasks.filter((task) => task.status === "done").length;
  const pendingCount = tasks.length - doneCount;
  const progress = tasks.length === 0 ? 0 : Math.round((doneCount / tasks.length) * 100);

  const toggleTask = (taskId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, status: task.status === "done" ? "pending" : "done" }
          : task
      )
    );
  };

  const clearDone = () => {
    setTasks((prev) => prev.filter((task) => task.status !== "done"));
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-5 flex items-baseline justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-slate-900">学习计划与任务</h2>
          <p className="mt-0.5 text-xs text-slate-400">任务由关键知识点派生，状态自动保存，刷新不丢失</p>
        </div>
        {doneCount > 0 && (
          <button
            onClick={clearDone}
            className="flex min-h-[44px] shrink-0 items-center rounded-lg px-2.5 text-[11px] font-medium text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 sm:min-h-0 sm:py-1.5"
          >
            清除已完成
          </button>
        )}
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
          <div className="text-[11px] font-medium text-emerald-700">已完成</div>
          <div className="mt-1 text-2xl font-bold tabular-nums text-emerald-800">{doneCount}</div>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
          <div className="text-[11px] font-medium text-amber-700">待完成</div>
          <div className="mt-1 text-2xl font-bold tabular-nums text-amber-800">{pendingCount}</div>
        </div>
      </div>

      {tasks.length > 0 && (
        <div className="mb-6">
          <div className="mb-1.5 flex justify-between text-[11px] text-slate-400">
            <span>整体进度</span>
            <span className="tabular-nums">{progress}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-violet-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {tasks.length === 0 ? (
        <EmptyState title="暂无任务" description="在「分析」页生成学习分析后，知识点会自动同步为任务" />
      ) : (
        <div className="space-y-2.5">
          {tasks.map((task) => {
            const done = task.status === "done";
            return (
              <div
                key={task.id}
                className={`flex items-start gap-2.5 rounded-2xl border p-4 transition ${
                  done
                    ? "border-emerald-200 bg-emerald-50/50"
                    : "border-slate-200 bg-white hover:border-violet-300 hover:shadow-sm"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleTask(task.id)}
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
                  <div className="flex items-start justify-between gap-3">
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
