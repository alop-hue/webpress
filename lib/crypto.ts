/**
 * AES-256-GCM encryption for secrets (e.g. stored AI API keys), keyed by WEBPRESS_MASTER_KEY.
 */
import "server-only";

import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";

function masterKey(): Buffer {
  const raw = process.env.WEBPRESS_MASTER_KEY || "webpress-dev-master-key";
  return createHash("sha256").update(raw).digest();
}

export function encryptSecret(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", masterKey(), iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  return ["v1", iv.toString("base64"), enc.toString("base64"), cipher.getAuthTag().toString("base64")].join(".");
}

export function decryptSecret(payload: string): string {
  const [v, ivB, dataB, tagB] = payload.split(".");
  if (v !== "v1") throw new Error("Unsupported secret format");
  const decipher = createDecipheriv("aes-256-gcm", masterKey(), Buffer.from(ivB, "base64"));
  decipher.setAuthTag(Buffer.from(tagB, "base64"));
  return Buffer.concat([decipher.update(Buffer.from(dataB, "base64")), decipher.final()]).toString("utf8");
}