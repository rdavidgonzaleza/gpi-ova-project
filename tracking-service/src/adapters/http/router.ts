import { Hono } from "hono";
import type { Context } from "hono";
import { cors } from "hono/cors";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { ForbiddenError } from "../../application/errors.js";
import type { GetUsageReport } from "../../application/getUsageReport.js";
import type { ListProgress } from "../../application/listProgress.js";
import type { UpsertProgress } from "../../application/upsertProgress.js";
import type { ProgressUpdate } from "../../domain/progress.js";
import { verifyToken } from "../auth/hmacToken.js";
import { groupQuerySchema, studentQuerySchema, upsertProgressSchema } from "./schemas.js";

type Dependencies = {
  upsertProgress: UpsertProgress;
  listProgress: ListProgress;
  getUsageReport: GetUsageReport;
  jwtSecret: string;
};

export function createRouter(deps: Dependencies) {
  const app = new Hono();
  app.use("*", cors({ origin: "*", allowHeaders: ["Content-Type", "Authorization"], allowMethods: ["GET", "PUT", "OPTIONS"] }));

  app.get("/healthz", (c) => c.text("ok"));

  app.get("/api/progress", async (c) => {
    const claims = auth(c, deps.jwtSecret);
    if (!claims) return error(c, 401, "UNAUTHORIZED", "token inválido o expirado");
    const studentId = studentQuerySchema.safeParse(c.req.query("student_id"));
    if (!studentId.success) return error(c, 400, "INVALID_QUERY", "student_id inválido o ausente");
    return run(c, () => deps.listProgress.execute(claims, studentId.data), 200);
  });

  app.put("/api/progress", async (c) => {
    const claims = auth(c, deps.jwtSecret);
    if (!claims) return error(c, 401, "UNAUTHORIZED", "token inválido o expirado");
    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return error(c, 400, "INVALID_BODY", "cuerpo de la solicitud inválido");
    }
    const parsed = upsertProgressSchema.safeParse(body);
    if (!parsed.success) return error(c, 400, "INVALID_BODY", "student_id, ova_id, status o percent_complete inválidos");
    return run(c, () => deps.upsertProgress.execute(claims, parsed.data as ProgressUpdate), 200);
  });

  app.get("/api/reports/usage", async (c) => {
    const claims = auth(c, deps.jwtSecret);
    if (!claims) return error(c, 401, "UNAUTHORIZED", "token inválido o expirado");
    const groupId = groupQuerySchema.safeParse(c.req.query("group_id"));
    if (!groupId.success) return error(c, 400, "INVALID_QUERY", "group_id inválido o ausente");
    return run(c, () => deps.getUsageReport.execute(claims, groupId.data), 200);
  });

  return app;
}

async function run(c: Context, action: () => Promise<unknown>, status: ContentfulStatusCode) {
  try {
    return c.json(await action(), status);
  } catch (err) {
    if (err instanceof ForbiddenError) return error(c, 403, "FORBIDDEN", err.message);
    console.error("error interno en tracking-service", err);
    return error(c, 500, "INTERNAL_ERROR", "no fue posible completar la operación");
  }
}

function auth(c: Context, secret: string) {
  const header = c.req.header("Authorization");
  return header?.startsWith("Bearer ") ? verifyToken(header.slice(7), secret) : null;
}

function error(c: Context, status: ContentfulStatusCode, code: string, message: string) {
  return c.json({ error: { code, message } }, status);
}
