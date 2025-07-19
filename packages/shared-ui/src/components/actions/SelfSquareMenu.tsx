import { ArrowUp } from 'lucide-react';
import { GameId } from '@tact/game-logic';
import { 
  useUpgradePlayer, 
  useUpgradeCost
} from '@tact/providers';

interface SelfSquareMenuProps {
  gameId: GameId;
  ownerTank: any;
  onClose?: () => void;
}

export function SelfSquareMenu({ gameId, ownerTank, onClose }: SelfSquareMenuProps) {
  const { upgradePlayer, isLoading: upgradeLoading } = useUpgradePlayer();
  const { data: upgradeCost } = useUpgradeCost(gameId, ownerTank?.tankId);

  const handleUpgrade = async () => {
    if (!ownerTank) return;
    
    const result = await upgradePlayer(gameId, ownerTank.tankId);
    if (result.success) {
      onClose?.();
    }
  };

  const cost = upgradeCost || 3;
  const canUpgrade = ownerTank && ownerTank.aps >= cost && ownerTank.hearts > 0;

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">
        Your Tank - {ownerTank?.playerName || 'Unknown'}
      </div>
      <div className="text-xs text-gray-600">
        HP: {ownerTank?.hearts || 0} | AP: {ownerTank?.aps || 0} | Range: {ownerTank?.range || 0}
      </div>
      
      <button
        onClick={handleUpgrade}
        disabled={!canUpgrade || upgradeLoading}
        className="flex items-center space-x-2 px-3 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed w-full"
      >
        <ArrowUp size={16} />
        <span>{upgradeLoading ? 'Upgrading...' : `Upgrade (${cost} AP)`}</span>
      </button>
      
      {!canUpgrade && (
        <div className="text-xs text-gray-500">
          {ownerTank?.aps < cost ? `Need ${cost} AP to upgrade` : "Cannot upgrade"}
        </div>
      )}
    </div>
  );
}