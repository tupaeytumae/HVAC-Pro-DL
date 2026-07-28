import unknownProfile from "./unknown.js";

const txvProfile = Object.freeze({
  ...unknownProfile,
  id: "txv",
  chargeMethod: "subcooling",
  weights: Object.freeze({
    ...unknownProfile.weights,
    restriction: 1.15,
    overfeed: 1.1,
    sh: 0.9,
    sc: 1.25
  }),
  tolerances: Object.freeze({
    ...unknownProfile.tolerances,
    lowSuperheat: 4,
    highSuperheat: 10,
    veryHighSuperheat: 16,
    highSubcooling: 10
  })
});

export default txvProfile;
