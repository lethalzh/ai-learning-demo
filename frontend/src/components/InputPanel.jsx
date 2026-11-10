const MATERIAL_TEMPLATE = `主题：Python 基础语法

核心内容：
本节材料介绍 Python 中列表（list）与字典（dict）的基本用法，以及它们在数据处理中的典型场景。

关键要点：
1. 列表是有序可变序列，支持索引、切片和 append 追加。
2. 字典用键值对存储数据，按键查找速度快，适合表示结构化信息。
3. 列表适合顺序遍历，字典适合按名称取值，两者经常配合使用。

已掌握：
- 变量与基本数据类型
- 条件判断与循环

待补充 / 疑问：
- 列表推导式的写法还不熟练
- 嵌套字典该如何高效遍历

示例（可替换为你自己的内容）：
统计单词出现次数时，可以先用列表保存单词，再用字典累计次数：
words = ["apple", "banana", "apple"]
counter = {}
for word in words:
    counter[word] = counter.get(word, 0) + 1
最终得到 {"apple": 2, "banana": 1}。`;

const INPUT_MODES = [
  { value: "text", label: "正文材料" },
  { value: "keywords", label: "关键词" }
];

export default function InputPanel({
  theme,
  setTheme,
  learningGoal,
  setLearningGoal,
  materialText,
  setMaterialText,
  keywords,
  setKeywords,
  inputMode,
  onInputModeChange,
  sampleMaterials,
  onUseSampleMaterial,
  onSubmit,
  loadingStage,
  formError,
  expandedMaterial
}) {
  const loading = Boolean(loadingStage);

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 disabled:opacity-60";

  const applyTemplate = () => {
    setMaterialText(MATERIAL_TEMPLATE);
    onInputModeChange("text");
  };

  const submitLabel = (() => {
    if (loadingStage === "checking") return "检测服务状态...";
    if (loadingStage === "expanding") return "扩写关键词...";
    if (loadingStage === "analyzing") return "分析生成中...";
    return "生成学习分析";
  })();

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center justify-between sm:mb-5">
        <div className="flex items-center gap-2.5">
          <span className="h-4 w-1 rounded-full bg-violet-500" aria-hidden="true" />
          <h2 className="text-base font-semibold text-slate-900">学习材料</h2>
        </div>
        <button
          type="button"
          onClick={applyTemplate}
          disabled={loading}
          className="flex min-h-[44px] items-center rounded-lg border border-violet-200 bg-violet-50 px-3 text-xs font-medium text-violet-600 transition hover:border-violet-300 hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-0 sm:px-2.5 sm:py-1 sm:text-[11px]"
        >
          套用模板
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-500">主题</label>
          <input
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            disabled={loading}
            className={inputClass}
            placeholder="例如：AI基础入门"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-500">学习目标</label>
          <input
            value={learningGoal}
            onChange={(e) => setLearningGoal(e.target.value)}
            disabled={loading}
            className={inputClass}
            placeholder="例如：快速掌握 AI 基础概念"
          />
        </div>

        <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100/80 p-1">
          {INPUT_MODES.map((item) => {
            const active = inputMode === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => onInputModeChange(item.value)}
                disabled={loading}
                aria-pressed={active}
                className={`min-h-[44px] rounded-lg px-3 text-xs font-medium transition disabled:cursor-not-allowed sm:min-h-0 sm:py-1.5 ${
                  active
                    ? "bg-white text-violet-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {inputMode === "text" ? (
          <div>
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <label className="block text-xs font-medium text-slate-500">学习材料</label>
              <span className="text-[11px] tabular-nums text-slate-400">{materialText.length} 字</span>
            </div>
            <textarea
              value={materialText}
              onChange={(e) => setMaterialText(e.target.value)}
              disabled={loading}
              rows={9}
              className={`${inputClass} resize-none leading-6`}
              placeholder="粘贴一段学习材料：例如 AI 基础概念、会议纪要、读书笔记、英语学习内容..."
            />
          </div>
        ) : (
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-500">关键词</label>
            <textarea
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              disabled={loading}
              rows={3}
              className={`${inputClass} resize-none leading-6`}
              placeholder="例如：机器学习, 过拟合, 正则化, 交叉验证"
            />
            <p className="mt-1.5 text-[11px] leading-5 text-slate-400">
              用逗号或空格分隔，系统会先扩写成一段学习材料，再走完整分析
            </p>
          </div>
        )}

        {formError && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs leading-5 text-rose-600">
            {formError}
          </div>
        )}

        <button
          onClick={onSubmit}
          disabled={loading}
          className="w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white shadow-sm shadow-violet-600/25 transition hover:bg-violet-700 active:scale-[0.995] disabled:cursor-not-allowed disabled:bg-violet-300 disabled:shadow-none"
        >
          {submitLabel}
        </button>

        {expandedMaterial && (
          <details className="rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5">
            <summary className="cursor-pointer select-none text-[11px] font-medium text-slate-600">
              查看本次扩写的学习材料（{expandedMaterial.length} 字）
            </summary>
            <p className="mt-2 whitespace-pre-wrap break-words text-xs leading-6 text-slate-600">
              {expandedMaterial}
            </p>
          </details>
        )}
      </div>

      <div className="mt-6 border-t border-slate-100 pt-5">
        <h3 className="mb-2.5 text-xs font-medium text-slate-500">示例材料</h3>
        <div className="space-y-2">
          {sampleMaterials.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-200 px-3 py-4 text-center text-xs text-slate-400">
              暂无示例材料
            </p>
          ) : (
            sampleMaterials.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onUseSampleMaterial(item)}
                disabled={loading}
                className="w-full min-h-[44px] rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left transition hover:-translate-y-0.5 hover:border-violet-300 hover:bg-violet-50/50 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-0"
              >
                <div className="text-sm font-medium text-slate-800">{item.title}</div>
                <div className="mt-0.5 text-[11px] text-slate-400">{item.theme}</div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
