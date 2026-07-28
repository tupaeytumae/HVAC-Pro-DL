import { temperatureAtPressure } from "../engine/calculations.js";

const element = id => document.getElementById(id);

function readNumber(id){
  const raw = element(id).value.trim().replace(",", ".");
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) ? value : null;
}

export function initializeDatabase(database){
  const valid = database && database.meta && database.fluids &&
    Object.keys(database.fluids).length > 0;

  if(!valid){
    element("source").textContent = "Tablas P‑T pendientes de generación";
    element("setup").style.display = "block";
    return false;
  }

  element("ref").innerHTML = "";
  Object.keys(database.fluids).forEach(name => {
    const option = document.createElement("option");
    option.value = option.textContent = name;
    element("ref").appendChild(option);
  });

  element("ref").disabled = false;
  element("diagnose").disabled = false;
  element("ref").value = database.fluids.R407C
    ? "R407C"
    : Object.keys(database.fluids)[0];
  element("source").textContent =
    `P‑T: ${database.meta.engine} ${database.meta.version} · datos locales offline`;
  element("technicalNote").textContent =
    `Presiones en bar(g). Las tablas se generaron desde presión absoluta usando ` +
    `${database.meta.atmospheric_pressure_bar} bar de referencia. Dew = Q1; bubble = Q0. ` +
    `Resolución térmica: ${database.meta.temperature_step_c} °C. Diagnóstico orientativo.`;

  return true;
}

export function readForm(){
  return {
    ref: element("ref").value,
    profileName: element("expansion").value,
    air: element("air").value,
    lp: readNumber("lp"),
    hp: readNumber("hp"),
    ts: readNumber("ts"),
    tl: readNumber("tl"),
    tr: readNumber("tr"),
    ti: readNumber("ti"),
    to: readNumber("to")
  };
}

export function validateForm(values, atmosphericPressure){
  const measurements = [
    values.lp,
    values.hp,
    values.ts,
    values.tl,
    values.tr,
    values.ti,
    values.to
  ];

  if(measurements.some(value => value === null)){
    return "Completa todos los campos.";
  }
  if(values.lp <= -atmosphericPressure){
    return "La presión de baja está por debajo del límite físico admitido.";
  }
  if(values.hp <= values.lp){
    return "La alta debe ser mayor que la baja.";
  }
  return null;
}

export function updatePressureTemperatures(database){
  if(!database || !database.fluids || !database.fluids[element("ref").value]){
    return;
  }

  const table = database.fluids[element("ref").value];
  const lowPressure = readNumber("lp");
  const highPressure = readNumber("hp");
  const lowDew = lowPressure === null
    ? null
    : temperatureAtPressure(table.dew,lowPressure);
  const lowBubble = lowPressure === null
    ? null
    : temperatureAtPressure(table.bubble,lowPressure);
  const highBubble = highPressure === null
    ? null
    : temperatureAtPressure(table.bubble,highPressure);
  const highDew = highPressure === null
    ? null
    : temperatureAtPressure(table.dew,highPressure);

  element("lpSat").textContent = lowPressure === null
    ? "Dew: — · Bubble: — · SH usa Dew"
    : Number.isFinite(lowDew) && Number.isFinite(lowBubble)
      ? `Dew: ${lowDew.toFixed(1)} °C · Bubble: ${lowBubble.toFixed(1)} °C · SH usa Dew`
      : "Dew/Bubble: fuera de tabla";
  element("hpSat").textContent = highPressure === null
    ? "Bubble: — · Dew: — · SC usa Bubble"
    : Number.isFinite(highBubble) && Number.isFinite(highDew)
      ? `Bubble: ${highBubble.toFixed(1)} °C · Dew: ${highDew.toFixed(1)} °C · SC usa Bubble`
      : "Bubble/Dew: fuera de tabla";
}
