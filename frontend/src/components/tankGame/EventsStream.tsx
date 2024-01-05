"use client";
import { tankGameABI } from "@/src/generated";
import { useState, useEffect } from "react";
import { Address, formatEther } from "viem";
import { Card, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { getPublicClient } from "wagmi/actions";

export async function getTankNameFromJoinIndex(
  address: Address,
  tankId: bigint
) {
  let logs = await getLogs(address);
  let joinLogs = logs.filter((log) => log.eventName == "PlayerJoined");
  // @ts-ignore
  let name = joinLogs.find((log) => log.args.tankId === tankId);
  // @ts-ignore
  return name ? name.args.name : "Unknown Tank";
}

export async function getTanks(address: Address) {
  let logs = await getLogs(address);
  let joinLogs = logs.filter((log) => log.eventName == "PlayerJoined");
  // @ts-ignore
  return joinLogs.map((log) => log.args.name);
}

export function useTanks(address: Address) {
  const [tanks, setTanks] = useState<string[]>([]);
  useEffect(() => {
    getTanks(address).then(setTanks);
  }, [address]);
  return tanks;
}

export async function getTankNameFromAddress(
  address: Address,
  player: Address
) {
  let logs = await getLogs(address);
  let joinLogs = logs.filter((log) => log.eventName === "PlayerJoined");
  // @ts-ignore
  let relevantJoin = joinLogs.find((log) => log.args.player === player);

  if (relevantJoin) {
    // @ts-ignore
    return relevantJoin.args.name;
  }

  let delegateLogs = logs.filter((log) => log.eventName === "Delegate");
  let relevantDelegate = delegateLogs.find(
    // @ts-ignore
    (log) => log.args.delegate === player
  );

  if (relevantDelegate) {
    // @ts-ignore
    let owner = relevantDelegate.args.owner;
    // @ts-ignore
    let name = joinLogs.find((log) => log.args.player === owner);

    if (name) {
      // @ts-ignore
      return name.args.name;
    }
  }

  return "Unknown Tank";
}

export function useTankNameFromId(address: Address, index: bigint) {
  const [tankName, setTankName] = useState<string | null>(null);

  useEffect(() => {
    getTankNameFromJoinIndex(address, index).then(setTankName);
  }, [address, index]);

  return tankName;
}

export function useTankNameFromAddress(address: Address, player: Address) {
  const [tankName, setTankName] = useState<string | null>(null);

  useEffect(() => {
    getTankNameFromAddress(address, player).then(setTankName);
  }, [address, player]);

  return tankName;
}

const getLogs = async (address: Address) => {
  const publicClient = getPublicClient();
  const filter = await publicClient.createContractEventFilter({
    abi: tankGameABI,
    strict: true,
    fromBlock: BigInt(0),
    address: address,
  });
  return await publicClient.getFilterLogs({
    filter,
  });
};
export function EventStream({ address }: { address: `0x${string}` }) {
  const [events, setEvents] = useState<string[]>([]);
  const [oldLogs, setOldLogs] = useState<string[]>([]);

  const getOldLogs = async () => {
    const logs = await getLogs(address);
    console.log(
      JSON.stringify(logs, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );
    // const logText = await logToText(address, log);
    let items = await Promise.all(
      logs.map(async (log) => [log, await logToText(address, log)])
    );
    setOldLogs([
      ...items
        .reverse()
        // @ts-ignore
        .map((log) => "Block number: " + log[0].blockNumber + " " + log[1]),
    ]);
  };

  return (
    <div className="py-4">
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
const logToText = async (address: Address, event): Promise<String> => {
  if (event.eventName == "Move") {
    return await moveString(address, event);
  }
  if (event.eventName == "Shoot") {
    return await shootString(address, event);
  }
  if (event.eventName == "Give") {
    return await giveString(address, event);
  }
  if (event.eventName == "Upgrade") {
    return await upgradeString(address, event);
  }
  if (event.eventName == "Vote") {
    return await voteString(address, event);
  }
  if (event.eventName == "Drip") {
    return await dripString(address, event);
  }
  if (event.eventName == "Claim") {
    return await claimString(address, event);
  }
  if (event.eventName == "PlayerJoined") {
    return await joinString(address, event);
  }
  if (event.eventName == "GameStarted") {
    return await startString();
  }
  if (event.eventName == "SpawnHeart") {
    return await spawnHeartString(address, event);
  }
  if (event.eventName == "Revive") {
    return await reviveString(address, event);
  }
  if (event.eventName == "Death") {
    return await deathString(address, event);
  }
  if (event.eventName == "Delegate") {
    return await delegateString(address, event);
  }
  if (event.eventName == "Commit") {
    return await commitString(address, event);
  }
  if (event.eventName == "GameInit") {
    return await gameInitString(address, event);
  }
  if (event.eventName == "Reveal") {
    return await revealString(address, event);
  }
  if (event.eventName == "PrizeIncrease") {
    return await donateString(address, event);
  }
  if (event.eventName == "BountyCompleted") {
    return await bountyString(address, event);
  }
  return event.eventName + "";
};
const moveString = async (address: Address, event: any) => {
  return `🏃 ${await getTankNameFromJoinIndex(
    address,
    event.args.tankId
  )} moved to (${event.args.position.x}, 
    ${event.args.position.y}, 
    ${event.args.position.z})`;
};

const shootString = async (address: Address, event: any) => {
  return `🔫 ${await getTankNameFromJoinIndex(
    address,
    event.args.tankId
  )} shot ${await getTankNameFromJoinIndex(address, event.args.targetId)}`;
};

const delegateString = async (address: Address, event: any) => {
  return `👨‍⚖️ ${await getTankNameFromAddress(
    address,
    event.args.owner
  )} delegated control of ${await getTankNameFromJoinIndex(
    address,
    event.args.tank
  )} to ${event.args.delegate}`;
};

const commitString = async (address: Address, event: any) => {
  return `📥 Next heart will be available to spawn at block ${event.args.blocknumber}`;
};
const gameInitString = async (address: Address, event: any) => {
  return `Game started with ${event.args.settings.playerCount} players. Buy in is ${event.args.settings.buyInMinimum} ether.`;
};
const revealString = async (address: Address, event: any) => {
  return `👇${await getTankNameFromAddress(
    address,
    event.args.poker
  )} poked the reveal!`;
};

const reviveString = async (address: Address, event: any) => {
  return `🩸 ${await getTankNameFromJoinIndex(
    address,
    event.args.saved
  )} was revived by ${await getTankNameFromJoinIndex(
    address,
    event.args.savior
  )}`;
};

const deathString = async (address: Address, event: any) => {
  return `💀 ${await getTankNameFromJoinIndex(
    address,
    event.args.killer
  )} killed ${await getTankNameFromJoinIndex(address, event.args.killed)}`;
};

const spawnHeartString = async (address: Address, event: any) => {
  return `❤️ A heart spawned at ${event.args.position.x}, 
    ${event.args.position.y}, 
    ${event.args.position.z}`;
};
const giveString = async (address: Address, event: any) => {
  return `🤝 ${await getTankNameFromJoinIndex(
    address,
    event.args.fromId
  )} gave ${event.args.hearts || event.args.aps} ${
    event.args.hearts ? "hearts" : "aps"
  } to ${await getTankNameFromJoinIndex(address, event.args.toId)}`;
};

const upgradeString = async (address: Address, event: any) => {
  return `📈 ${await getTankNameFromJoinIndex(
    address,
    event.args.tankId
  )} upgraded range to ${event.args.range} `;
};

const voteString = async (address: Address, event: any) => {
  return `🗳️ ${await getTankNameFromJoinIndex(
    address,
    event.args.voter
  )} voted to curse ${await getTankNameFromJoinIndex(
    address,
    event.args.cursed
  )} during epoch ${event.args.epoch}`;
};

const dripString = async (address: Address, event: any) => {
  return `🚰 ${await getTankNameFromJoinIndex(
    address,
    event.args.tankId
  )} claimed ${event.args.amount} action points from the faucet.`;
};

const claimString = async (address: Address, event: any) => {
  return `🏆 ${await getTankNameFromJoinIndex(
    address,
    event.args.tankId
  )} claimed their winnings of ${formatEther(
    event.args.amount!
  )} ether and sent it to ${await getTankNameFromAddress(
    address,
    event.args.reciever
  )} .`;
};

const joinString = async (address: Address, event: any) => {
  return `🆕 ${
    (await getTankNameFromAddress(address, event.args.player)) ||
    event.args.player
  } has joined the game.`;
};

const donateString = async (address: Address, event: any) => {
  return `🎁 ${
    (await getTankNameFromAddress(address, event.args.donator)) ||
    event.args.donator
  } has added ${formatEther(event.args.amount!)} ether to the prize pool.`;
};

const startString = async () => {
  return `🎮 The game has started! 🎊`;
};

const bountyString = async (address: Address, event: any) => {
  return `🎯 ${await getTankNameFromJoinIndex(
    address,
    event.args.hunter
  )} completed bounty on ${await getTankNameFromJoinIndex(
    address,
    event.args.victim
  )} for ${event.args.reward} APs.`;
};
