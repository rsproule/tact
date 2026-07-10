import { createMppAtomicStore } from "@tact/db";
import { Mppx, tempo } from "mppx/nextjs";

import { problem } from "./http";
import { getMppCurrency, getMppNetwork } from "./payment-config";

export type VerifiedPayment = Readonly<{
  challengeId: string;
  method: string;
  reference: string;
  status: "success";
  timestamp: string;
  amount: string;
  atomicAmount: string;
  currency: string;
  externalId?: string;
  payer?: string;
}>;

type RouteHandler = (
  request: Request,
  payment: VerifiedPayment,
) => Promise<Response> | Response;

export type ChargeOffer = Readonly<{
  amount: string;
  description: string;
  meta?: Record<string, string>;
  scope?: string;
}>;

class PaymentConfigurationError extends Error {
  override name = "PaymentConfigurationError";
}

export function isPaymentConfigured(): boolean {
  return Boolean(
    process.env.DATABASE_URL &&
      process.env.MPP_SECRET_KEY &&
      process.env.MPP_RECIPIENT,
  );
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

  let verifiedPayment: VerifiedPayment | undefined;
  paymentGateway.onPaymentSuccess((context) => {
    verifiedPayment = {
      challengeId: context.challenge.id,
      method: context.receipt.method,
      reference: context.receipt.reference,
      status: context.receipt.status,
      timestamp: context.receipt.timestamp,
      amount: offer.amount,
      atomicAmount: String(context.request.amount),
      currency: String(context.request.currency),
      ...(context.receipt.externalId
        ? { externalId: context.receipt.externalId }
        : {}),
      ...(context.credential?.source
        ? { payer: context.credential.source }
        : {}),
    };
  });

  const paidHandler = paymentGateway.tempo.charge({
    ...offer,
    currency: getMppCurrency(),
  })((paidRequest) => {
    if (!verifiedPayment) {
      return problem(
        502,
        "Payment verification failed",
        "The payment provider did not return a verified receipt.",
        "payment_receipt_missing",
      );
    }
    return handler(paidRequest, verifiedPayment);
  });

  return paidHandler(request);
}

function getGateway(): ReturnType<typeof createGateway> {
  // Event callbacks carry request-specific receipt data. A fresh lightweight
  // wrapper avoids cross-request listener state while the replay store remains
  // shared and durable in Neon.
  return createGateway();
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
        store: createMppAtomicStore(),
        testnet: network === "testnet",
      }),
    ],
    realm: process.env.MPP_REALM,
    secretKey,
  });
}
