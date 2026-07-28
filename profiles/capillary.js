import unknownProfile from "./unknown.js";

const capillaryProfile = Object.freeze({
  ...unknownProfile,
  id: "capillary",
  chargeMethod: "superheat",
  weights: Object.freeze({
    ...unknownProfile.weights,
    undercharge: 1.1,
    restriction: 0.8,
    overfeed: 0.9,
    sh: 1.3,
    sc: 0.7
  }),
  tolerances: Object.freeze({
    ...unknownProfile.tolerances,
    lowSuperheat: 5,
    highSuperheat: 15,
    veryHighSuperheat: 20,
    lowSubcooling: 1,
    veryLowSubcooling: 0,
    highSubcooling: 10,
    restrictionSubcooling: 6
  })
});

export default capillaryProfile;
