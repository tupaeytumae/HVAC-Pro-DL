export function evaluateBalanced(_measures, _calculations, _profile, evidence) {
  const matched = Object.values(evidence)
    .every(item => item.state === "NORMAL");

  return {
    id: "BALANCED",
    name: matched
      ? "Patrón razonablemente equilibrado"
      : "Sin patrón concluyente",
    score: 100,
    explanation: matched
      ? "No aparece un patrón fuerte de falta de carga, restricción o sobrealimentación."
      : "Existen evidencias que requieren revisión, pero no forman un patrón suficiente para atribuir una avería concreta.",
    evidences: [],
    steps: [
      "Comparar intensidad con placa",
      "Comprobar limpieza de baterías",
      "Registrar temperatura de descarga",
      "Confirmar estabilidad durante 10–15 minutos"
    ],
    level: matched ? "ok" : "warn",
    matched
  };
}
