function classify(value, lowThreshold, highThreshold) {
  if (lowThreshold !== undefined && value < lowThreshold) {
    return "LOW";
  }
  if (highThreshold !== undefined && value > highThreshold) {
    return "HIGH";
  }
  return "NORMAL";
}

export function buildEvidence(calculations, profile, measures) {
  const { tolerances } = profile;

  return {
    SH: {
      value: calculations.sh,
      state: classify(
        calculations.sh,
        tolerances.lowSuperheat,
        tolerances.highSuperheat
      )
    },
    SC: {
      value: calculations.sc,
      state: classify(
        calculations.sc,
        tolerances.lowSubcooling,
        tolerances.highSubcooling
      )
    },
    DELTA_T: {
      value: calculations.deltaT,
      state: classify(
        calculations.deltaT,
        tolerances.lowDeltaT,
        tolerances.highDeltaT
      )
    },
    APPROACH: {
      value: calculations.approach,
      state: classify(
        calculations.approach,
        tolerances.lowApproach,
        tolerances.highApproach
      )
    },
    CR: {
      value: calculations.cr,
      state: classify(
        calculations.cr,
        tolerances.lowCompressionRatio,
        tolerances.highCompressionRatio
      )
    },
    AIRFLOW: {
      value: measures.air,
      state: measures.air === "normal" ? "NORMAL" : "LOW"
    }
  };
}
