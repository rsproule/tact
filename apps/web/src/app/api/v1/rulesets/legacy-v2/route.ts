import { legacyV2Ruleset } from "@tact/game-engine";

export function GET(): Response {
  return Response.json({
    ...legacyV2Ruleset,
    board: {
      coordinates: "signed-cube",
      invariant: "q + r + s = 0",
      boardSizeMeaning: "radius",
    },
    actions: {
      move: "Any unoccupied destination; cost equals hex distance.",
      shoot: "One AP and one heart per shot; batched shots are supported.",
      give: "Transfer hearts and/or AP within the giver's range.",
      upgrade: "Cost is 6 * current range - 6, then range increases by one.",
      claimActionPoints: "One AP per elapsed epoch; dead tanks accrue none.",
      curseVote: "Dead players vote once per epoch against a living tank.",
    },
    compatibilityOnly: true,
    note: "Known authorization and accounting defects from the Solidity implementation are intentionally excluded.",
  });
}
