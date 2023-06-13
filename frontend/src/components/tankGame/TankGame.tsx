"use client";
import { useAccount, useWaitForTransaction } from "wagmi";
import {
  usePrepareTankGameJoin,
  usePrepareTankGameMove,
  usePrepareTankGameShoot,
  useTankGameJoin,
  useTankGameMove,
  useTankGamePlayers,
  useTankGameShoot,
  useTankGameState,
  useTankGameTanks,
  useTankGameTanksOnBoard,
} from "../../generated";
import { Button } from "../ui/button";
import { stringify } from "../../utils/stringify";
import { BaseError } from "viem";
import { Dispatch, SetStateAction, useState } from "react";
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export function TankGame() {
  let gameState = useTankGameState({
    address: CONTRACT_ADDRESS,
    watch: true,
  });
  let { config } = usePrepareTankGameJoin({
    address: CONTRACT_ADDRESS,
    enabled: gameState.data === 0,
  });
  const { write, data, error, isLoading, isError } = useTankGameJoin(config);
  console.log(gameState.data);
  const {
    data: receipt,
    isLoading: isPending,
    isSuccess,
  } = useWaitForTransaction({ hash: data?.hash });
  return (
    <div>
      <h1>Tank Game</h1>
      <p>
        Game State: {gameState.data === 0 ? "Waiting for players" : "Started"}
      </p>
      <Button
        onClick={() => {
          write?.();
        }}
        disabled={gameState.data !== 0}
      >
        join game
      </Button>
      {isLoading && <div>Check wallet...</div>}
      {isPending && <div>Transaction pending...</div>}
      {isError && <div>{(error as BaseError)?.shortMessage}</div>}
      <Board boardSize={10} />
    </div>
  );
}

interface BoardProps {
  boardSize: number;
}
export function Board(props: BoardProps) {
  let [selectedSquare, setSelectedSquare] = useState<
    { x: bigint; y: bigint } | undefined
  >();
  let a = new Array(props.boardSize).fill(0);
  let { address } = useAccount();
  let ownersTank = useTankGamePlayers({
    address: CONTRACT_ADDRESS,
    args: [address!],
    enabled: !!address,
  });
  let { config } = usePrepareTankGameMove({
    address: CONTRACT_ADDRESS,
    args: [ownersTank.data!, selectedSquare!],
    enabled: !!ownersTank.data && !!selectedSquare,
  });
  let selectedTankId = useTankGameTanksOnBoard({
    address: CONTRACT_ADDRESS,
    args: [
      selectedSquare
        ? selectedSquare.x + selectedSquare.y * BigInt(props.boardSize)
        : BigInt(0),
    ],
    enabled: !!selectedSquare,
  });
  const { write: move } = useTankGameMove(config);
  let { config: shootConfig } = usePrepareTankGameShoot({
    address: CONTRACT_ADDRESS,
    args: [ownersTank.data!, selectedTankId.data!],
    enabled: !!ownersTank.data && !!selectedTankId,
  });
  const { write: shoot } = useTankGameShoot(shootConfig);
  return (
    <div className={`grid grid-cols-10 justify-items-stretch gap-2`}>
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
      <Button
        disabled={!move}
        onClick={() => {
          move?.();
        }}
      >
        Move
      </Button>
      <Button
        disabled={!shoot}
        onClick={() => {
          shoot?.();
        }}
      >
        Shoot
      </Button>
      <Button
        disabled={!shoot}
        onClick={() => {
          alert("Upgrade.. TODO wire this up ")
        }}
      >
       Upgrade 
      </Button>
    </div>
  );
}

interface SquareProps {
  x: number;
  y: number;
  selected: boolean;
  setSelected: Dispatch<SetStateAction<{ x: bigint; y: bigint } | undefined>>;
}
function Square(props: SquareProps) {
  let tankId = useTankGameTanksOnBoard({
    address: CONTRACT_ADDRESS,
    args: [BigInt(props.x + props.y * 10)],
    watch: true,
  });

  let tank = useTankGameTanks({
    address: CONTRACT_ADDRESS,
    args: [tankId.data!],
    watch: true,
    enabled: tankId.data != BigInt(0),
  });

  return (
    <div
      className="border"
      onClick={() => {
        props.setSelected({ x: BigInt(props.x), y: BigInt(props.y) });
      }}
    >
      {tank.data ? (
        <Tank
          tankId={tankId.data!}
          owner={tank.data[0]}
          hearts={tank.data[1]}
          aps={tank.data[2]}
          range={tank.data[3]}
        />
      ) : props.selected ? (
        "🟩"
      ) : (
        " ."
      )}
    </div>
  );
}

interface TankProps {
  tankId: bigint;
  owner: `0x${string}`;
  hearts: bigint;
  aps: bigint;
  range: bigint;
}

function Tank(props: TankProps) {
  let { address } = useAccount();
  return (
    <div>
      {props.owner === address
        ? "💚".repeat(Number(props.hearts))
        : "❤️".repeat(Number(props.hearts))}
      {props.hearts === BigInt(0) ? "💀" : ""}
    </div>
  );
}
