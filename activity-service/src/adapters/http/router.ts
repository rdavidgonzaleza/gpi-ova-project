import { Hono } from "hono";
import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { cors } from "hono/cors";
import { CreateActivity, OvaNotFoundError } from "../../application/createActivity.js";
import { ListActivities } from "../../application/listActivities.js";
import { ActivityNotFoundError, RegisterActivityAttempt } from "../../application/registerActivityAttempt.js";
import { ContentServiceUnavailableError } from "../ovaCatalog/httpOvaCatalog.js";
import { verifyToken } from "../auth/hmacToken.js";
import { createActivityAttemptSchema, createActivitySchema } from "./schemas.js";

type Dependencies = {
  createActivity: CreateActivity;
  listActivities: ListActivities;
  registerActivityAttempt: RegisterActivityAttempt;
  jwtSecret: string;
};

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function createRouter(dependencies: Dependencies) {
  const app = new Hono();
  app.use("*", cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "OPTIONS"],
  }));

  app.get("/healthz", (context) => context.text("ok"));

  app.post("/api/activities", async (context) => {
    const claims = getClaims(context.req.header("Authorization"), dependencies.jwtSecret);
    if (!claims) return error(context, 401, "UNAUTHORIZED", "token inválido o expirado");
    if (claims.role !== "docente" && claims.role !== "administrador") {
      return error(context, 403, "FORBIDDEN", "rol sin permiso para crear actividades");
    }

    let body: unknown;
    try {
      body = await context.req.json();
    } catch {
      return error(context, 400, "INVALID_BODY", "cuerpo de la solicitud inválido");
    }
    const parsed = createActivitySchema.safeParse(body);
    if (!parsed.success) return error(context, 400, "INVALID_BODY", "datos o config de actividad inválidos");

    try {
      const activity = await dependencies.createActivity.execute(parsed.data);
      return context.json(activity, 201);
    } catch (err) {
      if (err instanceof OvaNotFoundError) return error(context, 404, "OVA_NOT_FOUND", "OVA no encontrado");
      if (err instanceof ContentServiceUnavailableError) {
        return error(context, 502, "CONTENT_SERVICE_UNAVAILABLE", "no fue posible validar el OVA");
      }
      console.error("no fue posible crear la actividad", err);
      return error(context, 500, "INTERNAL_ERROR", "no fue posible crear la actividad");
    }
  });

  app.get("/api/activities", async (context) => {
    const ovaId = context.req.query("ova_id");
    if (!ovaId || !uuidPattern.test(ovaId)) {
      return error(context, 400, "INVALID_QUERY", "ova_id inválido o ausente");
    }
    try {
      return context.json(await dependencies.listActivities.execute(ovaId), 200);
    } catch (err) {
      console.error("no fue posible consultar las actividades", err);
      return error(context, 500, "INTERNAL_ERROR", "no fue posible consultar las actividades");
    }
  });

  app.post("/api/activities/:id/attempts", async (context) => {
    const claims = getClaims(context.req.header("Authorization"), dependencies.jwtSecret);
    if (!claims) return error(context, 401, "UNAUTHORIZED", "token inválido o expirado");
    if (claims.role !== "estudiante") {
      return error(context, 403, "FORBIDDEN", "solo estudiantes pueden registrar intentos");
    }

    const activityId = context.req.param("id");
    if (!uuidPattern.test(activityId)) {
      return error(context, 400, "INVALID_PATH", "id de actividad inválido");
    }

    let body: unknown;
    try {
      body = await context.req.json();
    } catch {
      return error(context, 400, "INVALID_BODY", "cuerpo de la solicitud inválido");
    }
    const parsed = createActivityAttemptSchema.safeParse(body);
    if (!parsed.success) return error(context, 400, "INVALID_BODY", "student_id o answers inválidos");
    if (parsed.data.student_id !== claims.sub) {
      return error(context, 403, "STUDENT_MISMATCH", "student_id debe coincidir con el token");
    }

    try {
      const attempt = await dependencies.registerActivityAttempt.execute({
        activity_id: activityId,
        ...parsed.data,
      });
      return context.json(attempt, 201);
    } catch (err) {
      if (err instanceof ActivityNotFoundError) {
        return error(context, 404, "ACTIVITY_NOT_FOUND", "actividad no encontrada");
      }
      console.error("no fue posible registrar el intento", err);
      return error(context, 500, "INTERNAL_ERROR", "no fue posible registrar el intento");
    }
  });

  return app;
}

function getClaims(authorization: string | undefined, secret: string) {
  if (!authorization?.startsWith("Bearer ")) return null;
  return verifyToken(authorization.slice(7), secret);
}

function error(context: Context, status: ContentfulStatusCode, code: string, message: string) {
  return context.json({ error: { code, message } }, status);
}
