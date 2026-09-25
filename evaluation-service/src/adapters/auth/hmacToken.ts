import { createHmac, timingSafeEqual } from "node:crypto";

export type TokenClaims = {
  sub: string;
  role: "estudiante" | "docente" | "administrador" | "validador";
  exp: number;
};

export function verifyToken(token: string, secret: string): TokenClaims | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payload, signature] = parts;
  const expected = createHmac("sha256", secret).update(payload).digest();
  let actual: Buffer;
  try {
    actual = Buffer.from(signature, "base64url");
  } catch {
    return null;
  }
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;

  try {
    const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as Partial<TokenClaims>;
    if (
      typeof claims.sub !== "string"
      || !["estudiante", "docente", "administrador", "validador"].includes(claims.role ?? "")
      || typeof claims.exp !== "number"
      || claims.exp < Math.floor(Date.now() / 1000)
    ) return null;
    return claims as TokenClaims;
  } catch {
    return null;
  }
}
