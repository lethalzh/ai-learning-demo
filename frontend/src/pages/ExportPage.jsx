import { EmptyState } from "../components/EmptyState";

export default function ExportPage({ history, tasks }) {
  const latest = history[0];

  const downloadBlob = (content, type, filename) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportMarkdown = () => {
    if (!latest) return;

    const md = `# ${latest.theme} 学习笔记

## 学习目标
${latest.learningGoal}

## 总结
${latest.result?.summary || ""}

## 关键点
${(latest.result?.keyPoints || []).map((x) => `- ${x}`).join("\n")}

## 术语卡
${(latest.result?.terms || []).map((t) => `- **${t.word}**（${t.meaning}）：${t.example}`).join("\n")}

## 复习计划
${(latest.result?.reviewPlan || []).map((plan) => `### Day ${plan.day}：${plan.focus}\n${plan.actions.map((a) => `- ${a}`).join("\n")}`).join("\n\n")}

## 待办
${tasks.map((task) => `- [${task.status === "done" ? "x" : " "}] ${task.title}`).join("\n")}
`;

    downloadBlob(md, "text/markdown;charset=utf-8", `${latest.theme || "note"}-学习笔记.md`);
  };

  const exportJson = () => {
    if (!latest) return;
    downloadBlob(
      JSON.stringify({ record: latest, tasks }, null, 2),
      "application/json;charset=utf-8",
      "ai-learning-record.json"
    );
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">导出</h2>
        <p className="mt-0.5 text-xs text-slate-400">将最近一次分析结果导出为可归档的文件</p>
      </div>

      {!latest ? (
        <EmptyState title="暂无可导出的内容" description="在「分析」页生成学习分析后即可导出笔记与复习计划" />
      ) : (
        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
              当前导出内容
            </div>
            <div className="mt-2 text-base font-semibold text-slate-900">{latest.theme}</div>
            <div className="mt-1 text-xs text-slate-400">
              {new Date(latest.createdAt).toLocaleString()} · 待办 {tasks.length} 项 ·{" "}
              {latest.mode === "fallback" ? "本地兜底" : "线上模型"}
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-xs">
              <div>
                <dt className="text-slate-400">关键点</dt>
                <dd className="mt-0.5 font-medium text-slate-700">
                  {latest.result?.keyPoints?.length || 0} 条
                </dd>
              </div>
              <div>
                <dt className="text-slate-400">术语卡</dt>
                <dd className="mt-0.5 font-medium text-slate-700">
                  {latest.result?.terms?.length || 0} 张
                </dd>
              </div>
            </dl>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={exportMarkdown}
              className="group flex w-full items-center justify-between rounded-2xl bg-violet-600 px-5 py-4 text-left text-white shadow-sm shadow-violet-600/25 transition hover:bg-violet-700 active:scale-[0.995]"
            >
              <span>
                <span className="block text-sm font-semibold">导出笔记为 Markdown</span>
                <span className="mt-0.5 block text-[11px] text-violet-200">
                  包含总结、关键点、术语卡与复习计划
                </span>
              </span>
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0 text-violet-200 transition group-hover:translate-y-0.5">
                <path d="M12 4v11m0 0 4-4m-4 4-4-4M5 19h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button
              type="button"
              onClick={exportJson}
              className="group flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left shadow-sm transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.995]"
            >
              <span>
                <span className="block text-sm font-semibold text-slate-800">导出 JSON 快照</span>
                <span className="mt-0.5 block text-[11px] text-slate-400">
                  完整结构化数据，便于二次开发或备份
                </span>
              </span>
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0 text-slate-400 transition group-hover:translate-y-0.5">
                <path d="M12 4v11m0 0 4-4m-4 4-4-4M5 19h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
