"use client";
import {
  tankGameABI,
  tankGameAddress,
  useTankGameClaimEvent,
  useTankGameDripEvent,
  useTankGameGiveEvent,
  useTankGameMoveEvent,
  useTankGamePlayerJoinedEvent,
  useTankGamePrizeIncreaseEvent,
  useTankGameShootEvent,
  useTankGameUpgradeEvent,
  useTankGameVoteEvent,
} from "@/src/generated";
import { useState } from "react";
import { formatEther } from "viem";
import { Card, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { getPublicClient } from "wagmi/actions";
import { useNetwork } from "wagmi";
import { OWNERS } from "./Tank";

const TANK_MAPPING = [
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
  const [events, setEvents] = useState<string[]>([]);
  useTankGameMoveEvent({
    listener: (e) => {
      e.map((event) => {
        setEvents((prev) => {
          return [...prev, moveString(event)];
        });
      });
    },
  });
  useTankGameShootEvent({
    listener(e) {
      e.map((event) => {
        setEvents((prev) => {
          return [...prev, shootString(event)];
        });
      });
    },
  });
  useTankGameGiveEvent({
    listener(e) {
      e.map((event) => {
        setEvents((prev) => {
          return [...prev, giveString(event)];
        });
      });
    },
  });
  useTankGameUpgradeEvent({
    listener(e) {
      e.map((event) => {
        setEvents((prev) => {
          return [...prev, upgradeString(event)];
        });
      });
    },
  });
  useTankGameVoteEvent({
    listener(e) {
      e.map((event) => {
        setEvents((prev) => {
          return [...prev, voteString(event)];
        });
      });
    },
  });
  useTankGameDripEvent({
    listener(e) {
      e.map((event) => {
        setEvents((prev) => {
          return [...prev, dripString(event)];
        });
      });
    },
  });
  useTankGameClaimEvent({
    listener(e) {
      e.map((event) => {
        setEvents((prev) => {
          return [...prev, claimString(event)];
        });
      });
    },
  });
  useTankGamePlayerJoinedEvent({
    listener(e) {
      e.map((event) => {
        setEvents((prev) => {
          return [...prev, joinString(event)];
        });
      });
    },
  });
  useTankGamePrizeIncreaseEvent({
    listener(e) {
      e.map((event) => {
        setEvents((prev) => {
          return [...prev, donateString(event)];
        });
      });
    },
  });
  const [oldLogs, setOldLogs] = useState<string[]>([]);
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
    setOldLogs(logs.reverse().map((log) => logToText(log)));
  };

  return (
    <div className="py-4">
      <Card>
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
  return `🏃 ${toTankName(event.args.tankId)} moved to (${event.args.x}, ${
    event.args.y
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
