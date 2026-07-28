export function evaluateLowDeltaT(_measures, calculations, profile, evidence) {
  const matched = evidence.DELTA_T.state === "LOW";

  return {
    id: "LOW_DELTA_T",
    name: "Rendimiento térmico insuficiente",
    score: matched ? 300 * profile.weights.deltaT : 0,
    explanation: "El salto térmico del aire es bajo para una condición estable de funcionamiento.",
    evidences: matched ? ["Salto térmico bajo"] : [],
    steps: [
      `Confirmar el ΔT medido de ${calculations.deltaT.toFixed(1)} K con sondas en retorno e impulsión`,
      "Revisar filtros, turbina y baterías",
      "Confirmar caudal y temperaturas con instrumento fiable",
      "Medir intensidad y tensión",
      "Repetir medidas tras 10–15 minutos"
    ],
    level: "warn",
    matched
  };
}
