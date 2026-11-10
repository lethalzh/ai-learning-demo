import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000
});

export const analyzeMaterial = async (payload, signal) => {
  const { data } = await api.post("/api/analyze", payload, { signal });
  return data;
};

export const getSampleMaterials = async () => {
  const { data } = await api.get("/api/sample-materials");
  return data;
};

export const getCacheStatus = async (options = {}) => {
  const { data } = await api.get("/api/cache-status", {
    params: options.refresh ? { refresh: 1 } : {}
  });
  return data;
};

export const getFallbackData = async (materialId, theme) => {
  const { data } = await api.post("/api/fallback", { materialId, theme });
  return data;
};

export const expandKeywords = async (payload, signal) => {
  const { data } = await api.post("/api/expand-keywords", payload, { signal });
  return data;
};
