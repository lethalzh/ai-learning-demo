import { useNavigate } from "react-router-dom";
import LoadingState from "./LoadingState";

function SectionCard({ title, badge, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="h-4 w-1 rounded-full bg-violet-500" aria-hidden="true" />
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        </div>
        {badge}
      </div>
      {children}
    </section>
  );
}

function ModeBadge({ mode }) {
  const online = mode !== "fallback";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
        online ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${online ? "bg-emerald-500" : "bg-slate-400"}`} />
      {online ? "AI 生成" : "本地兜底"}
    </span>
  );
}

function Chevron() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 shrink-0 text-slate-300 transition group-hover:text-violet-500">
      <path d="m6 3.5 4.5 4.5L6 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ResultPanel({
  result,
  mode,
  cases = [],
  recordTerms = [],
  loadingStage = "",
  inputMode = "text",
  onCancel,
  resultOrigin = ""
}) {
  const navigate = useNavigate();

  if (loadingStage === "expanding" || loadingStage === "analyzing") {
    return (
      <LoadingState loadingStage={loadingStage} inputMode={inputMode} onCancel={onCancel} />
    );
  }

  if (!result) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-12 text-center sm:min-h-[420px] sm:py-16">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-400">
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
            <path
              d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5v-11Z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path d="M8 9h8M8 13h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <p className="mt-4 text-sm font-medium text-slate-600">还没有分析结果</p>
        <p className="mt-1 text-xs text-slate-400">在左侧粘贴学习材料后点击「生成学习分析」</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {resultOrigin === "builtin" && (
        <div className="rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-xs leading-5 text-violet-700">
          <span className="font-semibold">本地内置材料</span>
          <span className="ml-1.5">当前结果由内置材料直接生成，未调用模型。</span>
        </div>
      )}

      <SectionCard title="学习总结" badge={<ModeBadge mode={mode} />}>
        <p className="break-words text-sm leading-7 text-slate-700">{result.summary}</p>
      </SectionCard>

      <SectionCard title="关键知识点">
        <ul className="space-y-2">
          {result.keyPoints?.map((item, idx) => {
            const target = cases[idx];
            const content = (
              <>
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-violet-50 text-[11px] font-semibold text-violet-600">
                  {idx + 1}
                </span>
                <span className="min-w-0 flex-1 text-sm leading-6 text-slate-700">{item}</span>
                {target && <Chevron />}
              </>
            );

            return (
              <li key={idx}>
                {target ? (
                  <button
                    type="button"
                    onClick={() => navigate(`/point/${target.id}`)}
                    className="group flex w-full items-start gap-3 rounded-xl border border-transparent px-2 py-2 text-left transition hover:border-violet-200 hover:bg-violet-50/50"
                  >
                    {content}
                  </button>
                ) : (
                  <div className="flex items-start gap-3 px-2 py-2">{content}</div>
                )}
              </li>
            );
          })}
        </ul>
        {cases.length > 0 && (
          <p className="mt-3 pl-2 text-[11px] text-slate-400">点击知识点可查看完整讲解，并进入对应待办</p>
        )}
      </SectionCard>

      <SectionCard title="术语 / 单词卡">
        <div className="grid gap-3 md:grid-cols-2">
          {result.terms?.map((term, idx) => {
            const target = recordTerms[idx];
            const body = (
              <>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-semibold text-slate-800 break-words">{term.word}</span>
                  <div className="flex items-center gap-2">
                    {term.difficulty && (
                      <span className="shrink-0 text-[10px] uppercase tracking-wide text-slate-400">
                        {term.difficulty}
                      </span>
                    )}
                    {target && <Chevron />}
                  </div>
                </div>
                <div className="mt-1 text-sm text-slate-600">{term.meaning}</div>
                {term.example && (
                  <div className="mt-2 border-t border-slate-200/70 pt-2 text-[11px] italic leading-5 text-slate-500">
                    {term.example}
                  </div>
                )}
              </>
            );

            return target ? (
              <button
                key={idx}
                type="button"
                onClick={() => navigate(`/term/${target.id}`)}
                className="group rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-left transition hover:border-violet-300 hover:bg-violet-50/40 hover:shadow-sm"
              >
                {body}
              </button>
            ) : (
              <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5">
                {body}
              </div>
            );
          })}
        </div>
      </SectionCard>

      {result.warnings?.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-amber-800">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            提示
          </div>
          <ul className="space-y-1 text-xs leading-5 text-amber-700">
            {result.warnings.map((item, idx) => (
              <li key={idx}>• {item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
