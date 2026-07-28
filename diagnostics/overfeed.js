export function evaluateOverfeed(_measures, calculations, profile, evidence) {
  const matched =
    evidence.SH.state === "LOW" &&
    evidence.SC.state === "HIGH";

  return {
    id: "OVERFEED",
    name: "Posible sobrealimentación o exceso de refrigerante",
    score: matched ? 400 * profile.weights.overfeed : 0,
    explanation: "El recalentamiento bajo junto con subenfriamiento alto aumenta el riesgo de retorno de líquido.",
    evidences: matched
      ? ["Recalentamiento bajo", "Subenfriamiento alto"]
      : [],
    steps: [
      `Confirmar SH ${calculations.sh.toFixed(1)} K y SC ${calculations.sc.toFixed(1)} K antes de intervenir`,
      "Confirmar caudal de aire",
      "Comprobar carga por peso",
      "Revisar control de expansión",
      "Vigilar retorno de líquido al compresor"
    ],
    level: "bad",
    matched
  };
}
