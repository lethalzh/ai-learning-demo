function meta() {
  return {
    requestId: `req_${Date.now()}`,
    timestamp: new Date().toISOString()
  };
}

function success(data, { mode = "online", source = "local-cache" } = {}) {
  return {
    success: true,
    mode,
    source,
    error: null,
    data,
    meta: meta()
  };
}

function failure(error, data = {}, { mode = "fallback", source = "local-cache" } = {}) {
  return {
    success: false,
    mode,
    source,
    error,
    data,
    meta: meta()
  };
}

module.exports = { success, failure };
