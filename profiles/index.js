import unknown from "./unknown.js";
import capillary from "./capillary.js";
import txv from "./txv.js";
import eev from "./eev.js";

const profiles = Object.freeze({ unknown, capillary, txv, eev });

export function getProfile(profileName = "unknown") {
  return profiles[profileName] || profiles.unknown;
}
