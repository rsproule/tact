"use client";
import { tankGameABI, tankGameAddress } from "@/src/generated";
import { useState } from "react";
import { formatEther } from "viem";
import { Card, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { getPublicClient } from "wagmi/actions";
import { useNetwork } from "wagmi";
import { OWNERS } from "./Tank";

export const TANK_MAPPING = [
  "Ryan",
  "Jonah",
  "Sam",
  "Mason",
  "Spencer",
  "Yigit",
  "Caleb",
  "Joe",
  "Sterling",
  "Shishi",
];

const toTankName = (tankId: bigint | undefined) => {
  if (!tankId) {
    return "Unknown Tank";
  }
  if (tankId && tankId! > TANK_MAPPING.length + 1) {
    return "Tank " + tankId!.toString();
  }
  return TANK_MAPPING[Number(tankId!) - 1];
};
export function EventStream() {
  // const [events, setEvents] = useState<string[]>([]);
  // useTankGameMoveEvent({
  //   listener: (e) => {
  //     e.map((event) => {
  //       setEvents((prev) => {
  //         return [...prev, moveString(event)];
  //       });
  //     });
  //   },
  // });
  // useTankGameShootEvent({
  //   listener(e) {
  //     e.map((event) => {
  //       setEvents((prev) => {
  //         return [...prev, shootString(event)];
  //       });
  //     });
  //   },
  // });
  // useTankGameGiveEvent({
  //   listener(e) {
  //     e.map((event) => {
  //       setEvents((prev) => {
  //         return [...prev, giveString(event)];
  //       });
  //     });
  //   },
  // });
  // useTankGameUpgradeEvent({
  //   listener(e) {
  //     e.map((event) => {
  //       setEvents((prev) => {
  //         return [...prev, upgradeString(event)];
  //       });
  //     });
  //   },
  // });
  // useTankGameVoteEvent({
  //   listener(e) {
  //     e.map((event) => {
  //       setEvents((prev) => {
  //         return [...prev, voteString(event)];
  //       });
  //     });
  //   },
  // });
  // useTankGameDripEvent({
  //   listener(e) {
  //     e.map((event) => {
  //       setEvents((prev) => {
  //         return [...prev, dripString(event)];
  //       });
  //     });
  //   },
  // });
  // useTankGameClaimEvent({
  //   listener(e) {
  //     e.map((event) => {
  //       setEvents((prev) => {
  //         return [...prev, claimString(event)];
  //       });
  //     });
  //   },
  // });
  // useTankGamePlayerJoinedEvent({
  //   listener(e) {
  //     e.map((event) => {
  //       setEvents((prev) => {
  //         return [...prev, joinString(event)];
  //       });
  //     });
  //   },
  // });
  // useTankGamePrizeIncreaseEvent({
  //   listener(e) {
  //     e.map((event) => {
  //       setEvents((prev) => {
  //         return [...prev, donateString(event)];
  //       });
  //     });
  //   },
  // });
  const [oldLogs, setOldLogs] = useState<string[]>(emergencyInitLogs);
  const { chain } = useNetwork();
  const getOldLogs = async () => {
    const publicClient = getPublicClient();
    const chainId = chain?.id;
    const filter = await publicClient.createContractEventFilter({
      abi: tankGameABI,
      strict: true,
      fromBlock: BigInt(9229639),
      address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    });
    const logs = await publicClient.getFilterLogs({
      filter,
    });
    setOldLogs([
      ...emergencyInitLogs,
      ...logs.reverse().map((log) => logToText(log)),
    ]);
  };

  return (
    <div className="py-4">
      {/* <Card>
        <CardHeader>
          <h1 className="text-xl">Action Feed</h1>
        </CardHeader>
        <div className="grid-flow-row auto-rows-max">
          {events.reverse().map((event, i) => {
            return (
              <div key={i} className="border">
                {event}
              </div>
            );
          })}
        </div>
      </Card>
      <Card> */}
      <Card>
        <CardHeader>
          <h1 className="text-xl">Historical logs</h1>
          <Button onClick={() => getOldLogs()}>Fetch Historical Logs</Button>
        </CardHeader>
        {oldLogs.length > 0 && (
          <div className="grid-flow-row auto-rows-max">
            {oldLogs.map((event, i) => {
              return (
                <div key={i} className="border">
                  {event}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

// @ts-ignore
const logToText = (event) => {
  if (event.eventName == "Move") {
    return moveString(event);
  }
  if (event.eventName == "Shoot") {
    return shootString(event);
  }
  if (event.eventName == "Give") {
    return giveString(event);
  }
  if (event.eventName == "Upgrade") {
    return upgradeString(event);
  }
  if (event.eventName == "Vote") {
    return voteString(event);
  }
  if (event.eventName == "Drip") {
    return dripString(event);
  }
  if (event.eventName == "Claim") {
    return claimString(event);
  }
  if (event.eventName == "PlayerJoined") {
    return joinString(event);
  }
  if (event.eventName == "GameStarted") {
    return startString(event);
  }
  if (event.eventName == "PrizeIncrease") {
    return donateString(event);
  } else {
    return event.eventName + "";
  }
};
const moveString = (event: any) => {
  return `🏃 ${toTankName(event.args.tankId)} moved to (${event.args.y}, ${
    event.args.x
  })`;
};

const shootString = (event: any) => {
  return `🔫 ${toTankName(event.args.tankId)} shot ${toTankName(
    event.args.targetId
  )}`;
};

const giveString = (event: any) => {
  return `🤝 ${toTankName(event.args.fromId)} gave ${
    event.args.hearts || event.args.aps
  } ${event.args.hearts ? "hearts" : "aps"} to ${toTankName(event.args.toId)}`;
};

const upgradeString = (event: any) => {
  return `📈 ${toTankName(event.args.tankId)} upgraded range to ${
    event.args.range
  } `;
};

const voteString = (event: any) => {
  return `🗳️ ${toTankName(event.args.voter)} voted to curse ${
    event.args.cursed
  } during epoch ${event.args.epoch}`;
};

const dripString = (event: any) => {
  return `🚰 ${toTankName(event.args.tankId)} claimed ${
    event.args.amount
  } action points from the faucet.`;
};

const claimString = (event: any) => {
  return `🏆 ${toTankName(
    event.args.tankId
  )} claimed their winnings of ${formatEther(
    event.args.amount!
  )} ether and sent it to ${OWNERS.get(event.args.reciever)} .`;
};

const joinString = (event: any) => {
  return `🆕 ${
    OWNERS.get(event.args.player) || event.args.player
  } has joined the game.`;
};

const donateString = (event: any) => {
  return `🎁 ${
    OWNERS.get(event.args.donator) || event.args.donator
  } has added ${formatEther(event.args.amount!)} to the prize pool.`;
};

const startString = (event: any) => {
  return `🎮 The game has started! 🎊`;
};

const emergencyInitLogs = [
  "🔫  Mason shot Jonah",
  "🚰 Ryan claimed 1 action points from the faucet.",
  "🔫 Mason shot Jonah",
  "📈 Mason upgraded range to 8",
  "🚰 Mason claimed 5 action points from the faucet.",
  "🏃 Shishi moved to (32, 12)",
  "🚰 Shishi claimed 1 action points from the faucet.",
  "🔫 Jonah shot Joe",
  "🏃 Jonah moved to (11, 28)",
  "🚰 Jonah claimed 4 action points from the faucet.",
  "🚰 Ryan claimed 1 action points from the faucet.",
  "🏃 Sterling moved to (17, 5)",
  "🔫 Sterling shot Yigit",
  "🔫 Sterling shot Yigit",
  "🔫 Sterling shot Yigit",
  "🏃 Sterling moved to (4, 11)",
  "🏃 Sterling moved to (5, 11)",
  "🏃 Sterling moved to (7, 11)",
  "🤝 Shishi gave 1 aps to Sterling",
  "🚰 Shishi claimed 1 action points from the faucet.",
  "🤝 Shishi gave 1 aps to Sterling",
  "🤝 Shishi gave 1 aps to Sterling",
  "🤝 Shishi gave 1 aps to Sterling",
  "🤝 Shishi gave 1 aps to Sterling",
  "🤝 Shishi gave 1 aps to Sterling",
  "🤝 Shishi gave 1 aps to Sterling",
  "🤝 Shishi gave 1 aps to Sterling",
  "🤝 Shishi gave 1 aps to Sterling",
  "🤝 Shishi gave 1 aps to Sterling",
  "🤝 Shishi gave 1 aps to Sterling",
  "🤝 Shishi gave 1 aps to Sterling",
  "🤝 Shishi gave 1 aps to Sterling",
  "🤝 Shishi gave 1 aps to Sterling",
  "🏃 Shishi moved to (31, 11)",
  "🚰 Shishi claimed 2 action points from the faucet.",
  "🚰 Sterling claimed 6 action points from the faucet.",
  "🤝 Ryan gave 9 aps to Sterling",
  "🏃 Ryan moved to (30, 8)",
  "🚰 Ryan claimed 4 action points from the faucet.",
  "🚰 Shishi claimed 3 action points from the faucet.",
  "🚰 Jonah claimed 2 action points from the faucet.",
  "🤝 Mason gave 1 hearts to Joe",
  "🔫 Mason shot Caleb",
  "🚰 Mason claimed 3 action points from the faucet.",
  "🚰 Ryan claimed 7 action points from the faucet.",
  "🔫 Caleb shot Joe",
  "🔫 Caleb shot Joe",
  "🔫 Caleb shot Joe",
  "🏃 Caleb moved to (16, 32)",
  "📈 Caleb upgraded range to 4",
  "🔫 Caleb shot Sam",
  "🔫 Caleb shot Sam",
  "🔫 Caleb shot Sam",
  "🤝 Jonah gave 1 hearts to Caleb",
  "🏃 Jonah moved to (5, 32)",
  "🚰 Jonah claimed 1 action points from the faucet.",
  "🚰 Caleb claimed 17 action points from the faucet.",
  "📈 Sam upgraded range to 6",
  "📈 Sam upgraded range to 5",
  "📈 Sam upgraded range to 4",
  "🏃 Joe moved to (16, 33)",
  "🚰 Joe claimed 7 action points from the faucet.",
  "🚰 Jonah claimed 5 action points from the faucet.",
  "🚰 Sam claimed 13 action points from the faucet.",
  "🚰 Shishi claimed 3 action points from the faucet.",
  "🏃 Mason moved to (16, 36)",
  "📈 Mason upgraded range to 7",
  "🚰 Mason claimed 3 action points from the faucet.",
  "🚰 Sterling claimed 5 action points from the faucet.",
  "🚰 Shishi claimed 3 action points from the faucet.",
  "🚰 Mason claimed 1 action points from the faucet.",
  "📈 Jonah upgraded range to 5",
  "🚰 Jonah claimed 1 action points from the faucet.",
  "🏃 Mason moved to (17, 36)",
  "🚰 Mason claimed 1 action points from the faucet.",
  "🏃 Mason moved to (18, 36)",
  "🚰 Mason claimed 1 action points from the faucet.",
  "📈 Jonah upgraded range to 4",
  "🚰 Jonah claimed 3 action points from the faucet.",
  "🚰 Shishi claimed 4 action points from the faucet.",
  "🚰 Spencer claimed 1 action points from the faucet.",
  "🔫 Ryan shot Spencer",
  "🔫 Ryan shot Spencer",
  "🔫 Ryan shot Spencer",
  "🚰 Sterling claimed 1 action points from the faucet.",
  "🏃 Ryan moved to (32, 4)",
  "🚰 Ryan claimed 3 action points from the faucet.",
  "🤝 Sterling gave 1 hearts to Ryan",
  "🏃 Joe moved to (23, 33)",
  "🏃 Mason moved to (19, 36)",
  "🚰 Joe claimed 2 action points from the faucet.",
  "📈 Mason upgraded range to 6",
  "🚰 Mason claimed 4 action points from the faucet.",
  "🏃 Spencer moved to (32, 1)",
  "🏃 Sterling moved to (27, 11)",
  "🚰 Sterling claimed 5 action points from the faucet.",
  "🔫 Spencer shot Ryan",
  "🔫 Spencer shot Ryan",
  "🔫 Spencer shot Ryan",
  "🏃 Spencer moved to (32, 5)",
  "🚰 Spencer claimed 4 action points from the faucet.",
  "🎁 Jonah has added 0.000042069 to the prize pool.",
  "🚰 Jonah claimed 1 action points from the faucet.",
  "🚰 Ryan claimed 1 action points from the faucet.",
  "🏃 Joe moved to (25, 31)",
  "🚰 Joe claimed 2 action points from the faucet.",
  "🚰 Jonah claimed 1 action points from the faucet.",
  "🚰 Shishi claimed 1 action points from the faucet.",
  "🚰 Ryan claimed 1 action points from the faucet.",
  "🚰 Shishi claimed 2 action points from the faucet.",
  "📈 Joe upgraded range to 4",
  "🚰 Joe claimed 1 action points from the faucet.",
  "📈 Mason upgraded range to 5",
  "🚰 Mason claimed 2 action points from the faucet.",
  "🚰 Yigit claimed 1 action points from the faucet.",
  "🚰 Spencer claimed 1 action points from the faucet.",
  "🚰 Ryan claimed 1 action points from the faucet.",
  "🏃 Jonah moved to (0, 37)",
  "🚰 Jonah claimed 2 action points from the faucet.",
  "🏃 Yigit moved to (0, 11)",
  "🏃 Yigit moved to (0, 13)",
  "🚰 Yigit claimed 4 action points from the faucet.",
  "🚰 Joe claimed 1 action points from the faucet.",
  "🚰 Spencer claimed 4 action points from the faucet.",
  "🚰 Ryan claimed 1 action points from the faucet.",
  "🚰 Sterling claimed 1 action points from the faucet.",
  "📈 Shishi upgraded range to 4",
  "📈 Sterling upgraded range to 4",
  "🚰 Shishi claimed 2 action points from the faucet.",
  "🚰 Sterling claimed 3 action points from the faucet.",
  "🏃 Jonah moved to (0, 35)",
  "🏃 Jonah moved to (1, 34)",
  "🏃 Jonah moved to (2, 33)",
  "🔫 Sam shot Caleb",
  "🚰 Jonah claimed 2 action points from the faucet.",
  "🔫 Sam shot Caleb",
  "🏃 Joe moved to (27, 31)",
  "🚰 Sam claimed 3 action points from the faucet.",
  "📈 Mason upgraded range to 4",
  "🚰 Mason claimed 3 action points from the faucet.",
  "🚰 Ryan claimed 2 action points from the faucet.",
  "🚰 Joe claimed 2 action points from the faucet.",
  "🎁 Ryan has added 0.000001 to the prize pool.",
  "🏃 Ryan moved to (31, 8)",
  "🏃 Yigit moved to (2, 15)",
  "🚰 Shishi claimed 1 action points from the faucet.",
  "🏃 Jonah moved to (3, 32)",
  "🚰 Jonah claimed 1 action points from the faucet.",
  "🏃 Joe moved to (27, 30)",
  "🚰 Joe claimed 1 action points from the faucet.",
  "🚰 Ryan claimed 1 action points from the faucet.",
  "🏃 Joe moved to (27, 29)",
  "🎁 0x93AB0CD091DC8Dd513eBFd11972e64A2AC558552 has added 0.00698008135 to the prize pool.",
  "🎁 0x93AB0CD091DC8Dd513eBFd11972e64A2AC558552 has added 0.001 to the prize pool.",
  "🔫 Sam shot Caleb",
  "🏃 Sterling moved to (25, 13)",
  "🆕 Shishi has joined the game.",
  "🎮 The game has started! 🎊",
  "🆕 Sterling has joined the game.",
  "🎁 Mason has added 0.1 to the prize pool.",
  "🆕 Joe//Osprey has joined the game.",
  "🆕 Caleb has joined the game.",
  "🆕 Yigit has joined the game.",
  "🆕 Spencer has joined the game.",
  "🆕 Mason has joined the game.",
  "🆕 Sam has joined the game.",
  "🆕 Jonah has joined the game.",
  "🎁 Ryan has added 0.1 to the prize pool.",
  "🆕 Ryan has joined the game",
];
