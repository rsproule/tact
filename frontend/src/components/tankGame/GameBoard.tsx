import { useState } from "react";
import { Square } from "./Square";
import { useTankGameGetAllTanks, useTankGamePlayers } from "@/src/generated";
import { Tank as TankComponent } from "./Tank";
import { useAccount } from "wagmi";

export function Board({ boardSize }: { boardSize: bigint | undefined }) {
  let tanks = useTankGameGetAllTanks({ watch: true });
  const { address } = useAccount();
  let ownersTankId = useTankGamePlayers({
    args: [address!],
    enabled: !!address,
  });
  if (!boardSize) {
    return <div></div>;
  }

  const a = new Array(Number(boardSize)).fill(0);
  return boardSize === BigInt(0) ? (
    <div></div>
  ) : (
    <div className={`grid grid-cols-${boardSize}`}>
      {a.map((x: bigint, i: number) =>
        a.map((y: bigint, j: number) => {
          const tank = tanks.data?.find((tank) => {
            return (
              tank.position.x === BigInt(i) && tank.position.y === BigInt(j)
            );
          });
          return (
            <Square
              x={i}
              y={j}
              boardSize={Number(boardSize)}
              tank={tank}
              key={`${i},${j}`}
              ownersTankId={ownersTankId.data}
            />
          );
        })
      )}
    </div>
  );
}

function SquareNew({
  x,
  y,
  boardSize,
  tank,
}: {
  x: number;
  y: number;
  boardSize: number;
  tank: typeof ITank | undefined;
}) {
  return (
    <div
      className={`border w-full h-0 shadow-sm aspect-w-1 aspect-h-1 rounded-sm`}
    >
      {tank && (
        <TankComponent
          tank={tank.tank}
          tankId={tank.tankId}
          position={tank.position}
        />
      )}
    </div>
  );
}

export declare const ITank: {
  tank: {
    owner: `0x${string}`;
    hearts: bigint;
    aps: bigint;
    range: bigint;
  };
  position: {
    x: bigint;
    y: bigint;
  };
  tankId: bigint;
};
