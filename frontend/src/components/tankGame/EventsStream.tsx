"use client";
import {
  useTankGameClaimEvent,
  useTankGameDripEvent,
  useTankGameGiveEvent,
  useTankGameMoveEvent,
  useTankGamePlayerJoinedEvent,
  useTankGameShootEvent,
  useTankGameUpgradeEvent,
  useTankGameVoteEvent,
} from "@/src/generated";
import { useState } from "react";
import { formatEther } from "viem";

export function EventStream() {
  const [events, setEvents] = useState<string[]>([]);
  useTankGameMoveEvent({
    listener: (e) => {
      e.map((event) => {
        let moveString = `Tank ${event.args.tankId} moved to (${event.args.x}, ${event.args.y})`;
        setEvents((prev) => {
          return [...prev, moveString];
        });
      });
    },
  });
  useTankGameShootEvent({
    listener(e) {
      e.map((event) => {
        let s = `Tank ${event.args.tankId} shot ${event.args.targetId}`;
        setEvents((prev) => {
          return [...prev, s];
        });
      });
    },
  });
  useTankGameGiveEvent({
    listener(e) {
      e.map((event) => {
        let s = `Tank ${event.args.fromId} gave ${
          event.args.hearts || event.args.aps
        } ${event.args.hearts ? "hearts" : "aps"} to ${event.args.toId}`;
        setEvents((prev) => {
          return [...prev, s];
        });
      });
    },
  });
  useTankGameUpgradeEvent({
    listener(e) {
      e.map((event) => {
        let s = `Tank ${event.args.tankId} upgraded range to ${event.args.range} `;
        setEvents((prev) => {
          return [...prev, s];
        });
      });
    },
  });
  useTankGameVoteEvent({
    listener(e) {
      e.map((event) => {
        let s = `Tank ${event.args.voter} voted to curse ${event.args.cursed} during epoch ${event.args.epoch}`;
        setEvents((prev) => {
          return [...prev, s];
        });
      });
    },
  });
  useTankGameDripEvent({
    listener(e) {
      e.map((event) => {
        let s = `Tank ${event.args.tankId} claimed ${event.args.amount} action points from the faucet.`;
        setEvents((prev) => {
          return [...prev, s];
        });
      });
    },
  });
  useTankGameClaimEvent({
    listener(e) {
      e.map((event) => {
        let s = `Tank ${
          event.args.tankId
        } claimed their winnings of ${formatEther(
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
  return (
    <div className="grid-flow-row auto-rows-max">
      <h1>Action Feed</h1>
      {events.reverse().map((event, i) => {
        return (
          <div key={i} className="border">
            {event}
          </div>
        );
      })}
    </div>
  );
}
