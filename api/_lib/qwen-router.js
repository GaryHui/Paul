const defaultEndpoint = "https://dashscope.aliyuncs.com/compatible-mode/v1";

function numberEnv(name, fallback) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) ? value : fallback;
}

function qwenEndpoint() {
  return process.env.QWEN_BASE_URL || defaultEndpoint;
}

function configuredModels() {
  const strongModel = process.env.QWEN_MODEL_STRONG || process.env.QWEN_MODEL_MAX || process.env.QWEN_MODEL || "qwen-plus";
  const fastModel = process.env.QWEN_MODEL_FAST || process.env.QWEN_MODEL_PLUS || strongModel;
  return { strongModel, fastModel };
}

function qwenMaxTokens(source = "paul-lock") {
  const sourceKey = String(source || "").toLowerCase();
  if (sourceKey.includes("mistake") || sourceKey.includes("review")) {
    return numberEnv("QWEN_MISTAKE_MAX_OUTPUT_TOKENS", numberEnv("QWEN_MAX_OUTPUT_TOKENS", 1200));
  }
  if (sourceKey.includes("daily")) {
    return numberEnv("QWEN_DAILY_MAX_OUTPUT_TOKENS", numberEnv("QWEN_MAX_OUTPUT_TOKENS", 1200));
  }
  return numberEnv("QWEN_MAX_OUTPUT_TOKENS", 1400);
}

function chooseQwenModel(context = {}) {
  const { strongModel, fastModel } = configuredModels();
  if (process.env.QWEN_ROUTER_DISABLED === "1") {
    return {
      model: process.env.QWEN_MODEL || strongModel,
      tier: "fixed",
      reason: "router-disabled",
      strongModel,
      fastModel
    };
  }

  const source = context.source || "paul-lock";
  const hoursToKickoff = Number(context.hoursToKickoff);
  const upsetScore = Number(context.upsetScore);
  const strongDailyHours = numberEnv("QWEN_STRONG_DAILY_HOURS", 24);
  const strongUpsetScore = numberEnv("QWEN_STRONG_UPSET_SCORE", 45);
  const strongSources = new Set([
    "official-lock",
    "manual-lock",
    "mistake-review",
    "post-match-review",
    "shadow-lock"
  ]);

  let tier = "fast";
  let reason = "routine-refresh";

  if (strongSources.has(source)) {
    tier = "strong";
    reason = `${source}-requires-strong-model`;
  } else if (Number.isFinite(hoursToKickoff) && hoursToKickoff <= strongDailyHours) {
    tier = "strong";
    reason = `within-${strongDailyHours}h-pre-kickoff`;
  } else if (Number.isFinite(upsetScore) && upsetScore >= strongUpsetScore) {
    tier = "strong";
    reason = `upset-score-${Math.round(upsetScore)}`;
  } else if (context.missingPrimaryEvidence) {
    tier = "strong";
    reason = "missing-primary-evidence";
  }

  return {
    model: tier === "strong" ? strongModel : fastModel,
    tier,
    reason,
    strongModel,
    fastModel
  };
}

module.exports = {
  chooseQwenModel,
  qwenEndpoint,
  qwenMaxTokens
};
