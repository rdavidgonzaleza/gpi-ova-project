import { Hono } from "hono";
import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { cors } from "hono/cors";
import { z } from "zod";
import { EvaluationNotFoundError, RegisterAttempt } from "../../application/registerAttempt.js";
import { ListAttempts } from "../../application/listAttempts.js";
import { verifyToken } from "../auth/hmacToken.js";
import { evaluationConfigSchema, registerAttemptSchema } from "./schemas.js";

type Dependencies = {
  registerAttempt: RegisterAttempt;
  listAttempts: ListAttempts;
  jwtSecret: string;
};

const uuidSchema = z.string().uuid();

export function createRouter(dependencies: Dependencies) {
  const app = new Hono();
  app.use("*", cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "OPTIONS"],
  }));

  app.get("/healthz", (context) => context.text("ok"));

  app.post("/api/evaluations/:id/attempts", async (context) => {
    const claims = getClaims(context.req.header("Authorization"), dependencies.jwtSecret);
    if (!claims) return error(context, 401, "UNAUTHORIZED", "token inválido o expirado");
    if (claims.role !== "estudiante") {
      return error(context, 403, "FORBIDDEN", "solo un estudiante puede registrar un intento");
    }

    const evaluationId = uuidSchema.safeParse(context.req.param("id"));
    if (!evaluationId.success) return error(context, 400, "INVALID_ID", "id de evaluación inválido");

    let body: unknown;
    try {
      body = await context.req.json();
    } catch {
      return error(context, 400, "INVALID_BODY", "cuerpo de la solicitud inválido");
    }
    const parsed = registerAttemptSchema.safeParse(body);
    if (!parsed.success) return error(context, 400, "INVALID_BODY", "student_id o answers inválidos");
    if (parsed.data.student_id !== claims.sub) {
      return error(context, 403, "FORBIDDEN", "student_id no corresponde al token");
    }

    try {
      const result = await dependencies.registerAttempt.execute(
        evaluationId.data,
        claims.sub,
        parsed.data.answers,
      );
      return context.json(result, 201);
    } catch (err) {
      if (err instanceof EvaluationNotFoundError) {
        return error(context, 404, "NOT_FOUND", "evaluación no encontrada");
      }
      console.error("no fue posible registrar el intento", err);
      return error(context, 500, "INTERNAL_ERROR", "no fue posible registrar el intento");
    }
  });

  app.get("/api/evaluations/attempts", async (context) => {
    const claims = getClaims(context.req.header("Authorization"), dependencies.jwtSecret);
    if (!claims) return error(context, 401, "UNAUTHORIZED", "token inválido o expirado");

    const studentId = uuidSchema.safeParse(context.req.query("student_id"));
    if (!studentId.success) return error(context, 400, "INVALID_QUERY", "student_id inválido");
    if (claims.role === "estudiante" && studentId.data !== claims.sub) {
      return error(context, 403, "FORBIDDEN", "solo puedes consultar tu propio historial");
    }
    if (claims.role === "validador") {
      return error(context, 403, "FORBIDDEN", "rol sin acceso al historial");
    }

    try {
      return context.json(await dependencies.listAttempts.execute(studentId.data), 200);
    } catch (err) {
      console.error("no fue posible consultar el historial", err);
      return error(context, 500, "INTERNAL_ERROR", "no fue posible consultar el historial");
    }
  });

  return app;
}

function getClaims(authorization: string | undefined, secret: string) {
  if (!authorization?.startsWith("Bearer ")) return null;
  return verifyToken(authorization.slice(7), secret);
}

function error(
  context: Context,
  status: ContentfulStatusCode,
  code: string,
  message: string,
) {
  return context.json({ error: { code, message } }, status);
}
