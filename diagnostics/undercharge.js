function compatibility(evidence, profile) {
  const evidences = [];
  let score = 0;
  const { tolerances, weights } = profile;

  if (evidence.SH.value >= tolerances.veryHighSuperheat) {
    score += 35 * weights.sh;
    evidences.push("Recalentamiento muy alto");
  } else if (evidence.SH.value >= tolerances.highSuperheat) {
    score += 25 * weights.sh;
    evidences.push("Recalentamiento alto");
  }

  if (evidence.SC.value <= tolerances.veryLowSubcooling) {
    score += 35 * weights.sc;
    evidences.push("Subenfriamiento prácticamente nulo");
  } else if (evidence.SC.value <= tolerances.lowSubcooling) {
    score += 25 * weights.sc;
    evidences.push("Subenfriamiento bajo");
  }

  return {
    name: "Fuga o carga insuficiente",
    score: Math.max(0, Math.min(100, score)),
    evidences
  };
}

export function evaluateUndercharge(_measures, _calculations, profile, evidence) {
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
      "Confirmar caudal de aire",
      "Buscar aceite y comprobar fugas",
      "Realizar prueba de estanqueidad",
      "Vaciar, hacer vacío y cargar por peso"
    ],
    level: "bad",
    matched,
    compatibility: compatibility(evidence, profile)
  };
}
