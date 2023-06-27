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

  const a = new Array(Number(boardSize + BigInt(1))).fill(0);
  return boardSize === BigInt(0) ? (
    <div></div>
  ) : (
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
              {/* {j === 0 && <div className="grow-0">{i}</div>} */}
              {BigInt(i) !== boardSize && BigInt(j) !== boardSize && (
                <Square
                  x={i}
                  y={j}
                  boardSize={Number(boardSize)}
                  tank={tank}
                  ownersTankId={ownersTankId.data}
                />
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
