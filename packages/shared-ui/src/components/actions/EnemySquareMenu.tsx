import { useState } from 'react';
import { Target, Heart } from 'lucide-react';
import { GameId } from '@tact/game-logic';
import { 
  useShootPlayer, 
  useGiveToPlayer
} from '@tact/providers';

interface EnemySquareMenuProps {
  gameId: GameId;
  ownerTank: any;
  enemyTank: any;
  onClose?: () => void;
}

export function EnemySquareMenu({ gameId, ownerTank, enemyTank, onClose }: EnemySquareMenuProps) {
  const { shootPlayer, isLoading: shootLoading } = useShootPlayer();
  const { giveToPlayer, isLoading: giveLoading } = useGiveToPlayer();
  const [giveHearts, setGiveHearts] = useState(1);
  const [giveAps, setGiveAps] = useState(0);

  const handleShoot = async () => {
    if (!ownerTank || !enemyTank) return;
    
    const result = await shootPlayer(gameId, ownerTank.tankId, enemyTank.tankId);
    if (result.success) {
      onClose?.();
    }
  };

  const handleGive = async () => {
    if (!ownerTank || !enemyTank) return;
    
    const result = await giveToPlayer(gameId, ownerTank.tankId, enemyTank.tankId, giveHearts, giveAps);
    if (result.success) {
      onClose?.();
    }
  };

  const canShoot = ownerTank && ownerTank.hearts > 0 && enemyTank.hearts > 0;
  const canGive = ownerTank && (
    (giveHearts > 0 && ownerTank.hearts > giveHearts) ||
    (giveAps > 0 && ownerTank.aps > giveAps)
  );

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">
        Enemy Tank - {enemyTank?.playerName || 'Unknown'}
      </div>
      <div className="text-xs text-gray-600">
        HP: {enemyTank?.hearts || 0} | AP: {enemyTank?.aps || 0} | Range: {enemyTank?.range || 0}
      </div>
      
      <button
        onClick={handleShoot}
        disabled={!canShoot || shootLoading}
        className="flex items-center space-x-2 px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed w-full"
      >
        <Target size={16} />
        <span>{shootLoading ? 'Shooting...' : 'Shoot'}</span>
      </button>
      
      <div className="flex space-x-2">
        <input
          type="number"
          min="0"
          max={ownerTank?.hearts - 1 || 0}
          value={giveHearts}
          onChange={(e) => setGiveHearts(parseInt(e.target.value) || 0)}
          className="w-16 px-2 py-1 text-xs border rounded"
          placeholder="Hearts"
        />
        <input
          type="number"
          min="0"
          max={ownerTank?.aps || 0}
          value={giveAps}
          onChange={(e) => setGiveAps(parseInt(e.target.value) || 0)}
          className="w-16 px-2 py-1 text-xs border rounded"
          placeholder="APs"
        />
      </div>
      
      <button
        onClick={handleGive}
        disabled={!canGive || giveLoading}
        className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed w-full"
      >
        <Heart size={16} />
        <span>{giveLoading ? 'Giving...' : `Give ${giveHearts}♥ ${giveAps}⚡`}</span>
      </button>
      
      {!canShoot && enemyTank.hearts === 0 && (
        <div className="text-xs text-gray-500">Tank is dead</div>
      )}
      
      {!canGive && (
        <div className="text-xs text-gray-500">
          Not enough resources to give
        </div>
      )}
    </div>
  );
}