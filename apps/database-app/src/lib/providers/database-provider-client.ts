'use client';

import { DatabaseProvider } from '@tact/providers';

// Client-side database provider that uses API routes
export function createDatabaseProviderClient(currentUser?: string): DatabaseProvider {
  const provider = new DatabaseProvider(currentUser);
  
  // Override the base URL to use the Next.js API routes
  (provider as any).baseURL = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3001/api' 
    : '/api';
  
  return provider;
}