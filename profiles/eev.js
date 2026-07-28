import unknownProfile from "./unknown.js";

const eevProfile = Object.freeze({
  ...unknownProfile,
  id: "eev",
  chargeMethod: "controlled-superheat",
  weights: Object.freeze({
    ...unknownProfile.weights,
    restriction: 1.2,
    overfeed: 1.15,
    sh: 1.1,
    sc: 1.2
  }),
  tolerances: Object.freeze({
    ...unknownProfile.tolerances,
    lowSuperheat: 3,
    highSuperheat: 8,
    veryHighSuperheat: 14,
    highSubcooling: 10
  })
});

export default eevProfile;
