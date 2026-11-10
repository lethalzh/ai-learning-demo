import { OFFLINE_CATALOG } from "../utils/offlineCatalog";

export default function OfflineMaterialPicker({
  materials,
  loadingId,
  error,
  onSelect,
  onRetry,
  onClose
}) {
  const list = materials?.length ? materials : OFFLINE_CATALOG;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="h-4 w-1 rounded-full bg-slate-400" aria-hidden="true" />
            <h3 className="text-base font-semibold text-slate-900">离线模式 · 内置学习材料</h3>
          </div>
          <p className="mt-1.5 text-[11px] leading-5 text-slate-500">
            当前模型服务不可用。选择一份内置材料即可直接生成学习结果，
            <span className="font-medium text-slate-700">不会发起任何模型请求</span>。
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
          本地内置
        </span>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs leading-5 text-rose-600">
          {error}
        </div>
      )}

      <div className="mt-4 space-y-2.5">
        {list.map((item) => {
          const isLoading = loadingId === item.id;
          return (
            <div
              key={item.id}
              className="flex flex-col gap-2.5 rounded-xl border border-slate-200 bg-white p-3.5 transition hover:border-violet-300 hover:bg-violet-50/40 sm:flex-row sm:items-start sm:justify-between sm:gap-3"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-slate-800 break-words">{item.title}</span>
                  <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-medium text-violet-600">
                    {item.theme}
                  </span>
                </div>
                <p className="mt-1 text-[11px] leading-5 text-slate-500">{item.description}</p>
              </div>

              <button
                type="button"
                onClick={() => onSelect(item)}
                disabled={Boolean(loadingId)}
                className="flex min-h-[44px] shrink-0 items-center justify-center rounded-lg bg-violet-600 px-3 text-[11px] font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-violet-300 sm:min-h-0 sm:py-1.5"
              >
                {isLoading ? "生成中..." : "使用此材料"}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onRetry}
          disabled={Boolean(loadingId)}
          className="flex min-h-[44px] items-center justify-center rounded-lg border border-slate-200 px-3 text-[11px] font-medium text-slate-600 transition hover:border-violet-300 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-0 sm:py-1.5"
        >
          重新检测在线状态
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={Boolean(loadingId)}
          className="flex min-h-[44px] items-center justify-center rounded-lg px-2.5 text-[11px] font-medium text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-0 sm:py-1.5"
        >
          返回
        </button>
      </div>
    </div>
  );
}
