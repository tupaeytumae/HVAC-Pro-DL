import {
  chargeLabels,
  chargeMethodLabels,
  evidenceLabels,
  evidenceToleranceKeys,
  profileLabels,
  stateLabels
} from "./labels.js";

const element = id => document.getElementById(id);

function output(id,value,unit="",digits=1){
  element(id).textContent = Number.isFinite(value)
    ? `${value.toFixed(digits)} ${unit}`.trim()
    : "—";
}

function evidenceValue(key,item){
  if(key === "AIRFLOW"){
    return item.value === "normal"
      ? "Normal"
      : item.value === "low"
        ? "Bajo"
        : "No comprobado";
  }

  const digits = key === "CR" ? 2 : 1;
  const unit = evidenceLabels[key][1];
  return `${item.value.toFixed(digits)}${unit ? ` ${unit}` : ""}`;
}

function evidenceRange(key,profile){
  const toleranceKeys = evidenceToleranceKeys[key];
  if(!toleranceKeys){
    return "";
  }

  const [lowKey,highKey] = toleranceKeys;
  const low = profile.tolerances[lowKey];
  const high = profile.tolerances[highKey];
  const digits = key === "CR" ? 1 : 0;
  const unit = evidenceLabels[key][1];
  const profileName = profileLabels[profile.id] || profile.id;
  return `Orientativo ${profileName}: ${low.toFixed(digits)}–${high.toFixed(digits)}${unit ? ` ${unit}` : ""}`;
}

function renderEvidence(evidence,profile){
  element("profile").textContent =
    `Perfil aplicado: ${profileLabels[profile.id] || profile.id}`;
  element("chargeMethod").textContent = chargeMethodLabels[profile.chargeMethod];
  element("evidence").innerHTML = Object.entries(evidence).map(([key,item]) => {
    const range = evidenceRange(key,profile);
    return `
      <div class="evidence">
        <small>${evidenceLabels[key][0]}</small>
        <span class="evidence-value">${evidenceValue(key,item)}</span>
        <span class="badge state-${item.state.toLowerCase()}">${stateLabels[item.state]}</span>
        ${range ? `<small class="evidence-range">${range}</small>` : ""}
      </div>
    `;
  }).join("");
}

function renderDiagnostics(results){
  const renderItems = items => items.map(item => `
    <div class="diagnostic-item ${
      item.matched
        ? `diagnostic-match diagnostic-level-${item.level}`
        : "diagnostic-discarded"
    }">
      <div class="row">
        <strong>${item.name}</strong>
        <span class="badge ${item.matched ? item.level : "warn"}">
          ${item.matched ? "COINCIDE" : "DESCARTADO"}
        </span>
      </div>
      <p class="note">${
        item.matched
          ? item.explanation
          : "No coincide con la combinación actual de evidencias."
      }</p>
      ${item.evidences.length
        ? `<ul class="note">${item.evidences.map(value => `<li>${value}</li>`).join("")}</ul>`
        : ""}
    </div>
  `).join("");

  const matched = results.filter(item => item.matched);
  const discarded = results.filter(item => !item.matched);
  element("diagnostics").innerHTML = `
    ${matched.length
      ? `<section class="diagnostic-group">
          <div class="diagnostic-group-title">Coincide con las evidencias</div>
          <div class="diagnostic-matches">${renderItems(matched)}</div>
        </section>`
      : `<div class="diagnostic-empty">
          Ningún patrón específico coincide con todas las evidencias.
        </div>`}
    <section class="diagnostic-group">
      <div class="diagnostic-group-title">Otros patrones descartados</div>
      <div class="diagnostic-discarded-grid">${renderItems(discarded)}</div>
    </section>
  `;
}

function renderCharge(charge){
  const [label,level] = chargeLabels[charge.state];
  element("chargeStatus").textContent = label;
  element("chargeStatus").className = `badge ${level}`;
  element("chargeTitle").textContent = charge.title;
  element("chargeExplanation").textContent = charge.explanation;
  element("chargeEvidence").innerHTML =
    charge.evidences.map(value => `<li>${value}</li>`).join("");
}

export function renderResult(result){
  const { tev, tc, sh, sc, deltaT, cr } = result.calculations;
  const { name, explanation, level } = result.diagnosis;

  output("tev",tev,"°C");
  output("tc",tc,"°C");
  output("sh",sh,"K");
  output("sc",sc,"K");
  output("dt",deltaT,"K");
  output("cr",cr,"",2);

  element("diag").textContent = name;
  element("why").textContent = explanation;
  renderCharge(result.charge);
  renderEvidence(result.evidence,result.profile);
  renderDiagnostics(result.results);
  element("steps").innerHTML =
    result.checks.map(step => `<li>${step}</li>`).join("");
  element("status").textContent =
    level === "ok" ? "ESTABLE" : level === "warn" ? "REVISAR" : "PRIORIDAD";
  element("status").className = `badge ${level}`;
  element("result").style.display = "block";
  element("result").scrollIntoView({behavior:"smooth"});
}

export function buildSummary(result,measurements,database){
  const { tev, tc, sh, sc, deltaT, cr } = result.calculations;
  return `HVAC ${measurements.ref} · CoolProp ${database.meta.version}\n` +
    `Baja ${measurements.lp} bar(g) · Alta ${measurements.hp} bar(g)\n` +
    `Evap. dew ${tev.toFixed(1)} °C · Cond. bubble ${tc.toFixed(1)} °C\n` +
    `SH ${sh.toFixed(1)} K · SC ${sc.toFixed(1)} K · ΔT ${deltaT.toFixed(1)} K\n` +
    `Relación de compresión ${cr.toFixed(2)}\n` +
    `Lectura de carga: ${result.charge.title}\n` +
    `Diagnóstico orientativo: ${result.diagnosis.name}`;
}
