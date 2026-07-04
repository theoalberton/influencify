import { createHash } from "crypto";
import { headers } from "next/headers";

export async function hashRequestIp() {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? "unknown";
  return createHash("sha256").update(ip).digest("hex");
}

export async function requestUserAgent() {
  const h = await headers();
  return h.get("user-agent") ?? null;
}
