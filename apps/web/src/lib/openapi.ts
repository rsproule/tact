import { getMppCurrency, getMppDemoPrice } from "./payment-config";

const demoPrice = getMppDemoPrice();
const currency = getMppCurrency();

export const openApiDocument = {
  openapi: "3.1.0",
  info: {
    title: "Tact API",
    version: "0.1.0",
    description:
      "The shared HTTP interface used by Tact's human client and autonomous agents.",
    "x-guidance":
      "Use GET /api/v1 to inspect capabilities. Read GET /api/v1/rulesets/legacy-v2 before writing a game client. GET /api/v1/paid/echo is a small MPP integration check and requires no input.",
  },
  servers: [{ url: "/", description: "Current deployment" }],
  paths: {
    "/api/v1": {
      get: {
        operationId: "getCapabilities",
        summary: "Discover API capabilities",
        responses: {
          "200": {
            description: "Capability document",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Capabilities" } },
            },
          },
        },
      },
    },
    "/api/v1/health": {
      get: {
        operationId: "getHealth",
        summary: "Inspect application readiness",
        responses: {
          "200": {
            description: "Health checks",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Health" } },
            },
          },
        },
      },
    },
    "/api/v1/rulesets/legacy-v2": {
      get: {
        operationId: "getLegacyV2Ruleset",
        summary: "Read the executed V2 compatibility profile",
        responses: {
          "200": {
            description: "Versioned ruleset",
            content: {
              "application/json": { schema: { type: "object", additionalProperties: true } },
            },
          },
        },
      },
    },
    "/api/v1/paid/echo": {
      get: {
        operationId: "getPaidEcho",
        summary: "Exercise the MPP payment boundary",
        description:
          "Returns a small JSON response after a Tempo MPP charge. This route exists for provider and AgentCash integration checks.",
        "x-payment-info": {
          price: { mode: "fixed", currency: "USD", amount: demoPrice },
          protocols: [
            {
              mpp: {
                method: "tempo",
                intent: "charge",
                currency,
              },
            },
          ],
        },
        security: [{ Payment: [] }],
        responses: {
          "200": {
            description: "Paid response with a Payment-Receipt header",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/PaidEcho" } },
            },
          },
          "402": { description: "MPP payment challenge" },
          "503": {
            description: "MPP is not configured",
            content: {
              "application/problem+json": {
                schema: { $ref: "#/components/schemas/Problem" },
              },
            },
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      Payment: {
        type: "http",
        scheme: "Payment",
        description: "Machine Payments Protocol HTTP authentication",
      },
    },
    schemas: {
      Capabilities: {
        type: "object",
        required: ["name", "version", "audience", "links"],
        properties: {
          name: { type: "string" },
          version: { type: "string" },
          audience: { type: "array", items: { type: "string" } },
          stateAuthority: { type: "string" },
          paymentProtocol: { type: "string" },
          agentCashCompatible: { type: "boolean" },
          links: { type: "object", additionalProperties: { type: "string", format: "uri" } },
        },
      },
      Health: {
        type: "object",
        required: ["status", "service", "checks", "timestamp"],
        properties: {
          status: { type: "string", enum: ["ready", "degraded"] },
          service: { type: "string" },
          checks: { type: "object", additionalProperties: true },
          timestamp: { type: "string", format: "date-time" },
        },
      },
      PaidEcho: {
        type: "object",
        required: ["ok", "protocol", "message", "requestId"],
        properties: {
          ok: { type: "boolean", const: true },
          protocol: { type: "string", const: "mpp" },
          message: { type: "string" },
          requestId: { type: "string", format: "uuid" },
        },
      },
      Problem: {
        type: "object",
        required: ["type", "title", "status", "detail", "code"],
        properties: {
          type: { type: "string", format: "uri" },
          title: { type: "string" },
          status: { type: "integer" },
          detail: { type: "string" },
          code: { type: "string" },
        },
      },
    },
  },
} as const;
