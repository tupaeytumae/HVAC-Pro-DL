export function evaluateAirflow(measures, calculations, profile) {
  const matched = measures.air === "low";

  return {
    id: "AIRFLOW",
    name: "Primero debe corregirse el caudal de aire",
    score: matched ? 700 * profile.weights.airflow : 0,
    explanation: "Un caudal bajo altera presiones, recalentamiento y salto térmico, por lo que puede simular averías del circuito frigorífico.",
    evidences: matched ? ["Caudal de aire indicado como bajo"] : [],
    steps: [
      "Revisar filtros, turbina, correas y batería",
      "Confirmar velocidad y sentido del ventilador",
      "Repetir todas las medidas con el caudal normalizado"
    ],
    level: "warn",
    matched
  };
}
