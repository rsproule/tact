import { useState } from "react";
import { Square } from "./Square";

export function Board({ boardSize }: { boardSize: bigint | undefined }) {
  const [selectedSquare, setSelectedSquare] = useState<
    { x: bigint; y: bigint } | undefined
  >();
  if (!boardSize) {
    return <div></div>;
  }
  
  const a = new Array(Number(100)).fill(0);
  return boardSize === BigInt(0) ? (
    <div></div>
  ) : (
    <div className={`grid grid-cols-10`}>
      {a.map((x: bigint, i: number) =>
        a.map((x: bigint, j: number) => (
          <Square
            selected={
              !!selectedSquare &&
              selectedSquare.x === BigInt(i) &&
              selectedSquare.y === BigInt(j)
            }
            setSelected={setSelectedSquare}
            x={i}
            y={j}
            key={`${i},${j}`}
          />
        ))
      )}
    </div>
  );
}
