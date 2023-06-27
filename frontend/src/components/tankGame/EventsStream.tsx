"use client";
import {
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
  "Shishi"
];

const toTankName = (tankId: bigint | undefined) => {
  if (!tankId) {
    return "Unknown Tank";
  }
  if (tankId && tankId! > TANK_MAPPING.length) {
    return "Tank " + tankId!.toString();
  }
  return TANK_MAPPING[Number(tankId!)];
};
export function EventStream() {
  const [events, setEvents] = useState<string[]>([]);
  useTankGameMoveEvent({
    listener: (e) => {
      e.map((event) => {
        let moveString = `${toTankName(event.args.tankId)} moved to (${
          event.args.x
        }, ${event.args.y})`;
        setEvents((prev) => {
          return [...prev, moveString];
        });
      });
    },
  });
  useTankGameShootEvent({
    listener(e) {
      e.map((event) => {
        let s = `${toTankName(event.args.tankId)} shot ${event.args.targetId}`;
        setEvents((prev) => {
          return [...prev, s];
        });
      });
    },
  });
  useTankGameGiveEvent({
    listener(e) {
      e.map((event) => {
        let s = `${toTankName(event.args.fromId)} gave ${
          event.args.hearts || event.args.aps
        } ${event.args.hearts ? "hearts" : "aps"} to ${toTankName(
          event.args.toId
        )}`;
        setEvents((prev) => {
          return [...prev, s];
        });
      });
    },
  });
  useTankGameUpgradeEvent({
    listener(e) {
      e.map((event) => {
        let s = `${toTankName(event.args.tankId)} upgraded range to ${
          event.args.range
        } `;
        setEvents((prev) => {
          return [...prev, s];
        });
      });
    },
  });
  useTankGameVoteEvent({
    listener(e) {
      e.map((event) => {
        let s = `${toTankName(event.args.voter)} voted to curse ${
          event.args.cursed
        } during epoch ${event.args.epoch}`;
        setEvents((prev) => {
          return [...prev, s];
        });
      });
    },
  });
  useTankGameDripEvent({
    listener(e) {
      e.map((event) => {
        let s = `${toTankName(event.args.tankId)} claimed ${
          event.args.amount
        } action points from the faucet.`;
        setEvents((prev) => {
          return [...prev, s];
        });
      });
    },
  });
  useTankGameClaimEvent({
    listener(e) {
      e.map((event) => {
        let s = `${toTankName(
          event.args.tankId
        )} claimed their winnings of ${formatEther(
          event.args.amount!
        )} ether and sent it to ${event.args.reciever} .`;
        setEvents((prev) => {
          return [...prev, s];
        });
      });
    },
  });
  useTankGamePlayerJoinedEvent({
    listener(e) {
      e.map((event) => {
        let s = `${event.args.player} has joined the game.`;
        setEvents((prev) => {
          return [...prev, s];
        });
      });
    },
  });
  useTankGamePrizeIncreaseEvent({
    listener(e) {
      e.map((event) => {
        let s = `${event.args.donator} has added ${formatEther(
          event.args.amount!
        )} to the prize pool.`;
        setEvents((prev) => {
          return [...prev, s];
        });
      });
    },
  });
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
    </div>
  );
}
