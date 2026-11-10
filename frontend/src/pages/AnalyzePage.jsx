import { useEffect, useRef, useState } from "react";
import InputPanel from "../components/InputPanel";
import ResultPanel from "../components/ResultPanel";
import OfflineMaterialPicker from "../components/OfflineMaterialPicker";
import TodoPanel from "../components/TodoPanel";
import ReviewPanel from "../components/ReviewPanel";
import {
  analyzeMaterial,
  expandKeywords,
  getCacheStatus,
  getFallbackData,
  getSampleMaterials
} from "../api/client";
import { buildCases, buildTerms } from "../utils/cases";

const EXPANSION_ERROR_FALLBACK = "关键词扩写失败，请稍后重试，或切换到正文材料模式";

export default function AnalyzePage({
  analysis,
  patchAnalysis,
  setHistory,
  tasks,
  setTasks,
  terms,
  setTerms,
  status,
  onStatusChange
}) {
  const {
    theme,
    learningGoal,
    materialText,
    keywords,
    inputMode,
    expandedMaterial,
    result,
    recordId,
    loadingStage,
    resultOrigin
  } = analysis;

  const [sampleMaterials, setSampleMaterials] = useState([]);
  const [formError, setFormError] = useState("");
  const [showOfflinePicker, setShowOfflinePicker] = useState(false);
  const [pickerLoadingId, setPickerLoadingId] = useState("");
  const [pickerError, setPickerError] = useState("");
  const abortRef = useRef(null);

  const mode = status.mode;
  const currentCases = tasks.filter((task) => task.recordId === recordId);
  const currentTerms = terms.filter((term) => term.recordId === recordId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sampleRes = await getSampleMaterials();
        if (sampleRes.success) setSampleMaterials(sampleRes.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const applyOnlineStatus = (online, data) => {
    onStatusChange({
      online,
      mode: online ? "online" : "fallback",
      source: online ? "deepseek" : "local-cache",
      errorMessage: online ? "" : data?.offlineDetail || "模型服务不可用，请使用本地内置材料"
    });
  };

  const ensureOnline = async () => {
    try {
      const res = await getCacheStatus({ refresh: true });
      const online = res?.success ? res.data?.online !== false : false;
      applyOnlineStatus(online, res?.data);
      return online;
    } catch (err) {
      applyOnlineStatus(false, null);
      return false;
    }
  };

  const handleUseSampleMaterial = (item) => {
    setFormError("");
    patchAnalysis({
      theme: item.theme,
      learningGoal: `学习 ${item.title}`,
      materialText: item.previewText || "",
      inputMode: "text"
    });
  };

  const handleInputModeChange = (nextMode) => {
    setFormError("");
    patchAnalysis({ inputMode: nextMode });
  };

  const handleToggleTask = (taskId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, status: task.status === "done" ? "pending" : "done" }
          : task
      )
    );
  };

  const persistOutcome = (data, nextRecordId, material, recordMode, origin) => {
    const newTerms = buildTerms({ recordId: nextRecordId, theme, result: data });
    const newCases = buildCases({ recordId: nextRecordId, theme, result: data, terms: newTerms });

    setTerms((prev) => [...prev, ...newTerms]);
    setTasks((prev) => [...prev, ...newCases]);
    patchAnalysis({
      result: data,
      recordId: nextRecordId,
      loadingStage: "",
      resultOrigin: origin
    });

    setHistory((prev) =>
      [
        {
          id: nextRecordId,
          theme,
          learningGoal,
          materialText: material,
          createdAt: new Date().toISOString(),
          mode: recordMode,
          result: data
        },
        ...prev
      ].slice(0, 20)
    );
  };

  const buildLocalResult = () => ({
    summary: "当前 AI 服务不可用，已使用本地材料进行演示。",
    keyPoints: ["本地缓存内容已生效", "Demo 可继续使用"],
    taskList: [
      { id: "fallback_t1", title: "查看本地示例内容", status: "pending", priority: "high", category: "study" },
      { id: "fallback_t2", title: "继续学习并复习知识点", status: "pending", priority: "medium", category: "review" }
    ],
    reviewPlan: [{ day: 1, focus: "快速浏览知识结构", actions: ["理解核心知识点", "整理待复习事项"] }],
    terms: [
      {
        word: "Fallback",
        meaning: "降级模式",
        example: "The system entered fallback mode when AI failed.",
        difficulty: "easy"
      }
    ],
    warnings: ["当前为降级模式"]
  });

  const runAnalyze = async (material) => {
    const controller = new AbortController();
    abortRef.current = controller;
    patchAnalysis({ loadingStage: "analyzing" });
    onStatusChange({ errorMessage: "" });

    try {
      const response = await analyzeMaterial(
        { theme, learningGoal, materialText: material, mode: "study" },
        controller.signal
      );
      const nextMode = response.mode || (response.success ? "online" : "fallback");
      const nextSource = response.source || (response.success ? "deepseek" : "local-cache");

      onStatusChange({
        online: nextMode !== "fallback",
        mode: nextMode,
        source: nextSource,
        errorMessage: response.success
          ? ""
          : response.error?.message || "服务异常，已切换到本地缓存模式"
      });

      if (response.data) {
        persistOutcome(response.data, `record_${Date.now()}`, material, nextMode, nextSource);
      } else {
        patchAnalysis({ result: null, loadingStage: "" });
      }
    } catch (err) {
      if (err?.code === "ERR_CANCELED") {
        patchAnalysis({ loadingStage: "" });
        setFormError("已取消本次生成");
        return;
      }

      onStatusChange({
        online: false,
        mode: "fallback",
        source: "local-cache",
        errorMessage: "请求失败，已切换到本地缓存模式"
      });
      persistOutcome(buildLocalResult(), `local_${Date.now()}`, material, "fallback", "local-cache");
    } finally {
      abortRef.current = null;
    }
  };

  const handleCancel = () => {
    abortRef.current?.abort();
  };

  const handleSubmit = async () => {
    setFormError("");

    let tokens = [];
    if (inputMode === "keywords") {
      const trimmed = (keywords || "").trim();
      tokens = trimmed.split(/[,，、;；\s]+/).filter(Boolean);

      if (tokens.length === 0) {
        setFormError("请先输入关键词，多个关键词用逗号或空格分隔");
        return;
      }

      if (tokens.join("").length < 2) {
        setFormError("关键词太短，请至少输入 2 个字符");
        return;
      }
    }

    patchAnalysis({ loadingStage: "checking" });
    const online = await ensureOnline();

    if (!online) {
      patchAnalysis({ loadingStage: "" });
      setPickerError("");
      setShowOfflinePicker(true);
      return;
    }

    setShowOfflinePicker(false);

    if (inputMode === "keywords") {
      const controller = new AbortController();
      abortRef.current = controller;
      patchAnalysis({ loadingStage: "expanding" });

      let expanded;
      try {
        const expansion = await expandKeywords(
          { keywords: (keywords || "").trim(), theme },
          controller.signal
        );
        if (!expansion?.success || !expansion?.data?.materialText) {
          throw new Error(expansion?.error?.message || EXPANSION_ERROR_FALLBACK);
        }
        expanded = expansion.data.materialText;
      } catch (err) {
        abortRef.current = null;
        if (err?.code === "ERR_CANCELED") {
          patchAnalysis({ loadingStage: "" });
          setFormError("已取消关键词扩写");
          return;
        }
        patchAnalysis({ loadingStage: "" });
        setFormError(err?.response?.data?.error?.message || EXPANSION_ERROR_FALLBACK);
        return;
      }

      abortRef.current = null;
      patchAnalysis({ expandedMaterial: expanded });
      await runAnalyze(expanded);
      return;
    }

    await runAnalyze(materialText);
  };

  const handleUseOfflineMaterial = async (material) => {
    setPickerError("");
    setPickerLoadingId(material.id);

    try {
      const res = await getFallbackData(material.id, material.theme || theme);
      if (!res?.success || !res.data) {
        throw new Error(res?.error?.message || "内置材料加载失败");
      }

      persistOutcome(
        res.data,
        `offline_${Date.now()}`,
        material.previewText || material.title || material.theme,
        "fallback",
        "builtin"
      );
      onStatusChange({ mode: "fallback", source: "local-cache", errorMessage: "" });
      setShowOfflinePicker(false);
    } catch (err) {
      setPickerError(
        err?.response?.data?.error?.message || "无法加载内置材料结果，请确认后端服务可用后重试"
      );
    } finally {
      setPickerLoadingId("");
    }
  };

  const handleRetryOnline = async () => {
    setPickerError("");
    const online = await ensureOnline();
    if (online) {
      setShowOfflinePicker(false);
    } else {
      setPickerError("仍然无法连接模型服务，请继续使用内置材料");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1.55fr)_minmax(0,0.9fr)]">
        <InputPanel
          theme={theme}
          setTheme={(value) => patchAnalysis({ theme: value })}
          learningGoal={learningGoal}
          setLearningGoal={(value) => patchAnalysis({ learningGoal: value })}
          materialText={materialText}
          setMaterialText={(value) => patchAnalysis({ materialText: value })}
          keywords={keywords}
          setKeywords={(value) => patchAnalysis({ keywords: value })}
          inputMode={inputMode}
          onInputModeChange={handleInputModeChange}
          sampleMaterials={sampleMaterials}
          onUseSampleMaterial={handleUseSampleMaterial}
          onSubmit={handleSubmit}
          loadingStage={loadingStage}
          formError={formError}
          expandedMaterial={expandedMaterial}
        />

        {showOfflinePicker ? (
          <OfflineMaterialPicker
            materials={sampleMaterials}
            loadingId={pickerLoadingId}
            error={pickerError}
            onSelect={handleUseOfflineMaterial}
            onRetry={handleRetryOnline}
            onClose={() => setShowOfflinePicker(false)}
          />
        ) : (
          <ResultPanel
            result={result}
            mode={mode}
            cases={currentCases}
            recordTerms={currentTerms}
            loadingStage={loadingStage}
            inputMode={inputMode}
            onCancel={handleCancel}
            resultOrigin={resultOrigin}
          />
        )}

        <div className="space-y-4 sm:space-y-6">
          <TodoPanel cases={currentCases} onToggleTask={handleToggleTask} />
          <ReviewPanel reviewPlan={result?.reviewPlan || []} />
        </div>
      </div>
    </div>
  );
}
