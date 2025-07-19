'use client';

import { useUser } from './user-context';
import { useTheme } from './theme-provider';
import { Button } from './ui/button';
import { Sun, Moon, Monitor } from 'lucide-react';

export function Navbar() {
  const { user, signOut } = useUser();
  const { theme, setTheme } = useTheme();

  if (!user) return null;

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
    } else if (theme === 'light') {
      setTheme('system');
    } else {
      setTheme('dark');
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-3 w-3" />;
      case 'dark':
        return <Moon className="h-3 w-3" />;
      case 'system':
        return <Monitor className="h-3 w-3" />;
      default:
        return <Moon className="h-3 w-3" />;
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
        return 'System';
      default:
        return 'Dark';
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navbar/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="text-foreground text-sm font-medium">
          Tact
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="text-foreground text-sm">
            {user.user_metadata?.display_name || user.email?.split('@')[0]}
          </div>
          <Button 
            onClick={toggleTheme}
            size="sm" 
            variant="ghost"
            className="text-muted-foreground hover:text-foreground hover:bg-muted h-7 w-7 p-1"
            title={`Theme: ${getThemeLabel()}`}
          >
            {getThemeIcon()}
          </Button>
          <Button 
            onClick={signOut} 
            size="sm" 
            variant="ghost"
            className="text-muted-foreground hover:text-foreground hover:bg-muted h-7 px-2 text-xs"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  );
}