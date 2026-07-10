import { TactGameApp } from "@/components/game-app";

export default async function GamePage({
  params,
}: Readonly<{ params: Promise<{ gameId: string }> }>) {
  const { gameId } = await params;
  return <TactGameApp gameId={gameId} />;
}
