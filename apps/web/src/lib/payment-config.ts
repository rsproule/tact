export const tempoCurrency = {
  mainnet: "0x20C000000000000000000000b9537d11c60E8b50",
  testnet: "0x20c0000000000000000000000000000000000000",
} as const;

export type MppNetwork = keyof typeof tempoCurrency;

export function getMppNetwork(): MppNetwork {
  return process.env.MPP_NETWORK === "mainnet" ? "mainnet" : "testnet";
}

export function getMppCurrency(): string {
  return process.env.MPP_CURRENCY ?? tempoCurrency[getMppNetwork()];
}

export function getMppDemoPrice(): string {
  return process.env.MPP_DEMO_PRICE ?? "0.001";
}
