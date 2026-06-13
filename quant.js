const tokenInput = document.getElementById("tokenInput");
const bankrollInput = document.getElementById("bankrollInput");
const kellyInput = document.getElementById("kellyInput");
const strategyInput = document.getElementById("strategyInput");
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
  SIMULATE: "小仓模拟",
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
  const historical = reliability.historicalComparison || {};
  const liveComparison = reliability.liveComparison || {};
  const historicalPaul = historical.paul || {};
  const historicalMarket = historical.market || {};
  const historicalExact = historical.exactScore || {};
  const liveDirectionPaul = liveComparison.direction?.paul || {};
  const liveDirectionMarket = liveComparison.direction?.market || {};
  const liveExactPaul = liveComparison.exactScore?.paul || {};
  summary.hidden = false;
  summary.innerHTML = [
    metric("历史回测方向", `${pct(historicalPaul.accuracy)} · ${historicalPaul.correct || 0}/${historicalPaul.graded || 0}`, [
      "这是 PAUL 之前一千多场回测的胜平负/晋级方向命中率，不是比分命中率。",
      `PAUL：${historicalPaul.correct || 0}/${historicalPaul.graded || 0} = ${pct(historicalPaul.accuracy)}。`,
      `市场热门：${historicalMarket.correct || 0}/${historicalMarket.graded || 0} = ${pct(historicalMarket.accuracy)}。`,
      `样本：${reliability.historical?.source || "World Cup + Premier League holdout"}。`
    ]),
    metric("历史比分命中", historicalExact.accuracy === null || historicalExact.accuracy === undefined ? "未记录" : `${pct(historicalExact.accuracy)}`, [
      historicalExact.note || "历史回测没有保存逐场比分预测，所以不能计算历史比分全中率。",
      "市场 1X2 赔率也没有精确比分预测，不能做市场比分命中对比。",
      "比分命中从正式 PAUL 锁定预测开始统计。"
    ]),
    metric("正式比分命中", `${liveExactPaul.correct || 0}/${liveExactPaul.graded || 0}`, [
      "来源：已经锁定并完成的正式 PAUL 预测。",
      `PAUL 方向：${liveDirectionPaul.correct || 0}/${liveDirectionPaul.graded || 0} = ${pct(liveDirectionPaul.accuracy)}。`,
      `市场方向：${liveDirectionMarket.correct || 0}/${liveDirectionMarket.graded || 0} = ${pct(liveDirectionMarket.accuracy)}。`,
      `PAUL 比分全中：${liveExactPaul.correct || 0}/${liveExactPaul.graded || 0} = ${pct(liveExactPaul.accuracy)}。`,
      "比分不中但胜负方向中，会继续计入方向命中；比分层单独复盘。"
    ]),
    metric("可下注", data.summary.bettable, [
      "来源：本页所有未开赛比赛的逐行过滤结果。",
      "计算：严格价值下注 + PAUL 小仓模拟的比赛数量。",
      `严格价值下注：${data.summary.valueBets || 0} 场；小仓模拟：${data.summary.simulated || 0} 场。`,
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
    metric("模拟余额", money(data.summary.simulatedBalance ?? controls.bankroll), [
      "来源：PAUL 小仓模拟账本。",
      `已结算模拟盈亏：${money(data.summary.settledSimulationProfit || 0)}；已结算投入：${money(data.summary.settledSimulationStake || 0)}。`,
      `未开赛模拟占用：${money(data.summary.pendingSimulationStake || 0)}。`,
      "计算：按比赛时间顺序，用真实赛果结算已完赛场次；未完赛只显示赢/输两种余额情景。"
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
  const homeName = row.teams?.home?.name || "队伍A";
  const awayName = row.teams?.away?.name || "队伍B";
  const sideOrder = market.sideOrder || {};
  const orderNote = sideOrder.confidence === "matched-reversed"
    ? "赔率源顺序与赛程相反，系统已按赛程队伍 A/B 自动调换。"
    : sideOrder.confidence === "matched"
      ? "赔率源队伍顺序已和赛程队伍 A/B 校验一致。"
      : "未能从赔率源确认主客顺序，当前按赛程队伍 A/B 展示。";
  return `
    <div class="odds-grid">
      <span>${text(homeName)} 胜 <b>${odds(oddsRecord.home)}</b></span>
      <span>平局 <b>${odds(oddsRecord.draw)}</b></span>
      <span>${text(awayName)} 胜 <b>${odds(oddsRecord.away)}</b></span>
      <small class="sub">来源：${text(provider)}${infoButton("市场赔率数据", [
        `provider：${provider}`,
        `更新时间：${updatedAt}`,
        `eventId：${market.eventId || "无"}`,
        `eventName：${market.eventName || "无"}`,
        `bookmakerCount：${market.bookmakerCount ?? "未知"}`,
        `sampleBookmakers：${Array.isArray(market.sampleBookmakers) ? market.sampleBookmakers.join(", ") : "无"}`,
        "说明：这里的队伍 A/B 来自世界杯赛程排列，不代表真实主场优势。",
        `顺序校验：${orderNote}`,
        sideOrder.providerHome || sideOrder.providerAway ? `赔率源原始顺序：${sideOrder.providerHome || "未知"} vs ${sideOrder.providerAway || "未知"}` : "赔率源未返回可识别的原始队名顺序。",
        oddsRecord.home ? `${homeName} 胜隐含概率：1 / ${odds(oddsRecord.home)} = ${pct(100 / oddsRecord.home)}` : `缺少 ${homeName} 胜赔率。`,
        oddsRecord.draw ? `平局隐含概率：1 / ${odds(oddsRecord.draw)} = ${pct(100 / oddsRecord.draw)}` : "缺少平局赔率。",
        oddsRecord.away ? `${awayName} 胜隐含概率：1 / ${odds(oddsRecord.away)} = ${pct(100 / oddsRecord.away)}` : `缺少 ${awayName} 胜赔率。`
      ])}</small>
    </div>
  `;
}

function edgeMarkup(row) {
  const displayEdge = row.edgePct !== null && row.edgePct !== undefined
    ? Number(row.edgePct)
    : (row.dailyAdjustedEdgePct !== null && row.dailyAdjustedEdgePct !== undefined ? Number(row.dailyAdjustedEdgePct) : null);
  const cls = displayEdge === null ? "edge-missing" : displayEdge >= 0 ? "edge-positive" : "edge-negative";
  const edgeLabel = displayEdge === null ? "缺少赔率" : pct(displayEdge);
  const clv = row.clv || {};
  const clvText = clv.status === "positive"
    ? `CLV：+${pct(clv.clvPct)}，优于收盘`
    : clv.status === "negative"
      ? `CLV：${pct(clv.clvPct)}，差于收盘`
      : clv.status === "unavailable"
        ? "CLV：暂无收盘赔率"
        : "CLV：等待收盘赔率";
  const comment = row.selectedProbability !== null && row.impliedProbability !== null
    ? displayEdge >= 0
      ? "PAUL 概率高于赔率隐含概率"
      : "PAUL 看好方向，但当前赔率不划算"
    : "缺少概率或赔率";
  const breakEven = row.selectedOdds ? `保本要求：赔率 ${odds(row.selectedOdds)} 需要 ${pct(row.impliedProbability)} 以上胜率` : "保本要求：缺少赔率";
  const pickSource = labelSource(row.pick?.source);
  return `
    <strong class="${cls}">${edgeLabel}${infoButton("概率优势来源", [
      "计算：Kelly 校准概率 - 赔率隐含概率。",
      displayEdge === null
        ? "当前缺少选中方向赔率，所以无法计算赔率隐含概率、Kelly 校准概率和概率优势。"
        : `当前：${pct(row.kellyProbability)} - ${pct(row.impliedProbability)} = ${pct(displayEdge)}。`,
      "正数代表模型概率高于市场保本概率；负数代表方向可能对，但赔率不够划算。",
      `${row.pick?.source === "Market fallback" ? "参考概率" : "PAUL 原始概率"}：${pct(row.selectedProbability)}；来源：${pickSource}。`,
      row.pick?.source === "Market fallback" ? "此场暂无 PAUL 判断，使用市场赔率归一化概率作为占位参考。" : "来自 PAUL 正式锁定或每日判断里的三项概率。",
      `每日调整概率：${pct(row.dailyAdjustedProbability)}；每日样本数：${row.dailyCalibration?.count || 0}。`,
      `Kelly 校准：${pct(row.impliedProbability)} + (${pct(row.dailyAdjustedProbability)} - ${pct(row.impliedProbability)}) × ${pct(row.rowEdgeTrust)}。`,
      `原始优势：${pct(row.rawEdgePct)}；每日调整优势：${pct(row.dailyAdjustedEdgePct)}。`,
      `本场信任系数：${pct(row.rowEdgeTrust)}；同向率：${pct(row.dailyCalibration?.samePickRate)}；趋势：${pct(row.dailyCalibration?.trendPct)}。`
    ])}</strong>
    <span class="sub">${row.pick?.source === "Market fallback" ? "参考概率" : "PAUL 原始概率"}：${pct(row.selectedProbability)}</span>
    <span class="sub">Kelly 校准概率：${pct(row.kellyProbability)}</span>
    <span class="sub">赔率隐含：${pct(row.impliedProbability)}</span>
    <span class="sub">${text(breakEven)}</span>
    <span class="sub">本场信任系数：${pct(row.rowEdgeTrust)}</span>
    <span class="sub">${text(clvText)}</span>
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
  if (decision?.action === "SIMULATE") return "pill warn";
  if (decision?.action === "WATCH") return "pill warn";
  if (decision?.action === "SETTLED") return "pill";
  return "pill bad";
}

function reasonMarkup(row) {
  const pick = row.pick || {};
  const evidenceItems = Array.isArray(pick.evidenceUsedZh) && pick.evidenceUsedZh.length ? pick.evidenceUsedZh : pick.evidenceUsed;
  const evidence = Array.isArray(evidenceItems) && evidenceItems.length ? `<span class="sub">证据：${text(evidenceItems.join("；"))}</span>` : "";
  const riskText = pick.upsetRiskZh || pick.upsetRisk || "";
  const risk = riskText ? `<span class="sub">风险：${text(riskText)}</span>` : "";
  const review = row.postMatchReview?.summaryZh ? `<span class="sub result-${row.pickOutcome === "correct" ? "correct" : "missed"}">赛后复盘：${text(row.postMatchReview.summaryZh)}</span>` : "";
  const calibrationHints = row.postMatchReview?.calibrationHints
    ? `<span class="sub">校准提示：只调整校准层；Edge ${row.postMatchReview.calibrationHints.edgeTrustDelta ?? 0}，比分层 ${row.postMatchReview.calibrationHints.scoreModelDelta ?? 0}，市场回缩 ${row.postMatchReview.calibrationHints.marketShrinkDelta ?? 0}。</span>`
    : "";
  const daily = row.dailyCalibration?.count
    ? `<span class="sub">每日 PAUL：${text(row.dailyCalibration.count)} 次 · 同向率 ${pct(row.dailyCalibration.samePickRate)} · 趋势 ${pct(row.dailyCalibration.trendPct)} · 信任调整 ${pct(row.dailyCalibration.trustAdjustment)}</span>`
    : `<span class="sub">每日 PAUL：暂无足够历史样本。</span>`;
  const decisionReasons = row.decision?.reasons?.length
    ? `<span class="sub">过滤器：${text(row.decision.reasons.join(" "))}</span>`
    : "";
  return `
    <div class="analysis">
      <strong>${text(labelSource(pick.source))}${infoButton("分析来源", [
        `选择来源：${labelSource(pick.source)}。`,
        pick.source === "Market fallback" ? "没有 PAUL read 时只显示市场参考，不作为下注依据。" : "来自 PAUL 的正式锁定预测或每日判断。",
        `每日 PAUL：${row.dailyCalibration?.count || 0} 次；同向率 ${pct(row.dailyCalibration?.samePickRate)}；趋势 ${pct(row.dailyCalibration?.trendPct)}。`,
        riskText ? `风险：${riskText}` : "风险：无单独记录。",
        row.postMatchReview?.summaryZh ? `赛后复盘：${row.postMatchReview.summaryZh}` : "",
        row.decision?.reasons?.length ? `过滤器：${row.decision.reasons.join(" ")}` : "过滤器：已通过主要过滤器。",
        `skipReason：${row.skipReason || "无"}。`
      ])}</strong>
      <p>${text(row.analysisReasonZh || pick.reasoning || labelRisk(row.skipReason) || "暂无分析。")}</p>
      ${daily}
      ${decisionReasons}
      ${review}
      ${calibrationHints}
      ${risk}
      ${evidence}
    </div>
  `;
}

function resultMarkup(row) {
  const result = row.result || null;
  if (!result || result.status !== "final") {
    return `<span class="sub result-pending">真实赛果：等待同步</span>`;
  }
  const cls = row.pickOutcome === "correct" ? "result-correct" : row.pickOutcome === "missed" ? "result-missed" : "result-pending";
  const scorePart = row.pickOutcome === "correct"
    ? (row.exactScoreHit ? " · 比分全中" : " · 比分未中")
    : "";
  return `<span class="sub ${cls}">真实赛果：${text(result.score || "-")} · ${text(outcomeLabels[row.pickOutcome] || "已完赛")}${scorePart}</span>`;
}

function simulationMarkup(row) {
  const simulation = row.simulation || {};
  if (!simulation.eligible || !simulation.stake) {
    return `<span class="sub">模拟：缺少 PAUL 方向或赔率，暂不纳入账本。</span>`;
  }
  if (row.result?.status === "final") {
    const profitClass = Number(simulation.settledProfit || 0) >= 0 ? "result-correct" : "result-missed";
    return `
      <span class="sub ${profitClass}">模拟投入：${money(simulation.stake)} · 实际盈亏：${money(simulation.settledProfit)}</span>
      <span class="sub">赛前余额：${money(simulation.balanceBefore)} · 赛后余额：${money(simulation.balanceAfter)}</span>
      <span class="sub">${text(simulation.scoreFocus || "")}</span>
    `;
  }
  return `
    <span class="sub">模拟投入：${money(simulation.stake)} · 命中可赚：${money(simulation.profitIfWin)} · 未中亏：${money(Math.abs(simulation.lossIfLose))}</span>
    <span class="sub">若命中余额：${money(simulation.balanceIfWin)} · 若未中余额：${money(simulation.balanceIfLose)}</span>
    <span class="sub">${text(simulation.scoreFocus || "")}</span>
  `;
}

function rowMarkup(row) {
  const pick = row.pick || {};
  const stake = Number(row.recommendedStake || 0);
  const isSettled = row.decision?.action === "SETTLED";
  const stakeLabel = isSettled ? "复盘" : "不下注";
  const noStakeReason = row.decision?.action === "SETTLED"
    ? "赛后复盘，不再给入场仓位"
    : (row.decision?.label || labelRisk(row.skipReason) || "没有正优势");
  return `
    <tr class="quant-row quant-row--${text(row.pickOutcome || "pending")}">
      <td class="match-cell">
        <strong>#${text(row.id)} ${text(row.match)}</strong>
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
        ${pick.predictedScore ? `<span class="sub">预测比分：${text(pick.predictedScore)}</span>` : ""}
        <span class="${decisionClass(row.decision)}">${text(decisionLabels[row.decision?.action] || row.decision?.label || labelRisk(row.risk))}</span>
      </td>
      <td>${oddsMarkup(row)}</td>
      <td>${edgeMarkup(row)}</td>
      <td>
        <strong>${pct(row.fullKelly)}${infoButton("满凯利来源", [
          "公式：f* = (decimalOdds × Kelly校准概率 - 1) / (decimalOdds - 1)。",
          `代入：赔率 ${odds(row.selectedOdds)}，Kelly 概率 ${pct(row.kellyProbability)}。`,
          `分数凯利：${pct(row.fractionalKelly)}；最终仓位：${pct(row.finalFraction)}。`,
          "负值或未通过过滤器时实际下注仓位会归零。"
        ])}</strong>
        <span class="sub">满凯利</span>
        <span class="sub">分数凯利：${pct(row.fractionalKelly)}</span>
        <span class="sub">最终仓位：${pct(row.finalFraction)}</span>
      </td>
      <td>
        <strong class="stake">${stake > 0 ? money(stake) : stakeLabel}${infoButton(isSettled ? "复盘仓位来源" : "建议仓位来源", [
          stake > 0 ? "来源：通过过滤器后的分数凯利仓位。" : "来源：过滤器未通过或比赛已完赛，所以不给入场仓位。",
          `总资金：来自页面输入；建议仓位：${money(row.recommendedStake)}。`,
          `当前原因：${noStakeReason}。`
        ])}</strong>
        <span class="sub">${stake > 0 ? `执行赔率 ${odds(row.selectedOdds)}` : text(noStakeReason)}</span>
        ${simulationMarkup(row)}
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
    strategy: strategyInput?.value || "paul-follow",
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
    statusBox.textContent = `更新时间：${dateTime(data.generatedAt)}。历史回测 ${reliability.historicalComparison?.paul?.correct || 0}/${reliability.historicalComparison?.paul?.graded || 0} 是胜平负/晋级方向命中，不是比分命中；正式赛果方向 ${reliability.live?.correct || 0}/${reliability.live?.graded || 0}，比分全中 ${reliability.live?.exactScore || 0}/${reliability.live?.exactScoreGraded || 0}。实验室只调整校准和仓位，不改 PAUL 预测模型。`;
  } catch (error) {
    statusBox.textContent = error.message;
    table.hidden = true;
    emptyState.hidden = false;
    emptyState.textContent = error.message;
  } finally {
    loadButton.disabled = false;
  }
}

function closeCalcInfos(except = null) {
  document.querySelectorAll(".calc-info[open]").forEach((details) => {
    if (details !== except) details.open = false;
  });
}

function positionCalcInfo(details) {
  const summary = details.querySelector("summary");
  const body = details.querySelector(".calc-info__body");
  if (!summary || !body) return;
  const rect = summary.getBoundingClientRect();
  const margin = 12;
  const width = Math.min(360, window.innerWidth - margin * 2);
  let left = rect.left;
  if (left + width > window.innerWidth - margin) {
    left = window.innerWidth - margin - width;
  }
  left = Math.max(margin, left);
  let top = rect.bottom + 8;
  details.style.setProperty("--calc-info-left", `${Math.round(left)}px`);
  details.style.setProperty("--calc-info-top", `${Math.round(top)}px`);
  requestAnimationFrame(() => {
    const height = Math.min(body.offsetHeight || 0, window.innerHeight - margin * 2);
    if (top + height > window.innerHeight - margin) {
      top = Math.max(margin, rect.top - height - 8);
      details.style.setProperty("--calc-info-top", `${Math.round(top)}px`);
    }
  });
}

document.addEventListener("click", (event) => {
  const summary = event.target.closest?.(".calc-info summary");
  if (!summary) {
    if (!event.target.closest?.(".calc-info")) closeCalcInfos();
    return;
  }
  const details = summary.parentElement;
  requestAnimationFrame(() => {
    if (details.open) {
      closeCalcInfos(details);
      positionCalcInfo(details);
    }
  });
});

window.addEventListener("scroll", () => closeCalcInfos(), true);
window.addEventListener("resize", () => closeCalcInfos());

tokenInput.value = sessionGet("paul.quant.token");
loadButton.addEventListener("click", loadQuantBoard);
