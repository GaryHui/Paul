const tokenInput = document.getElementById("tokenInput");
const bankrollInput = document.getElementById("bankrollInput");
const kellyInput = document.getElementById("kellyInput");
const maxStakeInput = document.getElementById("maxStakeInput");
const portfolioCapInput = document.getElementById("portfolioCapInput");
const minEdgeInput = document.getElementById("minEdgeInput");
const loadButton = document.getElementById("loadButton");
const statusBox = document.getElementById("status");
const summary = document.getElementById("summary");
const table = document.getElementById("quantTable");
const tbody = document.getElementById("quantBody");
const emptyState = document.getElementById("emptyState");

const sourceLabels = {
  "Official lock": "正式锁定",
  "Daily read": "每日判断",
  "Market fallback": "市场参考"
};

const riskLabels = {
  Capped: "已触及上限",
  "Strong edge": "强优势",
  "Measured edge": "中等优势",
  "Small edge": "小优势",
  "No bet": "不下注",
  "Missing odds": "缺少赔率",
  "Edge below threshold": "低于优势阈值",
  "Reference only": "仅作参考",
  Final: "已完赛",
  "Kickoff passed": "已开赛",
  "No PAUL read": "暂无 PAUL 判断",
  "Missing PAUL probability": "缺少 PAUL 概率"
};

const outcomeLabels = {
  correct: "胜负命中",
  missed: "胜负未中",
  ungraded: "无法判定",
  pending: "等待赛果"
};

const decisionLabels = {
  BET: "可下注",
  WATCH: "观察机会",
  NO_BET: "不下注",
  SETTLED: "已完赛"
};

const roundLabels = {
  "Group Stage": "小组赛",
  "Round of 32": "32 强",
  "Round of 16": "16 强",
  Quarterfinal: "八强",
  Semifinal: "半决赛",
  "Third Place": "季军赛",
  Final: "决赛"
};

function sessionGet(key) {
  try {
    return sessionStorage.getItem(key) || "";
  } catch {
    return "";
  }
}

function sessionSet(key, value) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    // Session storage is optional.
  }
}

function money(value) {
  const amount = Number(value || 0);
  return `${new Intl.NumberFormat("zh-CN", {
    maximumFractionDigits: amount >= 100 ? 0 : 2
  }).format(amount)} 单位`;
}

function pct(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "N/A";
  return `${Number(value).toFixed(2)}%`;
}

function odds(value) {
  if (!value) return "-";
  return Number(value).toFixed(2);
}

function dateTime(value) {
  if (!value) return "时间待定";
  return new Intl.DateTimeFormat("zh-CN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function text(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function labelSource(value) {
  return sourceLabels[value] || value || "待定";
}

function labelRisk(value) {
  return riskLabels[value] || value || "待定";
}

function labelRound(value) {
  return roundLabels[value] || value || "比赛";
}

function infoButton(title, lines) {
  const safeLines = (Array.isArray(lines) ? lines : [lines]).filter((line) => line !== null && line !== undefined && line !== "");
  return `
    <details class="calc-info">
      <summary aria-label="${text(title)}">i</summary>
      <div class="calc-info__body">
        <strong>${text(title)}</strong>
        ${safeLines.map((line) => `<span>${text(line)}</span>`).join("")}
      </div>
    </details>
  `;
}

function metric(label, value, lines) {
  return `
    <article class="metric">
      <strong>${text(value)}${infoButton(`${label}来源`, lines)}</strong>
      <span>${text(label)}</span>
    </article>
  `;
}

function renderSummary(data) {
  const reliability = data.reliability || {};
  const controls = data.controls || {};
  summary.hidden = false;
  summary.innerHTML = [
    metric("可下注", data.summary.bettable, [
      "来源：本页所有未开赛比赛的逐行过滤结果。",
      "计算：decision.action === BET 的比赛数量。",
      `门槛：最小优势 ${pct(controls.minEdgePct)}，信任系数 ${pct(controls.minTrustPct)}，平局风险阈值 ${pct(controls.drawDangerPct)}。`
    ]),
    metric("观察名单", data.summary.watch || 0, [
      "来源：本页所有逐行过滤结果。",
      "计算：decision.action === WATCH 的比赛数量。",
      "含义：方向或赔率接近机会，但未达到正式入场门槛。"
    ]),
    metric("建议总仓位", money(data.summary.totalRecommendedStake), [
      "来源：每场通过过滤器后的凯利建议仓位。",
      "计算：所有 recommendedStake 相加。",
      `组合风险上限：${money(data.summary.portfolioCap)}；若超限会按比例缩放。`
    ]),
    metric("CLV 正/负", `${data.summary.positiveClv || 0}/${data.summary.negativeClv || 0}`, [
      "来源：开盘/执行赔率与收盘赔率对比。",
      "计算：CLV 为正的场次数 / CLV 为负的场次数。",
      "用途：复盘是否长期拿到比收盘更好的价格。"
    ]),
    metric("校准信任系数", `${reliability.edgeTrust ?? "N/A"}%`, [
      "来源：历史回测 + 已验证正式赛果 + 比分全中奖励 + 每日 PAUL 趋势。",
      `历史回测：${reliability.historical?.correct || 0}/${reliability.historical?.graded || 0}，约 ${pct(reliability.historical?.graded ? (reliability.historical.correct / reliability.historical.graded) * 100 : null)}。`,
      `正式赛果：${reliability.live?.correct || 0}/${reliability.live?.graded || 0} 场胜负命中；比分全中 ${reliability.live?.exactScore || 0} 场。`,
      `合并准确率：${reliability.combined?.correct || 0}/${reliability.combined?.graded || 0} = ${pct(reliability.combined?.accuracy)}。`,
      "用途：把 PAUL 与市场的差值收缩，避免模型过度自信。"
    ])
  ].join("");
}

function oddsMarkup(row) {
  const market = row.market || {};
  const oddsRecord = market.odds || {};
  const provider = market.provider || "无";
  const updatedAt = market.updatedAt ? dateTime(market.updatedAt) : "时间未知";
  return `
    <div class="odds-grid">
      <span>主胜 <b>${odds(oddsRecord.home)}${infoButton("主胜赔率来源", [`来源：${provider}`, `更新时间：${updatedAt}`, "含义：主队胜出的十进制赔率。", oddsRecord.home ? `隐含概率：1 / ${odds(oddsRecord.home)} = ${pct(oddsRecord.home ? 100 / oddsRecord.home : null)}` : "缺少主胜赔率。"])}</b></span>
      <span>平局 <b>${odds(oddsRecord.draw)}${infoButton("平局赔率来源", [`来源：${provider}`, `更新时间：${updatedAt}`, "含义：小组赛或常规时间打平的十进制赔率。", oddsRecord.draw ? `隐含概率：1 / ${odds(oddsRecord.draw)} = ${pct(oddsRecord.draw ? 100 / oddsRecord.draw : null)}` : "缺少平局赔率。"])}</b></span>
      <span>客胜 <b>${odds(oddsRecord.away)}${infoButton("客胜赔率来源", [`来源：${provider}`, `更新时间：${updatedAt}`, "含义：客队胜出的十进制赔率。", oddsRecord.away ? `隐含概率：1 / ${odds(oddsRecord.away)} = ${pct(oddsRecord.away ? 100 / oddsRecord.away : null)}` : "缺少客胜赔率。"])}</b></span>
      <small class="sub">来源：${text(provider)}${infoButton("市场赔率数据", [`provider：${provider}`, `eventId：${market.eventId || "无"}`, `bookmakerCount：${market.bookmakerCount ?? "未知"}`, `sampleBookmakers：${Array.isArray(market.sampleBookmakers) ? market.sampleBookmakers.join(", ") : "无"}`])}</small>
    </div>
  `;
}

function edgeMarkup(row) {
  const displayEdge = row.edgePct !== null && row.edgePct !== undefined
    ? Number(row.edgePct)
    : (row.dailyAdjustedEdgePct !== null && row.dailyAdjustedEdgePct !== undefined ? Number(row.dailyAdjustedEdgePct) : null);
  const cls = displayEdge === null || displayEdge >= 0 ? "edge-positive" : "edge-negative";
  const clv = row.clv || {};
  const clvText = clv.status === "positive"
    ? `CLV：+${pct(clv.clvPct)}，优于收盘`
    : clv.status === "negative"
      ? `CLV：${pct(clv.clvPct)}，差于收盘`
      : "CLV：等待收盘赔率";
  const comment = row.selectedProbability !== null && row.impliedProbability !== null
    ? displayEdge >= 0
      ? "PAUL 概率高于赔率隐含概率"
      : "PAUL 看好方向，但当前赔率不划算"
    : "缺少概率或赔率";
  const breakEven = row.selectedOdds ? `保本要求：赔率 ${odds(row.selectedOdds)} 需要 ${pct(row.impliedProbability)} 以上胜率` : "保本要求：缺少赔率";
  const pickSource = labelSource(row.pick?.source);
  return `
    <strong class="${cls}">${pct(displayEdge)}${infoButton("概率优势来源", [
      "计算：Kelly 校准概率 - 赔率隐含概率。",
      `当前：${pct(row.kellyProbability)} - ${pct(row.impliedProbability)} = ${pct(displayEdge)}。`,
      "正数代表模型概率高于市场保本概率；负数代表方向可能对，但赔率不够划算。"
    ])}</strong>
    <span class="sub">${row.pick?.source === "Market fallback" ? "参考概率" : "PAUL 原始概率"}：${pct(row.selectedProbability)}${infoButton("原始概率来源", [
      `来源：${pickSource}。`,
      row.pick?.source === "Market fallback" ? "说明：此场暂无 PAUL 判断，使用市场赔率归一化概率作为占位参考。" : "说明：来自 PAUL 正式锁定或每日判断里的三项概率。",
      `选中方向：${row.pick?.name || "-"}。`
    ])}</span>
    <span class="sub">每日调整概率：${pct(row.dailyAdjustedProbability)}${infoButton("每日调整概率来源", [
      "计算：原始概率与同场每日 PAUL 最新概率加权融合。",
      "正式锁定后每日权重较低；未锁定时每日权重较高。",
      `每日样本数：${row.dailyCalibration?.count || 0}。`
    ])}</span>
    <span class="sub">Kelly 校准概率：${pct(row.kellyProbability)}${infoButton("Kelly 校准概率来源", [
      "计算：赔率隐含概率 + (每日调整概率 - 赔率隐含概率) × 本场信任系数。",
      `代入：${pct(row.impliedProbability)} + (${pct(row.dailyAdjustedProbability)} - ${pct(row.impliedProbability)}) × ${pct(row.rowEdgeTrust)}。`,
      "用途：让 PAUL 的优势向市场收缩，避免过度下注。"
    ])}</span>
    <span class="sub">赔率隐含：${pct(row.impliedProbability)}${infoButton("赔率隐含概率来源", [
      "计算：1 / 选中方向的十进制赔率。",
      row.selectedOdds ? `代入：1 / ${odds(row.selectedOdds)} = ${pct(row.impliedProbability)}。` : "缺少选中方向赔率。",
      "含义：这笔赔率至少需要达到的保本胜率。"
    ])}</span>
    <span class="sub">${text(breakEven)}${infoButton("保本要求来源", [
      "来源：选中方向的市场赔率。",
      "计算：保本胜率 = 1 / 十进制赔率。",
      "若 PAUL 校准概率低于保本胜率，凯利公式会给 0 仓位。"
    ])}</span>
    <span class="sub">原始优势：${pct(row.rawEdgePct)}${infoButton("原始优势来源", [
      "计算：原始概率 - 赔率隐含概率。",
      `代入：${pct(row.selectedProbability)} - ${pct(row.impliedProbability)}。`
    ])}</span>
    <span class="sub">每日调整优势：${pct(row.dailyAdjustedEdgePct)}${infoButton("每日调整优势来源", [
      "计算：每日调整概率 - 赔率隐含概率。",
      `代入：${pct(row.dailyAdjustedProbability)} - ${pct(row.impliedProbability)}。`
    ])}</span>
    <span class="sub">本场信任系数：${pct(row.rowEdgeTrust)}${infoButton("本场信任系数来源", [
      "来源：全局校准信任系数 + 本场每日 PAUL 趋势调整。",
      `同向率：${pct(row.dailyCalibration?.samePickRate)}；趋势：${pct(row.dailyCalibration?.trendPct)}；调整：${pct(row.dailyCalibration?.trustAdjustment)}。`
    ])}</span>
    <span class="sub">${text(clvText)}${infoButton("CLV 来源", [
      "CLV = 当前/执行赔率相对收盘赔率的价格优势。",
      "收盘赔率出现后才可判断；正 CLV 代表拿到的价格优于收盘。"
    ])}</span>
    <span class="sub">${text(comment)}</span>
  `;
}

function riskClass(risk) {
  if (risk === "Capped" || risk === "Strong edge") return "pill warn";
  if (risk === "No bet" || risk === "Missing odds" || risk === "Edge below threshold" || risk === "Reference only") return "pill bad";
  return "pill";
}

function decisionClass(decision) {
  if (decision?.action === "BET") return "pill";
  if (decision?.action === "WATCH") return "pill warn";
  if (decision?.action === "SETTLED") return "pill";
  return "pill bad";
}

function reasonMarkup(row) {
  const pick = row.pick || {};
  const evidence = Array.isArray(pick.evidenceUsed) && pick.evidenceUsed.length ? `<span class="sub">证据：${text(pick.evidenceUsed.join(", "))}${infoButton("证据来源", pick.evidenceUsed)}</span>` : "";
  const risk = pick.upsetRisk ? `<span class="sub">风险：${text(pick.upsetRisk)}${infoButton("风险来源", ["来自 PAUL 分析返回的 upsetRisk 字段。", "用于提醒冷门、平局、红牌、轮换、伤停等不确定性。"])}</span>` : "";
  const daily = row.dailyCalibration?.count
    ? `<span class="sub">每日 PAUL：${text(row.dailyCalibration.count)} 次 · 同向率 ${pct(row.dailyCalibration.samePickRate)} · 趋势 ${pct(row.dailyCalibration.trendPct)} · 信任调整 ${pct(row.dailyCalibration.trustAdjustment)}${infoButton("每日 PAUL 来源", [
      "来源：同一场比赛每天自动保存的 PAUL 概率快照。",
      "同向率：历史快照中选择同一方向的比例。",
      "趋势：最新概率相对第一条快照的变化。",
      "信任调整：由同向率和趋势折算，对本场信任系数做小幅加减。"
    ])}</span>`
    : `<span class="sub">每日 PAUL：暂无足够历史样本。${infoButton("每日 PAUL 来源", ["此场还没有足够每日快照。", "定时任务写入更多记录后，这里会用于调整信任系数。"])}</span>`;
  const decisionReasons = row.decision?.reasons?.length
    ? `<span class="sub">过滤器：${text(row.decision.reasons.join(" "))}${infoButton("过滤器来源", [
      "来源：qualityDecision 规则。",
      "顺序检查：是否完赛/开赛、是否有 PAUL 判断、赔率是否存在、优势是否过门槛、信任系数是否过门槛、平局风险是否过高。",
      `当前结论：${row.decision?.label || row.decision?.action || "未知"}。`
    ])}</span>`
    : "";
  return `
    <div class="analysis">
      <strong>${text(labelSource(pick.source))}${infoButton("分析来源", [
        `选择来源：${labelSource(pick.source)}。`,
        pick.source === "Market fallback" ? "没有 PAUL read 时只显示市场参考，不作为下注依据。" : "来自 PAUL 的正式锁定预测或每日判断。",
        `skipReason：${row.skipReason || "无"}。`
      ])}</strong>
      <p>${text(pick.reasoning || labelRisk(row.skipReason) || "暂无分析。")}</p>
      ${daily}
      ${decisionReasons}
      ${risk}
      ${evidence}
    </div>
  `;
}

function resultMarkup(row) {
  const result = row.result || null;
  if (!result || result.status !== "final") {
    return `<span class="sub result-pending">真实赛果：等待同步${infoButton("赛果来源", ["来源：赛果同步 API / 自动任务。", "比赛未完赛或尚未抓取到结果时显示等待同步。"])}</span>`;
  }
  const cls = row.pickOutcome === "correct" ? "result-correct" : row.pickOutcome === "missed" ? "result-missed" : "result-pending";
  const scorePart = row.pickOutcome === "correct"
    ? (row.exactScoreHit ? " · 比分全中" : " · 比分未中")
    : "";
  return `<span class="sub ${cls}">真实赛果：${text(result.score || "-")} · ${text(outcomeLabels[row.pickOutcome] || "已完赛")}${scorePart}${infoButton("赛果与命中来源", [
    `赛果来源：${result.source || "未知"}；更新时间：${result.updatedAt ? dateTime(result.updatedAt) : "未知"}。`,
    `胜负判断：PAUL 选择 ${row.pick?.code || "-"}，真实赢家 ${result.winnerCode || "-"}。`,
    `比分判断：PAUL 预测 ${row.pick?.predictedScore || "-"}，真实比分 ${result.score || "-"}。`
  ])}</span>`;
}

function rowMarkup(row) {
  const pick = row.pick || {};
  const stake = Number(row.recommendedStake || 0);
  const stakeLabel = row.decision?.action === "SETTLED" ? "已完赛" : "不下注";
  const noStakeReason = row.decision?.action === "SETTLED"
    ? "赛后复盘，不再给入场仓位"
    : (row.decision?.label || labelRisk(row.skipReason) || "没有正优势");
  return `
    <tr class="quant-row quant-row--${text(row.pickOutcome || "pending")}">
      <td class="match-cell">
        <strong>#${text(row.id)} ${text(row.match)}${infoButton("比赛数据来源", [
          `matchId：${row.id}`,
          `轮次：${labelRound(row.round)}；小组：${row.group || "无"}`,
          `开赛时间：${dateTime(row.kickoffAt)}`,
          `场地：${row.venue || "未记录"}`
        ])}</strong>
        <span class="sub">${text(labelRound(row.round))}${row.group ? ` · ${text(row.group)} 组` : ""} · ${dateTime(row.kickoffAt)}</span>
        ${resultMarkup(row)}
      </td>
      <td class="pick">
        <strong>${text(pick.name || "暂无选择")}${infoButton("PAUL 选择来源", [
          `来源：${labelSource(pick.source)}。`,
          pick.source === "Market fallback" ? "此场暂无 PAUL 判断，只使用市场热门方作为参考。" : "来自 PAUL 锁定预测或每日判断。",
          `置信度：${pct(pick.confidence)}；方向：${pick.side || "-"}。`
        ])}</strong>
        <span class="sub">${text(pick.code || "-")} · ${text(labelSource(pick.source))}</span>
        ${pick.predictedScore ? `<span class="sub">预测比分：${text(pick.predictedScore)}${infoButton("预测比分来源", ["来自 PAUL 分析返回的 predictedScore 字段。", "胜负命中与比分全中会分开统计。"])}</span>` : ""}
        <span class="${decisionClass(row.decision)}">${text(decisionLabels[row.decision?.action] || row.decision?.label || labelRisk(row.risk))}${infoButton("决策来源", [
          `action：${row.decision?.action || "未知"}。`,
          `level：${row.decision?.level || "未知"}。`,
          row.decision?.reasons?.length ? `原因：${row.decision.reasons.join(" ")}` : "已通过主要过滤器。"
        ])}</span>
      </td>
      <td>${oddsMarkup(row)}</td>
      <td>${edgeMarkup(row)}</td>
      <td>
        <strong>${pct(row.fullKelly)}${infoButton("满凯利来源", [
          "公式：f* = (decimalOdds × Kelly校准概率 - 1) / (decimalOdds - 1)。",
          `代入：赔率 ${odds(row.selectedOdds)}，Kelly 概率 ${pct(row.kellyProbability)}。`,
          "负值或未通过过滤器时实际下注仓位会归零。"
        ])}</strong>
        <span class="sub">满凯利</span>
        <span class="sub">分数凯利：${pct(row.fractionalKelly)}${infoButton("分数凯利来源", [
          "计算：满凯利 × 当前选择的凯利比例。",
          "默认使用 1/4 凯利，降低波动和连续亏损风险。",
          "未达最小优势门槛时为 0。"
        ])}</span>
        <span class="sub">最终仓位：${pct(row.finalFraction)}${infoButton("最终仓位来源", [
          "计算：分数凯利先受单场上限限制，再受组合风险上限缩放。",
          "最终仓位 = recommendedStake / 总资金。",
          `建议金额：${money(row.recommendedStake)}。`
        ])}</span>
      </td>
      <td>
        <strong class="stake">${stake > 0 ? money(stake) : stakeLabel}${infoButton("建议仓位来源", [
          stake > 0 ? "来源：通过过滤器后的分数凯利仓位。" : "来源：过滤器未通过或比赛已完赛，所以不给入场仓位。",
          `总资金：来自页面输入；建议仓位：${money(row.recommendedStake)}。`,
          `当前原因：${noStakeReason}。`
        ])}</strong>
        <span class="sub">${stake > 0 ? `执行赔率 ${odds(row.selectedOdds)}` : text(noStakeReason)}</span>
      </td>
      <td>${reasonMarkup(row)}</td>
    </tr>
  `;
}

function renderRows(data) {
  table.hidden = false;
  emptyState.hidden = true;
  tbody.innerHTML = data.rows.map(rowMarkup).join("");
}

function controlsQuery() {
  const params = new URLSearchParams({
    bankroll: String(Number(bankrollInput.value || 1000)),
    kelly: String(Number(kellyInput.value || 0.25)),
    maxStakePct: String(Number(maxStakeInput.value || 3) / 100),
    portfolioCapPct: String(Number(portfolioCapInput.value || 12) / 100),
    minEdgePct: String(Number(minEdgeInput.value || 4)),
    modelAccuracy: "0.55",
    priorWeight: "40",
    strictEdgePct: "4",
    minTrustPct: "60",
    drawDangerPct: "28"
  });
  return params.toString();
}

async function loadQuantBoard() {
  const token = tokenInput.value.trim();
  if (!token) {
    statusBox.textContent = "请先输入管理员 Token。";
    return;
  }
  sessionSet("paul.quant.token", token);
  loadButton.disabled = true;
  statusBox.textContent = "正在载入私有凯利面板...";
  try {
    const response = await fetch(`/api/admin/quant?${controlsQuery()}`, {
      headers: { "X-Verify-Token": token }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "载入量化面板失败。");
    renderSummary(data);
    renderRows(data);
    const reliability = data.reliability || {};
    statusBox.textContent = `更新时间：${dateTime(data.generatedAt)}。凯利先验使用历史回测 + 正式赛果合并准确率 ${reliability.combined?.accuracy ?? reliability.modelAccuracy ?? "N/A"}%（${reliability.combined?.correct || 0}/${reliability.combined?.graded || 0}），正式赛果 ${reliability.live?.correct || 0}/${reliability.live?.graded || 0}，比分全中 ${reliability.live?.exactScore || 0} 场；实验室会过滤低优势、低信任和平局风险，并等待 CLV 复盘，不改 PAUL 预测模型。`;
  } catch (error) {
    statusBox.textContent = error.message;
    table.hidden = true;
    emptyState.hidden = false;
    emptyState.textContent = error.message;
  } finally {
    loadButton.disabled = false;
  }
}

tokenInput.value = sessionGet("paul.quant.token");
loadButton.addEventListener("click", loadQuantBoard);
