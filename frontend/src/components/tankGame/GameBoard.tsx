import { Square } from "./Square";
import { useTankGameGetAllTanks, useTankGamePlayers } from "@/src/generated";
import { useState } from "react";
import { useAccount } from "wagmi";

export function Board({ boardSize }: { boardSize: bigint | undefined }) {
  const [selectedTank, setSelectedTank] = useState<any>();
  let tanks = useTankGameGetAllTanks({ watch: true });
  const { address } = useAccount();
  let ownersTankId = useTankGamePlayers({
    args: [address!],
    enabled: !!address,
  });
  if (!boardSize) {
    return <div></div>;
  }

  const a = new Array(Number(boardSize + BigInt(1))).fill(0);
  return (
    boardSize !== BigInt(0) && (
      <div className={`grid grid-cols-41`}>
        {a.map((x: bigint, i: number) =>
          a.map((y: bigint, j: number) => {
            const tank = tanks.data?.find((tank) => {
              return (
                tank.position.x === BigInt(i) && tank.position.y === BigInt(j)
              );
            });
            return (
              <div key={`${i},${j}`}>
                {BigInt(i) === boardSize && BigInt(j) !== boardSize && (
                  <div>{j}</div>
                )}
                {BigInt(j) === boardSize && BigInt(i) !== boardSize && (
                  <div>{i}</div>
                )}
                {BigInt(i) !== boardSize && BigInt(j) !== boardSize && (
                  <Square
                    onClick={() => {
                      setSelectedTank(tank);
                    }}
                    x={i}
                    y={j}
                    boardSize={Number(boardSize)}
                    tank={tank}
                    ownersTankId={ownersTankId.data}
                    isShootRange={
                      !!selectedTank &&
                      selectedTank.tank.hearts > 0 &&
                      getDistance(
                        BigInt(i),
                        BigInt(j),
                        selectedTank.position.x,
                        selectedTank.position.y
                      ) <= selectedTank.tank.range
                    }
                    isMoveRange={
                      !!selectedTank &&
                      selectedTank.tank.hearts > 0 &&
                      getDistance(
                        BigInt(i),
                        BigInt(j),
                        selectedTank.position.x,
                        selectedTank.position.y
                      ) <= selectedTank.tank.aps
                    }
                  />
                )}
              </div>
            );
          })
        )}
      </div>
    )
  );
}

function getDistance(ax: bigint, ay: bigint, bx: bigint, by: bigint) {
  const x = ax > bx ? ax - bx : bx - ax;
  const y = ay > by ? ay - by : by - ay;
  return x > y ? x : y;
}
