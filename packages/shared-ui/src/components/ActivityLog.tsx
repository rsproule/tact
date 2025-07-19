import { useState, useEffect, useCallback } from 'react';
import { GameId } from '@tact/game-logic';

interface ActivityItem {
  id: string;
  timestamp: string;
  type: string;
  player?: string;
  playerName?: string;
  data: any;
  message: string;
}

interface ActivityLogProps {
  gameId: GameId;
  currentUser?: string;
  gameState?: number;
  className?: string;
}

export function ActivityLog({ gameId, currentUser, gameState, className = '' }: ActivityLogProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastReadTimestamp, setLastReadTimestamp] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch activities
  const fetchActivities = useCallback(async () => {
    if (!gameId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/games/${gameId}/events`);
      if (!response.ok) return;
      
      const events = await response.json();
      const formattedActivities = events.map((event: any) => formatEventToActivity(event));
      
      setActivities(formattedActivities);
      
      // Calculate unread count if log is closed
      if (!isOpen && lastReadTimestamp) {
        const newItems = formattedActivities.filter(
          activity => new Date(activity.timestamp) > new Date(lastReadTimestamp)
        );
        setUnreadCount(newItems.length);
      }
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setLoading(false);
    }
  }, [gameId, isOpen, lastReadTimestamp]);

  // Format game event to activity item
  const formatEventToActivity = (event: any): ActivityItem => {
    const timestamp = event.timestamp || event.createdAt;
    const playerName = event.data?.playerName || event.player?.substring(0, 8) || 'Unknown';
    
    let message = '';
    switch (event.type) {
      case 'GameCreated':
        message = `Game created by ${playerName}`;
        break;
      case 'PlayerJoined':
        message = `${playerName} joined the game`;
        break;
      case 'GameStarted':
        message = 'Game started!';
        break;
      case 'Move':
        const from = event.data?.from;
        const to = event.data?.to;
        message = `${playerName} moved from (${from?.x},${from?.y}) to (${to?.x},${to?.y})`;
        break;
      case 'Shoot':
        const damage = event.data?.damage || 1;
        message = `${playerName} shot for ${damage} damage`;
        break;
      case 'Upgrade':
        const newRange = event.data?.newRange;
        message = `${playerName} upgraded range to ${newRange}`;
        break;
      case 'Give':
        const hearts = event.data?.hearts || 0;
        const aps = event.data?.aps || 0;
        const receiverName = event.data?.receiver?.substring(0, 8) || 'Unknown';
        message = `${playerName} gave ${hearts > 0 ? `${hearts} heart${hearts !== 1 ? 's' : ''}` : ''}${hearts > 0 && aps > 0 ? ' and ' : ''}${aps > 0 ? `${aps} AP${aps !== 1 ? 's' : ''}` : ''} to ${receiverName}`;
        break;
      case 'ClaimAPs':
        const apsClaimed = event.data?.apsClaimed || 0;
        message = `${playerName} claimed ${apsClaimed} AP${apsClaimed !== 1 ? 's' : ''}`;
        break;
      case 'SettingsUpdated':
        message = `${playerName} updated game settings`;
        break;
      default:
        message = `${event.type} by ${playerName}`;
    }

    return {
      id: event.id,
      timestamp,
      type: event.type,
      player: event.player,
      playerName,
      data: event.data,
      message
    };
  };

  // Poll for new activities
  useEffect(() => {
    fetchActivities();
    const interval = setInterval(fetchActivities, 3000);
    return () => clearInterval(interval);
  }, [fetchActivities]);

  // Mark as read when opening
  const handleToggle = () => {
    if (!isOpen && activities.length > 0) {
      setLastReadTimestamp(activities[0]?.timestamp || new Date().toISOString());
      setUnreadCount(0);
    }
    setIsOpen(!isOpen);
  };

  // Get time ago string
  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return time.toLocaleDateString();
  };

  // Only show activity log when game is started (state 1), not in lobby (state 0) 
  if (gameState !== 1) {
    return null;
  }

  return (
    <div className={`fixed bottom-4 left-4 z-40 ${className}`}>
      {/* Toggle Button */}
      <button
        onClick={handleToggle}
        className="relative bg-gray-800/95 backdrop-blur-sm border border-gray-600 rounded-lg p-3 shadow-xl hover:bg-gray-700 transition-colors"
        title={isOpen ? 'Close Activity Log' : 'Open Activity Log'}
      >
        <div className="w-6 h-6 text-white">
          📋
        </div>
        {/* Notification Badge */}
        {!isOpen && unreadCount > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {unreadCount > 99 ? '99+' : unreadCount}
          </div>
        )}
      </button>

      {/* Activity Panel */}
      {isOpen && (
        <div className="absolute bottom-full mb-2 w-80 max-h-96 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-xl overflow-hidden">
          <div className="p-3 border-b border-gray-700">
            <h3 className="text-white font-semibold flex items-center justify-between">
              Activity Log
              {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            </h3>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {activities.length === 0 ? (
              <div className="p-4 text-gray-400 text-center">
                No activities yet
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="p-2 rounded text-sm bg-gray-800/50 border-l-2 border-blue-500/30"
                  >
                    <div className="text-gray-200">{activity.message}</div>
                    <div className="text-gray-400 text-xs mt-1">
                      {getTimeAgo(activity.timestamp)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}