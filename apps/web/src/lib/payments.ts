import { Mppx, tempo } from "mppx/nextjs";

import { problem } from "./http";
import { getMppCurrency, getMppNetwork } from "./payment-config";

type RouteHandler = (request: Request) => Promise<Response> | Response;

export type ChargeOffer = Readonly<{
  amount: string;
  description: string;
  meta?: Record<string, string>;
  scope?: string;
}>;

class PaymentConfigurationError extends Error {
  override name = "PaymentConfigurationError";
}

let gateway: ReturnType<typeof createGateway> | undefined;

export function isPaymentConfigured(): boolean {
  return Boolean(process.env.MPP_SECRET_KEY && process.env.MPP_RECIPIENT);
}

export async function withMppCharge(
  request: Request,
  offer: ChargeOffer,
  handler: RouteHandler,
): Promise<Response> {
  let paymentGateway: ReturnType<typeof createGateway>;

  try {
    paymentGateway = getGateway();
  } catch (error) {
    if (error instanceof PaymentConfigurationError) {
      return problem(
        503,
        "Payment service unavailable",
        "MPP is not configured for this deployment.",
        "payment_not_configured",
      );
    }
    throw error;
  }

  const paidHandler = paymentGateway.tempo.charge({
    ...offer,
    currency: getMppCurrency(),
  })(handler);

  return paidHandler(request);
}

function getGateway(): ReturnType<typeof createGateway> {
  gateway ??= createGateway();
  return gateway;
}

function createGateway() {
  const secretKey = process.env.MPP_SECRET_KEY;
  const recipient = process.env.MPP_RECIPIENT;
  const network = getMppNetwork();
  const currency = getMppCurrency();

  if (!secretKey || secretKey.length < 32) {
    throw new PaymentConfigurationError("MPP_SECRET_KEY must contain at least 32 bytes");
  }

  if (!recipient || !/^0x[0-9a-fA-F]{40}$/.test(recipient)) {
    throw new PaymentConfigurationError("MPP_RECIPIENT must be an EVM address");
  }

  if (!/^0x[0-9a-fA-F]{40}$/.test(currency)) {
    throw new PaymentConfigurationError("MPP_CURRENCY must be a TIP-20 token address");
  }

  return Mppx.create({
    methods: [
      tempo.charge({
        currency,
        html: true,
        recipient: recipient as `0x${string}`,
        testnet: network === "testnet",
      }),
    ],
    realm: process.env.MPP_REALM,
    secretKey,
  });
}
