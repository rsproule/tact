import { getPublicClient } from "wagmi/actions";
import { tankGameABI, useTankGameSettings } from "../generated";
import { Card, CardContent, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { useState } from "react";
import { useTanks } from "./tankGame/EventsStream";

export function LeaderBoard({ gameAddress }: { gameAddress: `0x${string}` }) {
  const [murderCount, setMurderCount] = useState(undefined);
  const [reviveCount, setReviveCount] = useState(undefined);
  const [deathCount, setDeathCount] = useState(undefined);
  const [dripCount, setDripCount] = useState(undefined);
  const getLogs = async () => {
    const publicClient = getPublicClient();
    const filter = await publicClient.createContractEventFilter({
      abi: tankGameABI,
      strict: true,
      fromBlock: BigInt(0),
      address: gameAddress,
    });
    return await publicClient.getFilterLogs({
      filter,
    });
  };
  const getLeaderBoard = async (numPlayers: number) => {
    const logs = await getLogs();
    const tanksByKills = logs
      .filter((log) => log.eventName === "Death")
      .reduce((acc, log) => {
        // @ts-ignore
        const tankId = log.args.killer;
        if (tankId in acc) {
          // @ts-ignore
          acc[tankId] += 1;
        } else {
          // @ts-ignore
          acc[tankId] = 1;
        }
        return acc;
      }, []);
    const sortedTanksByKills = Object.entries(tanksByKills).sort(
      (a, b) => b[1] - a[1]
    );
    // @ts-ignore
    setMurderCount(sortedTanksByKills);
    const tanksByRevives = logs
      .filter((log) => log.eventName === "Revive")
      .reduce((acc, log) => {
        // @ts-ignore
        const tankId = log.args.savior;
        if (tankId in acc) {
          // @ts-ignore
          acc[tankId] += 1;
        } else {
          // @ts-ignore
          acc[tankId] = 1;
        }
        return acc;
      }, []);
    const sortedTanksByRevives = Object.entries(tanksByRevives).sort(
      (a, b) => b[1] - a[1]
    );
    // @ts-ignore
    setReviveCount(sortedTanksByRevives);
    const tanksByDeaths = logs
      .filter((log) => log.eventName === "Death")
      .reduce((acc, log) => {
        // @ts-ignore
        const tankId = log.args.killed;
        if (tankId in acc) {
          // @ts-ignore
          acc[tankId] += 1;
        } else {
          // @ts-ignore
          acc[tankId] = 1;
        }
        return acc;
      }, []);

    const sortedTanksByDeaths = Object.entries(tanksByDeaths).sort(
      (a, b) => b[1] - a[1]
    );

    // @ts-ignore
    setDeathCount(sortedTanksByDeaths);

    const tanksByDrips = logs
      .filter((log) => log.eventName === "Drip")
      .reduce((acc, log) => {
        // @ts-ignore
        const tankId = log.args.tankId;
        if (tankId in acc) {
          // @ts-ignore
          acc[tankId] += 1;
        } else {
          // @ts-ignore
          acc[tankId] = 1;
        }
        return acc;
      }, []);

    const sortedTanksByDrips = Object.entries(tanksByDrips).sort(
      (a, b) => b[1] - a[1]
    );

    const missingTankIds = Array.from({ length: numPlayers }, (_, i) => i + 1)
      .map(String)
      .filter((id) => !sortedTanksByDrips.some(([num]) => num === id));

    missingTankIds.forEach((id) => {
      // @ts-ignore
      sortedTanksByDrips.push([id, 0]);
    });

    // @ts-ignore
    setDripCount(sortedTanksByDrips);
  };

  const tanks = useTanks(gameAddress);
  const { data: settings } = useTankGameSettings({
    // @ts-ignore
    address: gameAddress,
  });

  return (
    <Card className="container">
      <Button
        className="w-full my-2"
        onClick={() => getLeaderBoard(settings ? Number(settings[0]) : 0)}
      >
        Refresh LeaderBoard
      </Button>
      <CardContent>
        {dripCount && (
          <div className="flex md:justify-evenly m-2">
            <div>
              <div>
                <CardTitle className="text-xl mt-4">Murders</CardTitle>
                <div className="border-t border-gray-300 my-4"></div>
              </div>
              {murderCount &&
                // @ts-ignore
                murderCount.map(([tankId, murders]) => {
                  return (
                    <div key={tankId}>
                      {tanks[tankId -1]}: {murders}
                    </div>
                  );
                })}
              <div className="border-t border-gray-300 my-4"></div>
            </div>
            <div>
              <div>
                <CardTitle className="text-xl mt-4">Revives</CardTitle>
                <div className="border-t border-gray-300 my-4"></div>
              </div>

              {reviveCount &&
                // @ts-ignore
                reviveCount.map(([tankId, revives]) => {
                  return (
                    <div key={tankId}>
                      {tanks[tankId-1]}: {revives}
                    </div>
                  );
                })}
              <div className="border-t border-gray-300 my-4"></div>
            </div>
            <div>
              <div>
                <CardTitle className="text-xl mt-4">Deaths</CardTitle>
                <div className="border-t border-gray-300 my-4"></div>
              </div>
              {deathCount &&
                // @ts-ignore
                deathCount.map(([tankId, deaths]) => {
                  return (
                    <div key={tankId}>
                      {tanks[tankId-1]}: {deaths}
                    </div>
                  );
                })}
              <div className="border-t border-gray-300 my-4"></div>
            </div>
            <div>
              <div>
                <CardTitle className="text-xl mt-4">Drips</CardTitle>
                <div className="border-t border-gray-300 my-4"></div>
              </div>
              {dripCount &&
                // @ts-ignore
                dripCount.map(([num, drips]) => {
                  return (
                    <div key={num}>
                      {tanks[num-1]}: {drips}
                    </div>
                  );
                })}

              <div className="border-t border-gray-300 my-4"></div>
            </div>
            {/* <div>
              <div>
                <CardTitle className="text-xl mt-4">
                  Distance Travelled
                </CardTitle>
                <div className="border-t border-gray-300 my-4"></div>
              </div>
              {distances &&
                // @ts-ignore
                distances.map(([num, distance]) => {
                  return (
                    <div key={num}>
                      {toTankName(BigInt(num))}: {distance}
                    </div>
                  );
                })}

              <div className="border-t border-gray-300 my-4"></div>
            </div> */}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
