import { useState } from "react";
import { Square } from "./Square";

export function Board({ boardSize }: { boardSize: number }) {
  const [selectedSquare, setSelectedSquare] = useState<
    { x: bigint; y: bigint } | undefined
  >();
  const a = new Array(boardSize).fill(0);
  return boardSize === 0 ? (
    <div></div>
  ) : ( 
    <div className={`grid grid-cols-${boardSize}`}>
      {a.map((x: number, i: number) =>
        a.map((x: number, j: number) => (
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
