const unknownProfile = Object.freeze({
  id: "unknown",
  weights: Object.freeze({
    airflow: 1,
    undercharge: 1,
    restriction: 1,
    overfeed: 1,
    deltaT: 1,
    approach: 1,
    sh: 1,
    sc: 1,
    cr: 1
  }),
  tolerances: Object.freeze({
    highSuperheat: 12,
    veryHighSuperheat: 18,
    lowSubcooling: 3,
    veryLowSubcooling: 1,
    restrictionSubcooling: 5,
    lowSuperheat: 3,
    highSubcooling: 8,
    lowDeltaT: 7,
    highDeltaT: 15,
    lowApproach: 0,
    highApproach: 25,
    lowCompressionRatio: 1.2,
    highCompressionRatio: 5
  })
});

export default unknownProfile;
