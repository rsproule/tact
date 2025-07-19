import { ReactNode } from 'react';

interface ContextMenuProps {
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContextMenu({ children }: ContextMenuProps) {
  return <>{children}</>;
}