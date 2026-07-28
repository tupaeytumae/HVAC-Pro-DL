export function evaluateRestriction(measures, calculations, profile) {
  const matched =
    calculations.sh > profile.tolerances.highSuperheat &&
    calculations.sc >= profile.tolerances.restrictionSubcooling;

  return {
    id: "RESTRICTION",
    name: "Posible restricción o expansión insuficiente",
    score: matched ? 500 * profile.weights.restriction : 0,
    explanation: "Hay recalentamiento alto, pero el líquido conserva subenfriamiento.",
    evidences: matched
      ? ["Recalentamiento alto", "El líquido conserva subenfriamiento"]
      : [],
    steps: [
      "Medir caída térmica en filtro deshidratador",
      "Comprobar TXV o EXV",
      "Revisar estrangulamientos",
      "Descartar humedad o hielo"
    ],
    level: "warn",
    matched
  };
}
