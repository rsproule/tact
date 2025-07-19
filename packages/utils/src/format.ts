/**
 * Formats wei amount to ETH string
 */
export function formatEther(wei: string | bigint): string {
  const weiValue = typeof wei === 'string' ? BigInt(wei) : wei;
  const eth = Number(weiValue) / 1e18;
  return eth.toFixed(4);
}

/**
 * Formats address to shortened version
 */
export function formatAddress(address: string): string {
  if (address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Formats epoch time to human readable
 */
export function formatEpochTime(epochStart: number, epochDuration: number): string {
  const now = Math.floor(Date.now() / 1000);
  const currentEpoch = Math.floor((now - epochStart) / epochDuration);
  const nextEpochTime = epochStart + (currentEpoch + 1) * epochDuration;
  const timeToNext = nextEpochTime - now;
  
  if (timeToNext <= 0) return 'Epoch ended';
  
  const hours = Math.floor(timeToNext / 3600);
  const minutes = Math.floor((timeToNext % 3600) / 60);
  const seconds = timeToNext % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}

/**
 * Formats tank stats for display
 */
export function formatTankStats(tank: { hearts: number; aps: number; range: number }): string {
  return `♥${tank.hearts} ⚡${tank.aps} 🎯${tank.range}`;
}

/**
 * Formats game state for display
 */
export function formatGameState(state: number): string {
  const states = ['Waiting for Players', 'Started', 'Ended'];
  return states[state] || 'Unknown';
}

/**
 * Formats player count display
 */
export function formatPlayerCount(current: number, max: number): string {
  return `${current}/${max} players`;
}

/**
 * Formats large numbers with abbreviations
 */
export function formatNumber(num: number): string {
  if (num >= 1e9) {
    return (num / 1e9).toFixed(1) + 'B';
  }
  if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + 'M';
  }
  if (num >= 1e3) {
    return (num / 1e3).toFixed(1) + 'K';
  }
  return num.toString();
}