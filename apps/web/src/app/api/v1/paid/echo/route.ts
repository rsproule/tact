import { withMppCharge } from "@/lib/payments";
import { getMppDemoPrice } from "@/lib/payment-config";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request): Promise<Response> {
  return withMppCharge(
    request,
    {
      amount: getMppDemoPrice(),
      description: "Tact access check",
      scope: "/api/v1/paid/echo",
    },
    () =>
      Response.json({
        ok: true,
        protocol: "mpp",
        message: "Payment accepted.",
        requestId: crypto.randomUUID(),
      }),
  );
}
