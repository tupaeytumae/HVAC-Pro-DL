export function evaluateRestriction(_measures, calculations, profile, evidence) {
  const matched =
    evidence.SH.state === "HIGH" &&
    evidence.SC.value >= profile.tolerances.restrictionSubcooling;

  return {
    id: "RESTRICTION",
    name: "Posible restricción o expansión insuficiente",
    score: matched ? 500 * profile.weights.restriction : 0,
    explanation: "Hay recalentamiento alto, pero el líquido conserva subenfriamiento.",
    evidences: matched
      ? ["Recalentamiento alto", "El líquido conserva subenfriamiento"]
      : [],
    steps: [
      `Confirmar SH ${calculations.sh.toFixed(1)} K con SC conservado en ${calculations.sc.toFixed(1)} K`,
      "Medir caída térmica en filtro deshidratador",
      "Comprobar TXV o EXV",
      "Revisar estrangulamientos",
      "Descartar humedad o hielo"
    ],
    level: "warn",
    matched
  };
}
