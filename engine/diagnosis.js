import { calculate } from "./calculations.js";
import { buildEvidence } from "./evidence.js";
import { getProfile } from "../profiles/index.js";
import { evaluateAirflow } from "../diagnostics/airflow.js";
import { evaluateUndercharge } from "../diagnostics/undercharge.js";
import { evaluateRestriction } from "../diagnostics/restriction.js";
import { evaluateOverfeed } from "../diagnostics/overfeed.js";
import { evaluateLowDeltaT } from "../diagnostics/low_deltaT.js";
import { evaluateHighApproach } from "../diagnostics/high_approach.js";
import { evaluateBalanced } from "../diagnostics/balanced.js";

const diagnostics = Object.freeze([
  evaluateAirflow,
  evaluateUndercharge,
  evaluateRestriction,
  evaluateOverfeed,
  evaluateLowDeltaT,
  evaluateHighApproach,
  evaluateBalanced
]);

export function diagnose(measures, database, profileName = "unknown") {
  const calculations = calculate(measures, database);
  if (calculations === null) {
    return null;
  }

  const profile = getProfile(profileName);
  const evidence = buildEvidence(calculations, profile, measures);
  const results = diagnostics
    .map(diagnostic => diagnostic(measures, calculations, profile, evidence))
    .sort((left, right) => right.score - left.score);
  const undercharge = results.find(result => result.id === "UNDERCHARGE");

  return {
    calculations,
    evidence,
    diagnosis: results[0],
    compatibility: undercharge.compatibility,
    results,
    profile
  };
}
