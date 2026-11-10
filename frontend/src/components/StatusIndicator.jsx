import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const MODES = {
  online: {
    label: "AI 在线模式",
    short: "在线",
    dot: "bg-emerald-500",
    halo: true,
    shell: "sm:border-emerald-200 sm:bg-emerald-50/70 sm:text-emerald-700",
    dotWrap: "text-emerald-500"
  },
  fallback: {
    label: "离线兜底模式",
    short: "离线",
    dot: "bg-slate-400",
    halo: false,
    shell: "sm:border-slate-200 sm:bg-slate-100 sm:text-slate-600",
    dotWrap: "text-slate-400"
  }
};

const ERROR_MODE = {
  label: "服务异常",
  short: "异常",
  dot: "bg-rose-400",
  halo: false,
  shell: "sm:border-rose-200 sm:bg-rose-50 sm:text-rose-600",
  dotWrap: "text-rose-400"
};

function resolveMeta(mode) {
  if (mode === "online") return MODES.online;
  if (mode === "error") return ERROR_MODE;
  return MODES.fallback;
}

function sourceLabel(source) {
  return source === "deepseek" ? "线上模型（DeepSeek）" : "本地兜底材料";
}

function StatusCard({ meta, mode, source, cacheStatus, errorMessage, onClose }) {
  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${meta.dot}`} aria-hidden="true" />
          <span className="text-sm font-semibold text-slate-800">{meta.label}</span>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭状态说明"
            className="-mr-1 flex h-11 w-11 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 sm:hidden"
          >
            <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4" aria-hidden="true">
              <path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      <dl className="mt-3 space-y-2 text-xs">
        <div className="flex items-start justify-between gap-3">
          <dt className="shrink-0 text-slate-400">数据来源</dt>
          <dd className="text-right font-medium text-slate-700">{sourceLabel(source)}</dd>
        </div>
        <div className="flex items-start justify-between gap-3">
          <dt className="shrink-0 text-slate-400">本地兜底</dt>
          <dd className="text-right font-medium text-slate-700">
            {cacheStatus?.localCacheCount ?? 0} 篇材料可用
          </dd>
        </div>
      </dl>

      <p className="mt-3 border-t border-slate-100 pt-3 text-xs leading-5 text-slate-500">
        {mode === "online"
          ? "AI 服务正常，分析结果由线上模型实时生成。"
          : "当前使用本地缓存材料，业务功能不受影响，可视化降级演示。"}
      </p>

      {errorMessage && (
        <p className="mt-2 rounded-lg bg-amber-50 px-2.5 py-2 text-xs leading-5 text-amber-700">
          {errorMessage}
        </p>
      )}
    </>
  );
}

export default function StatusIndicator({ mode, source, errorMessage, cacheStatus }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const meta = resolveMeta(mode);

  useEffect(() => {
    if (!open) return;
    const handleClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    const handleKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const cardProps = { meta, mode, source, cacheStatus, errorMessage };

  return (
    <div className="group relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label={`系统状态：${meta.label}`}
        className={`flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-transparent bg-transparent text-xs font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 sm:h-auto sm:w-auto sm:border sm:px-3 sm:py-1.5 ${meta.shell}`}
      >
        <span className="relative flex h-2 w-2 items-center justify-center">
          {meta.halo && (
            <span
              className={`absolute inset-0 rounded-full ${meta.dot} animate-breathe`}
              aria-hidden="true"
            />
          )}
          <span className={`relative h-2 w-2 rounded-full ${meta.dot}`} aria-hidden="true" />
        </span>
        <span className="hidden sm:inline">{meta.short}</span>
      </button>

      {/* 桌面端：hover / 点击展开的下拉卡片（绝对定位在按钮下方） */}
      <div
        role="tooltip"
        className={`absolute right-0 top-full z-50 mt-2 hidden w-64 origin-top-right rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-lg shadow-slate-900/5 transition-all duration-150 sm:block ${
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100"
        }`}
      >
        <StatusCard {...cardProps} />
      </div>

      {/* 移动端：底部卡片式浮层，portal 到 body，避免被 sticky header 的 backdrop-filter 限制定位 */}
      {open &&
        createPortal(
          <div className="sm:hidden">
            <div
              className="fixed inset-0 z-40 bg-slate-900/30"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-label="系统状态详情"
              className="fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-50 max-h-[70vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 pb-safe text-left shadow-xl shadow-slate-900/15"
            >
              <StatusCard {...cardProps} onClose={() => setOpen(false)} />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
