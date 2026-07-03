import { randomBytes } from "node:crypto";

function createToken(ttlMs: number) {
  return {
    token: randomBytes(32).toString("hex"),
    expiresAt: new Date(Date.now() + ttlMs),
  };
}

export const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

export function createVerificationToken() {
  return createToken(VERIFICATION_TOKEN_TTL_MS);
}

export const PASSWORD_RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

export function createPasswordResetToken() {
  return createToken(PASSWORD_RESET_TOKEN_TTL_MS);
}
