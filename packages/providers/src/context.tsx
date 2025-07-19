import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ITactProvider, TactProviderContext } from './interface.js';

// Context
const TactContext = createContext<TactProviderContext | null>(null);

// Provider component
interface TactProviderProps {
  children: ReactNode;
  provider: ITactProvider;
  fallbackProvider?: ITactProvider;
}

export function TactProvider({ children, provider, fallbackProvider }: TactProviderProps) {
  const [currentProvider, setCurrentProvider] = useState<ITactProvider>(provider);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Test provider connection
    const testConnection = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const isConnected = currentProvider.isConnected();
        if (!isConnected && fallbackProvider) {
          setCurrentProvider(fallbackProvider);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Provider connection failed');
        if (fallbackProvider) {
          setCurrentProvider(fallbackProvider);
        }
      } finally {
        setIsLoading(false);
      }
    };

    testConnection();
  }, [currentProvider, fallbackProvider]);

  const switchProvider = (newProvider: ITactProvider) => {
    setCurrentProvider(newProvider);
  };

  const contextValue: TactProviderContext = {
    provider: currentProvider,
    isLoading,
    error,
    switchProvider,
  };

  return (
    <TactContext.Provider value={contextValue}>
      {children}
    </TactContext.Provider>
  );
}

// Hook to use the provider
export function useTactProvider(): TactProviderContext {
  const context = useContext(TactContext);
  if (!context) {
    throw new Error('useTactProvider must be used within a TactProvider');
  }
  return context;
}