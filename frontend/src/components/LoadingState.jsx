import { useEffect, useState } from "react";

const STEPS = {
  text: ["分析学习材料"],
  keywords: ["扩写关键词", "分析生成"]
};

function SkeletonBlock({ widths }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 h-3 w-24 animate-pulse rounded-full bg-slate-200" />
      <div className="space-y-2.5">
        {widths.map((width, idx) => (
          <div
            key={idx}
            className="h-2.5 animate-pulse rounded-full bg-slate-100"
            style={{ width, animationDelay: `${idx * 120}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function LoadingState({ loadingStage, inputMode, onCancel }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const steps = STEPS[inputMode] || STEPS.text;
  const activeIndex = loadingStage === "expanding" ? 0 : steps.length - 1;
  const title = loadingStage === "expanding" ? "正在扩写关键词…" : "正在分析学习材料…";

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-violet-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span
              className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600"
              aria-hidden="true"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900">{title}</p>
              <p className="mt-0.5 text-[11px] text-slate-400">
                通常需要 10-20 秒 · 已等待 {elapsed}s
              </p>
            </div>
          </div>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex min-h-[44px] shrink-0 items-center rounded-lg border border-slate-200 bg-white px-2.5 text-[11px] font-medium text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 sm:min-h-0 sm:py-1.5"
            >
              取消生成
            </button>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {steps.map((step, idx) => {
            const done = idx < activeIndex;
            const active = idx === activeIndex;
            return (
              <div key={step} className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                    active
                      ? "bg-violet-600 text-white"
                      : done
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-slate-100 text-slate-400"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      active ? "bg-white" : done ? "bg-emerald-500" : "bg-slate-300"
                    }`}
                  />
                  {done ? "已完成 · " : ""}
                  {step}
                </span>
                {idx < steps.length - 1 && <span className="text-[10px] text-slate-300">→</span>}
              </div>
            );
          })}
        </div>
      </div>

      <SkeletonBlock widths={["92%", "80%", "64%"]} />
      <SkeletonBlock widths={["86%", "94%", "72%", "58%"]} />
      <SkeletonBlock widths={["78%", "88%", "66%"]} />
    </div>
  );
}
