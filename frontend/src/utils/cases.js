/**
 * 由一次分析结果派生出「知识点 case」与「术语卡」实体。
 * 每条 case 与 keyPoints 一一对应，id 由 recordId + 下标稳定生成，
 * 保证详情页与待办列表读写同一份状态。
 */

export function buildTerms({ recordId, theme, result }) {
  return (result?.terms || []).map((term, index) => ({
    id: `${recordId}__term${index}`,
    recordId,
    index,
    theme,
    word: term.word || `术语 ${index + 1}`,
    meaning: term.meaning || "",
    example: term.example || "",
    difficulty: term.difficulty || "medium",
    detail: typeof term.detail === "string" ? term.detail.trim() : "",
    notes: [`从「${theme}」材料中提取的术语`, "尝试用这个词造一个与自己场景相关的句子"]
  }));
}

export function buildCases({ recordId, theme, result, terms }) {
  const points = result?.keyPoints || [];
  const details = Array.isArray(result?.keyPointDetails) ? result.keyPointDetails : [];
  const termList = terms || buildTerms({ recordId, theme, result });

  return points.map((point, index) => {
    const detail = details[index] || {};

    const matchedTermIds = termList
      .filter(
        (term) =>
          (term.word && point.includes(term.word)) ||
          (term.meaning && point.includes(term.meaning))
      )
      .map((term) => term.id);

    const relatedTermIds = matchedTermIds.length > 0 ? matchedTermIds : termList.slice(0, 2).map((t) => t.id);

    const example =
      detail.example ||
      (relatedTermIds.length > 0
        ? termList.find((term) => term.id === relatedTermIds[0])?.example || ""
        : "");

    return {
      id: `${recordId}__kp${index}`,
      recordId,
      index,
      theme,
      title: point,
      summary: result?.summary || "",
      explanation: detail.explanation || point,
      example,
      notes:
        Array.isArray(detail.notes) && detail.notes.length > 0
          ? detail.notes
          : [`结合「${theme}」的整体框架理解这一条`, "先自己复述一遍，再对照原文确认细节"],
      relatedTermIds,
      status: "pending",
      priority: index === 0 ? "high" : index < 3 ? "medium" : "low",
      category: index === 0 ? "study" : "review"
    };
  });
}
