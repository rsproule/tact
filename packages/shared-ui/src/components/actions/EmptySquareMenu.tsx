import { Move } from 'lucide-react';
import { GameId } from '@tact/game-logic';
import { useMovePlayer } from '@tact/providers';

interface EmptySquareMenuProps {
  gameId: GameId;
  targetPosition: { x: number; y: number; z: number };
  ownerTank: any;
  distance?: number;
  onClose?: () => void;
}

export function EmptySquareMenu({
  gameId,
  targetPosition,
  ownerTank,
  distance,
  onClose,
}: EmptySquareMenuProps) {
  const { movePlayer, isLoading, error } = useMovePlayer();

  const handleMove = async () => {
    if (!ownerTank || !canMove) return;
    
    const result = await movePlayer(gameId, ownerTank.tankId, { 
      x: targetPosition.x, 
      y: targetPosition.y,
      z: targetPosition.z
    });
    if (result.success) {
      onClose?.();
    }
  };

  const canMove = distance === 1 && ownerTank && ownerTank.aps > 0 && ownerTank.hearts > 0;

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">
        Position ({targetPosition.x}, {targetPosition.y}, {targetPosition.z})
      </div>
      
      <button
        onClick={handleMove}
        disabled={!canMove || isLoading}
        className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed w-full"
      >
        <Move size={16} />
        <span>{isLoading ? 'Moving...' : 'Move Here'}</span>
      </button>
      
      {!canMove && (
        <div className="text-xs text-gray-500">
          {distance !== 1 ? "Too far to move" : ownerTank?.aps <= 0 ? "Not enough APs" : "Cannot move"}
        </div>
      )}
      
      {error && (
        <div className="text-red-500 text-xs">{error}</div>
      )}
    </div>
  );
}