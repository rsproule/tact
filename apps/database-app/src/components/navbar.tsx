'use client';

import { useUser } from './user-context';
import { Button } from './ui/button';

export function Navbar() {
  const { user, signOut } = useUser();

  if (!user) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="text-white text-sm font-medium">
          Tact
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="text-white text-sm">
            {user.user_metadata?.display_name || user.email?.split('@')[0]}
          </div>
          <Button 
            onClick={signOut} 
            size="sm" 
            variant="ghost"
            className="text-gray-300 hover:text-white hover:bg-gray-800 h-7 px-2 text-xs"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  );
}