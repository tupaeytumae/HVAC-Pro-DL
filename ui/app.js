import { diagnose } from "../engine/diagnosis.js";
import {
  initializeDatabase,
  readForm,
  updatePressureTemperatures,
  validateForm
} from "./form.js";
import { buildSummary, renderResult } from "./render.js";

const element = id => document.getElementById(id);
const database = window.PT_DATABASE || null;
let summary = "";

function run(){
  if(!database || !database.fluids){
    return;
  }

  const form = readForm();
  const error = validateForm(form,database.meta.atmospheric_pressure_bar);
  if(error){
    alert(error);
    return;
  }

  const result = diagnose({
    ref: form.ref,
    air: form.air,
    lp: form.lp,
    hp: form.hp,
    ts: form.ts,
    tl: form.tl,
    tr: form.tr,
    ti: form.ti,
    to: form.to
  },database,form.profileName);

  if(result === null){
    alert(`Presión fuera del rango de tabla disponible para ${form.ref}.`);
    return;
  }

  renderResult(result);
  summary = buildSummary(result,form,database);
}

element("diagnose").addEventListener("click",run);
element("lp").addEventListener("input",() => updatePressureTemperatures(database));
element("hp").addEventListener("input",() => updatePressureTemperatures(database));
element("ref").addEventListener("change",() => updatePressureTemperatures(database));
element("copy").addEventListener("click",async () => {
  try{
    await navigator.clipboard.writeText(summary);
    alert("Resumen copiado.");
  }catch(error){
    alert(summary || "No hay resumen.");
  }
});

if(initializeDatabase(database)){
  updatePressureTemperatures(database);
}

if("serviceWorker" in navigator){
  window.addEventListener("load",() => navigator.serviceWorker.register("./sw.js"));
}
