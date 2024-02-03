'use client'

import { ConnectKitProvider } from 'connectkit'
import * as React from 'react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from '../wagmi'

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false)
  const queryClient = new QueryClient()

  React.useEffect(() => setMounted(true), [])
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{mounted && children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
