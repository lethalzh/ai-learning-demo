export default function ReviewPanel({ reviewPlan }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center gap-2.5">
        <span className="h-4 w-1 rounded-full bg-violet-500" aria-hidden="true" />
        <h3 className="text-base font-semibold text-slate-900">复习计划</h3>
      </div>

      {!reviewPlan || reviewPlan.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-200 px-3 py-6 text-center text-xs text-slate-400">
          暂无复习计划
        </p>
      ) : (
        <ol className="relative space-y-4 border-l border-slate-200 pl-5">
          {reviewPlan.map((plan) => (
            <li key={plan.day} className="relative">
              <span
                className="absolute -left-[26px] top-1 flex h-4 w-4 items-center justify-center rounded-full border border-violet-200 bg-violet-50 text-[9px] font-bold text-violet-600"
                aria-hidden="true"
              >
                {plan.day}
              </span>
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
                <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  Day {plan.day}
                </div>
                <div className="mt-0.5 text-sm font-medium text-slate-800">{plan.focus}</div>
                <ul className="mt-2 space-y-1 text-xs leading-5 text-slate-500">
                  {plan.actions.map((action, idx) => (
                    <li key={idx} className="flex gap-1.5">
                      <span className="text-violet-400">•</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
