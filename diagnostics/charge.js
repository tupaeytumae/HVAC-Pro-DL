function measurement(label, evidence, unit = "K") {
  const states = {
    LOW: "bajo",
    NORMAL: "normal",
    HIGH: "alto",
    UNKNOWN: "no comprobado"
  };
  return `${label}: ${evidence.value.toFixed(1)} ${unit} (${states[evidence.state]})`;
}

function result(state, title, explanation, evidences, checks) {
  return { state, title, explanation, evidences, checks };
}

const chargeMethods = Object.freeze({
  combined: "combinado de SH y SC",
  superheat: "de SH objetivo",
  subcooling: "de SC objetivo",
  "controlled-superheat": "de SC objetivo y control electrónico de SH"
});

export function evaluateCharge(_measures, _calculations, profile, evidence) {
  const sh = evidence.SH;
  const sc = evidence.SC;

  if (evidence.AIRFLOW.state === "LOW") {
    return result(
      "AIRFLOW_FIRST",
      "No evaluar la carga hasta corregir el caudal",
      "Un caudal bajo puede alterar SH, SC, presiones y salto térmico, simulando una carga incorrecta.",
      [measurement("SH", sh), measurement("SC", sc)],
      [
        "Normalizar filtros, batería y ventilador antes de intervenir en la carga",
        "Estabilizar el equipo durante 10–15 minutos y repetir todas las medidas"
      ]
    );
  }

  if (evidence.AIRFLOW.state === "UNKNOWN") {
    return result(
      "INCONCLUSIVE",
      "Carga no concluyente: falta comprobar el caudal",
      "Sin confirmar el caudal no es fiable atribuir las desviaciones únicamente al refrigerante.",
      [measurement("SH", sh), measurement("SC", sc)],
      [
        "Comprobar filtros, batería y caudal real antes de modificar la carga",
        "Repetir SH y SC con el caudal confirmado y el sistema estabilizado"
      ]
    );
  }

  if (sh.state === "HIGH" && sc.state === "LOW") {
    return result(
      "UNDERCHARGE",
      "Patrón compatible con falta de refrigerante",
      "La combinación de SH alto y SC bajo indica un evaporador poco alimentado y poco líquido disponible a la salida del condensador.",
      [measurement("SH", sh), measurement("SC", sc)],
      [
        "Buscar indicios de fuga y realizar una prueba de estanqueidad antes de añadir refrigerante",
        "Recuperar y cargar por peso si se confirma una carga incorrecta",
        `Contrastar los valores con el método ${chargeMethods[profile.chargeMethod]} del fabricante`
      ]
    );
  }

  if (sh.state === "LOW" && sc.state === "HIGH") {
    return result(
      "OVERCHARGE",
      "Patrón compatible con exceso de refrigerante o sobrealimentación",
      "La combinación de SH bajo y SC alto indica riesgo de exceso de líquido y posible retorno al compresor.",
      [measurement("SH", sh), measurement("SC", sc)],
      [
        "No añadir refrigerante",
        "Comparar la carga recuperada con el peso especificado por el fabricante",
        "Comprobar el dispositivo de expansión y vigilar retorno de líquido"
      ]
    );
  }

  if (sh.state === "HIGH" && sc.value >= profile.tolerances.restrictionSubcooling) {
    return result(
      "RESTRICTION",
      "La carga no parece baja: revisar restricción o alimentación",
      "El SH es alto, pero el circuito conserva SC. Añadir refrigerante podría ocultar una restricción y provocar sobrecarga.",
      [measurement("SH", sh), measurement("SC", sc)],
      [
        "No añadir refrigerante hasta descartar una restricción",
        "Medir caída térmica en filtro deshidratador y línea de líquido",
        "Comprobar válvula, orificio, sensores y control de expansión"
      ]
    );
  }

  if (sh.state === "NORMAL" && sc.state === "NORMAL") {
    return result(
      "NORMAL",
      "Sin patrón conjunto de carga anormal",
      "SH y SC están dentro del rango orientativo del perfil. La carga debe confirmarse con el objetivo del fabricante.",
      [measurement("SH", sh), measurement("SC", sc)],
      [
        "Comparar SH o SC con el valor objetivo indicado por el fabricante",
        "Confirmar estabilidad de presiones y temperaturas durante 10–15 minutos"
      ]
    );
  }

  const isolated = [];
  if (sh.state !== "NORMAL") isolated.push(measurement("SH", sh));
  if (sc.state !== "NORMAL") isolated.push(measurement("SC", sc));

  return result(
    "INCONCLUSIVE",
    "Datos aislados: no permiten concluir falta ni exceso",
    "Una desviación aislada de SH o SC también puede deberse a carga térmica, caudal, medición o control de expansión.",
    isolated,
    [
      "No modificar la carga basándose en una única evidencia",
      "Confirmar caudal, ubicación de sondas y estabilidad del equipo",
      "Comparar SH y SC con los objetivos específicos del fabricante"
    ]
  );
}
