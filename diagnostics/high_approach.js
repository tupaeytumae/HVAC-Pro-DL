export function evaluateHighApproach(measures, calculations, profile) {
  const matched = calculations.approach > profile.tolerances.highApproach;

  return {
    id: "HIGH_APPROACH",
    name: "Condensación elevada respecto al ambiente",
    score: matched ? 200 * profile.weights.approach : 0,
    explanation: "La diferencia entre condensación y temperatura exterior es alta.",
    evidences: matched
      ? ["Diferencia alta entre condensación y temperatura exterior"]
      : [],
    steps: [
      "Limpiar batería exterior",
      "Comprobar ventiladores y recirculación",
      "Verificar sobrecarga o gases no condensables",
      "Medir descarga e intensidad"
    ],
    level: "warn",
    matched
  };
}
