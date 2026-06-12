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

function metric(label, value) {
  return `
    <article class="metric">
      <strong>${text(value)}</strong>
      <span>${text(label)}</span>
    </article>
  `;
}

function renderSummary(data) {
  summary.hidden = false;
  summary.innerHTML = [
    metric("可执行优势", data.summary.bettable),
    metric("建议总仓位", money(data.summary.totalRecommendedStake)),
    metric("组合风险上限", money(data.summary.portfolioCap)),
    metric("最大单场仓位", money(data.summary.maxSingleStake)),
    metric("平均优势", `${data.summary.averageEdgePct}%`)
  ].join("");
}

function oddsMarkup(row) {
  const market = row.market || {};
  const oddsRecord = market.odds || {};
  return `
    <div class="odds-grid">
      <span>主胜 <b>${odds(oddsRecord.home)}</b></span>
      <span>平局 <b>${odds(oddsRecord.draw)}</b></span>
      <span>客胜 <b>${odds(oddsRecord.away)}</b></span>
      <small class="sub">来源：${text(market.provider || "无")}</small>
    </div>
  `;
}

function edgeMarkup(row) {
  const edge = Number(row.edgePct || 0);
  const cls = edge >= 0 ? "edge-positive" : "edge-negative";
  const comment = row.selectedProbability !== null && row.impliedProbability !== null
    ? edge >= 0
      ? "PAUL 概率高于赔率隐含概率"
      : "PAUL 看好，但当前赔率不划算"
    : "缺少概率或赔率";
  return `
    <strong class="${cls}">${pct(row.edgePct)}</strong>
    <span class="sub">PAUL 概率：${pct(row.selectedProbability)}</span>
    <span class="sub">赔率隐含：${pct(row.impliedProbability)}</span>
    <span class="sub">${text(comment)}</span>
  `;
}

function riskClass(risk) {
  if (risk === "Capped" || risk === "Strong edge") return "pill warn";
  if (risk === "No bet" || risk === "Missing odds" || risk === "Edge below threshold" || risk === "Reference only") return "pill bad";
  return "pill";
}

function reasonMarkup(row) {
  const pick = row.pick || {};
  const evidence = Array.isArray(pick.evidenceUsed) && pick.evidenceUsed.length ? `<span class="sub">证据：${text(pick.evidenceUsed.join(", "))}</span>` : "";
  const risk = pick.upsetRisk ? `<span class="sub">风险：${text(pick.upsetRisk)}</span>` : "";
  return `
    <div class="analysis">
      <strong>${text(labelSource(pick.source))}</strong>
      <p>${text(pick.reasoning || labelRisk(row.skipReason) || "暂无分析。")}</p>
      ${risk}
      ${evidence}
    </div>
  `;
}

function rowMarkup(row) {
  const pick = row.pick || {};
  const stake = Number(row.recommendedStake || 0);
  return `
    <tr>
      <td class="match-cell">
        <strong>#${text(row.id)} ${text(row.match)}</strong>
        <span class="sub">${text(labelRound(row.round))}${row.group ? ` · ${text(row.group)} 组` : ""} · ${dateTime(row.kickoffAt)}</span>
      </td>
      <td class="pick">
        <strong>${text(pick.name || "暂无选择")}</strong>
        <span class="sub">${text(pick.code || "-")} · ${text(labelSource(pick.source))}</span>
        <span class="${riskClass(row.risk)}">${text(labelRisk(row.risk))}</span>
      </td>
      <td>${oddsMarkup(row)}</td>
      <td>${edgeMarkup(row)}</td>
      <td>
        <strong>${pct(row.fullKelly)}</strong>
        <span class="sub">满凯利</span>
        <span class="sub">分数凯利：${pct(row.fractionalKelly)}</span>
        <span class="sub">最终仓位：${pct(row.finalFraction)}</span>
      </td>
      <td>
        <strong class="stake">${stake > 0 ? money(stake) : "不下注"}</strong>
        <span class="sub">${stake > 0 ? `执行赔率 ${odds(row.selectedOdds)}` : text(labelRisk(row.skipReason) || "没有正优势")}</span>
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
    minEdgePct: String(Number(minEdgeInput.value || 2))
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
    statusBox.textContent = `更新时间：${dateTime(data.generatedAt)}。本面板以 PAUL 预测概率为核心，赔率只用于计算隐含概率和凯利仓位。`;
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
