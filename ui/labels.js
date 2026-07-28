export const evidenceLabels = {
  SH: ["Recalentamiento", "K"],
  SC: ["Subenfriamiento", "K"],
  DELTA_T: ["Salto térmico", "K"],
  APPROACH: ["Aproximación", "K"],
  CR: ["Relación de compresión", ""],
  AIRFLOW: ["Caudal de aire", ""]
};

export const evidenceToleranceKeys = {
  SH: ["lowSuperheat", "highSuperheat"],
  SC: ["lowSubcooling", "highSubcooling"],
  DELTA_T: ["lowDeltaT", "highDeltaT"],
  APPROACH: ["lowApproach", "highApproach"],
  CR: ["lowCompressionRatio", "highCompressionRatio"]
};

export const stateLabels = {
  LOW: "BAJO",
  NORMAL: "NORMAL",
  HIGH: "ALTO",
  UNKNOWN: "NO COMPROBADO"
};

export const profileLabels = {
  unknown: "Desconocido",
  capillary: "Capilar",
  txv: "TXV",
  eev: "EEV"
};

export const chargeMethodLabels = {
  combined: "Sin dispositivo confirmado: contrasta conjuntamente SH y SC con los datos del fabricante.",
  superheat: "Capilar: prioriza el SH objetivo del fabricante y utiliza el SC como evidencia complementaria.",
  subcooling: "TXV: verifica la carga principalmente mediante el SC objetivo del fabricante y comprueba el control de SH.",
  "controlled-superheat": "EEV: verifica el SC objetivo y confirma que sensores, controlador y válvula mantienen el SH."
};

export const chargeLabels = {
  AIRFLOW_FIRST: ["CAUDAL PRIMERO", "warn"],
  UNDERCHARGE: ["FALTA", "bad"],
  OVERCHARGE: ["EXCESO", "bad"],
  RESTRICTION: ["RESTRICCIÓN", "warn"],
  NORMAL: ["SIN PATRÓN", "ok"],
  INCONCLUSIVE: ["NO CONCLUYENTE", "warn"]
};
