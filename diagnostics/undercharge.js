function compatibility(calculations, profile) {
  const evidences = [];
  let score = 0;
  const { tolerances, weights } = profile;

  if (calculations.sh >= tolerances.veryHighSuperheat) {
    score += 35 * weights.sh;
    evidences.push("Recalentamiento muy alto");
  } else if (calculations.sh >= tolerances.highSuperheat) {
    score += 25 * weights.sh;
    evidences.push("Recalentamiento alto");
  }

  if (calculations.sc <= tolerances.veryLowSubcooling) {
    score += 35 * weights.sc;
    evidences.push("Subenfriamiento prácticamente nulo");
  } else if (calculations.sc <= tolerances.lowSubcooling) {
    score += 25 * weights.sc;
    evidences.push("Subenfriamiento bajo");
  }

  return {
    name: "Fuga o carga insuficiente",
    score: Math.max(0, Math.min(100, score)),
    evidences
  };
}

export function evaluateUndercharge(measures, calculations, profile) {
  const matched =
    calculations.sh > profile.tolerances.highSuperheat &&
    calculations.sc < profile.tolerances.lowSubcooling;

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
    compatibility: compatibility(calculations, profile)
  };
}
