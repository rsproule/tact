export const tempoCurrency = {
  mainnet: "0x20C000000000000000000000b9537d11c60E8b50",
  testnet: "0x20c0000000000000000000000000000000000000",
} as const;

export type MppNetwork = keyof typeof tempoCurrency;

const usdAmountPattern = /^(0|[1-9]\d*)(\.\d{1,6})?$/;

export function getMppNetwork(): MppNetwork {
  return process.env.MPP_NETWORK === "mainnet" ? "mainnet" : "testnet";
}

export function getMppCurrency(): string {
  return process.env.MPP_CURRENCY ?? tempoCurrency[getMppNetwork()];
}

export function getMppDemoPrice(): string {
  return process.env.MPP_DEMO_PRICE ?? "0.001";
}

export function getMppMaxEntryPrice(): string {
  const value = process.env.MPP_MAX_ENTRY_PRICE ?? "5";
  if (!usdAmountPattern.test(value) || value === "0") {
    throw new Error(
      "MPP_MAX_ENTRY_PRICE must be a positive canonical USD amount with at most six decimal places",
    );
  }
  return value;
}
