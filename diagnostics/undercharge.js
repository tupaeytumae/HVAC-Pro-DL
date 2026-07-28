export function evaluateUndercharge(_measures, calculations, profile, evidence) {
  const matched =
    evidence.SH.state === "HIGH" &&
    evidence.SC.state === "LOW";

  return {
    id: "UNDERCHARGE",
    name: "Patrón compatible con carga insuficiente o fuga",
    score: matched ? 600 * profile.weights.undercharge : 0,
    explanation: "El recalentamiento alto y el subenfriamiento bajo indican alimentación reducida del evaporador.",
    evidences: matched
      ? ["Recalentamiento alto", "Subenfriamiento bajo"]
      : [],
    steps: [
      `Confirmar SH ${calculations.sh.toFixed(1)} K y SC ${calculations.sc.toFixed(1)} K con sondas bien fijadas`,
      "Confirmar caudal de aire",
      "Buscar aceite y comprobar fugas",
      "Realizar prueba de estanqueidad",
      "Vaciar, hacer vacío y cargar por peso"
    ],
    level: "bad",
    matched
  };
}
