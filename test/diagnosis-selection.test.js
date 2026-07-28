import assert from "node:assert/strict";
import test from "node:test";

import { diagnose, selectDiagnosis } from "../engine/diagnosis.js";
import { buildEvidence } from "../engine/evidence.js";
import { evaluateBalanced } from "../diagnostics/balanced.js";
import { getProfile } from "../profiles/index.js";

const database = {
  meta: {
    atmospheric_pressure_bar: 1
  },
  fluids: {
    TEST: {
      dew: [[0, 0], [10, 10]],
      bubble: [[0, 0], [10, 10]]
    }
  }
};

function measures(overrides = {}) {
  return {
    ref: "TEST",
    mode: "cool",
    air: "normal",
    lp: 2,
    hp: 4,
    ts: 7,
    tl: -1,
    tr: 15,
    ti: 5,
    to: -6,
    ...overrides
  };
}

test("selection ignores unmatched results regardless of score", () => {
  const selected = selectDiagnosis([
    { id: "UNMATCHED", score: 999, matched: false },
    { id: "MATCHED", score: 10, matched: true },
    { id: "BALANCED", score: 1, matched: false }
  ]);

  assert.equal(selected.id, "MATCHED");
});

test("balanced remains the non-stable fallback when no diagnosis matches", () => {
  const selected = selectDiagnosis([
    { id: "UNMATCHED", score: 999, matched: false },
    { id: "BALANCED", score: 100, matched: false }
  ]);

  assert.equal(selected.id, "BALANCED");
  assert.equal(selected.matched, false);
});

test("a fully normal system is stable", () => {
  const result = diagnose(measures(), database);

  assert.equal(result.profile.id, "unknown");
  assert.equal(result.diagnosis.id, "BALANCED");
  assert.equal(result.diagnosis.matched, true);
  assert.equal(result.diagnosis.level, "ok");
  assert.ok(
    Object.values(result.evidence).every(item => item.state === "NORMAL")
  );
});

test("the selected expansion device loads its corresponding profile", () => {
  for (const profileName of ["unknown", "capillary", "txv", "eev"]) {
    const result = diagnose(measures(), database, profileName);

    assert.equal(result.profile.id, profileName);
  }
});

test("an isolated anomaly cannot be stable", () => {
  const result = diagnose(measures({ ts: 15, tl: 0 }), database);

  assert.equal(result.evidence.SH.state, "HIGH");
  assert.equal(result.evidence.SC.state, "NORMAL");
  assert.equal(result.diagnosis.id, "BALANCED");
  assert.equal(result.diagnosis.matched, false);
  assert.equal(result.diagnosis.level, "warn");
});

test("a matched specific diagnosis wins", () => {
  const result = diagnose(measures({ ts: 15, tl: 2 }), database);

  assert.equal(result.evidence.SH.state, "HIGH");
  assert.equal(result.evidence.SC.state, "LOW");
  assert.equal(result.diagnosis.id, "UNDERCHARGE");
  assert.equal(result.diagnosis.matched, true);
});

test("stable always implies that every evidence is normal", () => {
  const values = {
    sh: [2.9, 3, 12, 12.1],
    sc: [2.9, 3, 8, 8.1],
    deltaT: [6.9, 7, 15, 15.1],
    approach: [-0.1, 0, 25, 25.1],
    cr: [1.19, 1.2, 5, 5.01],
    air: ["normal", "low", "unknown"]
  };

  for (const profileName of ["unknown", "capillary", "txv", "eev"]) {
    const profile = getProfile(profileName);
    for (const sh of values.sh) {
      for (const sc of values.sc) {
        for (const deltaT of values.deltaT) {
          for (const approach of values.approach) {
            for (const cr of values.cr) {
              for (const air of values.air) {
                const evidence = buildEvidence(
                  { sh, sc, deltaT, approach, cr },
                  profile,
                  { air }
                );
                const allNormal = Object.values(evidence)
                  .every(item => item.state === "NORMAL");
                const balanced = evaluateBalanced(
                  { air },
                  { sh, sc, deltaT, approach, cr },
                  profile,
                  evidence
                );

                assert.equal(
                  balanced.level === "ok",
                  allNormal
                );
              }
            }
          }
        }
      }
    }
  }
});
