export function evaluateBalanced(_measures, _calculations, _profile, evidence) {
  const matched = Object.values(evidence)
    .every(item => item.state === "NORMAL");

  return {
    id: "BALANCED",
    name: "Patrón razonablemente equilibrado",
    score: 100,
    explanation: "No aparece un patrón fuerte de falta de carga, restricción o sobrealimentación.",
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
