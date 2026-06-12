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
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: amount >= 100 ? 0 : 2
  }).format(amount);
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
  if (!value) return "Time TBA";
  return new Intl.DateTimeFormat("en-US", {
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
    metric("Bettable edges", data.summary.bettable),
    metric("Total stake", money(data.summary.totalRecommendedStake)),
    metric("Portfolio cap", money(data.summary.portfolioCap)),
    metric("Max single stake", money(data.summary.maxSingleStake)),
    metric("Average edge", `${data.summary.averageEdgePct}%`)
  ].join("");
}

function oddsMarkup(row) {
  const market = row.market || {};
  const oddsRecord = market.odds || {};
  return `
    <div class="odds-grid">
      <span>Home <b>${odds(oddsRecord.home)}</b></span>
      <span>Draw <b>${odds(oddsRecord.draw)}</b></span>
      <span>Away <b>${odds(oddsRecord.away)}</b></span>
      <small class="sub">${text(market.provider || "No provider")}</small>
    </div>
  `;
}

function edgeMarkup(row) {
  const cls = Number(row.edgePct || 0) >= 0 ? "edge-positive" : "edge-negative";
  return `
    <strong class="${cls}">${pct(row.edgePct)}</strong>
    <span class="sub">PAUL p: ${pct(row.selectedProbability)}</span>
    <span class="sub">Odds implied: ${pct(row.impliedProbability)}</span>
  `;
}

function riskClass(risk) {
  if (risk === "Capped" || risk === "Strong edge") return "pill warn";
  if (risk === "No bet" || risk === "Missing odds" || risk === "Edge below threshold" || risk === "Reference only") return "pill bad";
  return "pill";
}

function reasonMarkup(row) {
  const pick = row.pick || {};
  const evidence = Array.isArray(pick.evidenceUsed) && pick.evidenceUsed.length ? `<span class="sub">Evidence: ${text(pick.evidenceUsed.join(", "))}</span>` : "";
  const risk = pick.upsetRisk ? `<span class="sub">Risk: ${text(pick.upsetRisk)}</span>` : "";
  return `
    <div class="analysis">
      <strong>${text(pick.source || "No PAUL read")}</strong>
      <p>${text(pick.reasoning || row.skipReason || "No analysis is available yet.")}</p>
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
        <span class="sub">${text(row.round)}${row.group ? ` · Group ${text(row.group)}` : ""} · ${dateTime(row.kickoffAt)}</span>
      </td>
      <td class="pick">
        <strong>${text(pick.name || "No pick")}</strong>
        <span class="sub">${text(pick.code || "-")} · ${text(pick.source || "Pending")}</span>
        <span class="${riskClass(row.risk)}">${text(row.risk)}</span>
      </td>
      <td>${oddsMarkup(row)}</td>
      <td>${edgeMarkup(row)}</td>
      <td>
        <strong>${pct(row.fullKelly)}</strong>
        <span class="sub">Full Kelly</span>
        <span class="sub">Fractional: ${pct(row.fractionalKelly)}</span>
        <span class="sub">Final: ${pct(row.finalFraction)}</span>
      </td>
      <td>
        <strong class="stake">${stake > 0 ? money(stake) : "No bet"}</strong>
        <span class="sub">${stake > 0 ? `At odds ${odds(row.selectedOdds)}` : text(row.skipReason || "No positive edge")}</span>
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
    statusBox.textContent = "Enter the owner token first.";
    return;
  }
  sessionSet("paul.quant.token", token);
  loadButton.disabled = true;
  statusBox.textContent = "Loading private Kelly board...";
  try {
    const response = await fetch(`/api/admin/quant?${controlsQuery()}`, {
      headers: { "X-Verify-Token": token }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to load quant board.");
    renderSummary(data);
    renderRows(data);
    statusBox.textContent = `Updated ${dateTime(data.generatedAt)}. ${data.note}`;
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
