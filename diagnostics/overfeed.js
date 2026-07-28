export function evaluateOverfeed(measures, calculations, profile) {
  const matched =
    calculations.sh < profile.tolerances.lowSuperheat &&
    calculations.sc > profile.tolerances.highSubcooling;

  return {
    id: "OVERFEED",
    name: "Posible sobrealimentación o exceso de refrigerante",
    score: matched ? 400 * profile.weights.overfeed : 0,
    explanation: "El recalentamiento bajo junto con subenfriamiento alto aumenta el riesgo de retorno de líquido.",
    evidences: matched
      ? ["Recalentamiento bajo", "Subenfriamiento alto"]
      : [],
    steps: [
      "Confirmar caudal de aire",
      "Comprobar carga por peso",
      "Revisar control de expansión",
      "Vigilar retorno de líquido al compresor"
    ],
    level: "bad",
    matched
  };
}
