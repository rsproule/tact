import { Square } from "./Square";
import { useTankGameGetAllTanks, useTankGamePlayers } from "@/src/generated";
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

