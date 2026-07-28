export function evaluateBalanced(measures, calculations, profile) {
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
    level: "ok",
    matched: true
  };
}
