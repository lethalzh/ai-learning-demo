import { useNavigate, useParams } from "react-router-dom";
import { EmptyState } from "../components/EmptyState";

function Section({ title, children }) {
  return (
    <section>
      <div className="mb-2 flex items-center gap-2">
        <span className="h-3.5 w-1 rounded-full bg-violet-500" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export default function PointDetailPage({ tasks, setTasks, terms }) {
  const { caseId } = useParams();
  const navigate = useNavigate();

  const task = tasks.find((item) => item.id === caseId);

  if (!task) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <EmptyState title="未找到该知识点" description="它可能已被清除，请返回分析页重新生成" />
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

  const done = task.status === "done";
  const notes = task.notes || [];
  const relatedTermIds = task.relatedTermIds || [];
  const relatedTerms = relatedTermIds
    .map((id) => terms.find((term) => term.id === id))
    .filter(Boolean);

  const toggleStatus = () => {
    setTasks((prev) =>
      prev.map((item) =>
        item.id === task.id
          ? { ...item, status: item.status === "done" ? "pending" : "done" }
          : item
      )
    );
  };

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

        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
            done ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${done ? "bg-emerald-500" : "bg-amber-500"}`} />
          {done ? "已学习完成" : "待完成"}
        </span>
      </div>

      <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm break-words sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-medium text-violet-600">
            {task.theme}
          </span>
          <span className="text-[11px] text-slate-400">知识点 {Number(task.index ?? 0) + 1}</span>
        </div>

        <h1 className="mt-3 text-lg font-bold leading-7 text-slate-900 break-words sm:text-xl sm:leading-8">{task.title}</h1>

        <div className="mt-6 space-y-6">
          <Section title="要点讲解">
            <p className="rounded-xl bg-slate-50/80 p-4 text-sm leading-7 text-slate-700">
              {task.explanation || task.title}
            </p>
          </Section>

          <Section title="示例">
            {task.example ? (
              <blockquote className="rounded-xl border-l-2 border-violet-300 bg-violet-50/40 px-4 py-3 text-sm italic leading-6 text-slate-600">
                {task.example}
              </blockquote>
            ) : (
              <p className="rounded-xl border border-dashed border-slate-200 px-4 py-3 text-xs text-slate-400">
                暂无示例，可结合原始材料上下文自行举例
              </p>
            )}
          </Section>

          <Section title="注意事项">
            {notes.length > 0 ? (
              <ul className="space-y-2">
                {notes.map((note, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm leading-6 text-slate-600">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" aria-hidden="true" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400">暂无注意事项</p>
            )}
          </Section>

          {relatedTerms.length > 0 && (
            <Section title="相关术语">
              <div className="flex flex-wrap gap-2">
                {relatedTerms.map((term) => (
                  <button
                    key={term.id}
                    type="button"
                    onClick={() => navigate(`/term/${term.id}`)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-violet-300 hover:bg-violet-50/60 hover:text-violet-700 min-h-[44px] sm:min-h-0"
                  >
                    {term.word}
                    <span className="ml-1.5 text-slate-400">{term.meaning}</span>
                  </button>
                ))}
              </div>
            </Section>
          )}

          {task.summary && (
            <Section title="所属主题总结">
              <p className="text-xs leading-6 text-slate-500">{task.summary}</p>
            </Section>
          )}
        </div>
      </article>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-slate-500">
            {done ? "已标记为学习完成，可在下方取消。" : "读完这篇讲解后，点击右侧按钮记录学习进度。"}
          </p>
          <button
            type="button"
            onClick={toggleStatus}
            className={`min-h-[44px] w-full shrink-0 rounded-xl px-5 py-2.5 text-sm font-semibold transition sm:min-h-0 sm:w-auto ${
              done
                ? "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                : "bg-violet-600 text-white shadow-sm shadow-violet-600/25 hover:bg-violet-700"
            }`}
          >
            {done ? "取消完成" : "学习完成"}
          </button>
        </div>
      </div>
    </div>
  );
}
